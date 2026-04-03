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
// PayPal Modern Integration Logic
function initAdvancedCardFields(itemName, amount, btnId, numId, expId, cvvId, submitId) {
    if (!document.querySelector(btnId)) return;
    
    // We want the native form visible, because this is what the user actually wants
    const divider = document.querySelector('.payment-divider');
    const nativeForm = document.querySelector('.native-card-form');
    const trustedBadges = document.querySelector('.trusted-badges');
    if (divider) divider.style.display = 'flex';
    if (nativeForm) nativeForm.style.display = 'flex';
    if (trustedBadges) trustedBadges.style.display = 'flex';

    // 1. Render Blue Smart Button only
    paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            landing_page: 'billing' 
        },
        style: { shape: 'rect', color: 'blue', layout: 'vertical' },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => { 
            window.location.href = 'shipping.html'; 
        })
    }).render(btnId);

    const submitBtn = document.querySelector(submitId);
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    // 2. Render Card Fields if eligible
    if (paypal.CardFields && paypal.CardFields.isEligible()) {
        const cardFields = paypal.CardFields({
            createOrder: (data, actions) => actions.order.create({ 
                purchase_units: [{ description: itemName, amount: { value: amount } }] 
            }),
            onApprove: (data, actions) => actions.order.capture().then(details => { 
                window.location.href = 'shipping.html'; 
            }),
            onError: (err) => {
                console.error(err);
                if(submitBtn) submitBtn.innerHTML = originalBtnHTML;
                alert('حدث خطأ أثناء معالجة البطاقة. يرجى التأكد من البيانات.');
            }
        });

        try {
            cardFields.NumberField().render(numId);
            cardFields.ExpiryField().render(expId);
            cardFields.CVVField().render(cvvId);
            
            if (submitBtn) {
                // Change the click event to submit the fields via PayPal API
                submitBtn.addEventListener('click', () => {
                    submitBtn.innerHTML = 'جاري الدفع... Processing...';
                    cardFields.submit().catch(err => {
                        submitBtn.innerHTML = originalBtnHTML;
                    });
                });
            }
        } catch(e) {
            console.error('Failed to render card fields', e);
        }
    } else {
        // If not eligible (e.g. PayPal blocked it), we alert the user instead of bad redirect!
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                alert('عذراً، ميزة البطاقات المباشرة مجمدة حالياً من حساب باي بال التابع للبائع. يرجى تفعيلها من لوحة التحكم.');
            });
        }
    }
}

// Simple PayPal Button for products.html
function initPayPalButton(itemName, amount, btnId) {
    if (!document.querySelector(btnId)) return;
    paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            landing_page: 'billing' 
        },
        style: { shape: 'rect', color: 'blue', layout: 'vertical' },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => { 
            window.location.href = 'shipping.html'; 
        })
    }).render(btnId);
}
