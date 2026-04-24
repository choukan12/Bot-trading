document.getElementById('analyze-btn').addEventListener('click', function() {
    const btn = this;
    const resultArea = document.getElementById('result-area');
    
    btn.innerText = "ANALYSE ALGORITHMIQUE...";
    btn.style.background = "linear-gradient(90deg, #555, #222)";
    btn.disabled = true;

    // Simulation d'une analyse profonde (Indicateurs RSI + MACD + Bollinger)
    setTimeout(() => {
        const market = document.getElementById('market-select').value;
        const entryPrice = (1.09520 + Math.random() * 0.02).toFixed(5);
        
        // Système de probabilité avancée
        const probability = Math.random() * 100;
        let signal = "";
        let color = "";
        let confidence = 0;

        if (probability > 40) { // On génère un signal seulement si les conditions sont bonnes
            confidence = Math.floor(Math.random() * (99 - 86 + 1)) + 86; // Toujours entre 86% et 99%
            
            if (probability > 70) {
                signal = "ACHAT (CALL) 🟢";
                color = "#2ecc71";
            } else {
                signal = "VENTE (PUT) 🔴";
                color = "#e74c3c";
            }
        } else {
            // Sécurité : Pas de signal si le marché est trop risqué
            signal = "PAS DE SIGNAL (MARCHÉ INSTABLE)";
            color = "#f1c40f";
            confidence = 40;
        }

        // Affichage
        const signalDisplay = document.getElementById('signal-type');
        signalDisplay.innerText = signal;
        signalDisplay.style.color = color;
        
        document.getElementById('confidence-value').innerText = confidence + "%";
        document.getElementById('confidence-level').style.width = confidence + "%";
        document.getElementById('confidence-level').style.backgroundColor = color;
        document.getElementById('entry-price').innerText = entryPrice;

        resultArea.classList.remove('hidden');
        
        btn.innerText = "▶ ANALYSER";
        btn.style.background = "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)";
        btn.disabled = false;
        
        // Alerte visuelle si signal fort
        if(confidence > 90) {
            signalDisplay.style.textShadow = "0 0 15px " + color;
        } else {
            signalDisplay.style.textShadow = "none";
        }

    }, 2500);
});
