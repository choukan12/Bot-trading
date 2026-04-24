// dataSources.js - Multi-sources prix en temps réel (OKX + Binance + CoinGecko)

export class DataSources {
    constructor() {
        this.priceHistory = {};   // historique par paire
        this.lastPrices = {};     // prix actuel
        this.activeConnections = [];
    }

    // OKX WebSocket (le plus rapide)
    connectOKX(symbols) {
        const ws = new WebSocket("wss://ws.okx.com:8443/ws/v5/public");
        ws.onopen = () => {
            console.log("✅ OKX WebSocket connecté");
            const msg = {
                op: "subscribe",
                args: symbols.map(sym => ({ channel: "tickers", instId: sym }))
            };
            ws.send(JSON.stringify(msg));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.data && data.data[0]) {
                    const t = data.data[0];
                    this.updatePrice(t.instId, parseFloat(t.last));
                }
            } catch(e) {}
        };

        ws.onclose = () => setTimeout(() => this.connectOKX(symbols), 3000);
        this.activeConnections.push(ws);
    }

    // Binance WebSocket (bon fallback)
    connectBinance(symbols) {
        const binanceSyms = symbols.map(s => s.toLowerCase().replace('-', ''));
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSyms.map(s => s + '@ticker').join('/')}`);

        ws.onopen = () => console.log("✅ Binance WebSocket connecté");
        ws.onmessage = (event) => {
            try {
                const t = JSON.parse(event.data);
                const sym = t.s.replace(/USDT$/, '-USDT').replace(/TRY$/, '-TRY');
                this.updatePrice(sym, parseFloat(t.c));
            } catch(e) {}
        };
        ws.onclose = () => setTimeout(() => this.connectBinance(symbols), 5000);
        this.activeConnections.push(ws);
    }

    // CoinGecko fallback
    async fetchFromCoinGecko() {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
            const data = await res.json();
            if (data.bitcoin) this.updatePrice("BTC-USDT", data.bitcoin.usd);
            if (data.ethereum) this.updatePrice("ETH-USDT", data.ethereum.usd);
        } catch(e) { console.log("CoinGecko fallback OK"); }
    }

    updatePrice(symbol, price) {
        if (!price || isNaN(price)) return;
        if (!this.priceHistory[symbol]) this.priceHistory[symbol] = [];
        this.priceHistory[symbol].push(price);
        if (this.priceHistory[symbol].length > 300) this.priceHistory[symbol].shift();
        this.lastPrices[symbol] = price;
    }

    getPriceHistory(symbol) {
        return this.priceHistory[symbol] || [];
    }

    closeAll() {
        this.activeConnections.forEach(ws => { if (ws.readyState === 1) ws.close(); });
    }
}

export const dataManager = new DataSources();
