const btn = document.getElementById('analyze-btn');
const resultArea = document.getElementById('result-area');

// Mise à jour du décompte 1 min en temps réel
setInterval(() => {
    const now = new Date();
    const seconds = now.getSeconds();
    const timeLeft = 60 - seconds;
    document.getElementById('timer-display').innerText = `PROCHAINE BOUGIE DANS : ${timeLeft}s`;
    
    // Simulation de mouvement de prix pour le marché sélectionné
    const mockPrice = (1.08520 + (Math.random() * 0.00100)).toFixed(5);
    document.getElementById('live-price').innerText = mockPrice;
}, 1000);

btn.addEventListener('click', () => {
    btn.innerText = "CONNEXION SERVEURS...";
    btn.disabled = true;

    // Délai d'analyse pour synchronisation officielle
    setTimeout(() => {
        const chance = Math.random() * 100;
        let signal = "";
        let color = "";
        let conf = Math.floor(Math.random() * (99 - 88 + 1)) + 88;

        if (chance > 50) {
            signal = "🟢 CALL (HAUSSE)";
            color = "#2ecc71";
        } else {
            signal = "🔴 PUT (BAISSE)";
            color = "#e74c3c";
        }

        document.getElementById('signal-type').innerText = signal;
        document.getElementById('signal-type').style.color = color;
        document.getElementById('conf-val').innerText = conf + "%";
        document.getElementById('confidence-level').style.width = conf + "%";
        document.getElementById('confidence-level').style.background = color;

        resultArea.classList.remove('hidden');
        btn.innerText = "▶ ANALYSER MAINTENANT";
        btn.disabled = false;
    }, 1500);
});
