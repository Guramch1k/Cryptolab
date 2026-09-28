"use client";

import { useMemo, useState } from "react";

type Side = "buy" | "sell";
type OrderType = "market" | "limit" | "stop";

const GREEN = "#2bdca7";

const coins = [
  { symbol: "BTC", name: "Bitcoin", price: 67124.42 },
  { symbol: "ETH", name: "Ethereum", price: 2584.31 },
  { symbol: "SOL", name: "Solana", price: 151.82 },
  { symbol: "BNB", name: "BNB", price: 615.42 },
];

function Icon({
  type,
  size = 20,
}: {
  type: "home" | "markets" | "trade" | "futures" | "assets";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "home") {
    return (
      <svg {...common}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }

  if (type === "markets") {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (type === "trade") {
    return (
      <svg {...common}>
        <path d="M4 8h13" />
        <path d="m14 5 3 3-3 3" />
        <path d="M20 16H7" />
        <path d="m10 13-3 3 3 3" />
      </svg>
    );
  }

  if (type === "futures") {
    return (
      <svg {...common}>
        <path d="M4 18V9" />
        <path d="M9 15V5" />
        <path d="M14 19v-8" />
        <path d="M19 13V3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3.5 7.5h13a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
      <path d="M4 7.5V5.8A1.8 1.8 0 0 1 5.8 4H18" />
      <path d="M15 14h5" />
      <circle cx="15" cy="14" r=".7" fill="currentColor" />
    </svg>
  );
}

function generateCandles(base: number) {
  return Array.from({ length: 55 }, (_, i) => {
    const wave =
      Math.sin(i * 0.55) * base * 0.008 +
      Math.sin(i * 0.17) * base * 0.014;

    const noise =
      ((i * 17) % 11 - 5) * base * 0.002;

    const close = base + wave + noise;
    const open =
      close +
      (((i * 13) % 9) - 4) * base * 0.0025;

    const high =
      Math.max(open, close) +
      base * (0.002 + ((i * 7) % 6) * 0.001);

    const low =
      Math.min(open, close) -
      base * (0.002 + ((i * 5) % 5) * 0.001);

    return {
      open,
      close,
      high,
      low,
    };
  });
}

export default function ExchangePage() {
  const [selected, setSelected] = useState("BTC");
  const [side, setSide] = useState<Side>("buy");
  const [orderType, setOrderType] =
    useState<OrderType>("limit");

  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("67124.42");
  const [percentage, setPercentage] = useState(0);

  const coin =
    coins.find((item) => item.symbol === selected) ??
    coins[0];

  const candles = useMemo(
    () => generateCandles(coin.price),
    [coin.price]
  );

  const asks = [
    coin.price * 1.0034,
    coin.price * 1.0027,
    coin.price * 1.0019,
    coin.price * 1.0011,
    coin.price * 1.0005,
  ];

  const bids = [
    coin.price * 0.9995,
    coin.price * 0.9989,
    coin.price * 0.9981,
    coin.price * 0.9972,
    coin.price * 0.9964,
  ];

  function selectCoin(symbol: string) {
    setSelected(symbol);

    const newCoin =
      coins.find((item) => item.symbol === symbol) ??
      coins[0];

    setPrice(newCoin.price.toFixed(2));
  }

  function placeOrder() {
    if (!amount) {
      alert("Enter order amount");
      return;
    }

    alert(
      `Demo ${side.toUpperCase()} order created for ${selected}.`
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #03070b;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
          color: #eef5f3;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .exchange {
          min-height: 100vh;
          padding-bottom: 86px;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(43,220,167,.06),
              transparent 35%
            ),
            #03070b;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          background: rgba(3,7,11,.9);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: ${GREEN};
          color: #06100d;
          font-size: 17px;
          font-weight: 900;
          box-shadow: 0 0 24px rgba(43,220,167,.18);
        }

        .brand-name {
          color: ${GREEN};
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 18px;
          color: #627078;
          font-size: 11px;
        }

        .live {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${GREEN};
          box-shadow: 0 0 10px rgba(43,220,167,.7);
        }

        .pair-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 66px;
          padding: 0 24px;
          overflow-x: auto;
          border-bottom: 1px solid rgba(255,255,255,.05);
          scrollbar-width: none;
        }

        .pair-bar::-webkit-scrollbar {
          display: none;
        }

        .pair {
          flex: 0 0 auto;
          padding: 8px 14px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #59686f;
          text-align: left;
        }

        .pair.active {
          color: ${GREEN};
          border-color: rgba(43,220,167,.18);
          background: rgba(43,220,167,.06);
        }

        .pair-symbol {
          font-size: 12px;
          font-weight: 750;
        }

        .pair-price {
          margin-top: 3px;
          font-size: 9px;
          opacity: .7;
        }

        .terminal {
          width: min(1450px, calc(100% - 32px));
          margin: 16px auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 14px;
        }

        .left {
          min-width: 0;
          display: grid;
          gap: 14px;
        }

        .panel {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 15px;
          background: rgba(8,14,19,.8);
        }

        .panel-header {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .panel-title {
          color: #dce7e4;
          font-size: 12px;
          font-weight: 700;
        }

        .timeframes {
          display: flex;
          gap: 4px;
        }

        .timeframe {
          border: 0;
          padding: 5px 8px;
          border-radius: 6px;
          background: transparent;
          color: #4f5e65;
          font-size: 9px;
        }

        .timeframe.active {
          color: ${GREEN};
          background: rgba(43,220,167,.07);
        }

        .chart {
          position: relative;
          height: 430px;
          padding: 18px;
          overflow: hidden;
          background:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 70px 70px;
        }

        .candles {
          height: 100%;
          display: flex;
          align-items: stretch;
          gap: 5px;
        }

        .candle {
          position: relative;
          flex: 1;
          min-width: 3px;
        }

        .wick {
          position: absolute;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: currentColor;
          opacity: .8;
        }

        .body {
          position: absolute;
          left: 15%;
          right: 15%;
          min-height: 3px;
          border-radius: 1px;
        }

        .green {
          color: ${GREEN};
        }

        .red {
          color: #ff6679;
        }

        .chart-price {
          position: absolute;
          right: 12px;
          top: 50%;
          padding: 4px 6px;
          border-radius: 4px;
          color: #07100e;
          background: ${GREEN};
          font-size: 8px;
          font-weight: 800;
        }

        .orderbook {
          height: 300px;
        }

        .book-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 15px;
        }

        .book-side {
          min-width: 0;
        }

        .book-label {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          margin-bottom: 7px;
          color: #435158;
          font-size: 8px;
        }

        .book-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 4px 0;
          color: #84918f;
          font-size: 9px;
        }

        .depth {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          opacity: .08;
          background: currentColor;
        }

        .ask {
          color: #ff6679;
        }

        .bid {
          color: ${GREEN};
        }

        .mid-price {
          padding: 8px 15px;
          border-top: 1px solid rgba(255,255,255,.04);
          border-bottom: 1px solid rgba(255,255,255,.04);
          color: ${GREEN};
          font-size: 12px;
          font-weight: 750;
        }

        .trades {
          min-height: 240px;
        }

        .trade-head,
        .trade-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 0 16px;
        }

        .trade-head {
          padding-top: 12px;
          padding-bottom: 8px;
          color: #435158;
          font-size: 8px;
        }

        .trade-row {
          padding-top: 5px;
          padding-bottom: 5px;
          color: #87938f;
          font-size: 9px;
        }

        .trade-row span:first-child {
          color: ${GREEN};
        }

        .order-panel {
          height: fit-content;
          position: sticky;
          top: 84px;
        }

        .order-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .order-tab {
          height: 48px;
          border: 0;
          background: transparent;
          color: #526168;
          font-size: 12px;
          font-weight: 700;
        }

        .order-tab.active.buy {
          color: ${GREEN};
          box-shadow: inset 0 -2px ${GREEN};
        }

        .order-tab.active.sell {
          color: #ff6679;
          box-shadow: inset 0 -2px #ff6679;
        }

        .order-types {
          display: flex;
          gap: 4px;
          padding: 15px 15px 4px;
        }

        .order-type {
          border: 0;
          padding: 7px 9px;
          border-radius: 7px;
          background: transparent;
          color: #526168;
          font-size: 9px;
        }

        .order-type.active {
          color: ${GREEN};
          background: rgba(43,220,167,.07);
        }

        .form {
          padding: 10px 15px 18px;
        }

        .field {
          margin-top: 11px;
        }

        .field-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #59676e;
          font-size: 9px;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          background: #070d12;
        }

        .input-wrap:focus-within {
          border-color: rgba(43,220,167,.3);
        }

        .input-wrap input {
          width: 100%;
          border: 0;
          outline: 0;
          padding: 11px;
          background: transparent;
          color: #e9f1ef;
          font-size: 11px;
        }

        .input-suffix {
          padding-right: 11px;
          color: #536168;
          font-size: 9px;
        }

        .percentages {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin-top: 8px;
        }

        .percentage {
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 6px;
          padding: 6px 2px;
          color: #56646a;
          background: transparent;
          font-size: 8px;
        }

        .percentage.active {
          color: ${GREEN};
          border-color: rgba(43,220,167,.2);
        }

        .balance {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
          padding-top: 13px;
          border-top: 1px solid rgba(255,255,255,.05);
          color: #536168;
          font-size: 9px;
        }

        .balance strong {
          color: #9ba8a5;
          font-weight: 600;
        }

        .order-button {
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 9px;
          padding: 12px;
          background: ${GREEN};
          color: #04100c;
          font-size: 11px;
          font-weight: 800;
        }

        .order-button.sell {
          background: #ff6679;
          color: #160508;
        }

        .demo-note {
          margin-top: 10px;
          color: #3f4d53;
          font-size: 8px;
          line-height: 1.5;
          text-align: center;
        }

        .bottom-nav {
          position: fixed;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          z-index: 50;
          width: min(620px, calc(100% - 18px));
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 8px;
          border: 1px solid rgba(43,220,167,.1);
          border-radius: 19px;
          background: rgba(6,13,17,.94);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 55px rgba(0,0,0,.45);
        }

        .nav-item {
          min-height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 0;
          border-radius: 13px;
          background: transparent;
          color: rgba(43,220,167,.45);
        }

        .nav-item.active {
          color: ${GREEN};
          background: rgba(43,220,167,.08);
        }

        .nav-label {
          font-size: 8px;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .terminal {
            grid-template-columns: 1fr;
          }

          .order-panel {
            position: static;
          }

          .chart {
            height: 360px;
          }
        }

        @media (max-width: 600px) {
          .topbar {
            padding: 0 15px;
          }

          .header-right {
            gap: 0;
          }

          .live {
            display: none;
          }

          .pair-bar {
            padding: 0 12px;
          }

          .terminal {
            width: calc(100% - 14px);
            margin: 8px auto;
          }

          .panel {
            border-radius: 12px;
          }

          .chart {
            height: 300px;
            padding: 10px;
          }

          .candles {
            gap: 3px;
          }

          .orderbook {
            height: auto;
          }

          .book-grid {
            gap: 8px;
            padding: 10px;
          }

          .book-row {
            font-size: 8px;
          }
        }
      `}</style>

      <main className="exchange">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">C</div>
            <div className="brand-name">CryptoLab</div>
          </div>

          <div className="header-right">
            <div className="live">
              <span className="live-dot" />
              Live Market
            </div>

            <span>DEMO</span>
          </div>
        </header>

        <div className="pair-bar">
          {coins.map((item) => (
            <button
              key={item.symbol}
              className={`pair ${
                selected === item.symbol
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                selectCoin(item.symbol)
              }
            >
              <div className="pair-symbol">
                {item.symbol}/USDT
              </div>

              <div className="pair-price">
                ${item.price.toLocaleString()}
              </div>
            </button>
          ))}
        </div>

        <div className="terminal">
          <div className="left">
            <section className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  {selected}/USDT
                </div>

                <div className="timeframes">
                  {[
                    "1m",
                    "5m",
                    "15m",
                    "1H",
                    "4H",
                    "1D",
                  ].map((time, index) => (
                    <button
                      key={time}
                      className={`timeframe ${
                        index === 2
                          ? "active"
                          : ""
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              
                      <div
                        className={`candle ${
                          isGreen
                            ? "green"
                            : "red"
                        }`}
                        key={index}
                      >
                        <div
                          className="wick"
                          style={{
                            top: `${high}%`,
                            height: `${low - high}%`,
                          }}
                        />

                        <div
                          className="body"
                          style={{
                            top: `${top}%`,
                            height: `${Math.max(
                              bottom - top,
                              1.2
                            )}%`,
                            background:
                              "currentColor",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="chart-price">
                  {coin.price.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
              </div>
            </section>

            <section className="panel orderbook">
              <div className="panel-header">
                <div className="panel-title">
                  Order Book
                </div>

                <div
                  style={{
                    color: "#526168",
                    fontSize: 9,
                  }}
                >
                  0.01
                </div>
              </div>

              <div className="book-grid">
                <div className="book-side">
                  <div className="book-label">
                    <span>Price</span>
                    <span>Amount</span>
                    <span>Total</span>
                  </div>

                  {asks.map((value, index) => (
                    <div
                      className="book-row ask"
                      key={value}
                    >
                      <div
                        className="depth"
                        style={{
                          width: `${
                            35 + index * 11
                          }%`,
                        }}
                      />

                      <span>
                        {value.toFixed(2)}
                      </span>

                      <span>
                        {(0.18 +
                          index * 0.07
                        ).toFixed(3)}
                      </span>

                      <span>
                        {(
                          value *
                          (0.18 +
                            index * 0.07)
                        ).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="book-side">
                  <div className="book-label">
                    <span>Price</span>
                    <span>Amount</span>
                    <span>Total</span>
                  </div>

                  {bids.map((value, index) => (
                    <div
                      className="book-row bid"
                      key={value}
                    >
                      <div
                        className="depth"
                        style={{
                          width: `${
                            35 + index * 11
                          }%`,
                        }}
                      />

                      <span>
                        {value.toFixed(2)}
                      </span>

                      <span>
                        {(0.16 +
                          index * 0.08
                        ).toFixed(3)}
                      </span>

                      <span>
                        {(
                          value *
                          (0.16 +
                            index * 0.08)
                        ).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mid-price">
                ≈ {coin.price.toFixed(2)} USDT
              </div>
            </section>

            <section className="panel trades">
              <div className="panel-header">
                <div className="panel-title">
                  Recent Trades
                </div>
              </div>

              <div className="trade-head">
                <span>Price</span>
                <span>Amount</span>
                <span>Time</span>
              </div>

              {[0, 1, 2, 3, 4, 5].map(
                (index) => {
                  const tradePrice =
                    coin.price +
                    ((index % 3) - 1) *
                      coin.price *
                      0.0005;

                  return (
                    <div
                      className="trade-row"
                      key={index}
                    >
                      <span>
                        {tradePrice.toFixed(2)}
                      </span>

                      <span>
                        {(
                          0.08 +
                          index * 0.031
                        ).toFixed(3)}
                      </span>

                      <span>
                        13:{20 + index}:4
                        {index}
                      </span>
                    </div>
                  );
                }
              )}
            </section>
          </div>

          <aside className="panel order-panel">
            <div className="order-tabs">
              <button
                className={`order-tab ${
                  side === "buy"
                    ? "active buy"
                    : ""
                }`}
                onClick={() => setSide("buy")}
              >
                Buy
              </button>

              <button
                className={`order-tab ${
                  side === "sell"
                    ? "active sell"
                    : ""
                }`}
                onClick={() => setSide("sell")}
              >
                Sell
              </button>
            </div>

            <div className="order-types">
              <button
                className={`order-type ${
                  orderType === "market"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setOrderType("market")
                }
              >
                Market
              </button>

              <button
                className={`order-type ${
                  orderType === "limit"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setOrderType("limit")
                }
              >
                Limit
              </button>

              <button
                className={`order-type ${
                  orderType === "stop"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setOrderType("stop")
                }
              >
                Stop
              </button>
            </div>

            <div className="form">
              {orderType !== "market" && (
                <div className="field">
                  <div className="field-label">
                    <span>Price</span>
                    <span>USDT</span>
                  </div>

                  <div className="input-wrap">
                    <input
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      inputMode="decimal"
                    />

                    <span className="input-suffix">
                      USDT
                    </span>
                  </div>
                </div>
              )}

              <div className="field">
                <div className="field-label">
                  <span>Amount</span>
                  <span>{selected}</span>
                </div>

                <div className="input-wrap">
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="0.00"
                    inputMode="decimal"
                  />

                  <span className="input-suffix">
                    {selected}
                  </span>
                </div>
              </div>

              <div className="percentages">
                {[25, 50, 75, 100].map(
                  (value) => (
                    <button
                      key={value}
                      className={`percentage ${
                        percentage === value
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setPercentage(value)
                      }
                    >
                      {value}%
                    </button>
                  )
                )}
              </div>

              <div className="balance">
                <span>
                  Available
                </span>

                <strong>
                  {side === "buy"
                    ? "25,000.00 USDT"
                    : `2.450 ${selected}`}
                </strong>
              </div>

              <button
                className={`order-button ${
                  side === "sell"
                    ? "sell"
                    : ""
                }`}
                onClick={placeOrder}
              >
                {side === "buy"
                  ? `Buy ${selected}`
                  : `Sell ${selected}`}
              </button>

              <div className="demo-note">
                Demo trading environment.
                No real funds or blockchain
                transactions are used.
              </div>
            </div>
          </aside>
        </div>

        <nav className="bottom-nav">
          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/")
            }
          >
            <Icon type="home" />
            <span className="nav-label">
              Home
            </span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/")
            }
          >
            <Icon type="markets" />
            <span className="nav-label">
              Markets
            </span>
          </button>

          <button className="nav-item active">
            <Icon type="trade" />
            <span className="nav-label">
              Trade
            </span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              alert(
                "Futures module is coming soon"
              )
            }
          >
            <Icon type="futures" />
            <span className="nav-label">
              Futures
            </span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              alert(
                "Assets module is coming soon"
              )
            }
          >
            <Icon type="assets" />
            <span className="nav-label">
              Assets
            </span>
          </button>
        </nav>
      </main>
    </>
  );
}
