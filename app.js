/* ==========================================================================
   Ultra-Streamlined Interaction Controller — app.js
   Instantly redirects client to WhatsApp with the selected calendar date only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE MACHINE FOR BOOKING SYSTEM ---
    const bookingState = {
        package: '1:1 Study Support & Focus Session',
        currentYear: 2026,
        currentMonth: 4, // 0-indexed, so 4 is May
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    // --- DOM ELEMENTS REFERENCE ---
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('close-booking');
    
    // Calendar Elements
    const calendarMonthLabel = document.getElementById('current-month-year');
    const calendarDaysGrid = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    // Sticky CTA & Scroll Triggers
    const stickyMobileCta = document.getElementById('sticky-mobile-cta');
    const bookingCtaBtn = document.getElementById('booking-cta-btn');

    // --- 1. MODAL STATE TOGGLERS ---
    
    const openBooking = () => {
        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        renderCalendar();
    };

    const closeBooking = () => {
        bookingModal.classList.remove('active');
        bookingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach click events to booking trigger buttons
    document.querySelectorAll('.trigger-booking-modal').forEach(trigger => {
        trigger.addEventListener('click', openBooking);
    });

    closeBookingBtn.addEventListener('click', closeBooking);

    // Close Modals on background clicking
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBooking();
    });

    // --- 2. DYNAMIC CALENDAR GENERATOR & INSTANT REDIRECT ---

    const renderCalendar = () => {
        calendarDaysGrid.innerHTML = '';
        
        const year = bookingState.currentYear;
        const month = bookingState.currentMonth;
        
        calendarMonthLabel.textContent = `${bookingState.monthNames[month]} ${year}`;

        // Get first day & total days in month
        const firstDayIdx = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        // Convert JS Sunday-start (0-6) to standard Monday-start index (0-6)
        let startOffset = firstDayIdx === 0 ? 6 : firstDayIdx - 1;

        // Fill empty starting grid offsets
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            calendarDaysGrid.appendChild(emptyCell);
        }

        // Set baseline comparison Date constraints (May 24, 2026)
        const todayConstraint = new Date(2026, 4, 24);

        // Populate days
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            const cellDate = new Date(year, month, day);
            const weekday = cellDate.getDay();

            // Business Rules check: disallow passed dates & weekend slots
            const isWeekend = (weekday === 0 || weekday === 6);
            const isPast = cellDate < todayConstraint;

            if (isWeekend || isPast) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.classList.add('available-slot');
                
                dayCell.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day').forEach(cell => cell.classList.remove('selected'));
                    dayCell.classList.add('selected');
                    
                    // INSTANT REDIRECT TO WHATSAPP WITH SELECTED DATE ONLY
                    setTimeout(() => {
                        const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                        const dateStr = cellDate.toLocaleDateString('en-US', dateOptions);
                        
                        const message = `Hi Nazal, I want to book a 1:1 Study Support & Focus Session for *${dateStr}*!`;
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/918086272273?text=${encodedMessage}`;
                        
                        // Launch WhatsApp in a new tab
                        window.open(whatsappUrl, '_blank');
                        
                        // Close calendar modal
                        closeBooking();
                    }, 200);
                });
            }

            calendarDaysGrid.appendChild(dayCell);
        }
    };

    // Calendar Month Navigation Buttons Event Listeners
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            // Disallow going before May 2026
            if (bookingState.currentMonth > 4 || bookingState.currentYear > 2026) {
                bookingState.currentMonth--;
                if (bookingState.currentMonth < 0) {
                    bookingState.currentMonth = 11;
                    bookingState.currentYear--;
                }
                renderCalendar();
            }
        });

        nextMonthBtn.addEventListener('click', () => {
            // Limit to August 2026
            if (bookingState.currentMonth < 7 || bookingState.currentYear < 2026) {
                bookingState.currentMonth++;
                if (bookingState.currentMonth > 11) {
                    bookingState.currentMonth = 0;
                    bookingState.currentYear++;
                }
                renderCalendar();
            }
        });
    }

    // --- 3. SIMULATED WHATSAPP COMMUNITY COUNTER (GROWTH CIRCLE) ---
    
    const activeCounterEl = document.getElementById('active-members');
    let activeVal = 412;

    const simulateActiveCommunityStats = () => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        activeVal = Math.max(405, Math.min(428, activeVal + change));
        
        if (activeCounterEl) {
            activeCounterEl.textContent = `${activeVal} Members Active`;
        }
        
        const nextTimeout = Math.floor(Math.random() * 4000) + 4000;
        setTimeout(simulateActiveCommunityStats, nextTimeout);
    };

    setTimeout(simulateActiveCommunityStats, 3000);

    // --- 4. MOBILE VIEWPORT EVENTS & STICKY CTA ---

    const handleScrollTransitions = () => {
        if (!stickyMobileCta || !bookingCtaBtn) return;

        const topCtaBottom = bookingCtaBtn.getBoundingClientRect().bottom + window.scrollY;
        const currentScroll = window.scrollY;

        if (currentScroll > topCtaBottom) {
            stickyMobileCta.classList.add('visible');
        } else {
            stickyMobileCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScrollTransitions);
    handleScrollTransitions();
});
