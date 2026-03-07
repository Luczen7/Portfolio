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

function printCV() {
    window.print();
}

function showCV(cvName) {
    // Cacher tous les CV
    document.getElementById('CV').classList.add('hidden');
    
    // Réinitialiser tous les onglets
    document.getElementById('tab-victoria').classList.remove('active');
   
    // Afficher le CV sélectionné
    if (cvName === 'victoria') {
        document.getElementById('cv-victoria').classList.remove('hidden');
        document.getElementById('tab-victoria').classList.add('active');
    }
}

// Charger la navigation
        fetch('./components/navigation.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('nav-container').innerHTML = html;
                // Réinitialiser la navigation après injection
                new Navigation();
            });

// Charger le bouton de téléchargement
fetch('./components/download-cv.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('download-container').innerHTML = html;
    });            
        
