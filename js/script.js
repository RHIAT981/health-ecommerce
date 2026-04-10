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
handleScroll();

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

// The only reliable PayPal Button for all account types
function initPayPalButton(itemName, amount, btnId) {
    if (!document.querySelector(btnId)) return;
    paypal.Buttons({
        experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            landing_page: 'billing'
        },
        style: { 
            shape: 'rect', 
            color: 'gold', 
            layout: 'vertical',
            label: 'pay'
        },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => {
            console.log("Success:", details);
            window.location.href = 'thanks.html';
        }).catch(err => {
            console.error("Capture Error:", err);
            alert("عذراً، لم تكتمل العملية. يرجى التأكد من رصيد بطاقتك أو تفعيلها للمشتريات عبر الإنترنت.\n\nTransaction failed. Please check your card balance or ensure it is activated for online shopping.\n\nÉchec de la transaction. Veuillez vérifier le solde de votre carte ou vous assurer qu'elle est activée pour les achats en ligne.");
        }),
        onError: (err) => {
            console.error("PayPal Error:", err);
            alert("عذراً، لم تكتمل العملية. يرجى التأكد من رصيد بطاقتك أو تفعيلها للمشتريات عبر الإنترنت.\n\nTransaction failed. Please check your card balance or ensure it is activated for online shopping.\n\nÉchec de la transaction. Veuillez vérifier le solde de votre carte ou vous assurer qu'elle est activée pour les achats en ligne.");
        }
    }).render(btnId);
}

// Re-using initPayPalButton for all specialized integrations
function initAdvancedCardFields(itemName, amount, btnId) {
    initPayPalButton(itemName, amount, btnId);
}

function initOtherPayments(itemName, amount, payeerBtnId, binanceBtnId) {
    const binanceBtn = document.querySelector(binanceBtnId);
    if (binanceBtn) {
        binanceBtn.onclick = () => showBinanceModal(itemName, amount);
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
            <div class="modal-content" style="max-width: 270px; padding: 12px; border-radius: 10px;">
                <span class="close-modal" style="font-size: 18px; top: 10px; right: 15px;">&times;</span>
                <div style="text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#f3ba2f" style="margin-bottom: 2px; overflow: visible;"><path d="M12 2L9.5 4.5L12 7L14.5 4.5ZM5 9.5L2.5 12L5 14.5L7.5 12ZM19 9.5L16.5 12L19 14.5L21.5 12ZM12 9.5L9.5 12L12 14.5L14.5 12ZM12 17L9.5 19.5L12 22L14.5 19.5Z"/></svg>
                    <h2 style="font-size: 0.95rem; margin-bottom: 8px; color: #f3ba2f; font-weight: 700;">Binance Pay</h2>
                </div>
                <div style="text-align: center; margin: 8px 0;">
                    <p style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 5px;">Scan to Pay | امسح الكود</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${binanceWallet}" alt="Binance QR" style="width: 100px; height: 100px; border-radius: 4px; border: 2px solid #f3ba2f; background: white; padding: 3px;">
                </div>
                <div style="text-align: center;">
                    <span class="network-badge" style="font-size: 0.65rem; padding: 2px 8px; display: inline-block;">TRC20 - Tron</span>
                    <div class="wallet-box" style="font-size: 0.65rem; word-break: break-all; background: rgba(243, 186, 47, 0.03); border: 1px dashed #f3ba2f; padding: 6px; border-radius: 5px; margin: 6px 0;">${binanceWallet}</div>
                    <button class="copy-btn" id="copyBtn" style="width: 100%; border-radius: 5px; background: #f3ba2f; color: #000; font-weight: 700; padding: 6px; font-size: 0.8rem;">Copy Address | نسخ</button>
                    <a href="${whatsappLink}?text=تم الدفع عبر Binance لمنتدج: ${itemName}" class="btn" style="margin-top: 6px; display: block; background: #25d366; color: white !important; border-radius: 5px; padding: 6px; font-size: 0.8rem; text-decoration: none;">
                        إرسال التأكيد | WhatsApp
                    </a>
                </div>
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
}
