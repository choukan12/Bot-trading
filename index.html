import { useState, useEffect, useRef, useCallback } from "react";

// ─── BINANCE PUBLIC API (no key needed) ───────────────────────────────────────
const BINANCE_BASE = "https://api.binance.com/api/v3";

const PAIRS = [
  { label: "BTC/USDT", symbol: "BTCUSDT" },
  { label: "ETH/USDT", symbol: "ETHUSDT" },
  { label: "BNB/USDT", symbol: "BNBUSDT" },
  { label: "SOL/USDT", symbol: "SOLUSDT" },
  { label: "XRP/USDT", symbol: "XRPUSDT" },
  { label: "ADA/USDT", symbol: "ADAUSDT" },
  { label: "DOGE/USDT", symbol: "DOGEUSDT" },
  { label: "AVAX/USDT", symbol: "AVAXUSDT" },
];

const TIMEFRAMES = [
  { label: "1 min", value: "1m", ms: 60000 },
  { label: "3 min", value: "3m", ms: 180000 },
  { label: "5 min", value: "5m", ms: 300000 },
  { label: "15 min", value: "15m", ms: 900000 },
];

// ─── TECHNICAL INDICATOR CALCULATIONS ────────────────────────────────────────
function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calcEMA(closes, period) {
  if (closes.length < period) return null;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) ema = closes[i] * k + ema * (1 - k);
  return ema;
}

function calcMACD(closes) {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  if (!ema12 || !ema26) return null;
  return { macd: ema12 - ema26, ema12, ema26 };
}

function calcBollinger(closes, period = 20) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period);
  return { upper: mean + 2 * std, middle: mean, lower: mean - 2 * std, std };
}

function calcStochastic(highs, lows, closes, kPeriod = 14, dPeriod = 3) {
  if (closes.length < kPeriod) return null;
  const recentHighs = highs.slice(-kPeriod);
  const recentLows = lows.slice(-kPeriod);
  const highestHigh = Math.max(...recentHighs);
  const lowestLow = Math.min(...recentLows);
  const lastClose = closes[closes.length - 1];
  if (highestHigh === lowestLow) return null;
  const k = ((lastClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  return { k, d: k }; // simplified
}

function calcATR(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return null;
  const trs = [];
  for (let i = closes.length - period; i < closes.length; i++) {
    const hl = highs[i] - lows[i];
    const hc = Math.abs(highs[i] - closes[i - 1]);
    const lc = Math.abs(lows[i] - closes[i - 1]);
    trs.push(Math.max(hl, hc, lc));
  }
  return trs.reduce((a, b) => a + b, 0) / period;
}

// ─── SIGNAL ENGINE ────────────────────────────────────────────────────────────
function computeSignal(candles) {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const volumes = candles.map(c => c.volume);

  const rsi = calcRSI(closes);
  const macdData = calcMACD(closes);
  const bb = calcBollinger(closes);
  const ema9 = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const stoch = calcStochastic(highs, lows, closes);
  const atr = calcATR(highs, lows, closes);

  const lastClose = closes[closes.length - 1];
  const prevClose = closes[closes.length - 2];
  const priceChange = ((lastClose - prevClose) / prevClose) * 100;

  const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const lastVol = volumes[volumes.length - 1];
  const volRatio = lastVol / avgVol;

  let callScore = 0, putScore = 0;
  const reasons = [];
  const indicators = {};

  // RSI
  if (rsi !== null) {
    indicators.rsi = rsi;
    if (rsi < 25) { callScore += 3; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Survente extrême ⬆ CALL FORT`, dir: "CALL", str: 3 }); }
    else if (rsi < 35) { callScore += 2; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Zone survente → CALL`, dir: "CALL", str: 2 }); }
    else if (rsi > 75) { putScore += 3; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Surachat extrême ⬇ PUT FORT`, dir: "PUT", str: 3 }); }
    else if (rsi > 65) { putScore += 2; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Zone surachat → PUT`, dir: "PUT", str: 2 }); }
    else if (rsi >= 45 && rsi <= 55) { reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Zone neutre`, dir: "NEUTRAL", str: 0 }); }
    else if (rsi < 50) { callScore += 1; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Légère haussier`, dir: "CALL", str: 1 }); }
    else { putScore += 1; reasons.push({ ind: "RSI", msg: `RSI ${rsi.toFixed(1)} → Légère baissier`, dir: "PUT", str: 1 }); }
  }

  // MACD
  if (macdData) {
    indicators.macd = macdData.macd;
    const macdPct = (macdData.macd / lastClose) * 100;
    if (macdPct > 0.05) { callScore += 2; reasons.push({ ind: "MACD", msg: `MACD +${macdData.macd.toFixed(4)} → Momentum haussier fort`, dir: "CALL", str: 2 }); }
    else if (macdPct > 0) { callScore += 1; reasons.push({ ind: "MACD", msg: `MACD positif → Tendance haussière`, dir: "CALL", str: 1 }); }
    else if (macdPct < -0.05) { putScore += 2; reasons.push({ ind: "MACD", msg: `MACD ${macdData.macd.toFixed(4)} → Momentum baissier fort`, dir: "PUT", str: 2 }); }
    else { putScore += 1; reasons.push({ ind: "MACD", msg: `MACD négatif → Tendance baissière`, dir: "PUT", str: 1 }); }
  }

  // Bollinger Bands
  if (bb) {
    indicators.bb = bb;
    const bbPos = (lastClose - bb.lower) / (bb.upper - bb.lower);
    const bbPct = bbPos * 100;
    indicators.bbPos = bbPct;
    if (bbPct < 10) { callScore += 3; reasons.push({ ind: "BB", msg: `Prix SOUS bande inf (${bbPct.toFixed(0)}%) → Rebond CALL`, dir: "CALL", str: 3 }); }
    else if (bbPct < 25) { callScore += 1; reasons.push({ ind: "BB", msg: `Prix proche bande inférieure → Signal CALL`, dir: "CALL", str: 1 }); }
    else if (bbPct > 90) { putScore += 3; reasons.push({ ind: "BB", msg: `Prix OVER bande sup (${bbPct.toFixed(0)}%) → Retour PUT`, dir: "PUT", str: 3 }); }
    else if (bbPct > 75) { putScore += 1; reasons.push({ ind: "BB", msg: `Prix proche bande supérieure → Signal PUT`, dir: "PUT", str: 1 }); }
    else { reasons.push({ ind: "BB", msg: `Prix milieu Bollinger (${bbPct.toFixed(0)}%) → Neutre`, dir: "NEUTRAL", str: 0 }); }
  }

  // EMA Cross
  if (ema9 && ema21) {
    indicators.ema9 = ema9;
    indicators.ema21 = ema21;
    const cross = ((ema9 - ema21) / ema21) * 100;
    if (cross > 0.1) { callScore += 2; reasons.push({ ind: "EMA", msg: `EMA9 > EMA21 (+${cross.toFixed(2)}%) → Tendance haussière`, dir: "CALL", str: 2 }); }
    else if (cross > 0) { callScore += 1; reasons.push({ ind: "EMA", msg: `EMA9 légèrement > EMA21 → Haussier`, dir: "CALL", str: 1 }); }
    else if (cross < -0.1) { putScore += 2; reasons.push({ ind: "EMA", msg: `EMA9 < EMA21 (${cross.toFixed(2)}%) → Tendance baissière`, dir: "PUT", str: 2 }); }
    else { putScore += 1; reasons.push({ ind: "EMA", msg: `EMA9 < EMA21 → Légèrement baissier`, dir: "PUT", str: 1 }); }
  }

  // Stochastic
  if (stoch) {
    indicators.stoch = stoch.k;
    if (stoch.k < 20) { callScore += 2; reasons.push({ ind: "STOCH", msg: `Stoch ${stoch.k.toFixed(0)} → Survente → CALL`, dir: "CALL", str: 2 }); }
    else if (stoch.k > 80) { putScore += 2; reasons.push({ ind: "STOCH", msg: `Stoch ${stoch.k.toFixed(0)} → Surachat → PUT`, dir: "PUT", str: 2 }); }
    else { reasons.push({ ind: "STOCH", msg: `Stoch ${stoch.k.toFixed(0)} → Zone neutre`, dir: "NEUTRAL", str: 0 }); }
  }

  // Volume confirmation
  if (volRatio > 1.5) {
    const volMsg = `Volume ${volRatio.toFixed(1)}x la moyenne → Confirmation du mouvement`;
    if (callScore > putScore) { callScore += 1; reasons.push({ ind: "VOL", msg: volMsg, dir: "CALL", str: 1 }); }
    else if (putScore > callScore) { putScore += 1; reasons.push({ ind: "VOL", msg: volMsg, dir: "PUT", str: 1 }); }
  } else {
    reasons.push({ ind: "VOL", msg: `Volume ${volRatio.toFixed(1)}x moy → Pas de confirmation`, dir: "NEUTRAL", str: 0 });
  }

  const total = callScore + putScore;
  const confidence = total === 0 ? 50 : Math.round(Math.max(callScore, putScore) / total * 100);
  let signal = "WAIT";
  if (total >= 4 && callScore > putScore && confidence >= 60) signal = "CALL";
  else if (total >= 4 && putScore > callScore && confidence >= 60) signal = "PUT";

  return { signal, confidence, callScore, putScore, reasons, indicators, lastClose, priceChange, atr, volRatio };
}

// ─── SPARKLINE COMPONENT ──────────────────────────────────────────────────────
function Sparkline({ data, color, height = 40, width = 120 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2.5" fill={color} />
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LiveSignalBot() {
  const [pairIdx, setPairIdx] = useState(0);
  const [tfIdx, setTfIdx] = useState(0);
  const [candles, setCandles] = useState([]);
  const [signal, setSignal] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | live | error
  const [error, setError] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [ticker, setTicker] = useState(null);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(0);

  const pair = PAIRS[pairIdx];
  const tf = TIMEFRAMES[tfIdx];

  // ─── FETCH REAL BINANCE DATA ────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      // Fetch klines (candles)
      const klinesRes = await fetch(
        `${BINANCE_BASE}/klines?symbol=${pair.symbol}&interval=${tf.value}&limit=100`
      );
      if (!klinesRes.ok) throw new Error(`Binance API: ${klinesRes.status}`);
      const klinesRaw = await klinesRes.json();

      const parsed = klinesRaw.map(k => ({
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));

      // Fetch 24h ticker
      const tickerRes = await fetch(`${BINANCE_BASE}/ticker/24hr?symbol=${pair.symbol}`);
      const tickerData = tickerRes.ok ? await tickerRes.json() : null;
      if (tickerData) setTicker(tickerData);

      setCandles(parsed);
      const result = computeSignal(parsed);
      const entry = { ...result, pair: pair.label, tf: tf.label, time: new Date().toLocaleTimeString("fr-FR"), id: Date.now() };
      setSignal(entry);
      setHistory(prev => [entry, ...prev].slice(0, 15));
      setLastUpdate(new Date());
      setStatus("live");
      setCountdown(tf.ms / 1000);

      if (entry.signal !== "WAIT" && entry.confidence >= 65) {
        fetchAIComment(entry);
      } else {
        setAiComment("");
      }
    } catch (e) {
      setStatus("error");
      setError(e.message || "Erreur de connexion à Binance");
    }
  }, [pair, tf]);

  // ─── AUTO REFRESH ───────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(intervalRef.current);
    clearInterval(countdownRef.current);
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, tf.ms);
      countdownRef.current = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    }
    return () => { clearInterval(intervalRef.current); clearInterval(countdownRef.current); };
  }, [autoRefresh, fetchData, tf.ms]);

  // ─── AI COMMENT ─────────────────────────────────────────────────────────────
  async function fetchAIComment(entry) {
    setAiLoading(true);
    setAiComment("");
    try {
      const prompt = `Tu es un analyste expert en trading crypto sur options binaires à court terme.
Voici les données réelles Binance pour ${entry.pair} (timeframe ${entry.tf}):
- Signal généré: ${entry.signal}
- Confiance: ${entry.confidence}%
- Prix actuel: $${entry.lastClose?.toFixed(4)}
- Variation: ${entry.priceChange?.toFixed(3)}%
- RSI: ${entry.indicators?.rsi?.toFixed(1) ?? "N/A"}
- MACD: ${entry.indicators?.macd?.toFixed(6) ?? "N/A"}
- Stochastique: ${entry.indicators?.stoch?.toFixed(1) ?? "N/A"}
- Ratio volume: ${entry.volRatio?.toFixed(2)}x la moyenne
- Score CALL: ${entry.callScore} / PUT: ${entry.putScore}

Donne une analyse concise en français (3 phrases max) sur:
1. La validité du signal basée sur la convergence des indicateurs
2. Le niveau de risque et les conditions de marché
3. Un conseil de gestion du risque spécifique
Sois direct, factuel, sans promesse de gains garantis.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      setAiComment(text);
    } catch (e) {
      setAiComment("Analyse IA indisponible.");
    }
    setAiLoading(false);
  }

  const recentCloses = candles.slice(-30).map(c => c.close);
  const sigColor = signal?.signal === "CALL" ? "#00e096" : signal?.signal === "PUT" ? "#ff4d6d" : "#fbbf24";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      color: "#c9d8f0",
      padding: "16px",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1a3060; border-radius: 2px; }
        .hov:hover { opacity: 0.8; transform: scale(0.98); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .live-dot { animation: blink 1.2s ease-in-out infinite; }
        .slide-up { animation: slideUp 0.35s ease-out; }
        .tag { font-size: 9px; letter-spacing: 2px; padding: 2px 8px; border-radius: 3px; font-weight: 700; }
        input, select { outline: none; }
        .ind-row { transition: background 0.15s; }
        .ind-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden", opacity: 0.03 }}>
        <div style={{ width: "100%", height: "2px", background: "rgba(0,224,150,0.8)", animation: "scanline 8s linear infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 6, color: "#00e096", lineHeight: 1 }}>
              SIGNAL BOT LIVE
            </div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#2a4a6a", marginTop: 2 }}>
              DONNÉES RÉELLES BINANCE · ANALYSE TECHNIQUE · IA INTÉGRÉE
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {status === "live" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                <div className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e096" }} />
                <span style={{ fontSize: 10, color: "#00e096", letterSpacing: 2 }}>LIVE</span>
              </div>
            )}
            {lastUpdate && <div style={{ fontSize: 9, color: "#2a4a6a", marginTop: 4 }}>MàJ: {lastUpdate.toLocaleTimeString("fr-FR")}</div>}
            {autoRefresh && countdown > 0 && <div style={{ fontSize: 9, color: "#fbbf24", marginTop: 2 }}>Prochain: {countdown}s</div>}
          </div>
        </div>

        {/* ── TICKER BAR ── */}
        {ticker && (
          <div style={{ background: "rgba(0,224,150,0.04)", border: "1px solid rgba(0,224,150,0.1)", borderRadius: 8, padding: "8px 14px", marginBottom: 16, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 11 }}>
            <span style={{ color: "#00e096", fontWeight: 700 }}>{pair.label}</span>
            <span>${parseFloat(ticker.lastPrice).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span>
            <span style={{ color: parseFloat(ticker.priceChangePercent) >= 0 ? "#00e096" : "#ff4d6d" }}>
              {parseFloat(ticker.priceChangePercent) >= 0 ? "▲" : "▼"} {parseFloat(ticker.priceChangePercent).toFixed(2)}%
            </span>
            <span style={{ color: "#4a6a8a" }}>H: ${parseFloat(ticker.highPrice).toLocaleString()}</span>
            <span style={{ color: "#4a6a8a" }}>L: ${parseFloat(ticker.lowPrice).toLocaleString()}</span>
            <span style={{ color: "#4a6a8a" }}>Vol: {parseFloat(ticker.volume).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}</span>
          </div>
        )}

        {/* ── CONTROLS ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 2, marginBottom: 5 }}>PAIRE CRYPTO</div>
            <select value={pairIdx} onChange={e => setPairIdx(+e.target.value)}
              style={{ background: "#0d1520", border: "1px solid #1a3060", borderRadius: 6, padding: "9px 14px", color: "#c9d8f0", fontSize: 12, fontFamily: "inherit" }}>
              {PAIRS.map((p, i) => <option key={p.symbol} value={i}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 2, marginBottom: 5 }}>TIMEFRAME</div>
            <select value={tfIdx} onChange={e => setTfIdx(+e.target.value)}
              style={{ background: "#0d1520", border: "1px solid #1a3060", borderRadius: 6, padding: "9px 14px", color: "#c9d8f0", fontSize: 12, fontFamily: "inherit" }}>
              {TIMEFRAMES.map((t, i) => <option key={t.value} value={i}>{t.label}</option>)}
            </select>
          </div>
          <button className="hov" onClick={fetchData} disabled={status === "loading"}
            style={{ background: status === "loading" ? "#0d1a2a" : "linear-gradient(135deg, #00e096, #0099ff)", color: status === "loading" ? "#2a4a6a" : "#080c14", border: "none", borderRadius: 6, padding: "9px 22px", fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2, cursor: status === "loading" ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: status !== "loading" ? "0 0 20px rgba(0,224,150,0.25)" : "none" }}>
            {status === "loading" ? "CHARGEMENT..." : "▶ ANALYSER"}
          </button>
          <button className="hov" onClick={() => { setAutoRefresh(a => !a); }}
            style={{ background: autoRefresh ? "rgba(0,224,150,0.1)" : "transparent", border: `1px solid ${autoRefresh ? "#00e096" : "#1a3060"}`, borderRadius: 6, padding: "9px 16px", color: autoRefresh ? "#00e096" : "#4a6a8a", fontFamily: "inherit", fontSize: 11, cursor: "pointer", letterSpacing: 1, transition: "all 0.2s" }}>
            {autoRefresh ? "⏸ STOP AUTO" : "⟳ AUTO"}
          </button>
        </div>

        {/* ── ERROR ── */}
        {status === "error" && (
          <div style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#ff4d6d" }}>
            ⚠ {error} — Vérifiez votre connexion internet.
          </div>
        )}

        {/* ── MAIN SIGNAL CARD ── */}
        {signal && (
          <div className="slide-up" style={{ background: "#0d1520", borderRadius: 12, border: `1px solid ${sigColor}22`, padding: 20, marginBottom: 16, boxShadow: `0 0 40px ${sigColor}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>

              {/* Signal main */}
              <div>
                <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 3, marginBottom: 6 }}>
                  {signal.pair} · {signal.tf} · {signal.time}
                </div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 56, color: sigColor, lineHeight: 1, letterSpacing: 4 }}>
                  {signal.signal === "CALL" ? "▲ CALL" : signal.signal === "PUT" ? "▼ PUT" : "⏸ ATTENDRE"}
                </div>
                <div style={{ fontSize: 11, color: "#4a6a8a", marginTop: 4 }}>
                  Prix: <span style={{ color: "#c9d8f0" }}>${signal.lastClose?.toFixed(signal.lastClose > 1000 ? 2 : 4)}</span>
                  &nbsp;|&nbsp;
                  Var: <span style={{ color: (signal.priceChange || 0) >= 0 ? "#00e096" : "#ff4d6d" }}>
                    {(signal.priceChange || 0) >= 0 ? "+" : ""}{signal.priceChange?.toFixed(3)}%
                  </span>
                </div>
              </div>

              {/* Confidence + Sparkline */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <div style={{ position: "relative", width: 74, height: 74 }}>
                  <svg viewBox="0 0 74 74">
                    <circle cx="37" cy="37" r="30" fill="none" stroke="#0d1a2a" strokeWidth="7"/>
                    <circle cx="37" cy="37" r="30" fill="none" stroke={sigColor}
                      strokeWidth="7" strokeDasharray={`${signal.confidence * 1.885} 188.5`}
                      strokeLinecap="round" transform="rotate(-90 37 37)" style={{ transition: "stroke-dasharray 0.6s ease" }}/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: sigColor, lineHeight: 1 }}>{signal.confidence}%</div>
                    <div style={{ fontSize: 7, color: "#2a4a6a", letterSpacing: 1 }}>CONF.</div>
                  </div>
                </div>
                {recentCloses.length > 5 && <Sparkline data={recentCloses} color={sigColor} width={110} height={36} />}
              </div>
            </div>

            {/* Score bar */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: "#00e096", minWidth: 60 }}>CALL {signal.callScore}</span>
              <div style={{ flex: 1, height: 6, background: "#0d1a2a", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg, #00e096, #0099ff)`,
                  width: `${(signal.callScore / (signal.callScore + signal.putScore + 0.01)) * 100}%`, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
              <span style={{ fontSize: 10, color: "#ff4d6d", minWidth: 60, textAlign: "right" }}>{signal.putScore} PUT</span>
            </div>

            {/* Indicators */}
            <div style={{ display: "grid", gap: 5, marginBottom: aiComment || aiLoading ? 14 : 0 }}>
              {signal.reasons.map((r, i) => (
                <div key={i} className="ind-row" style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "7px 10px", borderLeft: `2px solid ${r.dir === "CALL" ? "#00e096" : r.dir === "PUT" ? "#ff4d6d" : "#1a3060"}` }}>
                  <span style={{ fontSize: 9, background: "#0d1a2a", borderRadius: 3, padding: "2px 6px", color: "#5a7fa0", minWidth: 40, textAlign: "center", letterSpacing: 1 }}>{r.ind}</span>
                  <span style={{ fontSize: 11, color: r.dir === "CALL" ? "#7df5c2" : r.dir === "PUT" ? "#ffa0b0" : "#3a5a7a", flex: 1 }}>{r.msg}</span>
                  {r.str > 0 && <span style={{ fontSize: 10, color: r.dir === "CALL" ? "#00e096" : "#ff4d6d", letterSpacing: -1 }}>{"●".repeat(r.str)}</span>}
                </div>
              ))}
            </div>

            {/* AI Comment */}
            {aiLoading && (
              <div style={{ padding: "10px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 7, borderLeft: "2px solid #6366f1", fontSize: 11, color: "#6366f1" }}>
                <span style={{ animation: "blink 1s infinite" }}>🤖 Claude analyse les données Binance...</span>
              </div>
            )}
            {aiComment && !aiLoading && (
              <div style={{ padding: "12px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 7, borderLeft: "2px solid #6366f1" }}>
                <div style={{ fontSize: 9, color: "#6366f1", letterSpacing: 2, marginBottom: 6 }}>🤖 ANALYSE CLAUDE IA</div>
                <div style={{ fontSize: 12, color: "#a5b4fc", lineHeight: 1.75 }}>{aiComment}</div>
              </div>
            )}
          </div>
        )}

        {/* ── RISK RULES ── */}
        <div style={{ background: "#0d1520", border: "1px solid #2a2010", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 14, color: "#fbbf24", letterSpacing: 3, marginBottom: 10 }}>💰 RÈGLES DE MONEY MANAGEMENT</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            {[
              ["Mise par trade", "1-2% du capital"],
              ["Signal min.", "≥ 65% confiance"],
              ["Indicateurs", "≥ 3/6 alignés"],
              ["Max/jour", "5-8 trades"],
              ["Stop journalier", "-5% du capital"],
              ["Éviter news", "NFP / BCE / FOMC"],
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: 11 }}>
                <span style={{ color: "#3a5a7a" }}>{k}: </span>
                <span style={{ color: "#fcd34d", fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HISTORY ── */}
        {history.length > 0 && (
          <div style={{ background: "#0d1520", borderRadius: 10, border: "1px solid #0d1a2a", padding: "14px 16px" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 14, color: "#2a4a6a", letterSpacing: 3, marginBottom: 10 }}>
              HISTORIQUE ({history.length}) &nbsp;·&nbsp; Forts: {history.filter(h => h.signal !== "WAIT" && h.confidence >= 65).length}
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              {history.map(h => (
                <div key={h.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.015)", borderLeft: `2px solid ${h.signal === "CALL" ? "#00e096" : h.signal === "PUT" ? "#ff4d6d" : "#2a4060"}` }}>
                  <span style={{ fontSize: 9, color: "#2a4060", minWidth: 55 }}>{h.time}</span>
                  <span style={{ fontSize: 11, color: "#5a7fa0", minWidth: 75 }}>{h.pair}</span>
                  <span style={{ fontSize: 11, fontFamily: "'Bebas Neue'", letterSpacing: 1, color: h.signal === "CALL" ? "#00e096" : h.signal === "PUT" ? "#ff4d6d" : "#fbbf24", minWidth: 60 }}>
                    {h.signal === "CALL" ? "▲ CALL" : h.signal === "PUT" ? "▼ PUT" : "⏸ WAIT"}
                  </span>
                  <span style={{ fontSize: 10, color: h.confidence >= 70 ? "#00e096" : h.confidence >= 55 ? "#fbbf24" : "#3a5a7a" }}>{h.confidence}%</span>
                  <span style={{ fontSize: 9, color: "#2a4060" }}>{h.tf}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 9, color: "#1a3060", lineHeight: 2, letterSpacing: 1 }}>
          DONNÉES EN TEMPS RÉEL VIA BINANCE PUBLIC API · CALCULS RSI / MACD / BB / EMA / STOCH / VOL<br />
          OUTIL ÉDUCATIF — LES OPTIONS BINAIRES COMPORTENT UN RISQUE ÉLEVÉ DE PERTE EN CAPITAL<br />
          NE JAMAIS INVESTIR PLUS QUE CE QUE VOUS POUVEZ VOUS PERMETTRE DE PERDRE
        </div>
      </div>
    </div>
  );
}
