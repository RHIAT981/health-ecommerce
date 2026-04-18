// Intersection Observer for Premium Scroll Animations
const observerOptions = {
    threshold: 0,
    rootMargin: "0px 0px 50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            // Once revealed, we can stop observing if we want a one-time animation
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('section, .card, .storeCard, .projectCard, .timeline > div').forEach(el => {
    el.classList.add('hidden-section');
    observer.observe(el);
});

// ============================================
// THEME TOGGLE — Dark / Light Mode
// ============================================
function applyTheme() {
    const saved = localStorage.getItem('theme');
    const toggle = document.getElementById("themeToggle");
    if (saved === 'light') {
        document.body.classList.add("light");
        if (toggle) toggle.textContent = '🌙';
    } else {
        document.body.classList.remove("light");
        if (toggle) toggle.textContent = '☀️';
    }
}

function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    applyTheme();
    toggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle("light");
        toggle.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
    initThemeToggle();
}


// Countdown Timer
function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;
    let totalSeconds = 12 * 60 * 60;
    function update() {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        timerElement.innerHTML = (hours < 10 ? '0' : '') + hours + "h : " + (minutes < 10 ? '0' : '') + minutes + "m : " + (seconds < 10 ? '0' : '') + seconds + "s";
        totalSeconds--;
        if (totalSeconds < 0) totalSeconds = 12 * 60 * 60;
    }
    update();
    setInterval(update, 1000);
}
startCountdown();

// Standard PayPal Link Generator (No API needed)
function getPayPalEmailLink(itemName, amount) {
    // Redirects directly to the user's PayPal.me link with the required amount in USD
    return `https://paypal.me/health2026/${amount}USD`;
}

function initPayPalButton(itemName, amount, btnId) {
    // Upgraded to render real interactive buttons on the home page too
    renderStandardButtons(itemName, amount, btnId);
}

function renderFallbackButton(container, itemName, amount) {
    container.innerHTML = `
        <a href="${getPayPalEmailLink(itemName, amount)}" target="_blank" class="paypal-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" style="margin-right:8px; flex-shrink:0;">
                <path d="M20.067 6.378c-.201-1.303-.591-2.18-1.282-2.852C17.65 2.455 15.688 2 13.013 2H6.969c-.439 0-.819.324-.882.756L3.13 21.314a.455.455 0 0 0 .448.52h4.521c.367 0 .685-.27.738-.631l.995-6.848c.053-.361.371-.631.738-.631h2.292c4.463 0 7.37-2.19 8.205-7.346zm-1.636 5.862c-.443 2.766-2.228 4.29-5.111 4.29H11.02c-.367 0-.685.271-.738.631l-1.01 6.945H5.803L8.683 4.834c.052-.361.37-.631.737-.631h3.763c3.486 0 5.41.802 6.002 2.7.202 1.302.138 2.214-.294 3.337z" fill="#003087"/>
            </svg>
            <span>PAY WITH PAYPAL</span>
        </a>
    `;
}

// Re-using initPayPalButton for all specialized integrations

function initAdvancedCardFields(itemName, amount, btnId) {
    const container = document.querySelector(btnId);
    if (!container) return;

    const businessEmail = 'rhiatabdellah712@gmail.com'; 

    // 1. Build the Professional Card Form (Always Visible)
    container.innerHTML = `
        <div class="native-card-form" style="margin-bottom: 25px; padding: 25px; border: 2px solid #22c55e; border-radius: 20px; background: #0f172a; box-shadow: 0 10px 40px rgba(0,0,0,0.4);">
            <h4 style="color: #fff; margin-bottom: 20px; text-align: center; font-size: 1.2rem; font-weight: 700;">💳 الدفع المباشر بالبطاقة البنكية | Secure Card Checkout</h4>
            
            <div style="margin-bottom: 15px; text-align: left;">
                <label style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">رقم البطاقة | Card Number</label>
                <div id="card-number-field" style="height: 50px; background: #fff; border-radius: 10px; margin-top: 5px; padding: 0 10px; border: 1px solid #cbd5e1;"></div>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; text-align: left;">
                <div style="flex: 1;">
                    <label style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">تاريخ الانتهاء | Expiry</label>
                    <div id="card-expiry-field" style="height: 50px; background: #fff; border-radius: 10px; margin-top: 5px; padding: 0 10px; border: 1px solid #cbd5e1;"></div>
                </div>
                <div style="flex: 1;">
                    <label style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">CVV</label>
                    <div id="card-cvv-field" style="height: 50px; background: #fff; border-radius: 10px; margin-top: 5px; padding: 0 10px; border: 1px solid #cbd5e1;"></div>
                </div>
            </div>
            
            <button id="card-pay-btn-final" style="width: 100%; height: 70px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #fff; border: none; border-radius: 12px; font-weight: 800; font-size: 1.2rem; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 12px 24px rgba(34, 197, 94, 0.4);">
                <span>PAY $${amount} NOW | إدفع الآن</span>
                <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.9; margin-top: 4px;">🔒 Direct SSL Encrypted Checkout</span>
            </button>

            <div style="text-align: center; margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <span style="color: #94a3b8; font-size: 0.85rem; display: block; margin-bottom: 15px;">أو الدفع عبر باي بال | OR PAY WITH PAYPAL</span>
                <div id="paypal-fallback-container"></div>
            </div>
        </div>
    `;

    // 2. Logic to handle the payment
    if (window.paypal) {
        // Attempt Advanced Card Fields (Stay on page)
        if (paypal.CardFields) {
            const cardFields = paypal.CardFields({
                createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: amount }, description: itemName }] }),
                onApprove: (data, actions) => actions.order.capture().then(() => window.location.href = 'thanks.html'),
                onError: (err) => {
                    console.error('Card Fields error:', err);
                    triggerLegacyFallback();
                }
            });

            if (cardFields.isEligible()) {
                cardFields.NumberField().render('#card-number-field');
                cardFields.ExpiryField().render('#card-expiry-field');
                cardFields.CVVField().render('#card-cvv-field');
                document.getElementById('card-pay-btn-final').onclick = () => {
                    document.getElementById('card-pay-btn-final').innerHTML = '<span>Processing... | جاري الدفع...</span>';
                    cardFields.submit();
                };
            } else {
                setupLegacyUI();
            }
        } else {
            setupLegacyUI();
        }

        // Standard PayPal Button - Using the Legacy Direct URL which ALWAYS shows the amount and product name upfront
        const paypalContainer = document.getElementById('paypal-fallback-container');
        const businessEmail = 'rhiatabdellah712@gmail.com'; 
        if (paypalContainer) {
            const legacyUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD`;
            paypalContainer.innerHTML = `
                <a href="${legacyUrl}" target="_blank" style="display: flex; align-items: center; justify-content: center; background: #ffc439; color: #111; height: 55px; border-radius: 10px; text-decoration: none; font-weight: 700; gap: 10px; border: 1px solid #e2a400;">
                    <img src="https://img.icons8.com/color/48/000000/paypal.png" width="24">
                    <span>PAY $${amount} VIA PAYPAL</span>
                </a>
            `;
        }
    }

    function setupLegacyUI() {
        // If Advanced fields are not available, clicking the button uses the Direct PayPal URL
        // This is THE MOST RELIABLE way to show the amount and allow card payment
        document.getElementById('card-pay-btn-final').onclick = triggerLegacyFallback;
    }

    function triggerLegacyFallback() {
        const btn = document.getElementById('card-pay-btn-final');
        btn.innerHTML = '<span>Redirecting... | جاري التحويل...</span>';
        const fallbackUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD&solution_type=Sole&landing_page=Billing`;
        window.location.href = fallbackUrl;
    }
}

function renderStandardButtons(itemName, amount, btnId) {
    const container = document.querySelector(btnId);
    if (!container) return;

    // We use the direct paypal.me link because it shows the amount transparently to the user
    renderFallbackButton(container, itemName, amount);
}

function initOtherPayments(itemName, amount, cardBtnId, binanceBtnId) {
    const binanceBtn = document.querySelector(binanceBtnId);
    if (binanceBtn) {
        binanceBtn.onclick = () => showBinanceModal(itemName, amount);
    }

    const cardBtn = document.querySelector(cardBtnId);
    if (cardBtn) {
        cardBtn.onclick = () => {
            window.open(`https://paypal.me/health2026/${amount}USD`, '_blank');
        };
    }
}

function showBinanceModal(itemName, amount) {
    const binanceWallet = "TYy7YAYg7LbM83vLSM7VrFVcM394fTEvMG";
    const whatsappLink = "https://wa.me/212641617786";
    let modal = document.getElementById('binanceModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `<div id="binanceModal" class="modal"></div>`);
        modal = document.getElementById('binanceModal');
    }
    modal.innerHTML = `
            <div class="modal-content" style="max-width: 320px; padding: 20px; border-radius: 15px; background: #0f172a; border: 1px solid #f3ba2f; color: white;">
                <span class="close-modal" style="font-size: 24px; top: 10px; right: 15px; color: #cbd5e1; cursor: pointer; position: absolute;">&times;</span>
                <div style="text-align: center; margin-top: 5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#f3ba2f" style="margin-bottom: 2px;"><path d="M12 2L9.5 4.5L12 7L14.5 4.5ZM5 9.5L2.5 12L5 14.5L7.5 12ZM19 9.5L16.5 12L19 14.5L21.5 12ZM12 9.5L9.5 12L12 14.5L14.5 12ZM12 17L9.5 19.5L12 22L14.5 19.5Z"/></svg>
                    <h2 style="font-size: 1.1rem; margin-bottom: 5px; color: #f3ba2f; font-weight: 700;">Binance Pay Checkout</h2>
                </div>
                
                <div style="text-align: center; margin: 10px 0;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${binanceWallet}" alt="Binance QR" style="width: 110px; height: 110px; border-radius: 8px; border: 2px solid #f3ba2f; background: white; padding: 5px;">
                </div>
                
                <div style="text-align: center;">
                    <span style="font-size: 0.8rem; font-weight: 600; color: #fff;">Total: $${amount} | Network: TRC20</span>
                    <div style="font-size: 0.70rem; color: #cbd5e1; word-break: break-all; background: rgba(243, 186, 47, 0.05); border: 1px dashed #f3ba2f; padding: 8px; border-radius: 5px; margin: 8px 0; user-select: all;">${binanceWallet}</div>
                    <button id="copyBtn" style="width: 100%; border-radius: 5px; background: #334155; color: #fff; border: 1px solid #475569; padding: 8px; font-size: 0.85rem; margin-bottom: 10px; cursor: pointer; transition: 0.2s;">Copy Address | نسخ</button>
                </div>
                
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0;">
                
                <div style="text-align: left; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 15px; text-align: center;">بعد النقل، أدخل عنوان التوصيل لإرسال المنتج إليك:</p>
                    <label style="color: #cbd5e1; font-size: 0.8rem; margin-bottom: 5px; display: block;">Full Name:</label>
                    <input type="text" id="wa-name" placeholder="E.g. John Doe" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #475569; background: #1e293b; color: white; margin-bottom: 10px; font-size: 0.85rem; box-sizing: border-box;" required>
                    
                    <label style="color: #cbd5e1; font-size: 0.8rem; margin-bottom: 5px; display: block;">Full Shipping Address:</label>
                    <textarea id="wa-address" placeholder="123 Main St, New York, NY 10001" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #475569; background: #1e293b; color: white; height: 60px; font-size: 0.85rem; box-sizing: border-box; resize: none;" required></textarea>
                </div>
                
                <button id="sendWaBtn" style="width: 100%; font-weight: bold; background: #25d366; color: white !important; border: none; border-radius: 5px; padding: 12px; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12.01 2.01c-5.52 0-9.99 4.47-9.99 9.99 0 1.96.57 3.79 1.54 5.34l-1.57 5.75 5.86-1.54c1.51.93 3.29 1.46 5.16 1.46 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm5.55 14.15c-.27.76-1.54 1.48-2.12 1.56-.54.08-1.25.13-3.64-.86-2.87-1.19-4.72-4.14-4.86-4.32-.14-.19-1.16-1.55-1.16-2.96 0-1.42.74-2.12 1.01-2.42.27-.3.59-.38.79-.38.2 0 .4 0 .57.01.19.01.44-.07.69.53.26.63.89 2.18.97 2.34.08.16.14.34.04.53-.1.19-.15.31-.3.47-.15.16-.32.36-.45.48-.15.16-.32.32-.14.62.18.3 1.13 1.83 2.5 3.06 1.77 1.59 3.27 2.08 3.57 2.22.3.14.48.11.66-.1.18-.21.78-.91.99-1.22.2-.31.42-.26.69-.16.27.1 1.72.81 2.02.96.3.15.5.23.57.36.07.12.07.72-.2 1.48z"/></svg>
                    Send Proof & Address
                </button>
            </div>`;
    modal.style.display = 'flex';
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(binanceWallet).then(() => {
            const btn = document.getElementById('copyBtn');
            btn.innerHTML = "Copied! | تم النسخ";
            setTimeout(() => btn.innerHTML = "Copy Address | نسخ", 2000);
        });
    };
    
    document.getElementById('sendWaBtn').onclick = () => {
        const name = document.getElementById('wa-name').value.trim();
        const address = document.getElementById('wa-address').value.trim();
        
        if (!name || !address) {
            alert("Please enter your full name and shipping address before confirming via WhatsApp.\n\nيرجى إدخال اسمك الكامل وعنوان التوصيل أولاً حتى نتمكن من شحن طلبك.");
            return;
        }
        
        const message = `*✅ Binance Payment Received - Order Request*\n\n*🛒 Product:* ${itemName}\n*💰 Total Paid:* $${amount} USDT\n\n*📦 Shipping Information:*\n*Name:* ${name}\n*Address:* ${address}\n\n_Please find attached the screenshot of my payment._`;
        const encodedMessage = encodeURIComponent(message);
        
        // Open whatsapp link
        window.open(`${whatsappLink}?text=${encodedMessage}`, '_blank');
        
        // Optionally alert the user too
        setTimeout(() => {
            modal.style.display = 'none';
        }, 1000);
    };
}
