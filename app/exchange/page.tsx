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

type BookRow = {
  price: number;
  amount: number;
  total: number;
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
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function generateCandles(price: number, count = 70): Candle[] {
  const candles: Candle[] = [];
  let current = price * 0.965;

  for (let i = 0; i < count; i++) {
    const movement = (seededRandom(i + 17) - 0.48) * price * 0.012;
    const open = current;
    const close = Math.max(price * 0.88, open + movement);

    const high =
      Math.max(open, close) +
      seededRandom(i + 51) * price * 0.007;

    const low =
      Math.min(open, close) -
      seededRandom(i + 91) * price * 0.007;

    candles.push({
      open,
      high,
      low,
      close,
    });

    current = close;
  }

  const adjustment = price / candles[candles.length - 1].close;

  return candles.map((c) => ({
    open: c.open * adjustment,
    high: c.high * adjustment,
    low: c.low * adjustment,
    close: c.close * adjustment,
  }));
}

function formatPrice(value: number) {
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toFixed(2);
}

function generateBook(price: number) {
  const asks: BookRow[] = [];
  const bids: BookRow[] = [];

  for (let i = 0; i < 8; i++) {
    const askPrice = price + price * 0.00065 * (i + 1);
    const bidPrice = price - price * 0.00065 * (i + 1);

    const askAmount = 0.08 + seededRandom(i + 10) * 0.75;
    const bidAmount = 0.08 + seededRandom(i + 30) * 0.75;

    asks.push({
      price: askPrice,
      amount: askAmount,
      total: askPrice * askAmount,
    });

    bids.push({
      price: bidPrice,
      amount: bidAmount,
      total: bidPrice * bidAmount,
    });
  }

  return {
    asks: asks.reverse(),
    bids,
  };
}

function generateTrades(price: number) {
  return Array.from({ length: 9 }, (_, i) => ({
    price:
      price +
      (seededRandom(i + 100) - 0.5) * price * 0.002,
    amount: 0.01 + seededRandom(i + 120) * 0.12,
    side: i % 3 === 0 ? "sell" : "buy",
    time: `13:${String(48 - i).padStart(2, "0")}:${
      10 + i
    }`,
  }));
}

function CandleChart({
  candles,
  timeframe,
}: {
  candles: Candle[];
  timeframe: string;
}) {
  const width = 900;
  const height = 430;
  const padding = 35;

  const visible = candles.slice(-55);

  const highs = visible.map((c) => c.high);
  const lows = visible.map((c) => c.low);

  const max = Math.max(...highs);
  const min = Math.min(...lows);

  const range = max - min || 1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const candleWidth = chartWidth / visible.length;

  const y = (value: number) =>
    padding + ((max - value) / range) * chartHeight;

  return (
    <div className="chart-wrapper">
      <div className="chart-top">
        <div>
          <span className="chart-label">Price</span>
          <span className="chart-price">
            {formatPrice(visible[visible.length - 1].close)}
          </span>
        </div>

        <div className="chart-meta">
          <span>{timeframe}</span>
          <span>•</span>
          <span>LIVE</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="chart"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#24d9a4" stopOpacity=".12" />
            <stop offset="100%" stopColor="#24d9a4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((line) => {
          const yy = padding + (chartHeight / 4) * line;

          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={yy}
              y2={yy}
              stroke="rgba(255,255,255,.055)"
              strokeWidth="1"
            />
          );
        })}

        {[0, 1, 2, 3, 4, 5].map((line) => {
          const xx = padding + (chartWidth / 5) * line;

          return (
            <line
              key={line}
              x1={xx}
              x2={xx}
              y1={padding}
              y2={height - padding}
              stroke="rgba(255,255,255,.035)"
              strokeWidth="1"
            />
          );
        })}

        {visible.map((candle, index) => {
          const x =
            padding +
            index * candleWidth +
            candleWidth / 2;

          const openY = y(candle.open);
          const closeY = y(candle.close);
          const highY = y(candle.high);
          const lowY = y(candle.low);

          const bullish = candle.close >= candle.open;
          const bodyY = Math.min(openY, closeY);
          const bodyHeight = Math.max(
            2,
            Math.abs(closeY - openY)
          );

          return (
            <g key={index}>
              <line
                x1={x}
                x2={x}
                y1={highY}
                y2={lowY}
                stroke={bullish ? "#28d9a5" : "#ff526d"}
                strokeWidth="1"
              />

              <rect
                x={x - candleWidth * 0.31}
                y={bodyY}
                width={candleWidth * 0.62}
                height={bodyHeight}
                rx="1"
                fill={bullish ? "#28d9a5" : "#ff526d"}
              />
            </g>
          );
        })}

        <line
          x1={padding}
          x2={width - padding}
          y1={y(visible[visible.length - 1].close)}
          y2={y(visible[visible.length - 1].close)}
          stroke="#2bdca7"
          strokeDasharray="5 5"
          opacity=".65"
        />
      </svg>

      <div className="chart-axis">
        <span>12:00</span>
        <span>12:30</span>
        <span>13:00</span>
        <span>13:30</span>
        <span>14:00</span>
      </div>
    </div>
  );
}

export default function ExchangePage() {
  const [selectedSymbol, setSelectedSymbol] =
    useState("BTC/USDT");

  const [timeframe, setTimeframe] = useState("15m");

  const [side, setSide] = useState<"buy" | "sell">("buy");

  const [orderType, setOrderType] = useState<
    "Market" | "Limit" | "Stop"
  >("Limit");

  const [amount, setAmount] = useState("");

  const [limitPrice, setLimitPrice] =
    useState("");

  const [mobilePanel, setMobilePanel] =
    useState<"chart" | "book" | "trade">("chart");

  const [menuOpen, setMenuOpen] = useState(false);

  const market =
    MARKETS.find(
      (item) => item.symbol === selectedSymbol
    ) || MARKETS[0];

  const candles = useMemo(
    () => generateCandles(market.price),
    [market.symbol, market.price]
  );

  const book = useMemo(
    () => generateBook(market.price),
    [market.symbol, market.price]
  );

  const trades = useMemo(
    () => generateTrades(market.price),
    [market.symbol, market.price]
  );

  const orderPrice =
    orderType === "Market"
      ? market.price
      : Number(limitPrice) || market.price;

  const numericAmount = Number(amount) || 0;

  const total = numericAmount * orderPrice;

  const available =
    side === "buy" ? 12480.52 : 0.1847;

  useEffect(() => {
    if (orderType === "Limit") {
      setLimitPrice(market.price.toFixed(2));
    }
  }, [market.price, orderType]);

  function setPercentage(percent: number) {
    if (side === "buy") {
      const value =
        (available * percent) / orderPrice;

      setAmount(value.toFixed(6));
    } else {
      setAmount(
        (available * percent).toFixed(6)
      );
    }
  }

  function submitOrder() {
    alert(
      "Demo order only.\n\nNo real transaction has been executed."
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
          color: #e9f1ef;
        }

        button,
        input {
          font: inherit;
        }

        button {
          border: 0;
        }

        .exchange {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 55% -10%,
              rgba(36, 217, 164, .055),
              transparent 30%
            ),
            #03070b;
        }

        .header {
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          border-bottom: 1px solid #172029;
          background: rgba(4, 9, 13, .94);
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 190px;
        }

        .brand-logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #07100f;
          font-size: 19px;
          font-weight: 950;
          background: linear-gradient(
            145deg,
            #38e8b4,
            #14906e
          );
          box-shadow:
            0 0 22px rgba(43,220,167,.15);
        }

        .brand-name {
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -.5px;
        }

        .brand-name span {
          color: #2bdca7;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 25px;
          color: #697887;
          font-size: 12px;
          font-weight: 650;
        }

        .nav .active {
          color: #e9f1ef;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .header-button {
          height: 34px;
          padding: 0 13px;
          color: #91a0ad;
          background: #0a1117;
          border: 1px solid #1a2630;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .header-button:hover {
          border-color: #2bdca7;
          color: #e9f1ef;
        }

        .profile {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #17232d;
          border: 1px solid #293641;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8e9eab;
          font-size: 12px;
          font-weight: 800;
        }

        .marketbar {
          min-height: 92px;
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 14px 22px;
          border-bottom: 1px solid #172029;
          overflow-x: auto;
        }

        .pair {
          min-width: 165px;
        }

        .pair-select {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
        }

        .coin-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111a22;
          border: 1px solid #26323c;
          color: #dbe8e4;
          font-size: 10px;
          font-weight: 900;
        }

        .pair-name {
          font-size: 16px;
          font-weight: 850;
        }

        .pair-small {
          color: #667685;
          font-size: 10px;
          margin-top: 2px;
        }

        .market-stat {
          min-width: 105px;
        }

        .market-stat-label {
          color: #526170;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .market-stat-value {
          font-size: 12px;
          font-weight: 750;
        }

        .price-large {
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -.5px;
        }

        .green {
          color: #2bdca7;
        }

        .red {
          color: #ff526d;
        }

        .market-switcher {
          display: flex;
          gap: 7px;
          margin-left: auto;
        }

        .market-chip {
          flex: 0 0 auto;
          padding: 8px 10px;
          border: 1px solid #18242d;
          border-radius: 8px;
          background: #081017;
          color: #687987;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .market-chip.active {
          color: #e8f1ef;
          border-color: rgba(43,220,167,.35);
          background: rgba(43,220,167,.07);
        }

        .main-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            310px
            330px;
          min-height: calc(100vh - 160px);
        }

        .left-column {
          min-width: 0;
          border-right: 1px solid #172029;
        }

        .chart-toolbar {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px;
          border-bottom: 1px solid #172029;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .tool-button {
          padding: 7px 9px;
          color: #647583;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .tool-button:hover,
        .tool-button.active {
          color: #dbe7e3;
          background: #101820;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #536371;
          font-size: 10px;
        }

        .chart-area {
          min-height: 510px;
          padding: 12px 17px 8px;
          border-bottom: 1px solid #172029;
        }

        .chart-wrapper {
          width: 100%;
          height: 100%;
          min-height: 480px;
          position: relative;
        }

        .chart-top {
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-label {
          color: #566674;
          font-size: 9px;
          margin-right: 8px;
        }

        .chart-price {
          color: #dfeae7;
          font-size: 12px;
          font-weight: 800;
        }

        .chart-meta {
          display: flex;
          gap: 7px;
          color: #596a78;
          font-size: 9px;
        }

        .chart {
          width: 100%;
          height: 405px;
          display: block;
        }

        .chart-axis {
          display: flex;
          justify-content: space-between;
          color: #4d5d6a;
          font-size: 9px;
          padding: 0 25px;
        }

        .bottom-panel {
          min-height: 220px;
        }

        .panel-header {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 17px;
          border-bottom: 1px solid #172029;
        }

        .panel-tab {
          height: 48px;
          position: relative;
          background: transparent;
          color: #61717f;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .panel-tab.active {
          color: #e6efec;
        }

        .panel-tab.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: #2bdca7;
        }

        .positions-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
          color: #465560;
          font-size: 11px;
        }

        .side-column {
          min-width: 0;
          border-right: 1px solid #172029;
        }

        .side-title {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          border-bottom: 1px solid #172029;
          font-size: 12px;
          font-weight: 800;
        }

        .side-title span {
          color: #50616f;
          font-size: 9px;
          font-weight: 600;
        }

        .book-head,
        .book-row {
          display: grid;
          grid-template-columns: 1fr .85fr 1fr;
          gap: 8px;
          padding: 0 14px;
        }

        .book-head {
          height: 32px;
          align-items: center;
          color: #465663;
          font-size: 9px;
        }

        .book-row {
          height: 28px;
          align-items: center;
          position: relative;
          font-size: 9px;
          overflow: hidden;
        }

        .book-depth {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          opacity: .07;
          z-index: 0;
        }

        .ask-depth {
          background: #ff526d;
        }

        .bid-depth {
          background: #2bdca7;
        }

        .book-row span {
          position: relative;
          z-index: 1;
        }

        .book-row .amount {
          color: #9ba8b2;
          text-align: right;
        }

        .book-row .total {
          color: #5e6e7b;
          text-align: right;
        }

        .mid-price {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          border-top: 1px solid #18232c;
          border-bottom: 1px solid #18232c;
          background: #071016;
        }

        .mid-price-value {
          color: #2bdca7;
          font-size: 15px;
          font-weight: 850;
        }

        .mid-label {
          color: #51616e;
          font-size: 9px;
        }

        .trades-title {
          margin-top: 18px;
        }

        .trade-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 0 14px;
          height: 28px;
          align-items: center;
          font-size: 9px;
        }

        .trade-row .time {
          color: #526270;
          text-align: right;
        }

        .trade-row .amount {
          color: #8e9ba5;
          text-align: right;
        }

        .trade-row .buy {
          color: #2bdca7;
        }

        .trade-row .sell {
          color: #ff526d;
        }

        .order-column {
          min-width: 0;
          background: #050a0f;
        }

        .order-header {
          height: 52px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          border-bottom: 1px solid #172029;
          font-size: 12px;
          font-weight: 800;
        }

        .order-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin: 17px 18px 14px;
          background: #0b1218;
          border: 1px solid #17232c;
          border-radius: 8px;
          padding: 3px;
        }

        .order-side {
          height: 32px;
          background: transparent;
          border-radius: 6px;
          color: #647582;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        .order-side.buy.active {
          color: #2bdca7;
          background: rgba(43,220,167,.09);
        }

        .order-side.sell.active {
          color: #ff667d;
          background: rgba(255,82,109,.09);
        }

        .order-types {
          display: flex;
          gap: 19px;
          padding: 0 18px 14px;
          border-bottom: 1px solid #172029;
        }

        .order-type {
          color: #596a77;
          background: transparent;
          cursor: pointer;
          padding: 0;
          font-size: 9px;
          font-weight: 700;
        }

        .order-type.active {
          color: #e1ebe8;
        }

        .form {
          padding: 18px;
        }

        .balance {
          display: flex;
          justify-content: space-between;
          color: #53636f;
          font-size: 9px;
          margin-bottom: 12px;
        }

        .balance strong {
          color: #b8c5c1;
          font-weight: 700;
        }

        .field {
          margin-bottom: 10px;
        }

        .field-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #566773;
          font-size: 9px;
        }

        .field-box {
          height: 40px;
          display: flex;
          align-items: center;
          border: 1px solid #1b2933;
          border-radius: 7px;
          background: #091118;
          overflow: hidden;
        }

        .field-box:focus-within {
          border-color: rgba(43,220,167,.45);
        }

        .field-box input {
          flex: 1;
          width: 100%;
          height: 100%;
          padding: 0 11px;
          border: 0;
          outline: 0;
          color: #e6efec;
          background: transparent;
          font-size: 11px;
        }

        .field-unit {
          padding-right: 11px;
          color: #657581;
          font-size: 9px;
          font-weight: 700;
        }

        .percentages {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin: 12px 0 15px;
        }

        .percentage {
          height: 27px;
          border: 1px solid #192630;
          background: #081017;
          color: #5c6c78;
          border-radius: 5px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 700;
        }

        .percentage:hover {
          color: #dbe7e3;
          border-color: #2b3b46;
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          color: #53636f;
          font-size: 9px;
          margin: 7px 0;
        }

        .order-summary strong {
          color: #aebbb8;
          font-weight: 700;
        }

        .submit {
          width: 100%;
          height: 43px;
          margin-top: 12px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 850;
          color: #04100c;
          background: #2bdca7;
          box-shadow: 0 8px 25px rgba(43,220,167,.08);
        }

        .submit.sell {
          color: #fff;
          background: #d94c63;
          box-shadow: 0 8px 25px rgba(217,76,99,.08);
        }

        .demo-note {
          margin-top: 16px;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #182630;
          color: #52636f;
          background: #071016;
          font-size: 8px;
          line-height: 1.5;
          text-align: center;
        }

        .assets {
          border-top: 1px solid #172029;
          padding: 17px 18px;
        }

        .assets-title {
          color: #596a76;
          font-size: 9px;
          margin-bottom: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .asset {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .asset-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .asset-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #121c24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 900;
          color: #b7c6c1;
        }

        .asset-name {
          font-size: 9px;
          font-weight: 750;
        }

        .asset-value {
          color: #85949e;
          font-size: 9px;
        }

        .mobile-tabs {
          display: none;
        }

        .menu-dropdown {
          position: absolute;
          right: 22px;
          top: 58px;
          width: 150px;
          padding: 7px;
          border: 1px solid #1b2933;
          border-radius: 9px;
          background: #091118;
          box-shadow: 0 18px 50px rgba(0,0,0,.4);
        }

        .menu-item {
          width: 100%;
          text-align: left;
          padding: 9px;
          color: #81909b;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
        }

        .menu-item:hover {
          background: #101a22;
          color: #e4eeeb;
        }

        @media (max-width: 1150px) {
          .main-grid {
            grid-template-columns:
              minmax(0, 1fr)
              280px;
          }

          .order-column {
            display: none;
          }
        }

        @media (max-width: 800px) {
          .header {
            height: 60px;
            padding: 0 13px;
          }

          .brand {
            min-width: auto;
          }

          .nav {
            display: none;
          }

          .header-button {
            padding: 0 9px;
          }

          .marketbar {
            padding: 11px 13px;
            gap: 18px;
            min-height: 82px;
          }

          .market-stat:nth-of-type(n + 4) {
            display: none;
          }

          .market-switcher {
            display: none;
          }

          .main-grid {
            display: block;
            min-height: 0;
          }

          .left-column {
            border-right: 0;
          }

          .side-column {
            display: none;
            border-right: 0;
          }

          .order-column {
            display: none;
          }

          .left-column.mobile-book .chart-area,
          .left-column.mobile-trade .chart-area {
            display: none;
          }

          .left-column.mobile-book .bottom-panel,
          .left-column.mobile-trade .bottom-panel {
            display: none;
          }

          .chart-area {
            min-height: 500px;
            padding: 8px 8px 5px;
          }

          .chart-wrapper {
            min-height: 470px;
          }

          .chart {
            height: 410px;
          }

          .mobile-tabs {
            position: fixed;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            bottom: 0;
            left: 0;
            right: 0;
            height: 56px;
            z-index: 30;
            border-top: 1px solid #18242d;
            background: rgba(5,10,15,.97);
            backdrop-filter: blur(14px);
          }

          .mobile-tab {
            background: transparent;
            color: #596a77;
            font-size: 10px;
            font-weight: 750;
          }

          .mobile-tab.active {
            color: #2bdca7;
          }

          .mobile-book-panel,
          .mobile-trade-panel {
            display: block;
            padding-bottom: 60px;
          }

          .mobile-book-panel .side-column,
          .mobile-trade-panel .side-column {
            display: block;
            min-height: calc(100vh - 145px);
          }

          .desktop-only {
            display: none;
          }
        }

        @media (min-width: 801px) {
          .mobile-book-panel,
          .mobile-trade-panel {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .brand-name {
            font-size: 16px;
          }

          .header-actions .header-button:first-child {
            display: none;
          }

          .price-large {
            font-size: 17px;
          }

          .pair {
            min-width: 145px;
          }

          .chart-toolbar {
            padding: 0 9px;
          }

          .toolbar-right {
            display: none;
          }

          .chart-area {
            min-height: 465px;
          }

          .chart {
            height: 380px;
          }
        }
      `}</style>

      <main className="exchange">
        <header className="header">
          <div className="brand">
            <div className="brand-logo">C</div>

            <div className="brand-name">
              Crypto<span>Lab</span>
            </div>
          </div>

          <nav className="nav">
            <span className="active">Exchange</span>
            <span>Markets</span>
            <span>Assets</span>
            <span>Orders</span>
          </nav>

          <div className="header-actions">
            <button
              className="header-button"
              onClick={() =>
                alert(
                  "CryptoLab demo account.\nNo real funds are connected."
                )
              }
            >
              Demo Account
            </button>

            <button
              className="header-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <div className="profile">G</div>
          </div>

          {menuOpen && (
            <div className="menu-dropdown">
              <button className="menu-item">
                Account
              </button>
              <button className="menu-item">
                Security
              </button>
              <button className="menu-item">
                API
              </button>
              <button className="menu-item">
                Settings
              </button>
            </div>
          )}
        </header>

        <section className="marketbar">
          <div className="pair">
            <div className="pair-select">
              <div className="coin-icon">
                {market.base}
              </div>

              <div>
                <div className="pair-name">
                  {market.symbol}
                </div>
                <div className="pair-small">
                  CryptoLab Spot
                </div>
              </div>
            </div>
          </div>

          <div className="market-stat">
            <div className="market-stat-label">
              Last Price
            </div>
            <div className="price-large">
              {formatPrice(market.price)}
            </div>
          </div>

          <div className="market-stat">
            <div className="market-stat-label">
              24h Change
            </div>
            <div
              className={
                market.change >= 0
                  ? "green market-stat-value"
                  : "red market-stat-value"
              }
            >
              {market.change >= 0 ? "+" : ""}
              {market.change.toFixed(2)}%
            </div>
          </div>

          <div className="market-stat">
            <div className="market-stat-label">
              24h Volume
            </div>
            <div className="market-stat-value">
              {market.volume} USDT
            </div>
          </div>

          <div className="market-stat">
            <div className="market-stat-label">
              Mark Price
            </div>
            <div className="market-stat-value">
              {formatPrice(market.price * 0.9998)}
            </div>
          </div>

          <div className="market-switcher">
            {MARKETS.map((item) => (
              <button
                key={item.symbol}
                className={
                  item.symbol === selectedSymbol
                    ? "market-chip active"
                    : "market-chip"
                }
                onClick={() =>
                  setSelectedSymbol(item.symbol)
                }
              >
                {item.symbol}
              </button>
            ))}
          </div>
        </section>

        <div
          className={`main-grid ${
            mobilePanel === "book"
              ? "mobile-book"
              : mobilePanel === "trade"
              ? "mobile-trade"
              : ""
          }`}
        >
          <section className="left-column">
            <div className="chart-toolbar">
              <div className="toolbar-left">
                {TIMEFRAMES.map((item) => (
                  <button
                    key={item}
                    className={
                      item === timeframe
                        ? "tool-button active"
                        : "tool-button"
                    }
                    onClick={() =>
                      setTimeframe(item)
                    }
                  >
                    {item}
                  </button>
                ))}

                <button className="tool-button">
                  Indicators
                </button>
              </div>

              <div className="toolbar-right">
                <span>●</span>
                <span>TradingView style</span>
              </div>
            </div>

            <div className="chart-area">
              <CandleChart
                candles={candles}
                timeframe={timeframe}
              />
            </div>

            <div className="bottom-panel">
              <div className="panel-header">
                <button className="panel-tab active">
                  Positions
                </button>

                <button className="panel-tab">
                  Open Orders
                </button>

                <button className="panel-tab">
                  Order History
                </button>
              </div>

              <div className="positions-empty">
                No open positions
              </div>
            </div>
          </section>

          <aside className="side-column">
            <div className="side-title">
              Order Book
              <span>0.01</span>
            </div>

            <div className="book-head">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>

            {book.asks.map((row, index) => (
              <div className="book-row" key={`ask-${index}`}>
                <div
                  className="book-depth ask-depth"
                  style={{
                    width: `${35 + index * 7}%`,
                  }}
                />

                <span className="red">
                  {formatPrice(row.price)}
                </span>

                <span className="amount">
                  {row.amount.toFixed(4)}
                </span>

                <span className="total">
                  {Math.round(row.total).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="mid-price">
              <div className="mid-price-value">
                {formatPrice(market.price)}
              </div>

              <div className="mid-label">
                ≈ ${formatPrice(market.price)}
              </div>
            </div>

            {book.bids.map((row, index) => (
              <div className="book-row" key={`bid-${index}`}>
                <div
                  className="book-depth bid-depth"
                  style={{
                    width: `${32 + index * 7}%`,
                  }}
                />

                <span className="green">
                  {formatPrice(row.price)}
                </span>

                <span className="amount">
                  {row.amount.toFixed(4)}
                </span>

                <span className="total">
                  {Math.round(row.total).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="side-title trades-title">
              Recent Trades
              <span>Price / Amount</span>
            </div>

            {trades.map((trade, index) => (
              <div className="trade-row" key={index}>
                <span
                  className={
                    trade.side === "buy"
                      ? "buy"
                      : "sell"
                  }
                >
                  {formatPrice(trade.price)}
                </span>

                <span className="amount">
                  {trade.amount.toFixed(4)}
                </span>

                <span className="time">
                  {trade.time}
                </span>
              </div>
            ))}
          </aside>

          <aside className="order-column">
            <div className="order-header">
              Place Order
            </div>

            <div className="order-tabs">
              <button
                className={
                  side === "buy"
                    ? "order-side buy active"
                    : "order-side buy"
                }
                onClick={() => setSide("buy")}
              >
                Buy {market.base}
              </button>

              <button
                className={
                  side === "sell"
                    ? "order-side sell active"
                    : "order-side sell"
                }
                onClick={() => setSide("sell")}
              >
                Sell {market.base}
              </button>
            </div>

            <div className="order-types">
              {(["Market", "Limit", "Stop"] as const).map(
                (type) => (
                  <button
                    key={type}
                    className={
                      orderType === type
                        ? "order-type active"
                        : "order-type"
                    }
                    onClick={() =>
                      setOrderType(type)
                    }
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <div className="form">
              <div className="balance">
                <span>Available</span>
                <strong>
                  {available.toFixed(
                    side === "buy" ? 2 : 6
                  )}{" "}
                  {side === "buy"
                    ? "USDT"
                    : market.base}
                </strong>
              </div>

              {orderType !== "Market" && (
                <div className="field">
                  <div className="field-label">
                    <span>Price</span>
                  </div>

                  <div className="field-box">
                    <input
                      value={limitPrice}
                      onChange={(e) =>
                        setLimitPrice(
                          e.target.value
                        )
                      }
                      inputMode="decimal"
                    />

                    <span className="field-unit">
                      USDT
                    </span>
                  </div>
                </div>
              )}

              <div className="field">
                <div className="field-label">
                  <span>Amount</span>
                </div>

                <div className="field-box">
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="0.00"
                    inputMode="decimal"
                  />

                  <span className="field-unit">
                    {market.base}
                  </span>
                </div>
              </div>

              <div className="percentages">
                {[0.25, 0.5, 0.75, 1].map(
                  (percent) => (
                    <button
                      key={percent}
                      className="percentage"
                      onClick={() =>
                        setPercentage(percent)
                      }
                    >
                      {percent * 100}%
                    </button>
                  )
                )}
              </div>

              <div className="order-summary">
                <span>Price</span>
                <strong>
                  {formatPrice(orderPrice)} USDT
                </strong>
              </div>

              <div className="order-summary">
                <span>Amount</span>
                <strong>
                  {numericAmount
                    ? numericAmount.toFixed(6)
                    : "0.000000"}{" "}
                  {market.base}
                </strong>
              </div>

              <div className="order-summary">
                <span>Total</span>
                <strong>
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDT
                </strong>
              </div>

              <button
                className={
                  side === "sell"
                    ? "submit sell"
                    : "submit"
                }
                onClick={submitOrder}
              >
                {side === "buy"
                  ? `Buy ${market.base}`
                  : `Sell ${market.base}`}
              </button>

              <div className="demo-note">
                DEMO MODE
                <br />
                Orders are simulated locally.
                No real cryptocurrency or funds
                are transferred.
              </div>
            </div>

            <div className="assets">
              <div className="assets-title">
                Demo Assets
              </div>

              <div className="asset">
                <div className="asset-left">
                  <div className="asset-icon">
                    $
                  </div>
                  <span className="asset-name">
                    USDT
                  </span>
                </div>

                <span className="asset-value">
                  12,480.52
                </span>
              </div>

              <div className="asset">
                <div className="asset-left">
                  <div className="asset-icon">
                    ₿
                  </div>
                  <span className="asset-name">
                    BTC
                  </span>
                </div>

                <span className="asset-value">
                  0.184700
                </span>
              </div>

              <div className="asset">
                <div className="asset-left">
                  <div className="asset-icon">
                    Ξ
                  </div>
                  <span className="asset-name">
                    ETH
                  </span>
                </div>

                <span className="asset-value">
                  2.3400
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mobile-book-panel">
          <aside className="side-column">
            <div className="side-title">
              Order Book
              <span>0.01</span>
            </div>

            <div className="book-head">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>

            {book.asks.map((row, index) => (
              <div className="book-row" key={`m-ask-${index}`}>
                <div
                  className="book-depth ask-depth"
                  style={{
                    width: `${35 + index * 7}%`,
                  }}
                />

                <span className="red">
                  {formatPrice(row.price)}
                </span>

                <span className="amount">
                  {row.amount.toFixed(4)}
                </span>

                <span className="total">
                  {Math.round(row.total).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="mid-price">
              <div className="mid-price-value">
                {formatPrice(market.price)}
              </div>
              <div className="mid-label">
                Current Price
              </div>
            </div>

            {book.bids.map((row, index) => (
              <div className="book-row" key={`m-bid-${index}`}>
                <div
                  className="book-depth bid-depth"
                  style={{
                    width: `${32 + index * 7}%`,
                  }}
                />

                <span className="green">
                  {formatPrice(row.price)}
                </span>

                <span className="amount">
                  {row.amount.toFixed(4)}
                </span>

                <span className="total">
                  {Math.round(row.total).toLocaleString()}
                </span>
              </div>
            ))}
          </aside>
        </div>

        <div className="mobile-trade-panel">
          <aside className="side-column">
            <div className="side-title">
              Recent Trades
            </div>

            {trades.map((trade, index) => (
              <div
                className="trade-row"
                key={`mobile-${index}`}
              >
                <span
                  className={
                    trade.side === "buy"
                      ? "buy"
                      : "sell"
                  }
                >
                  {formatPrice(trade.price)}
                </span>

                <span className="amount">
                  {trade.amount.toFixed(4)}
                </span>

                <span className="time">
                  {trade.time}
                </span>
              </div>
            ))}
          </aside>
        </div>

        <div className="mobile-tabs">
          <button
            className={
              mobilePanel === "chart"
                ? "mobile-tab active"
                : "mobile-tab"
            }
            onClick={() =>
              setMobilePanel("chart")
            }
          >
            Chart
          </button>

          <button
            className={
              mobilePanel === "book"
                ? "mobile-tab active"
                : "mobile-tab"
            }
            onClick={() =>
              setMobilePanel("book")
            }
          >
            Order Book
          </button>

          <button
            className={
              mobilePanel === "trade"
                ? "mobile-tab active"
                : "mobile-tab"
            }
            onClick={() =>
              setMobilePanel("trade")
            }
          >
            Trades
          </button>
        </div>
      </main>
    </>
  );
}
