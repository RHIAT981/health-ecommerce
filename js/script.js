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
                submitBtn.innerHTML = originalBtnHTML;
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
            setupFallback();
        }
    } else {
        setupFallback();
    }

    function setupFallback() {
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                submitBtn.innerHTML = 'جاري التحويل الآمن... Redirecting...';
                const fallbackUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD&solution_type=Sole&landing_page=Billing`;
                window.location.href = fallbackUrl;
            });
        }
    }
}
