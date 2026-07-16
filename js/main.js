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

    // 5. Secret Admin Panel & Dynamic Prices
    const KVDB_URL = 'https://kvdb.io/5x1ToFqcujZEyHwkY2wqb8/prices';
    let basePrices = [15000, 15000, 55000, 95000]; // Default fallbacks
    
    // Fetch prices on load
    fetch(KVDB_URL)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('No prices found');
        })
        .then(prices => {
            if (Array.isArray(prices) && prices.length === 4) {
                basePrices = prices;
                updateDOMPrices();
            }
        })
        .catch(err => console.log('Using default prices.'));

    function updateDOMPrices() {
        const priceEls = document.querySelectorAll('.plan-price');
        priceEls.forEach((el, index) => {
            if (basePrices[index]) {
                el.setAttribute('data-monthly', basePrices[index]);
            }
        });
        // Trigger billing switch logic if exists
        const billingSwitch = document.getElementById('billing-switch');
        if (billingSwitch) {
            billingSwitch.dispatchEvent(new Event('change'));
        } else {
            // Force update text if no billing switch
            const dynamicPrices = document.querySelectorAll('.dynamic-price');
            dynamicPrices.forEach((el, index) => {
                if (basePrices[index]) {
                    el.textContent = parseInt(basePrices[index], 10).toLocaleString('es-AR');
                }
            });
        }
    }

    // Secret Panel Trigger
    const logoEl = document.querySelector('.header .logo');
    let clickCount = 0;
    let clickTimer = null;
    
    if (logoEl) {
        logoEl.addEventListener('click', (e) => {
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 5000);
            
            if (clickCount >= 7) {
                clickCount = 0;
                const pwd = prompt('Clave de acceso:');
                if (pwd === '0803') {
                    openAdminModal();
                } else if (pwd !== null) {
                    alert('Clave incorrecta');
                }
            }
        });
    }
    
    const adminModal = document.getElementById('adminModal');
    const btnSave = document.getElementById('adminSaveBtn');
    const btnClose = document.getElementById('adminCloseBtn');
    const statusText = document.getElementById('adminStatus');
    
    function openAdminModal() {
        if (!adminModal) return;
        document.getElementById('adminPrice1').value = basePrices[0];
        document.getElementById('adminPrice2').value = basePrices[1];
        document.getElementById('adminPrice3').value = basePrices[2];
        document.getElementById('adminPrice4').value = basePrices[3];
        adminModal.style.display = 'flex';
        statusText.style.display = 'none';
    }
    
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }
    
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const p1 = parseInt(document.getElementById('adminPrice1').value, 10);
            const p2 = parseInt(document.getElementById('adminPrice2').value, 10);
            const p3 = parseInt(document.getElementById('adminPrice3').value, 10);
            const p4 = parseInt(document.getElementById('adminPrice4').value, 10);
            
            if (isNaN(p1) || isNaN(p2) || isNaN(p3) || isNaN(p4)) {
                alert('Por favor, ingresa solo números.');
                return;
            }
            
            const newPrices = [p1, p2, p3, p4];
            statusText.textContent = 'Guardando...';
            statusText.style.display = 'block';
            
            fetch(KVDB_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPrices)
            })
            .then(res => {
                if(res.ok) {
                    statusText.textContent = '¡Precios actualizados!';
                    basePrices = newPrices;
                    updateDOMPrices();
                    setTimeout(() => adminModal.style.display = 'none', 1500);
                } else {
                    throw new Error('Failed to save');
                }
            })
            .catch(err => {
                statusText.textContent = 'Error al guardar. Intenta de nuevo.';
            });
        });
    }

