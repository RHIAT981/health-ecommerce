const toggle = document.getElementById("themeToggle");

if (toggle) {
    toggle.onclick = () => {
        document.body.classList.toggle("light");
    }
}

const cards = document.querySelectorAll(".card");

function handleScroll() {
    cards.forEach(card => {
        let top = card.getBoundingClientRect().top;
        if (top < window.innerHeight - 50) {
            card.style.opacity = 1;
            card.style.transform = "translateY(0px)";
        }
    });
}

window.addEventListener("scroll", handleScroll);
handleScroll(); // Initial check

// Countdown Timer Logic
function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    let totalSeconds = 12 * 60 * 60; // 12 hours start

    function update() {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        timerElement.innerHTML =
            (hours < 10 ? '0' : '') + hours + "h : " +
            (minutes < 10 ? '0' : '') + minutes + "m : " +
            (seconds < 10 ? '0' : '') + seconds + "s";

        totalSeconds--;
        if (totalSeconds < 0) totalSeconds = 12 * 60 * 60; // Reset
    }

    update();
    setInterval(update, 1000);
}

startCountdown();

// PayPal Modern Integration Logic
function initAdvancedCardFields(itemName, amount, btnId, numId, expId, cvvId, submitId) {
    if (!document.querySelector(btnId)) return;

    const divider = document.querySelector('.payment-divider');
    const nativeForm = document.querySelector('.native-card-form');
    const trustedBadges = document.querySelector('.trusted-badges');

    // 1. Render Modern Smart Buttons (Fallback and alternate payment options)
    paypal.Buttons({
        experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            landing_page: 'billing'
        },
        style: { shape: 'rect', color: 'black', layout: 'vertical' },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => {
            window.location.href = 'shipping.html';
        })
    }).render(btnId);

    // 2. Initialize Native Advanced Card Fields (if eligible)
    if (paypal.CardFields && paypal.CardFields().isEligible()) {
        const cardField = paypal.CardFields({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{ description: itemName, amount: { value: amount } }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    window.location.href = 'shipping.html';
                });
            },
            onError: function (err) {
                console.error("Card Payment Error:", err);
                alert("حدث خطأ في عملية الدفع، يرجى المحاولة باستخدام زر PayPal.");
            }
        });

        // Ensure fields are rendered
        if (document.querySelector(numId) && document.querySelector(expId) && document.querySelector(cvvId)) {
            cardField.NumberField({ style: { input: { 'font-size': '16px', 'color': '#333' } } }).render(numId);
            cardField.ExpiryField({ style: { input: { 'font-size': '16px', 'color': '#333' } } }).render(expId);
            cardField.CVVField({ style: { input: { 'font-size': '16px', 'color': '#333' } } }).render(cvvId);

            document.querySelector(submitId).addEventListener('click', () => {
                const btn = document.querySelector(submitId);
                const originalText = btn.innerHTML;
                btn.innerHTML = 'جاري المعالجة... | Processing...';
                cardField.submit().catch(() => {
                    btn.innerHTML = originalText;
                });
            });
        }
    } else {
        // Hide native UI if Advanced Card Fields is not supported by Sandbox / Account
        if (divider) divider.style.display = 'none';
        if (nativeForm) nativeForm.style.display = 'none';
        if (trustedBadges) trustedBadges.style.display = 'none';
    }
}


// Simple PayPal Button for products.html
function initPayPalButton(itemName, amount, btnId) {
    if (!document.querySelector(btnId)) return;
    paypal.Buttons({
        experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            landing_page: 'billing'
        },
        style: { shape: 'rect', color: 'black', layout: 'vertical' },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => {
            window.location.href = 'shipping.html';
        })
    }).render(btnId);
}


// Payeer and Binance Redirection Logic
function initOtherPayments(itemName, amount, payeerBtnId, binanceBtnId) {
    const payeerBtn = document.querySelector(payeerBtnId);
    if (payeerBtn) {
        payeerBtn.onclick = () => {
            alert("سيتصل بك نظام Payeer الآن... | Redirecting to Payeer...");
            // Redirect logic would go here
        };
    }

    const binanceBtn = document.querySelector(binanceBtnId);
    if (binanceBtn) {
        binanceBtn.onclick = () => {
            showBinanceModal(itemName, amount);
        };
    }
}

function showBinanceModal(itemName, amount) {
    const binanceWallet = "TYy7YAYg7LbM83vLSM7VrFVcM394fTEvMG";
    const binanceNetwork = "TRC20 (Tron)";
    const whatsappLink = "https://wa.me/212641617786"; // User's WhatsApp


    // Refresh modal content if exists, or create new
    let modal = document.getElementById('binanceModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `<div id="binanceModal" class="modal"></div>`);
        modal = document.getElementById('binanceModal');
    }


    modal.innerHTML = `
            <div class="modal-content" style="max-width: 270px; padding: 12px; border-radius: 10px;">
                <span class="close-modal" style="font-size: 18px; top: 10px; right: 15px;">&times;</span>
                <div style="text-align: center;">
                    <img src="https://img.icons8.com/color/48/000000/binance.png" alt="Binance Pay" style="width: 28px; margin-bottom: 2px;">
                    <h2 style="font-size: 0.95rem; margin-bottom: 8px; color: #f3ba2f; font-weight: 700;">Binance Pay</h2>
                </div>
                
                <div style="text-align: center; margin: 8px 0;">
                    <p style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 5px;">Scan to Pay | امسح الكود</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${binanceWallet}" alt="Binance QR" style="width: 100px; height: 100px; border-radius: 4px; border: 2px solid #f3ba2f; background: white; padding: 3px;">
                </div>

                <div style="text-align: center;">
                    <span class="network-badge" style="font-size: 0.65rem; padding: 2px 8px; display: inline-block;">TRC20 - Tron</span>
                    <div class="wallet-box" id="walletAddr" style="font-size: 0.65rem; word-break: break-all; background: rgba(243, 186, 47, 0.03); border: 1px dashed #f3ba2f; padding: 6px; border-radius: 5px; margin: 6px 0;">${binanceWallet}</div>
                    <button class="copy-btn" id="copyBtn" style="width: 100%; border-radius: 5px; background: #f3ba2f; color: #000; font-weight: 700; padding: 6px; font-size: 0.8rem; cursor: pointer;">Copy Address | نسخ</button>
                    
                    <a href="${whatsappLink}?text=تم الدفع عبر Binance لمنتدج: ${itemName}" class="btn" style="margin-top: 6px; display: block; background: #25d366; color: white !important; border-radius: 5px; padding: 6px; font-size: 0.8rem; text-decoration: none;">
                        إرسال التأكيد | WhatsApp
                    </a>
                </div>
            </div>
    `;

    modal.style.display = 'flex';

    // Simple Close
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

    // Copy Function
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(binanceWallet).then(() => {
            const btn = document.getElementById('copyBtn');
            btn.innerHTML = "Copied! | تم النسخ";
            btn.style.background = "#22c55e";
            setTimeout(() => {
                btn.innerHTML = "Copy Address | نسخ العنوان";
                btn.style.background = "#f3ba2f";
            }, 2000);
        });
    };
}
