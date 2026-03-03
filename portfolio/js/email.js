// EmailJS Browser SDK v4.4.1 - Version non-minifiée
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.emailjs = factory());
})(this, (function () { 'use strict';

    class EmailJSResponseStatus {
        constructor(httpResponse) {
            this.status = httpResponse ? httpResponse.status : 0;
            this.text = httpResponse ? httpResponse.responseText : 'Network Error';
        }
    }

    const sendPost = (url, data, headers = {}) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.addEventListener('load', ({ target }) => {
                const responseStatus = new EmailJSResponseStatus(target);
                if (responseStatus.status === 200 || responseStatus.status === 0) {
                    resolve(responseStatus);
                } else {
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

    const sendJSON = (serviceID, templateID, userID, templateParams) => {
        return sendPost(
            'https://api.emailjs.com/api/v1.0/email/send',
            JSON.stringify({
                lib_version: '4.4.1',
                user_id: userID,
                service_id: serviceID,
                template_id: templateID,
                template_params: templateParams
            }),
            {
                'Content-type': 'application/json'
            }
        );
    };

    const sendForm = (serviceID, templateID, form, userID) => {
        const formData = new FormData(form);
        formData.append('lib_version', '4.4.1');
        formData.append('service_id', serviceID);
        formData.append('template_id', templateID);
        formData.append('user_id', userID);
        
        return sendPost(
            'https://api.emailjs.com/api/v1.0/email/send-form',
            formData
        );
    };

    let _userID = null;

    return {
        init(userID) {
            _userID = userID;
        },
        
        send(serviceID, templateID, templateParams, userID) {
            const currentUserID = userID || _userID;
            if (!currentUserID) {
                throw new Error('EmailJS user ID is required. Call emailjs.init() or pass userID.');
            }
            return sendJSON(serviceID, templateID, currentUserID, templateParams);
        },
        
        sendForm(serviceID, templateID, form, userID) {
            const currentUserID = userID || _userID;
            if (!currentUserID) {
                throw new Error('EmailJS user ID is required. Call emailjs.init() or pass userID.');
            }
            return sendForm(serviceID, templateID, form, currentUserID);
        }
    };

}));