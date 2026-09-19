/* ===========================
   GIBBS EDU TECH — STUDENT PAGE JS
   Countdown, Per-Track Seats, Curriculum Toggle
   =========================== */

function initStudentPage() {

    // --- Countdown Timer to October 30, 2026 ---
    const batchDate = new Date('2026-10-30T09:00:00+05:30').getTime();
    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');

    if (cdDays && cdHours && cdMins && cdSecs) {
        function updateCountdown() {
            const now = Date.now();
            const diff = batchDate - now;

            if (diff <= 0) {
                cdDays.textContent = '00';
                cdHours.textContent = '00';
                cdMins.textContent = '00';
                cdSecs.textContent = '00';
                const label = document.querySelector('.countdown-label');
                if (label) label.innerHTML = '<i class="fas fa-check-circle"></i> Batch Has Started!';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            cdDays.textContent = String(days).padStart(2, '0');
            cdHours.textContent = String(hours).padStart(2, '0');
            cdMins.textContent = String(mins).padStart(2, '0');
            cdSecs.textContent = String(secs).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // --- Per-Track Seat Trackers ---
    const trackSeatTrackers = document.querySelectorAll('.track-seat-tracker');

    if (trackSeatTrackers.length > 0) {
        const seatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tracker = entry.target;
                    const total = parseInt(tracker.dataset.total) || 60;
                    const remaining = parseInt(tracker.dataset.remaining) || 60;
                    const fillPercent = (remaining / total) * 100;
                    const fillBar = tracker.querySelector('.track-seat-fill');
                    const countStrong = tracker.querySelector('.track-seat-count strong');

                    if (fillBar) {
                        // Start from 0, animate to fill
                        fillBar.style.width = '0%';
                        setTimeout(() => {
                            fillBar.style.width = fillPercent + '%';
                        }, 200);
                    }

                    if (countStrong) {
                        animateNumber(countStrong, 0, remaining, 1200);
                    }

                    seatObserver.unobserve(tracker);
                }
            });
        }, { threshold: 0.3 });

        trackSeatTrackers.forEach(tracker => seatObserver.observe(tracker));
    }

    // --- Number Animation Helper ---
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(start + (end - start) * easeOut);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
            else element.textContent = end;
        }

        requestAnimationFrame(update);
    }

    // --- Curriculum Toggle (expand/collapse) ---
    document.querySelectorAll('.curriculum-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const curriculum = toggle.closest('.track-curriculum');
            const weeks = curriculum.querySelector('.curriculum-weeks');
            const hint = toggle.querySelector('.toggle-hint');

            if (!weeks) return;

            const isHidden = weeks.style.display === 'none';
            weeks.style.display = isHidden ? 'flex' : 'none';

            if (hint) {
                hint.textContent = isHidden ? '(click to collapse)' : '(click to expand)';
            }
        });
    });

    // --- Scroll Reveal for Student-specific elements ---
    const studentRevealSelectors = [
        '.value-card',
        '.enroll-card',
        '.enroll-note',
        '.student-track-card'
    ];

    const studentRevealElements = document.querySelectorAll(studentRevealSelectors.join(', '));
    studentRevealElements.forEach(el => el.classList.add('reveal'));

    const studentRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                studentRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    studentRevealElements.forEach(el => studentRevealObserver.observe(el));

    // --- Track card hover ripple effect ---
    document.querySelectorAll('.student-track-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudentPage);
} else {
    initStudentPage();
}
