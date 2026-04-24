let prices = [];
let timeLeft = 60;

function update() {
    // Simulation du prix OTC
    const lastPrice = prices.length > 0 ? prices[prices.length - 1] : 1.0850;
    const newPrice = lastPrice + (Math.random() * 0.0004 - 0.0002);
    prices.push(newPrice);
    if (prices.length > 20) prices.shift();

    document.getElementById('price').innerText = newPrice.toFixed(5);

    // Compte à rebours 1 minute
    timeLeft--;
    if (timeLeft <= 0) {
        timeLeft = 60;
        const signalElement = document.getElementById('signal');
        
        // Logique de prédiction simplifiée
        if (newPrice > prices[0]) {
            signalElement.innerText = "SIGNAL : CALL (↑)";
            signalElement.style.backgroundColor = "#27ae60";
        } else {
            signalElement.innerText = "SIGNAL : PUT (↓)";
            signalElement.style.backgroundColor = "#e74c3c";
        }
    }
    document.getElementById('timer').innerText = "Prochain signal : " + timeLeft + "s";
}

setInterval(update, 1000);
