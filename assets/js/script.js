/* ===========================
   GIBBS EDU TECH PROPOSAL — JavaScript
   =========================== */

function initProposalApp() {
    // --- Navbar scroll behavior ---
    const nav = document.getElementById('main-nav');
    const backToTopBtn = document.getElementById('backToTop');

    if (nav || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (nav) {
                if (scrollY > 60) { nav.classList.add('scrolled'); }
                else { nav.classList.remove('scrolled'); }
            }
            if (backToTopBtn) {
                if (scrollY > 500) { backToTopBtn.classList.add('visible'); }
                else { backToTopBtn.classList.remove('visible'); }
            }
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile menu toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }

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

    // --- Custom Multi-Select UI ---
    const box = document.getElementById('multiSelectBox');
    const dropdown = document.getElementById('multiSelectDropdown');
    
    if (box && dropdown) {
        const valDisplay = box.querySelector('.multi-select-value');
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        
        box.addEventListener('click', () => {
            const isActive = box.classList.contains('active');
            box.classList.toggle('active', !isActive);
            dropdown.style.display = isActive ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if (!box.contains(e.target) && !dropdown.contains(e.target)) {
                box.classList.remove('active');
                dropdown.style.display = 'none';
            }
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const selected = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
                if (selected.length > 0) {
                    valDisplay.textContent = selected.join(', ');
                    valDisplay.style.color = '#fff';
                } else {
                    valDisplay.textContent = 'Select preferred tracks...';
                    valDisplay.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });
    }

    // --- Form submission ---
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitter = e.submitter;
            const submitType = submitter ? submitter.value : 'email';
            
            const fullName = document.getElementById('fullName')?.value || '';
            const designation = document.getElementById('designation')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            
            const cbx = document.querySelectorAll('#multiSelectDropdown input[type="checkbox"]');
            const tracks = Array.from(cbx).filter(c => c.checked).map(c => c.value).join(', ') || 'None selected';
            
            const message = document.getElementById('message')?.value || '';

            const text = `New Interest from ${fullName} (${designation})\nEmail: ${email}\nPhone: ${phone}\nTracks Interested: ${tracks}\nMessage: ${message}`;

            let btn = submitter;
            if (!btn) {
                btn = enquiryForm.querySelector('button[type="submit"]');
            }
            
            const originalText = btn.innerHTML;
            const originalBg = btn.style.background;
            const originalBorder = btn.style.borderColor;

            const resetFormState = () => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg;
                btn.style.borderColor = originalBorder;
                enquiryForm.reset();
                const valDisplay = document.querySelector('.multi-select-value');
                if (valDisplay) {
                    valDisplay.textContent = 'Select preferred tracks...';
                    valDisplay.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            };

            if (submitType === 'whatsapp') {
                const waUrl = `https://wa.me/919171647365?text=${encodeURIComponent(text)}`;
                window.open(waUrl, '_blank');
                
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Opening WhatsApp...';
                btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                btn.style.borderColor = '#2ecc71';
                
                setTimeout(resetFormState, 3000);
            } else {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                fetch("https://formsubmit.co/ajax/gibbsedutech@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: fullName,
                        Designation: designation,
                        Email: email,
                        Phone: phone,
                        Tracks: tracks,
                        Message: message,
                        _subject: `Partnership Interest - ${fullName}`
                    })
                })
                .then(response => response.json())
                .then(data => {
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent Successfully!';
                    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                    btn.style.borderColor = '#2ecc71';
                    setTimeout(resetFormState, 3000);
                })
                .catch(error => {
                    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Sending';
                    btn.style.background = '#e74c3c';
                    btn.style.borderColor = '#e74c3c';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = originalBg;
                        btn.style.borderColor = originalBorder;
                    }, 3000);
                });
            }
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProposalApp);
} else {
    initProposalApp();
}
