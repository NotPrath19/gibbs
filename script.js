/* ===========================
   GIBBS EDU TECH PROPOSAL — JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar scroll behavior ---
    const nav = document.getElementById('main-nav');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) { nav.classList.add('scrolled'); }
        else { nav.classList.remove('scrolled'); }
        if (scrollY > 500) { backToTopBtn.classList.add('visible'); }
        else { backToTopBtn.classList.remove('visible'); }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Mobile menu toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
        });
    });

    // --- Counter animation ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(easeOut * target);
                counter.textContent = current.toLocaleString();
                if (progress < 1) { requestAnimationFrame(update); }
                else { counter.textContent = target.toLocaleString(); }
            }

            requestAnimationFrame(update);
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) { heroObserver.observe(heroStats); }

    // --- Hero particles ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (5 + Math.random() * 6) + 's';
            const size = (2 + Math.random() * 4) + 'px';
            particle.style.width = size;
            particle.style.height = size;
            particle.style.opacity = (0.1 + Math.random() * 0.4);
            const colors = ['#43c6ac', '#f7b733', '#6fd9c4', '#ffffff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particlesContainer.appendChild(particle);
        }
    }

    // --- Scroll reveal ---
    const revealSelectors = [
        '.cs-card', '.method-step', '.program-card', '.pricing-card',
        '.why-card', '.benefit-card', '.cta-step',
        '.prepared-for-banner > div'
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // --- Form submission ---
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = enquiryForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Interest Submitted!';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            btn.style.borderColor = '#2ecc71';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                enquiryForm.reset();
            }, 3000);
        });
    }

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.style.color = '#43c6ac';
            } else {
                a.style.color = '';
            }
        });
    });

    // --- Curriculum toggle (expand/collapse) ---
    document.querySelectorAll('.program-curriculum h4').forEach(h4 => {
        h4.style.cursor = 'pointer';
        h4.addEventListener('click', () => {
            const curriculum = h4.parentElement;
            const blocks = curriculum.querySelectorAll('.month-block');
            const isCollapsed = blocks[0].style.display === 'none';
            blocks.forEach(b => {
                b.style.display = isCollapsed ? '' : 'none';
            });
            h4.innerHTML = isCollapsed
                ? '<i class="fas fa-calendar-alt"></i> 12-Week Breakdown <span style="font-size:0.7em;opacity:0.5">(click to collapse)</span>'
                : '<i class="fas fa-calendar-alt"></i> 12-Week Breakdown <span style="font-size:0.7em;opacity:0.5">(click to expand)</span>';
        });
    });
});
