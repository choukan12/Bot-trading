// engine.js - Version optimisée pour signaux 1 minute (rapide + fiable)

import { getTradingSignal } from './signals.js';
import { dataManager } from './dataSources.js';

const symbols = [
    "BTC-USDT", "ETH-USDT", "SOL-USDT", "XRP-USDT",
    "DOGE-USDT", "TON-USDT", "USDT-TRY", "BTC-TRY", "ETH-TRY"
];

let isRunning = false;
let signalInterval = null;

export function startBot() {
    if (isRunning) return;
    isRunning = true;

    console.log("🚀 Bot Trading OTC - Mode 1 minute activé");

    // Connexions aux sources (OKX prioritaire + Binance + CoinGecko)
    dataManager.connectOKX(symbols);
    dataManager.connectBinance(symbols);

    // CoinGecko en backup toutes les 20 secondes
    setInterval(() => dataManager.fetchFromCoinGecko(), 20000);

    // === GÉNÉRATION DE SIGNAUX TOUTES LES ~8-10 SECONDES (adapté 1 minute) ===
    signalInterval = setInterval(() => {
        symbols.forEach(symbol => {
            const history = dataManager.getPriceHistory(symbol);
            
            if (history.length >= 25) {  // assez de données pour analyse 1 min
                const signal = getTradingSignal(history);
                
                // On affiche TOUS les signaux (même NEUTRAL) + on filtre les forts pour alerte
                if (typeof window !== 'undefined' && window.updateUI) {
                    window.updateUI(symbol, signal);
                }

                // Log seulement les signaux forts (≥ 65%)
                if (signal.strength >= 65) {
                    console.log(`🔥 SIGNAL FORT 1 MIN → ${symbol} | ${signal.signal} | Force: ${signal.strength}% | RSI: ${signal.rsi}`);
                }
            }
        });
    }, 8000); // ~ toutes les 8 secondes → bon compromis pour 1 minute sans spam
}

export function stopBot() {
    if (signalInterval) clearInterval(signalInterval);
    dataManager.closeAll();
    isRunning = false;
    console.log("⏹️ Bot arrêté");
}
