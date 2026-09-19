/* ===========================
   GIBBS EDU TECH — STUDENT PAGE JS
   Countdown, Seats Animation, Interactions
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

    // --- Seats Ring Animation ---
    const seatsRingFill = document.getElementById('seatsRingFill');
    const seatsCountEl = document.getElementById('seatsCount');

    if (seatsRingFill && seatsCountEl) {
        const totalSeats = 60;
        const remainingSeats = 60; // Hardcoded for now — will be dynamic later
        const circumference = 2 * Math.PI * 52; // r=52
        const fillPercent = remainingSeats / totalSeats;
        const offset = circumference * (1 - fillPercent);

        // Start fully hidden, animate on scroll
        seatsRingFill.style.strokeDasharray = circumference;
        seatsRingFill.style.strokeDashoffset = circumference;

        const seatsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        seatsRingFill.style.strokeDashoffset = offset;
                    }, 300);

                    // Animate count number
                    animateNumber(seatsCountEl, 0, remainingSeats, 1500);
                    seatsObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const seatsBox = document.querySelector('.seats-box');
        if (seatsBox) seatsObserver.observe(seatsBox);
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
