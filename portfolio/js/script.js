// Register GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        cursorOutline.animate({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect
    document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = scrolled + "%";
});

// Magnetic Buttons
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
    });
});

// GSAP Animations
gsap.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.2
});

gsap.from(".hero-text", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.4
});

gsap.from(".project-card", {
    scrollTrigger: {
        trigger: "#work",
        start: "top 80%",
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power4.out"
});

gsap.to("#about img", {
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    y: -50
});

gsap.from(".skill-tag", {
    scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
    },
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: { amount: 1, from: "random" },
    ease: "back.out(1.7)"
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Form
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message envoyé ! (Démo)');
    });
}

// =====================================================
// GESTION DU FORMULAIRE DE CONTACT - EMAILJS LOCAL
// =====================================================

(function() {
    // Vérifier que EmailJS est chargé
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS non chargé');
        return;
    }

    // Initialiser EmailJS avec la configuration locale
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Désactiver le bouton pendant l'envoi
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Cacher les anciens messages
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        // Envoyer le formulaire
        emailjs.sendForm(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            this
        )
        .then(() => {
            // Succès
            successMsg.style.display = 'block';
            form.reset();
            
            // Cacher le message après 5 secondes
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        })
        .catch((error) => {
            // Erreur
            console.error('EmailJS Error:', error);
            errorMsg.style.display = 'block';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        })
        .finally(() => {
            // Réactiver le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
})();