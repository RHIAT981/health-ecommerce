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
    
    // Hide the native card form elements and dividers because Sandbox is rejecting them
    const divider = document.querySelector('.payment-divider');
    const nativeForm = document.querySelector('.native-card-form');
    const trustedBadges = document.querySelector('.trusted-badges');
    if (divider) divider.style.display = 'none';
    if (nativeForm) nativeForm.style.display = 'none';
    if (trustedBadges) trustedBadges.style.display = 'none';

    // 1. Render Modern Smart Buttons (Allowing all funding sources so Black Card button appears)
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
        style: { shape: 'rect', color: 'blue', layout: 'vertical' },
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ description: itemName, amount: { value: amount } }] }),
        onApprove: (data, actions) => actions.order.capture().then(details => { 
            window.location.href = 'shipping.html'; 
        })
    }).render(btnId);
}
