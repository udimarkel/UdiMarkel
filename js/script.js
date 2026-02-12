document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scroll for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // --- Active Navigation Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.section, .project-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('reveal'); // Ensure reveal class is applied
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15
    });

    revealElements.forEach(el => {
        el.classList.add('reveal'); // Initial state
        revealObserver.observe(el);
    });

    // --- Timeline Scroll Zoom Logic ---
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineFocus() {
        const viewportCenter = window.innerHeight / 2;
        const viewportTop = window.innerHeight * 0.25; // First quarter
        const viewportBottom = window.innerHeight * 0.75; // Third quarter

        let closestItem = null;
        let minDistance = Infinity;

        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + (rect.height / 2);

            // Check if item center is within the middle half of screen
            // Or just find the absolute closest to center to ensure "only one"
            const distance = Math.abs(viewportCenter - itemCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        // Apply focus only if the closest item is reasonably visible (e.g. within viewport)
        // User requested: "Between first quarter and third quarter"

        timelineItems.forEach(item => {
            item.classList.remove('active-focus');
        });

        if (closestItem) {
            const rect = closestItem.getBoundingClientRect();
            const itemCenter = rect.top + (rect.height / 2);

            // Only activate if it's strictly within the 25% - 75% zone
            // Actually, to ensure smooth "handover", strictly closest is better,
            // but let's respect the "zoom in ... return to normal" when crossing bounds.

            if (itemCenter > viewportTop && itemCenter < viewportBottom) {
                closestItem.classList.add('active-focus');
            }
        }
    }

    // Run on scroll and initial load
    window.addEventListener('scroll', updateTimelineFocus);
    updateTimelineFocus();

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger lines (optional simple toggle)
            hamburger.classList.toggle('toggle');
        });
    }

    // --- Add CSS for Mobile Menu explicitly via JS (for simple toggle logic) ---
    // In a real larger app, this would be in CSS, but ensuring logic works here.
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @media screen and (max-width: 768px) {
            .nav-links.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 70px;
                right: 0;
                width: 100%;
                background: rgba(10, 10, 18, 0.95);
                backdrop-filter: blur(10px);
                padding: 2rem;
                align-items: center;
                border-bottom: 1px solid var(--glass-border);
            }
        }
    `;
    document.head.appendChild(styleSheet);


    // --- Language Toggle Logic ---
    const langToggle = document.getElementById('lang-toggle');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    // Check saved preference or default to Hebrew (as user requested priority)
    // User said: "Hebrew is the important language because most people will prefer to read it in Hebrew"
    // So let's default to Hebrew if no preference.

    // Actually, standard practice is browser lang or default. 
    // Let's check if stored. If not, default to 'he'.
    let currentLang = localStorage.getItem('preferredLang') || 'he';

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);

        if (lang === 'he') {
            htmlEl.setAttribute('dir', 'rtl');
            htmlEl.setAttribute('lang', 'he');
            bodyEl.classList.add('rtl-mode');
            langToggle.textContent = 'EN'; // Button shows option to switch TO English
        } else {
            htmlEl.setAttribute('dir', 'ltr');
            htmlEl.setAttribute('lang', 'en');
            bodyEl.classList.remove('rtl-mode');
            langToggle.textContent = 'HE'; // Button shows option to switch TO Hebrew
        }

        // Toggle visibility
        document.querySelectorAll('.lang-en').forEach(el => {
            el.style.display = lang === 'en' ? '' : 'none';
        });
        document.querySelectorAll('.lang-he').forEach(el => {
            el.style.display = lang === 'he' ? '' : 'none';
        });

        // Update Glitch Text Data Attribute logic if needed
        const glitchTexts = document.querySelectorAll('.glitch-text');
        glitchTexts.forEach(el => {
            const text = lang === 'he' ? el.getAttribute('data-text-he') : el.getAttribute('data-text-en');
            if (text) el.setAttribute('data-text', text);
        });
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'he' : 'en';
            updateLanguage(newLang);
        });
    }

    // Initialize
    updateLanguage(currentLang);

});
