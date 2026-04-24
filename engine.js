// engine.js
import { getTradingSignal } from './signals.js';

const symbols = ["BTC-USDT", "ETH-USDT", "SOL-USDT", "USDT-TRY", "BTC-TRY"];

export function startBot() {
    console.log("🚀 Démarrage du bot...");

    // Connexion OKX
    const ws = new WebSocket("wss://ws.okx.com:8443/ws/v5/public");
    ws.onopen = () => {
        console.log("✅ OKX WebSocket connecté");
        const msg = {
            op: "subscribe",
            args: symbols.map(s => ({ channel: "tickers", instId: s }))
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.data && data.data[0]) {
                const ticker = data.data[0];
                const symbol = ticker.instId;
                const price = parseFloat(ticker.last);

                // Simulation d'historique simple
                if (!window.priceHistory) window.priceHistory = {};
                if (!window.priceHistory[symbol]) window.priceHistory[symbol] = [];
                window.priceHistory[symbol].push(price);
                if (window.priceHistory[symbol].length > 50) window.priceHistory[symbol].shift();

                const signal = getTradingSignal(window.priceHistory[symbol]);
                if (window.updateUI) window.updateUI(symbol, signal);
            }
        } catch(e) {}
    };
}
