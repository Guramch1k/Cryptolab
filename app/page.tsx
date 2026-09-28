"use client";

import { useEffect, useMemo, useState } from "react";

type Market = {
  symbol: string;
  base: string;
  quote: string;
  price: number;
  change: number;
  volume: string;
};

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

const MARKETS: Market[] = [
  {
    symbol: "BTC/USDT",
    base: "BTC",
    quote: "USDT",
    price: 68452.31,
    change: 2.84,
    volume: "2.84B",
  },
  {
    symbol: "ETH/USDT",
    base: "ETH",
    quote: "USDT",
    price: 3928.64,
    change: 1.72,
    volume: "1.31B",
  },
  {
    symbol: "SOL/USDT",
    base: "SOL",
    quote: "USDT",
    price: 182.47,
    change: -0.64,
    volume: "482M",
  },
  {
    symbol: "BNB/USDT",
    base: "BNB",
    quote: "USDT",
    price: 612.84,
    change: 0.91,
    volume: "391M",
  },
];

const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateCandles(
  startPrice: number,
  count: number,
  seed: number,
): Candle[] {
  const candles: Candle[] = [];
  let previous = startPrice * 0.96;

  for (let i = 0; i < count; i++) {
    const movement =
      (seededRandom(seed + i * 4.21) - 0.46) * startPrice * 0.012;

    const open = previous;
    const close = Math.max(
      startPrice * 0.86,
      Math.min(startPrice * 1.1, open + movement),
    );

    const high =
      Math.max(open, close) +
      seededRandom(seed + i * 7.31) * startPrice * 0.007;

    const low =
      Math.min(open, close) -
      seededRandom(seed + i * 8.17) * startPrice * 0.007;

    candles.push({
      open,
      high,
      low,
      close,
    });

    previous = close;
  }

  return candles;
}

function formatPrice(value: number) {
  if (value >= 1000) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function generateBook(price: number) {
  const asks = Array.from({ length: 8 }, (_, i) => ({
    price: price + price * (0.00035 + i * 0.00034),
    amount: 0.03 + seededRandom(i + price) * 0.22,
  })).reverse();

  const bids = Array.from({ length: 8 }, (_, i) => ({
    price: price - price * (0.00035 + i * 0.00034),
    amount: 0.03 + seededRandom(i + price * 2) * 0.22,
  }));

  return { asks, bids };
}

function generateTrades(price: number) {
  return Array.from({ length: 9 }, (_, i) => ({
    price:
      price +
      price * ((seededRandom(i + 10.8) - 0.5) * 0.0025),
    amount: 0.02 + seededRandom(i + 21.7) * 0.18,
    side: i % 3 === 0 ? "sell" : "buy",
    time: `13:${String(48 - i).padStart(2, "0")}:${String(
      52 - i * 3,
    ).padStart(2, "0")}`,
  }));
}

function CandleChart({
  candles,
  positive,
}: {
  candles: Candle[];
  positive: boolean;
}) {
  const width = 900;
  const height = 420;
  const padding = {
    top: 28,
    right: 65,
    bottom: 30,
    left: 18,
  };

  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);

  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const candleWidth = chartWidth / candles.length;

  const y = (value: number) =>
    padding.top + ((max - value) / range) * chartHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="chart-svg"
      preserveAspectRatio="none"
    >
      {[0, 1, 2, 3, 4].map((line) => {
        const yy = padding.top + (chartHeight / 4) * line;

        return (
          <g key={line}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yy}
              y2={yy}
              stroke="rgba(255,255,255,.07)"
            />
            <text
              x={width - 5}
              y={yy + 4}
              textAnchor="end"
              fill="#6f7b8c"
              fontSize="11"
            >
              {formatPrice(max - (range / 4) * line)}
            </text>
          </g>
        );
      })}

      {candles.map((candle, index) => {
        const x =
          padding.left + index * candleWidth + candleWidth / 2;

        const bullish = candle.close >= candle.open;

        const bodyTop = y(Math.max(candle.open, candle.close));
        const bodyBottom = y(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(2, bodyBottom - bodyTop);

        return (
          <g key={index}>
            <line
              x1={x}
              x2={x}
              y1={y(candle.high)}
              y2={y(candle.low)}
              stroke={bullish ? "#20c997" : "#ff5575"}
              strokeWidth="1"
            />

            <rect
              x={x - Math.max(2, candleWidth * 0.32)}
              y={bodyTop}
              width={Math.max(3, candleWidth * 0.64)}
              height={bodyHeight}
              rx="1"
              fill={bullish ? "#20c997" : "#ff5575"}
              opacity={0.95}
            />
          </g>
        );
      })}

      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={y(candles[candles.length - 1].close)}
        y2={y(candles[candles.length - 1].close)}
        stroke={positive ? "#20c997" : "#ff5575"}
        strokeDasharray="5 5"
        opacity=".65"
      />
    </svg>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("15m");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<
    "Limit" | "Market" | "Stop"
  >("Limit");

  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [percent, setPercent] = useState(25);

  const [mobilePanel, setMobilePanel] = useState<
    "chart" | "book" | "trade"
  >("chart");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const market =
    MARKETS.find((item) => item.symbol === selectedSymbol) ??
    MARKETS[0];

  const candles = useMemo(() => {
    const timeframeIndex = TIMEFRAMES.indexOf(timeframe);
    const marketIndex = MARKETS.findIndex(
      (item) => item.symbol === selectedSymbol,
    );

    return generateCandles(
      market.price,
      62,
      100 + timeframeIndex * 73 + marketIndex * 151,
    );
  }, [selectedSymbol, timeframe]);

  const book = useMemo(
    () => generateBook(market.price),
    [market.price],
  );

  const trades = useMemo(
    () => generateTrades(market.price),
    [market.price],
  );

  const orderPrice =
    orderType === "Market"
      ? market.price
      : Number(limitPrice) || market.price;

  const total =
    Number(amount || 0) * orderPrice;

  const available =
    side === "buy" ? 24850.73 : 0.8421;

  const calculatedAmount =
    side === "buy"
      ? (available * (percent / 100)) / orderPrice
      : available * (percent / 100);

  const usePercent = (value: number) => {
    setPercent(value);
    setAmount(calculatedAmount.toFixed(6));
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="splash">
          <div className="splash-grid" />

          <div className="splash-content">
            <div className="brand-mark">
              <div className="brand-icon">
                C
              </div>
            </div>

            <div className="splash-title">
              Crypto<span>Lab</span>
            </div>

            <div className="splash-subtitle">
              DIGITAL EXCHANGE
            </div>

            <div className="loader">
              <div />
            </div>

            <div className="loading-text">
              INITIALIZING TERMINAL
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        <header className="topbar">
          <div className="logo-area">
            <div className="logo-icon">C</div>

            <div>
              <div className="logo-name">
                Crypto<span>Lab</span>
              </div>

              <div className="logo-caption">
                DIGITAL EXCHANGE
              </div>
            </div>
          </div>

          <div className="top-navigation">
            <button className="nav-active">
              Markets
            </button>
            <button>Trade</button>
            <button>Assets</button>
          </div>

          <div className="top-actions">
            <div className="demo-badge">
              <span />
              DEMO MODE
            </div>

            <button className="icon-button">
              ◐
            </button>

            <button className="profile-button">
              <span className="avatar">G</span>
              Guest
              <span className="chevron">⌄</span>
            </button>
          </div>
        </header>

        <section className="ticker-bar">
          {MARKETS.map((item) => (
            <button
              key={item.symbol}
              className={`ticker ${
                selectedSymbol === item.symbol
                  ? "ticker-active"
                  : ""
              }`}
              onClick={() => setSelectedSymbol(item.symbol)}
            >
              <span className="ticker-symbol">
                {item.symbol}
              </span>

              <strong>
                ${formatPrice(item.price)}
              </strong>

              <span
                className={
                  item.change >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(2)}%
              </span>
            </button>
          ))}
        </section>

        <main className="terminal">
          <section className="market-header">
            <div className="market-main">
              <div className="coin-avatar">
                {market.base[0]}
              </div>

              <div>
                <div className="pair-title">
                  {market.base}
                  <span>/ {market.quote}</span>
                  <span className="favorite">☆</span>
                </div>

                <div className="pair-subtitle">
                  Spot Market
                </div>
              </div>
            </div>

            <div className="stats">
              <div>
                <span>24h Change</span>
                <strong
                  className={
                    market.change >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {market.change >= 0 ? "+" : ""}
                  {market.change.toFixed(2)}%
                </strong>
              </div>

              <div>
                <span>24h High</span>
                <strong>
                  {formatPrice(market.price * 1.037)}
                </strong>
              </div>

              <div>
                <span>24h Low</span>
                <strong>
                  {formatPrice(market.price * 0.963)}
                </strong>
              </div>

              <div>
                <span>24h Volume</span>
                <strong>{market.volume}</strong>
              </div>
            </div>
          </section>

          <div className="mobile-tabs">
            <button
              className={
                mobilePanel === "chart"
                  ? "active"
                  : ""
              }
              onClick={() => setMobilePanel("chart")}
            >
              Chart
            </button>

            <button
              className={
                mobilePanel === "book"
                  ? "active"
                  : ""
              }
              onClick={() => setMobilePanel("book")}
            >
              Order Book
            </button>

            <button
              className={
                mobilePanel === "trade"
                  ? "active"
                  : ""
              }
              onClick={() => setMobilePanel("trade")}
            >
              Trade
            </button>
          </div>

          <div className="workspace">
            <section
              className={`chart-panel ${
                mobilePanel !== "chart"
                  ? "mobile-hidden"
                  : ""
              }`}
            >
              <div className="panel-toolbar">
                <div className="timeframes">
                  {TIMEFRAMES.map((item) => (
                    <button
                      key={item}
                      className={
                        timeframe === item
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setTimeframe(item)
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="chart-tools">
                  <button>⌁</button>
                  <button>⌗</button>
                  <button>⚙</button>
                  <button>⛶</button>
                </div>
              </div>

              <div className="chart">
                <CandleChart
                  candles={candles}
                  positive={market.change >= 0}
                />

                <div className="chart-label">
                  {timeframe} · Candles
                </div>
              </div>

              <div className="volume-area">
                {candles.slice(-42).map((candle, index) => {
                  const height =
                    10 +
                    seededRandom(index * 4.2) * 35;

                  return (
                    <div
                      key={index}
                      className={
                        candle.close >= candle.open
                          ? "volume-up"
                          : "volume-down"
                      }
                      style={{ height }}
                    />
                  );
                })}
              </div>

              <div className="trades-title">
                <span>Recent Trades</span>
                <span>Price (USDT)</span>
                <span>Amount ({market.base})</span>
                <span>Time</span>
              </div>

              <div className="recent-trades">
                {trades.slice(0, 6).map((trade, index) => (
                  <div
                    className="trade-row"
                    key={index}
                  >
                    <span
                      className={
                        trade.side === "buy"
                          ? "positive"
                          : "negative"
                      }
                    >
                      {trade.side === "buy"
                        ? "Buy"
                        : "Sell"}
                    </span>

                    <span>
                      {formatPrice(trade.price)}
                    </span>

                    <span>
                      {trade.amount.toFixed(4)}
                    </span>

                    <span>{trade.time}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside
              className={`orderbook-panel ${
                mobilePanel !== "book"
                  ? "mobile-hidden"
                  : ""
              }`}
            >
              <div className="section-heading">
                <strong>Order Book</strong>

                <button className="depth-button">
                  0.01 ⌄
                </button>
              </div>

              <div className="book-head">
                <span>Price (USDT)</span>
                <span>Amount</span>
              </div>

              <div className="book-list asks">
                {book.asks.map((row, index) => (
                  <div
                    className="book-row"
                    key={index}
                  >
                    <span className="negative">
                      {formatPrice(row.price)}
                    </span>
                    <span>
                      {row.amount.toFixed(4)}
                    </span>

                    <div
                      className="depth depth-red"
                      style={{
                        width: `${25 + index * 8}%`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mid-price">
                <strong>
                  ${formatPrice(market.price)}
                </strong>

                <span
                  className={
                    market.change >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {market.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(market.change).toFixed(2)}%
                </span>
              </div>

              <div className="book-list bids">
                {book.bids.map((row, index) => (
                  <div
                    className="book-row"
                    key={index}
                  >
                    <span className="positive">
                      {formatPrice(row.price)}
                    </span>

                    <span>
                      {row.amount.toFixed(4)}
                    </span>

                    <div
                      className="depth depth-green"
                      style={{
                        width: `${25 + index * 8}%`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="book-footer">
                <span>Spread</span>
                <strong>
                  $
                  {formatPrice(
                    market.price * 0.0007,
                  )}
                </strong>
              </div>
            </aside>

            <aside
              className={`trade-panel ${
                mobilePanel !== "trade"
                  ? "mobile-hidden"
                  : ""
              }`}
            >
              <div className="trade-tabs">
                <button
                  className={
                    side === "buy"
                      ? "buy-tab active"
                      : "buy-tab"
                  }
                  onClick={() => setSide("buy")}
                >
                  Buy {market.base}
                </button>

                <button
                  className={
                    side === "sell"
                      ? "sell-tab active"
                      : "sell-tab"
                  }
                  onClick={() => setSide("sell")}
                >
                  Sell {market.base}
                </button>
              </div>

              <div className="order-types">
                {(["Limit", "Market", "Stop"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      className={
                        orderType === type
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setOrderType(type)
                      }
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>

              <div className="available">
                <span>Available</span>

                <strong>
                  {side === "buy"
                    ? `${available.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )} USDT`
                    : `${available.toFixed(4)} ${
                        market.base
                      }`}
                </strong>
              </div>

              {orderType !== "Market" && (
                <label className="input-label">
                  <span>Price</span>

                  <div className="input-box">
                    <input
                      value={
                        limitPrice ||
                        market.price.toString()
                      }
                      onChange={(e) =>
                        setLimitPrice(
                          e.target.value,
                        )
                      }
                      inputMode="decimal"
                    />

                    <span>USDT</span>
                  </div>
                </label>
              )}

              <label className="input-label">
                <span>Amount</span>

                <div className="input-box">
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="0.000000"
                    inputMode="decimal"
                  />

                  <span>{market.base}</span>
                </div>
              </label>

              <div className="percentage-row">
                {[25, 50, 75, 100].map(
                  (value) => (
                    <button
                      key={value}
                      className={
                        percent === value
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        usePercent(value)
                      }
                    >
                      {value}%
                    </button>
                  ),
                )}
              </div>

              <div className="input-label">
                <span>Total</span>

                <div className="input-box total-box">
                  <span className="total-value">
                    {total
                      ? total.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )
                      : "0.00"}
                  </span>

                  <span>USDT</span>
                </div>
              </div>

              <button
                className={
                  side === "buy"
                    ? "submit buy-submit"
                    : "submit sell-submit"
                }
                onClick={() =>
                  alert(
                    "CryptoLab Demo Mode\n\nNo real transaction has been executed.",
                  )
                }
              >
                {side === "buy"
                  ? `Buy ${market.base}`
                  : `Sell ${market.base}`}
              </button>

              <div className="demo-note">
                <span>●</span>
                Demo trading only — no real funds
              </div>
            </aside>
          </div>

          <section className="bottom-assets">
            <div className="assets-header">
              <div>
                <h3>Your Assets</h3>
                <span>Demo portfolio</span>
              </div>

              <button>View all assets →</button>
            </div>

            <div className="asset-grid">
              <div className="asset-card">
                <div className="asset-top">
                  <div className="asset-icon usdt">
                    $
                  </div>

                  <div>
                    <strong>USDT</strong>
                    <span>Tether USD</span>
                  </div>

                  <div className="asset-value">
                    $24,850.73
                  </div>
                </div>
              </div>

              <div className="asset-card">
                <div className="asset-top">
                  <div className="asset-icon btc">
                    ₿
                  </div>

                  <div>
                    <strong>BTC</strong>
                    <span>Bitcoin</span>
                  </div>

                  <div className="asset-value">
                    0.8421 BTC
                  </div>
                </div>
              </div>

              <div className="asset-card">
                <div className="asset-top">
                  <div className="asset-icon eth">
                    Ξ
                  </div>

                  <div>
                    <strong>ETH</strong>
                    <span>Ethereum</span>
                  </div>

                  <div className="asset-value">
                    4.218 ETH
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>© 2026 CryptoLab</span>

          <div>
            <span className="online">
              ● System operational
            </span>
            <span>Markets</span>
            <span>Security</span>
            <span>API</span>
          </div>
        </footer>
      </div>
    </>
  );
}

const styles = `
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #05080d;
  color: #e9eef5;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input {
  font: inherit;
}

button {
  border: 0;
  cursor: pointer;
}

.splash {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(26, 210, 151, .13),
      transparent 28%
    ),
    #05080d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-grid {
  position: absolute;
  inset: 0;
  opacity: .22;
  background-image:
    linear-gradient(
      rgba(255,255,255,.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.035) 1px,
      transparent 1px
    );
  background-size: 50px 50px;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 35%,
    black 65%,
    transparent
  );
}

.splash-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: splashIn .8s ease both;
}

.brand-mark {
  width: 86px;
  height: 86px;
  margin: 0 auto 25px;
  padding: 2px;
  border-radius: 25px;
  background: linear-gradient(
    145deg,
    #25e5a9,
    #14866d
  );
  box-shadow:
    0 0 50px rgba(32, 210, 160, .25),
    inset 0 0 20px rgba(255,255,255,.15);
}

.brand-icon {
  width: 100%;
  height: 100%;
  border-radius: 23px;
  background: #07100f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #29e5aa;
  font-size: 43px;
  font-weight: 900;
}

.splash-title {
  font-size: 58px;
  font-weight: 800;
  letter-spacing: -3px;
}

.splash-title span,
.logo-name span {
  color: #28dca5;
}

.splash-subtitle {
  margin-top: 7px;
  color: #778496;
  letter-spacing: 5px;
  font-size: 11px;
  font-weight: 700;
}

.loader {
  width: 180px;
  height: 3px;
  margin: 42px auto 15px;
  background: #151d26;
  border-radius: 20px;
  overflow: hidden;
}

.loader div {
  width: 55%;
  height: 100%;
  background: #27dca6;
  animation: loading 1.4s ease-in-out infinite;
  box-shadow: 0 0 12px #27dca6;
}

.loading-text {
  color: #536174;
  font-size: 10px;
  letter-spacing: 2px;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(280%); }
}

@keyframes splashIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.app {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 85% 10%,
      rgba(28, 198, 151, .035),
      transparent 25%
    ),
    #05080d;
}

.topbar {
  height: 68px;
  padding: 0 25px;
  border-bottom: 1px solid #18202a;
  background: rgba(5,8,13,.94);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 11px;
}

.logo-icon {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    #27dba6,
    #12755e
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: #03100c;
  font-size: 20px;
  font-weight: 900;
}

.logo-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -.5px;
}

.logo-caption {
  color: #586577;
  font-size: 7px;
  letter-spacing: 2px;
  margin-top: 1px;
}

.top-navigation {
  display: flex;
  gap: 5px;
  height: 100%;
}

.top-navigation button {
  padding: 0 20px;
  background: transparent;
  color: #758195;
  position: relative;
}

.top-navigation button:hover {
  color: #dfe7ef;
}

.top-navigation .nav-active {
  color: #e9eef5;
}

.top-navigation .nav-active:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #29dca6;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-badge {
  border: 1px solid rgba(36,217,163,.25);
  color: #31dca8;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .6px;
  display: flex;
  gap: 7px;
  align-items: center;
}

.demo-badge span {
  width: 5px;
  height: 5px;
  background: #28dca5;
  border-radius: 50%;
  box-shadow: 0 0 7px #28dca5;
}

.icon-button,
.profile-button {
  background: #0b1118;
  color: #8995a7;
  border: 1px solid #1b2530;
  border-radius: 8px;
}

.icon-button {
  width: 35px;
  height: 35px;
}

.profile-button {
  height: 35px;
  padding: 0 10px 0 6px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: #1b2935;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #30dca8;
  font-weight: 700;
}

.chevron {
  color: #566477;
  margin-left: 3px;
}

.ticker-bar {
  height: 45px;
  border-bottom: 1px solid #18202a;
  background: #080d13;
  display: flex;
  overflow-x: auto;
}

.ticker {
  flex: 1;
  min-width: 185px;
  padding: 0 17px;
  background: transparent;
  border-right: 1px solid #151e28;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #8290a3;
  font-size: 11px;
}

.ticker-active {
  background: rgba(30,211,159,.035);
}

.ticker-symbol {
  color: #b7c1ce;
  font-weight: 700;
}

.ticker strong {
  color: #e7edf4;
  font-size: 11px;
}

.positive {
  color: #24d5a0 !important;
}

.negative {
  color: #ff5b7b !important;
}

.terminal {
  max-width: 1600px;
  margin: 0 auto;
}

.market-header {
  min-height: 92px;
  padding: 19px 25px;
  border-bottom: 1px solid #18202a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.market-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-avatar {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 35% 30%,
      #34495a,
      #17232e
    );
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d8e2eb;
  font-weight: 800;
  border: 1px solid #2a3947;
}

.pair-title {
  font-size: 20px;
  font-weight: 800;
}

.pair-title span {
  color: #69788b;
  font-weight: 600;
}

.favorite {
  margin-left: 8px;
  color: #566477 !important;
}

.pair-subtitle {
  margin-top: 4px;
  color: #596779;
  font-size: 10px;
}

.stats {
  display: flex;
  gap: 35px;
}

.stats > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats span {
  color: #5d6b7d;
  font-size: 9px;
}

.stats strong {
  font-size: 11px;
  color: #bfc8d3;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 265px 330px;
  min-height: 670px;
}

.chart-panel,
.orderbook-panel,
.trade-panel {
  background: #070c12;
  border-right: 1px solid #18202a;
}

.chart-panel {
  min-width: 0;
}

.panel-toolbar {
  height: 48px;
  border-bottom: 1px solid #151e27;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
}

.timeframes,
.chart-tools {
  display: flex;
  gap: 3px;
}

.timeframes button,
.chart-tools button {
  min-width: 34px;
  height: 27px;
  padding: 0 8px;
  border-radius: 5px;
  background: transparent;
  color: #69778a;
  font-size: 10px;
}

.timeframes button:hover,
.timeframes .selected {
  color: #e7edf4;
  background: #131d27;
}

.chart-tools button {
  color: #566476;
}

.chart {
  height: 400px;
  position: relative;
  padding: 8px 4px 0;
}

.chart-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.chart-label {
  position: absolute;
  left: 15px;
  top: 14px;
  color: #536174;
  font-size: 9px;
}

.volume-area {
  height: 55px;
  margin: 0 60px 0 18px;
  border-top: 1px solid rgba(255,255,255,.025);
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.volume-area div {
  flex: 1;
  min-width: 1px;
  opacity: .4;
}

.volume-up {
  background: #22c89a;
}

.volume-down {
  background: #ee5371;
}

.trades-title {
  height: 35px;
  margin-top: 5px;
  padding: 0 20px;
  border-top: 1px solid #151e27;
  border-bottom: 1px solid #151e27;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  color: #526074;
  font-size: 9px;
}

.recent-trades {
  padding: 2px 20px;
}

.trade-row {
  height: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  font-size: 10px;
  color: #8491a2;
}

.orderbook-panel {
  min-width: 0;
  padding-bottom: 15px;
}

.section-heading {
  height: 48px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #151e27;
}

.section-heading strong {
  font-size: 12px;
}

.depth-button {
  background: #101821;
  border: 1px solid #1b2733;
  color: #738095;
  border-radius: 5px;
  padding: 5px 7px;
  font-size: 9px;
}

.book-head,
.book-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

.book-head {
  height: 31px;
  padding: 0 14px;
  align-items: center;
  color: #536175;
  font-size: 9px;
}

.book-row {
  height: 25px;
  padding: 0 14px;
  align-items: center;
  font-size: 10px;
  color: #8d99a8;
  overflow: hidden;
}

.book-row > span {
  position: relative;
  z-index: 2;
}

.book-row > span:nth-child(2) {
  text-align: right;
}

.depth {
  position: absolute;
  right: 0;
  top: 3px;
  bottom: 3px;
  opacity: .08;
}

.depth-red {
  background: #ff4e71;
}

.depth-green {
  background: #1ed4a0;
}

.mid-price {
  height: 50px;
  margin: 6px 14px;
  border-top: 1px solid #1b2530;
  border-bottom: 1px solid #1b2530;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mid-price strong {
  color: #e8eef5;
  font-size: 13px;
}

.mid-price span {
  font-size: 9px;
}

.book-footer {
  padding: 14px;
  margin-top: 10px;
  border-top: 1px solid #151e27;
  display: flex;
  justify-content: space-between;
  color: #5c6a7d;
  font-size: 10px;
}

.book-footer strong {
  color: #8996a7;
}

.trade-panel {
  border-right: 0;
  padding: 0 17px;
}

.trade-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 48px;
  border-bottom: 1px solid #18212b;
}

.trade-tabs button {
  background: transparent;
  color: #657285;
  font-size: 12px;
  font-weight: 700;
  position: relative;
}

.trade-tabs .active {
  color: #e6edf4;
}

.buy-tab.active:after,
.sell-tab.active:after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 15%;
  right: 15%;
  height: 2px;
}

.buy-tab.active:after {
  background: #21d3a0;
}

.sell-tab.active:after {
  background: #ff5575;
}

.order-types {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #151e27;
}

.order-types button {
  background: transparent;
  color: #627084;
  font-size: 10px;
  padding: 7px 0;
}

.order-types .selected {
  color: #e3eaf1;
  border-bottom: 2px solid #29d9a4;
}

.available {
  display: flex;
  justify-content: space-between;
  margin: 18px 0 13px;
  color: #59687b;
  font-size: 9px;
}

.available strong {
  color: #9ba7b6;
  font-weight: 600;
}

.input-label {
  display: block;
  margin-top: 12px;
}

.input-label > span {
  display: block;
  margin-bottom: 6px;
  color: #687589;
  font-size: 9px;
}

.input-box {
  height: 40px;
  background: #0c131b;
  border: 1px solid #1a2632;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.input-box:focus-within {
  border-color: #275f53;
  box-shadow: 0 0 0 2px rgba(35,214,160,.05);
}

.input-box input {
  min-width: 0;
  flex: 1;
  background: transparent;
  border: 0;
  outline: 0;
  color: #e4ebf2;
  font-size: 11px;
}

.input-box input::placeholder {
  color: #3e4b5c;
}

.input-box > span {
  color: #647286;
  font-size: 9px;
}

.percentage-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-top: 7px;
}

.percentage-row button {
  height: 26px;
  background: #0c131b;
  border: 1px solid #1a2632;
  color: #657386;
  border-radius: 5px;
  font-size: 9px;
}

.percentage-row button:hover,
.percentage-row .selected {
  color: #b7c3cf;
  border-color: #294238;
  background: #101b19;
}

.total-box {
  justify-content: space-between;
}

.total-value {
  color: #e1e8ef !important;
  font-size: 11px !important;
}

.submit {
  width: 100%;
  height: 43px;
  margin-top: 19px;
  border-radius: 7px;
  color: #03100c;
  font-size: 11px;
  font-weight: 800;
  transition: transform .15s, filter .15s;
}

.submit:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.buy-submit {
  background: #22d4a0;
}

.sell-submit {
  background: #ff5575;
  color: #18050a;
}

.demo-note {
  margin-top: 13px;
  text-align: center;
  color: #4e5d70;
  font-size: 8px;
}

.demo-note span {
  color: #22d4a0;
}

.bottom-assets {
  border-top: 1px solid #18202a;
  padding: 24px 25px 28px;
  background: #070c12;
}

.assets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.assets-header h3 {
  margin: 0;
  font-size: 14px;
}

.assets-header span {
  display: block;
  color: #526174;
  font-size: 9px;
  margin-top: 4px;
}

.assets-header button {
  background: transparent;
  color: #22d3a0;
  font-size: 10px;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.asset-card {
  padding: 14px;
  border: 1px solid #18232e;
  border-radius: 8px;
  background: #090f16;
}

.asset-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.asset-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
}

.usdt {
  background: rgba(40,205,160,.12);
  color: #2ad9a5;
}

.btc {
  background: rgba(247,170,70,.12);
  color: #f4aa48;
}

.eth {
  background: rgba(126,143,255,.12);
  color: #8d9bff;
}

.asset-top > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.asset-top strong {
  font-size: 11px;
}

.asset-top span {
  color: #59677a;
  font-size: 8px;
}

.asset-value {
  margin-left: auto;
  color: #bdc8d4;
  font-size: 10px;
}

.footer {
  height: 55px;
  padding: 0 25px;
  border-top: 1px solid #18202a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #445264;
  font-size: 9px;
}

.footer div {
  display: flex;
  gap: 18px;
}

.online {
  color: #24c99a;
}

.mobile-tabs {
  display: none;
}

@media (max-width: 1100px) {
  .workspace {
    grid-template-columns: minmax(0, 1fr) 230px 290px;
  }

  .stats {
    gap: 17px;
  }

  .stats > div:nth-child(3),
  .stats > div:nth-child(4) {
    display: none;
  }
}

@media (max-width: 850px) {
  .top-navigation {
    display: none;
  }

  .topbar {
    padding: 0 15px;
  }

  .demo-badge {
    display: none;
  }

  .market-header {
    padding: 15px;
  }

  .stats {
    display: none;
  }

  .workspace {
    display: block;
    min-height: auto;
  }

  .mobile-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 43px;
    border-bottom: 1px solid #18202a;
    background: #080d13;
  }

  .mobile-tabs button {
    background: transparent;
    color: #5f6d7f;
    font-size: 10px;
    position: relative;
  }

  .mobile-tabs button.active {
    color: #e2e9ef;
  }

  .mobile-tabs button.active:after {
    content: "";
    position: absolute;
    left: 25%;
    right: 25%;
    bottom: 0;
    height: 2px;
    background: #28dca6;
  }

  .mobile-hidden {
    display: none !important;
  }

  .chart-panel,
  .orderbook-panel,
  .trade-panel {
    border-right: 0;
  }

  .chart {
    height: 350px;
  }

  .orderbook-panel {
    min-height: 600px;
  }

  .trade-panel {
    min-height: 590px;
    padding: 0 18px 20px;
  }

  .asset-grid {
    grid-template-columns: 1fr;
  }

  .footer {
    padding: 0 15px;
  }
}

@media (max-width: 520px) {
  .logo-caption {
    display: none;
  }

  .profile-button {
    font-size: 0;
    padding-right: 6px;
  }

  .profile-button .chevron {
    display: none;
  }

  .ticker {
    min-width: 160px;
  }

  .pair-title {
    font-size: 18px;
  }

  .market-header {
    min-height: 75px;
  }

  .chart {
    height: 315px;
  }

  .volume-area {
    margin-right: 50px;
  }

  .trades-title,
  .trade-row {
    font-size: 8px;
  }

  .footer {
    height: auto;
    min-height: 55px;
    padding-top: 12px;
    padding-bottom: 12px;
    gap: 10px;
    align-items: flex-start;
  }

  .footer div {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .splash-title {
    font-size: 45px;
  }
}
`;
