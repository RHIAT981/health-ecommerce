// Final Working System v400.0
const BUSINESS_EMAIL = 'rhiatabdellah712@gmail.com';

function initAdvancedCardFields(itemName, amount, btnId) {
    const container = document.querySelector(btnId);
    if (!container) return;

    // 1. Static Layout to prevent white spaces
    container.innerHTML = `
        <div class="secure-checkout-panel" style="padding: 20px; border: 2px solid #22c55e; border-radius: 15px; background: #0f172a; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #22c55e; margin: 0; font-size: 1.2rem;">${itemName}</h3>
                <div style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-top: 5px;">$${amount}</div>
            </div>

            <!-- CARD BUTTON CONTAINER (SDK BLACK BUTTON) -->
            <div id="sd-card-container" style="min-height: 50px; margin-bottom: 15px;"></div>

            <!-- PAYPAL BUTTON (DIRECT PAYPAL ME LINK AS REQUESTED) -->
            <a href="https://paypal.me/health2026/${amount}USD" 
               target="_blank" 
               style="display: flex; align-items: center; justify-content: center; background: #ffc439; color: #111; text-decoration: none; padding: 15px; border-radius: 10px; border: 2px solid #e2a400; font-weight: 700; gap: 10px; height: 18px;">
                <img src="https://img.icons8.com/color/48/000000/paypal.png" width="24">
                <span>PAY $${amount} VIA PAYPAL.ME</span>
            </a>

            <div style="margin-top: 15px; text-align: center;">
                <img src="https://img.icons8.com/ios-filled/50/22c55e/shield.png" width="14" style="vertical-align: middle;">
                <span style="color: #22c55e; font-size: 0.70rem; font-weight: 600;">SECURE SSL ENCRYPTED CHECKOUT</span>
            </div>
        </div>
    `;

    // 2. Render the Black Card button (which you said was working)
    if (window.paypal) {
        paypal.Buttons({
            fundingSource: paypal.FUNDING.CARD,
            style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 50 },
            createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: amount }, description: itemName }] }),
            onApprove: (data, actions) => actions.order.capture().then(() => window.location.href = 'thanks.html')
        }).render('#sd-card-container');
    }
}

function initOtherPayments(itemName, amount, cardBtnId, binanceBtnId) {
    const binanceBtn = document.querySelector(binanceBtnId);
    if (binanceBtn) {
        binanceBtn.onclick = () => showBinanceModal(itemName, amount);
    }
}

function showBinanceModal(itemName, amount) {
    const binanceWallet = "TYy7YAYg7LbM83vLSM7VrFVcM394fTEvMG";
    let modal = document.getElementById('binanceModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `<div id="binanceModal" class="modal"></div>`);
        modal = document.getElementById('binanceModal');
    }
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 350px; padding: 25px; border-radius: 20px; background: #0f172a; border: 1px solid #f3ba2f; color: white;">
            <span class="close-modal" style="font-size: 28px; top: 10px; right: 20px; color: #cbd5e1; cursor: pointer; position: absolute;">&times;</span>
            <div style="text-align: center;">
                <h2 style="font-size: 1.2rem; color: #f3ba2f; margin-bottom: 20px;">Binance Pay Checkout</h2>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${binanceWallet}" alt="Binance QR" style="width: 150px; background: #fff; padding: 10px; border-radius: 10px; margin-bottom: 20px;">
                <p style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 5px;">Total: $${amount} USDT</p>
                <div style="font-family: monospace; font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border: 1px dashed #f3ba2f; word-break: break-all;">${binanceWallet}</div>
                <button id="copyBtn" style="width: 100%; margin: 15px 0; background: #334155; color: #fff; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">Copy Address | نسخ</button>
            </div>
            <div style="margin-top: 20px;">
                <p style="font-size: 0.8rem; color: #94a3b8; text-align: center; margin-bottom: 15px;">After payment, please send us your details via WhatsApp:</p>
                <input type="text" id="wa-name" placeholder="Full Name | الاسم الكامل" style="width: 100%; padding: 12px; margin-bottom: 10px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 8px; font-size: 0.9rem;">
                <textarea id="wa-address" placeholder="Shipping Address | عنوان الشحن" style="width: 100%; padding: 12px; height: 80px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 8px; font-size: 0.9rem; resize: none;"></textarea>
                <button id="sendWaBtn" style="width: 100%; margin-top: 15px; background: #22c55e; color: #fff; padding: 15px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer;">Send Proof via WhatsApp</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(binanceWallet).then(() => {
            const btn = document.getElementById('copyBtn');
            btn.textContent = "Copied! | تم النسخ";
            setTimeout(() => btn.textContent = "Copy Address | نسخ", 2000);
        });
    };
    
    document.getElementById('sendWaBtn').onclick = () => {
        const name = document.getElementById('wa-name').value.trim();
        const address = document.getElementById('wa-address').value.trim();
        if (!name || !address) { alert("Please complete your details | يرجى إكمال البيانات"); return; }
        const message = encodeURIComponent(`*Order Request*\nProduct: ${itemName}\nAmount: $${amount} USDT\nName: ${name}\nAddress: ${address}`);
        window.open(`https://wa.me/212641617786?text=${message}`, '_blank');
        modal.style.display = 'none';
    };
}
