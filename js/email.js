// EmailJS Browser SDK v4.4.1
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.emailjs = factory());
})(this, (function () { 'use strict';

    const store = {
        origin: 'https://api.emailjs.com',
        blockHeadless: false
    };

    const buildOptions = (options) => {
        if (!options)
            return {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { origin, blockHeadless, ...extra } = options;
        return extra;
    };

    const isBlockedValueInParams = (blockedValue, params) => {
        if (!params)
            return false;
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                if (typeof value === 'string' && value.includes(blockedValue)) {
                    return true;
                }
                if (typeof value === 'object' && isBlockedValueInParams(blockedValue, value)) {
                    return true;
                }
            }
        }
        return false;
    };

    const validateParams = (params, blockedValues) => {
        if (!params || !blockedValues || !blockedValues.length)
            return true;
        for (const blockedValue of blockedValues) {
            if (isBlockedValueInParams(blockedValue, params)) {
                return false;
            }
        }
        return true;
    };

    const isHeadless = (navigator) => {
        return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
    };

    const validateBlockListParams = (params, blockList) => {
        if (!params || !blockList || !blockList.length)
            return true;
        for (const list of blockList) {
            const value = params[list?.watchVariable];
            if (!value)
                continue;
            for (const blockedValue of list?.list || []) {
                if (value?.includes(blockedValue)) {
                    return false;
                }
            }
        }
        return true;
    };

    const validateLimitRateParams = (params, limitRate, extra) => {
        if (!params || !limitRate || !extra)
            return true;
        const { id, throttle } = limitRate;
        if (!id || !throttle)
            return true;
        const value = params[id];
        if (!value)
            return true;
        const key = `emailjs_${extra.location || 'default'}_${value}`;
        const lastSent = localStorage.getItem(key);
        if (!lastSent)
            return true;
        const isAllowed = Date.now() - parseInt(lastSent) > throttle;
        if (isAllowed) {
            localStorage.removeItem(key);
        }
        return isAllowed;
    };

    const setLimitRateInLocalStorage = (params, limitRate, extra) => {
        if (!params || !limitRate || !extra)
            return;
        const { id, throttle } = limitRate;
        if (!id || !throttle)
            return;
        const value = params[id];
        if (!value)
            return;
        const key = `emailjs_${extra.location || 'default'}_${value}`;
        localStorage.setItem(key, Date.now().toString());
    };

    class EmailJSResponseStatus {
        constructor(httpResponse) {
            this.status = httpResponse ? httpResponse.status : 0;
            this.text = httpResponse ? httpResponse.responseText : 'Network Error';
        }
    }

    const createWebStorage = () => {
        if (typeof localStorage !== 'undefined')
            return localStorage;
        return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { }
        };
    };

    const sendPost = (url, data, headers = {}) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', ({ target }) => {
                const responseStatus = new EmailJSResponseStatus(target);
                if (responseStatus.status === 200 || responseStatus.status === 0) {
                    resolve(responseStatus);
                }
                else {
                    reject(responseStatus);
                }
            });
            xhr.addEventListener('error', ({ target }) => {
                reject(new EmailJSResponseStatus(target));
            });
            xhr.open('POST', url, true);
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });
            xhr.send(data);
        });
    };

    const buildHeader$1 = (publicKey) => {
        return {
            'Content-type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };
    };

    const buildPath = (options) => {
        if (!options)
            return;
        const { origin } = options;
        if (origin)
            store.origin = origin;
        if (typeof options.blockHeadless === 'boolean') {
            store.blockHeadless = options.blockHeadless;
        }
    };

    const sendJSON = (serviceID, templateID, templateParams, options) => {
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const blockList = opts.blockList || store.blockList;
        const limitRate = opts.limitRate || store.limitRate;
        if (blockHeadless && isHeadless(navigator)) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 403,
                responseText: 'Forbidden'
            }));
        }
        if (!validateParams(templateParams, ['g-recaptcha-response', 'h-captcha-response', 'cf-turnstile-response'])) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 400,
                responseText: "Non-optional template params not found: g-recaptcha-response, h-captcha-response, cf-turnstile-response"
            }));
        }
        if (!validateBlockListParams(templateParams, blockList)) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 403,
                responseText: 'Forbidden'
            }));
        }
        if (!validateLimitRateParams(templateParams, limitRate, { location: window?.location?.href })) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 429,
                responseText: 'Too Many Requests'
            }));
        }
        const params = {
            lib_version: '4.4.1',
            user_id: publicKey,
            service_id: serviceID,
            template_id: templateID,
            template_params: templateParams
        };
        return sendPost(store.origin + '/api/v1.0/email/send', JSON.stringify(params), buildHeader$1(publicKey)).then((response) => {
            setLimitRateInLocalStorage(templateParams, limitRate, { location: window?.location?.href });
            return response;
        });
    };

    const buildHeader = (publicKey) => {
        const header = {};
        if (publicKey)
            header['X-User-ID'] = publicKey;
        return header;
    };

    const sendForm = (serviceID, templateID, form, options) => {
        if (!form || form.nodeName !== 'FORM') {
            throw 'Expected the HTML form element or the style selector of the form';
        }
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const blockList = opts.blockList || store.blockList;
        const limitRate = opts.limitRate || store.limitRate;
        if (blockHeadless && isHeadless(navigator)) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 403,
                responseText: 'Forbidden'
            }));
        }
        const formData = new FormData(form);
        const templateParams = {};
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                templateParams[key] = value;
            }
        });
        if (!validateParams(templateParams, ['g-recaptcha-response', 'h-captcha-response', 'cf-turnstile-response'])) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 400,
                responseText: "Non-optional template params not found: g-recaptcha-response, h-captcha-response, cf-turnstile-response"
            }));
        }
        if (!validateBlockListParams(templateParams, blockList)) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 403,
                responseText: 'Forbidden'
            }));
        }
        if (!validateLimitRateParams(templateParams, limitRate, { location: window?.location?.href })) {
            return Promise.reject(new EmailJSResponseStatus({
                status: 429,
                responseText: 'Too Many Requests'
            }));
        }
        formData.append('lib_version', '4.4.1');
        formData.append('service_id', serviceID);
        formData.append('template_id', templateID);
        formData.append('user_id', publicKey);
        return sendPost(store.origin + '/api/v1.0/email/send-form', formData, buildHeader(publicKey)).then((response) => {
            setLimitRateInLocalStorage(templateParams, limitRate, { location: window?.location?.href });
            return response;
        });
    };

    const init = (options, publicKey) => {
        if (typeof options === 'string') {
            store.publicKey = options;
        }
        else {
            buildPath(options);
            store.publicKey = options?.publicKey;
            store.blockList = options?.blockList;
            store.limitRate = options?.limitRate;
        }
        if (publicKey)
            store.publicKey = publicKey;
    };

    const send = (serviceID, templateID, templateParams, options) => {
        return sendJSON(serviceID, templateID, templateParams, options);
    };

    var index = { init, send, sendForm };

    return index;

}));