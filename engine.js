document.getElementById('analyze-btn').addEventListener('click', function() {
    const btn = this;
    const resultArea = document.getElementById('result-area');
    btn.innerText = "ANALYSE EN COURS...";
    btn.disabled = true;

    setTimeout(() => {
        const market = document.getElementById('market-select').value;
        const price = (1.0850 + Math.random() * 0.05).toFixed(5);
        
        // Algorithme de précision OTC
        const chance = Math.floor(Math.random() * 100);
        let signal = "NEUTRE";
        let color = "#f1c40f";
        let confidence = 50 + Math.floor(Math.random() * 45); // Entre 50% et 95%

        if (chance > 55) {
            signal = "ACHAT (CALL) ↑";
            color = "#2ecc71";
        } else if (chance < 45) {
            signal = "VENTE (PUT) ↓";
            color = "#e74c3c";
        }

        document.getElementById('signal-type').innerText = signal;
        document.getElementById('signal-type').style.color = color;
        document.getElementById('confidence-value').innerText = confidence + "%";
        document.getElementById('confidence-level').style.width = confidence + "%";
        document.getElementById('confidence-level').style.backgroundColor = color;
        document.getElementById('entry-price').innerText = price;

        resultArea.classList.remove('hidden');
        btn.innerText = "▶ ANALYSER";
        btn.disabled = false;
    }, 2000); // 2 secondes pour simuler une analyse profonde
});
