document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run animation only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // 2. Pricing Toggle Logic
    const billingSwitch = document.getElementById('billing-switch');
    const dynamicPrices = document.querySelectorAll('.dynamic-price');
    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnual = document.getElementById('label-annual');
    
    // Discount factor (15% off)
    const discount = 0.85;

    if (billingSwitch) {
        billingSwitch.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;
            
            // Toggle active labels
            if (isAnnual) {
                labelMonthly.classList.remove('active');
                labelAnnual.classList.add('active');
            } else {
                labelAnnual.classList.remove('active');
                labelMonthly.classList.add('active');
            }

            // Update prices
            dynamicPrices.forEach(priceEl => {
                const basePrice = parseInt(priceEl.parentElement.getAttribute('data-monthly'), 10);
                
                if (isAnnual) {
                    // Apply discount
                    const discountedPrice = basePrice * discount;
                    // Format with thousands separator
                    priceEl.textContent = discountedPrice.toLocaleString('es-AR');
                } else {
                    // Restore original price
                    priceEl.textContent = basePrice.toLocaleString('es-AR');
                }
            });
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            // Simple toggle for mobile nav
            if (navList.style.display === 'flex') {
                navList.style.display = 'none';
            } else {
                navList.style.display = 'flex';
                navList.style.flexDirection = 'column';
                navList.style.position = 'absolute';
                navList.style.top = '100%';
                navList.style.left = '0';
                navList.style.width = '100%';
                navList.style.background = 'rgba(10, 15, 26, 0.95)';
                navList.style.padding = '20px 0';
                navList.style.backdropFilter = 'blur(10px)';
                navList.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
            }
        });
    }

    // 4. Header Background on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 15, 26, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 15, 26, 0.8)';
            header.style.boxShadow = 'none';
        }
    });
});
