document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const observeElements = () => {
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-right');
        animatedElements.forEach(el => observer.observe(el));
    };
    observeElements();

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
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

    // ==========================================
    // DYNAMIC CMS LOGIC (KVDB)
    // ==========================================
    const KVDB_URL = 'https://kvdb.io/5x1ToFqcujZEyHwkY2wqb8/plans';
    
    let defaultPlans = [
        {
            title: "Google Local", desc: "Ideal para comercios de barrio que solo necesitan que los encuentren.", image: "",
            priceType: "Pago único", price: "35000", period: " ARS", features: "Alta en Google Maps\nOptimización completa de ficha\nConfig. de horarios y fotos\nDatos de contacto precisos", isRecommended: false
        },
        {
            title: "Control Digital", desc: "Para negocios que quieren Maps y ordenar sus números de forma fácil.", image: "",
            priceType: "Suscripción Sistema", price: "15000", period: " / mes", features: "Todo Google Local\nSistema de Control de Ventas\nGestión de gastos diarios\nCálculo de ganancias autom.", isRecommended: false
        },
        {
            title: "Presencia Web", desc: "Para empresas que quieren dar el salto de confianza en internet 24/7.", image: "",
            priceType: "Suscripción Integral (Inc. Hosting)", price: "55000", period: " / mes", features: "Todo Control Digital\nPágina Web Profesional\nHosting y Soporte incluido\nOptimización para celulares (Responsive)", isRecommended: true
        },
        {
            title: "Impulso Comercial", desc: "El combo perfecto para las PyMEs que quieren vender a nivel profesional.", image: "",
            priceType: "Suscripción Integral", price: "95000", period: " / mes", features: "Todo Presencia Web\nConfiguración Redes Business\nInstagram Optimizado\nWhatsApp Automático (Catálogo/Bots)", isRecommended: false
        }
    ];

    let currentPlans = [...defaultPlans];
    let isAnnualBilling = false;
    const discount = 0.85;

    // Fetch from DB
    fetch(KVDB_URL)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not found');
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                currentPlans = data;
                renderPlans();
                buildAdminPanel();
            }
        })
        .catch(() => {
            console.log('Using default plans structure.');
            renderPlans();
            buildAdminPanel();
        });

    function renderPlans() {
        const container = document.getElementById('dynamic-pricing-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        currentPlans.forEach((plan, i) => {
            const delay = i * 100;
            const recClass = plan.isRecommended ? 'popular glow-effect' : '';
            const recBadge = plan.isRecommended ? '<div class="popular-badge">Recomendado</div>' : '';
            
            const imageHtml = plan.image ? `<img src="${plan.image}" style="width: 100%; border-radius: 8px; margin-bottom: 16px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" alt="${plan.title}">` : '';
            
            const featureList = plan.features.split('\n').map(f => `<li><span class="check">✓</span> ${f}</li>`).join('');
            
            // Calc price based on toggle
            let displayPrice = parseInt(plan.price, 10);
            if (!isNaN(displayPrice) && isAnnualBilling && plan.period.includes('mes')) {
                displayPrice = displayPrice * discount;
            }
            const priceStr = isNaN(displayPrice) ? plan.price : displayPrice.toLocaleString('es-AR');
            
            const html = `
                <div class="pricing-card glass-card fade-in-up ${recClass}" style="transition-delay: ${delay}ms;">
                    ${recBadge}
                    ${imageHtml}
                    <div class="plan-header">
                        <h3 class="plan-name">${plan.title}</h3>
                        <p class="plan-desc">${plan.desc}</p>
                    </div>
                    <div class="plan-price-wrapper">
                        <div class="price-type">${plan.priceType}</div>
                        <div class="plan-price">
                            <span class="currency">$</span>
                            <span class="amount dynamic-price">${priceStr}</span>
                            <span class="period">${plan.period}</span>
                        </div>
                    </div>
                    <ul class="plan-features">
                        ${featureList}
                    </ul>
                    <div class="plan-cta">
                        <a href="#contacto" class="btn ${plan.isRecommended ? 'btn-primary' : 'btn-outline'} btn-full">Elegir Plan</a>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
        observeElements();
    }

    // Billing toggle logic
    const billingSwitch = document.getElementById('billing-switch');
    if (billingSwitch) {
        billingSwitch.addEventListener('change', (e) => {
            isAnnualBilling = e.target.checked;
            document.getElementById('label-monthly').classList.toggle('active', !isAnnualBilling);
            document.getElementById('label-annual').classList.toggle('active', isAnnualBilling);
            renderPlans();
        });
    }

    // ==========================================
    // ADMIN PANEL LOGIC
    // ==========================================
    const logoEl = document.querySelector('.header .logo');
    let clickCount = 0;
    let clickTimer = null;
    const adminModal = document.getElementById('adminModal');
    
    if (logoEl) {
        logoEl.addEventListener('click', () => {
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => clickCount = 0, 5000);
            
            if (clickCount >= 7) {
                clickCount = 0;
                if (prompt('Clave de acceso:') === '0803') {
                    buildAdminPanel();
                    adminModal.style.display = 'flex';
                }
            }
        });
    }
    
    function buildAdminPanel() {
        const container = document.getElementById('adminPlansContainer');
        if (!container) return;
        container.innerHTML = '';
        
        currentPlans.forEach((plan, i) => {
            container.innerHTML += `
                <div style="background: rgba(255,255,255,0.05); padding: 16px; margin-bottom: 16px; border-radius: 8px;">
                    <h4 style="margin-bottom: 12px; color: var(--primary);">Plan ${i + 1}</h4>
                    <input type="text" id="admin_title_${i}" value="${plan.title}" placeholder="Título" style="width: 100%; margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">
                    <input type="text" id="admin_desc_${i}" value="${plan.desc}" placeholder="Descripción" style="width: 100%; margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="admin_image_${i}" value="${plan.image}" placeholder="Imagen (ej. flyer1.jpeg) o dejar vacío" style="flex: 1; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">
                        <button class="btn btn-outline" style="padding: 8px; font-size: 12px; border-color: red; color: red;" onclick="document.getElementById('admin_image_${i}').value=''">Quitar Imagen</button>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="admin_price_${i}" value="${plan.price}" placeholder="Precio (ej. 35000)" style="flex: 1; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">
                        <input type="text" id="admin_period_${i}" value="${plan.period}" placeholder="Periodo (ej. / mes)" style="flex: 1; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">
                    </div>
                    <textarea id="admin_features_${i}" rows="3" placeholder="Características (una por línea)" style="width: 100%; margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;">${plan.features}</textarea>
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                        <input type="checkbox" id="admin_rec_${i}" ${plan.isRecommended ? 'checked' : ''}> Es recomendado (destacado)
                    </label>
                    <button class="btn btn-outline" style="margin-top: 12px; padding: 6px 12px; font-size: 12px; border-color: red; color: red;" onclick="removePlan(${i})">Eliminar Plan</button>
                </div>
            `;
        });
    }

    window.removePlan = function(index) {
        if(confirm('¿Seguro que deseas eliminar este plan?')) {
            currentPlans.splice(index, 1);
            buildAdminPanel();
        }
    }

    const btnAdd = document.getElementById('adminAddPlanBtn');
    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            currentPlans.push({
                title: "Nuevo Plan", desc: "Descripción corta", image: "",
                priceType: "Suscripción", price: "0", period: " / mes", features: "Característica 1\nCaracterística 2", isRecommended: false
            });
            buildAdminPanel();
        });
    }
    
    const btnSave = document.getElementById('adminSaveBtn');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            // Rebuild currentPlans from DOM
            const newPlans = [];
            for (let i = 0; i < currentPlans.length; i++) {
                const elTitle = document.getElementById(`admin_title_${i}`);
                if(!elTitle) continue; // safety check
                
                newPlans.push({
                    title: elTitle.value,
                    desc: document.getElementById(`admin_desc_${i}`).value,
                    image: document.getElementById(`admin_image_${i}`).value,
                    priceType: currentPlans[i].priceType, // Keep original or make it editable if needed
                    price: document.getElementById(`admin_price_${i}`).value,
                    period: document.getElementById(`admin_period_${i}`).value,
                    features: document.getElementById(`admin_features_${i}`).value,
                    isRecommended: document.getElementById(`admin_rec_${i}`).checked
                });
            }
            
            const statusText = document.getElementById('adminStatus');
            statusText.textContent = 'Guardando...';
            statusText.style.display = 'block';
            
            fetch(KVDB_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlans)
            })
            .then(res => {
                if(res.ok) {
                    statusText.textContent = '¡Planes actualizados!';
                    currentPlans = newPlans;
                    renderPlans();
                    setTimeout(() => adminModal.style.display = 'none', 1500);
                } else throw new Error();
            })
            .catch(() => statusText.textContent = 'Error al guardar.');
        });
    }

    const btnClose = document.getElementById('adminCloseBtn');
    if (btnClose) btnClose.addEventListener('click', () => adminModal.style.display = 'none');
});
