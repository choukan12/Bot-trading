// signals.js - Signaux améliorés pour timeframe 1 minute (RSI + MACD)

function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
        const change = prices[prices.length - i] - prices[prices.length - i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period || 0.0001;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(prices) {
    if (prices.length < 50) return { macd: 0, signal: 0, histogram: 0 };
    const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
    const macdLine = ema12 - ema26;
    const signalLine = macdLine * 0.9;
    return {
        macd: parseFloat(macdLine.toFixed(4)),
        signal: parseFloat(signalLine.toFixed(4)),
        histogram: parseFloat((macdLine - signalLine).toFixed(4))
    };
}

export function getTradingSignal(priceHistory) {
    if (priceHistory.length < 25) {
        return { 
            signal: "WAIT", 
            strength: 0, 
            reason: "Données insuffisantes", 
            rsi: null, 
            macd: {macd:0, signal:0, histogram:0},
            price: priceHistory[priceHistory.length-1] || 0,
            timestamp: new Date().toISOString()
        };
    }

    const currentPrice = priceHistory[priceHistory.length - 1];
    const rsi = calculateRSI(priceHistory);
    const macd = calculateMACD(priceHistory);

    let signal = "NEUTRAL";
    let strength = 40;
    let reason = "Marché neutre";

    if (rsi < 32 && macd.histogram > 0 && macd.macd > macd.signal) {
        signal = "BUY";
        strength = 82;
        reason = "RSI Oversold + MACD Bullish";
    } 
    else if (rsi > 68 && macd.histogram < 0 && macd.macd < macd.signal) {
        signal = "SELL";
        strength = 82;
        reason = "RSI Overbought + MACD Bearish";
    } 
    else if (rsi < 45 && macd.histogram > 0) {
        signal = "BUY";
        strength = 62;
        reason = "RSI bas + Momentum haussier";
    } 
    else if (rsi > 55 && macd.histogram < 0) {
        signal = "SELL";
        strength = 62;
        reason = "RSI haut + Momentum baissier";
    }

    return {
        signal,
        strength,
        rsi: rsi ? parseFloat(rsi.toFixed(1)) : null,
        macd,
        price: currentPrice,
        timestamp: new Date().toISOString(),
        reason
    };
}
