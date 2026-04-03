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
    
    const businessEmail = 'rhiatabdellah712@gmail.com'; // Your PayPal Email

    // 1. Render Modern Smart Buttons
    paypal.Buttons({
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

    // 2. High-Reliability Fallback for the Green Button
    const submitBtn = document.querySelector(submitId);
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            submitBtn.innerHTML = 'جاري التحويل الآمن... Redirecting...';
            
            // This is the "Magic Link" that forces Guest Checkout for most regions
            const fallbackUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD&solution_type=Sole&landing_page=Billing`;
            
            window.location.href = fallbackUrl;
        });
    }

    // 3. Optional: Render Card Fields if eligible
    if (paypal.CardFields) {
        const cardFields = paypal.CardFields({
            createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
            onApprove: (data, actions) => actions.order.capture().then(details => { window.location.href = 'shipping.html'; })
        });
        try {
            cardFields.NumberField().render(numId);
            cardFields.ExpiryField().render(expId);
            cardFields.CVVField().render(cvvId);
        } catch(e) {}
    }
}
