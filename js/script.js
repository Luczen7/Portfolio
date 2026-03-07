// =====================================================
// CURSEUR PERSONNALISÉ - CORRIGÉ
// =====================================================

(function() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    if (!cursorDot || !cursorOutline) {
        console.error('❌ Éléments curseur non trouvés');
        return;
    }
    
    // Détecter mobile/tablette
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (isTouchDevice) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    // Variables pour la position
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Suivi de la souris
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Curseur point (instantané)
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Animation fluide pour le contour
    function animateOutline() {
        // Interpolation linéaire (lerp)
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    
    // Démarrer l'animation
    animateOutline();
    
    // Effet hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .skill-tag, .btn, input, textarea, .magnetic-btn, .nav-link, .social-link'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
    
    console.log('✅ Curseur personnalisé activé');
})();



// Charger la navigation
        fetch('./components/navigation.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('nav-container').innerHTML = html;
                // Réinitialiser la navigation après injection
                new Navigation();
            });

// =====================================================
// EMAILJS - Configuration et envoi du formulaire
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM chargé');
    
    // Vérifier que la config existe
    if (typeof EMAILJS_CONFIG === 'undefined') {
        console.error('❌ EMAILJS_CONFIG non défini ! Vérifiez email-config.js');
        return;
    }
    
    console.log('📧 Config EmailJS:', EMAILJS_CONFIG);
    
    // Initialisation d'EmailJS avec la Public Key
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialisé avec succès');
    } catch (error) {
        console.error('❌ Erreur initialisation EmailJS:', error);
        return;
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (!contactForm) {
        console.error('❌ Formulaire #contact-form non trouvé');
        return;
    }
    
    console.log('✅ Formulaire trouvé');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📨 Tentative d\'envoi...');
        
        // Désactiver le bouton pendant l'envoi
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Masquer les messages précédents
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        // Récupérer les données du formulaire pour debug
        const formData = new FormData(contactForm);
        console.log('📋 Données du formulaire:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`);
        }

        // Envoi via EmailJS
        emailjs.sendForm(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            contactForm
        )
        .then(function(response) {
            console.log('✅ SUCCÈS!', response);
            successMsg.style.display = 'block';
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
        })
        .catch(function(error) {
            console.error('❌ ERREUR COMPLÈTE:', error);
            console.error('Status:', error.status);
            console.error('Text:', error.text);
            
            // Message d'erreur détaillé
            let errorMsgText = 'Erreur lors de l\'envoi.';
            if (error.status === 0) {
                errorMsgText = 'Problème de connexion. Vérifiez votre internet ou les fichiers JS.';
            } else if (error.text) {
                errorMsgText = error.text;
            }
            
            errorMsg.textContent = '❌ ' + errorMsgText;
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
        });
    });
});