// ============================================
// NAVIGATION LOGIC - TLWT Portfolio
// ============================================

class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.toggle = document.getElementById('navToggle');
        this.mobile = document.getElementById('navMobile');
        this.overlay = document.getElementById('navOverlay');
        this.links = document.querySelectorAll('.nav-link, .nav-mobile-link');
        
        this.currentPage = this.detectCurrentPage();
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.highlightCurrentPage();
        this.handleSmoothScroll();
        
        // Fermer le menu au redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    // Détecte la page actuelle
    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        if (page === 'index.html' || page === '') return 'index';
        if (page === 'index2.html') return 'cv';
        if (page === 'index3.html') return 'projects';
        return 'index';
    }

    // Effet scroll
    handleScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Ajouter/retirer la classe scrolled
            if (currentScroll > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            // Cacher/montrer la nav au scroll (optionnel)
            if (currentScroll > lastScroll && currentScroll > 200) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Menu mobile
    handleMobileMenu() {
        if (!this.toggle) return;
        
        this.toggle.addEventListener('click', () => {
            this.toggle.classList.toggle('active');
            this.mobile.classList.toggle('active');
            this.overlay.classList.toggle('active');
            document.body.style.overflow = this.mobile.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer au clic sur l'overlay
        this.overlay?.addEventListener('click', () => this.closeMobileMenu());

        // Fermer au clic sur un lien
        this.mobile?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }

    closeMobileMenu() {
        this.toggle?.classList.remove('active');
        this.mobile?.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Met en évidence la page active
    highlightCurrentPage() {
        this.links.forEach(link => {
            const linkPage = link.dataset.page;
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Scroll doux pour les ancres
    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Hauteur de la nav
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});