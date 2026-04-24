// signals.js
export function getTradingSignal(prices) {
    if (prices.length < 10) {
        return { signal: "WAIT", strength: 30, reason: "Chargement des données...", price: prices[prices.length-1] || 0 };
    }
    const lastPrice = prices[prices.length-1];
    const rsi = 50; // simulation simple pour commencer

    let signal = "NEUTRAL";
    let strength = 50;
    let reason = "Marché neutre";

    if (rsi < 40) {
        signal = "BUY";
        strength = 75;
        reason = "RSI bas - Signal d'achat";
    } else if (rsi > 60) {
        signal = "SELL";
        strength = 75;
        reason = "RSI haut - Signal de vente";
    }

    return { signal, strength, reason, price: lastPrice, timestamp: Date.now() };
}
