// engine.js - Moteur du bot de trading OTC sur OKX (et autres marchés)

import { getTradingSignal } from './signals.js';

// Historique des prix (on garde ~100 dernières bougies)
let priceHistory = [];

// Configuration des paires OTC / Spot (tu peux en ajouter)
const symbols = [
    "BTC-USDT",
    "ETH-USDT",
    "USDT-TRY",   // exemple de paire OTC populaire
    "BTC-USDC"
];

// Connexion WebSocket OKX (public - pas besoin de clé API pour les prix)
function connectWebSocket() {
    const ws = new WebSocket("wss://ws.okx.com:8443/ws/v5/public");

    ws.onopen = () => {
        console.log("✅ Connecté au WebSocket OKX");

        // S'abonner aux tickers en temps réel
        const subscribeMsg = {
            op: "subscribe",
            args: symbols.map(sym => ({
                channel: "tickers",
                instId: sym
            }))
        };
        ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.data && data.data[0]) {
            const ticker = data.data[0];
            const price = parseFloat(ticker.last);
            const symbol = ticker.instId;

            // Mise à jour de l'historique pour cette paire
            if (!priceHistory[symbol]) priceHistory[symbol] = [];
            
            priceHistory[symbol].push(price);
            if (priceHistory[symbol].length > 200) {
                priceHistory[symbol].shift(); // garder seulement les 200 dernières
            }

            // Générer un signal toutes les ~5-10 secondes (ou sur chaque tick)
            if (priceHistory[symbol].length % 5 === 0) {  // ajuste la fréquence
                const signal = getTradingSignal(priceHistory[symbol]);
                
                console.log(`📊 Signal pour ${symbol} : ${signal.signal} | Force: ${signal.strength}% | RSI: ${signal.rsi} | Prix: ${price}`);
                
                // Ici tu peux afficher sur l'interface (index.html) ou envoyer à ton bot
                updateUI(symbol, signal);   // fonction que tu vas créer dans index.html
            }
        }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => {
        console.log("❌ WebSocket fermé - reconnexion dans 5s...");
        setTimeout(connectWebSocket, 5000);
    };
}

// Fonction pour mettre à jour l'interface (à appeler depuis index.html)
function updateUI(symbol, signal) {
    // Exemple : tu peux lier ça à des éléments HTML
    console.log("Signal prêt pour affichage :", signal);
    
    // Plus tard tu feras : document.getElementById('signal-' + symbol).innerHTML = ...
}

// Lancement du bot
export function startBot() {
    console.log("🚀 Bot-trading démarré - Recherche de signaux OTC...");
    connectWebSocket();
    
    // Optionnel : ajouter d'autres sources (Binance, CoinGecko REST, etc.)
}

// Pour tester directement
// startBot();
