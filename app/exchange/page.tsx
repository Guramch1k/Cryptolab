"use client";

import { useEffect, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
};

const initialCoins: Coin[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    icon: "bitcoin",
    current_price: 109842,
    price_change_percentage_24h: 2.84,
    market_cap: 2180000000000,
    market_cap_rank: 1,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    icon: "ethereum",
    current_price: 3942.15,
    price_change_percentage_24h: 3.17,
    market_cap: 475000000000,
    market_cap_rank: 2,
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    icon: "tether",
    current_price: 1,
    price_change_percentage_24h: 0.01,
    market_cap: 145000000000,
    market_cap_rank: 3,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    icon: "binance-coin",
    current_price: 712.42,
    price_change_percentage_24h: 1.92,
    market_cap: 105000000000,
    market_cap_rank: 4,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    icon: "solana",
    current_price: 221.64,
    price_change_percentage_24h: 4.21,
    market_cap: 108000000000,
    market_cap_rank: 5,
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USDC",
    icon: "usd-coin",
    current_price: 1,
    price_change_percentage_24h: -0.01,
    market_cap: 56000000000,
    market_cap_rank: 6,
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    icon: "xrp",
    current_price: 2.84,
    price_change_percentage_24h: 2.63,
    market_cap: 166000000000,
    market_cap_rank: 7,
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    icon: "dogecoin",
    current_price: 0.234,
    price_change_percentage_24h: 1.46,
    market_cap: 35000000000,
    market_cap_rank: 8,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    icon: "cardano",
    current_price: 0.842,
    price_change_percentage_24h: 2.18,
    market_cap: 30000000000,
    market_cap_rank: 9,
  },
  {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    icon: "avalanche",
    current_price: 42.18,
    price_change_percentage_24h: 3.74,
    market_cap: 17000000000,
    market_cap_rank: 10,
  },
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
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "home") {
    return (
      <svg {...common}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }

  if (type === "markets") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </svg>
    );
  }

  if (type === "trade") {
    return (
      <svg {...common}>
        <path d="M7 7h13" />
        <path d="m17 3 4 4-4 4" />
        <path d="M17 17H4" />
        <path d="m7 13-4 4 4 4" />
      </svg>
    );
  }

  if (type === "futures") {
    return (
      <svg {...common}>
        <path d="M4 18V6" />
        <path d="M4 18h16" />
        <path d="M7 14l3-3 3 2 4-6" />
        <path d="M17 7h3v3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15h4" />
      <path d="M15 15h2" />
      <path d="M7 9h10" />
    </svg>
  );
}

function formatPrice(price: number) {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  return price.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  return `$${value.toLocaleString("en-US")}`;
}

export default function HomePage() {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const symbols = initialCoins.map(
      (coin) => coin.symbol.toLowerCase() + "usdt"
    );

    const streams = symbols
      .map((symbol) => symbol + "@ticker")
      .join("/");

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/stream?streams=" + streams
    );

    ws.onopen = () => {
      setLive(true);
    };

    ws.onclose = () => {
      setLive(false);
    };

    ws.onerror = () => {
      setLive(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const ticker = message?.data;

        if (!ticker?.s || !ticker?.c) {
          return;
        }

        const symbol = ticker.s
          .replace("USDT", "")
          .toLowerCase();

        const price = Number(ticker.c);
        const change = Number(ticker.P);

        if (!Number.isFinite(price)) {
          return;
        }

        setCoins((current) =>
          current.map((coin) =>
            coin.symbol.toLowerCase() === symbol
              ? {
                  ...coin,
                  current_price: price,
                  price_change_percentage_24h: Number.isFinite(change)
                    ? change
                    : coin.price_change_percentage_24h,
                }
              : coin
          )
        );
      } catch {
        // Ignore malformed websocket messages
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <main className="page">
      <header className="header">
        <a href="/exchange" className="brand">
          <div className="brand-mark">C</div>
          <span>CryptoLab</span>
        </a>

        <div className="header-actions">
          <a href="/login" className="login-button">
            Log In
          </a>

          <a href="/signup" className="signup-button">
            Sign Up
          </a>
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">
            CRYPTOLAB EXCHANGE
          </div>

          <h1>Crypto Exchange</h1>

          <p>
            Trade cryptocurrencies on CryptoLab
          </p>
        </div>

        <div className="market-status">
          <div className="status-label">
            Market snapshot
          </div>

          <div
            className={`live-status ${
              live ? "live" : "connecting"
            }`}
          >
            <span className="status-dot"></span>

            {live
              ? "Live market"
              : "Connecting to market..."}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Trading Pairs</span>
          <strong>10</strong>
        </div>

        <div className="stat-card">
          <span>Market Data</span>
          <strong>Live</strong>
        </div>

        <div className="stat-card">
          <span>Status</span>
          <strong className="online">
            Online
          </strong>
        </div>

        <div className="stat-card">
          <span>Exchange</span>
          <strong>CryptoLab</strong>
        </div>
      </section>

      <section className="markets-section">
        <div className="section-header">
          <div>
            <h2>Markets</h2>
            <p>Live cryptocurrency prices</p>
          </div>

          <a href="/trade" className="view-all">
            Trade
          </a>
        </div>

        <div className="market-list">
          {coins.map((coin) => {
            const positive =
              coin.price_change_percentage_24h >= 0;

            return (
              <div
                className="coin-row"
                key={coin.id}
              >
                <div className="coin-info">
                  <img
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                    alt={coin.name}
                    className="coin-logo"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";

                      const fallback =
                        e.currentTarget
                          .nextElementSibling as HTMLElement | null;

                      if (fallback) {
                        fallback.style.display =
                          "flex";
                      }
                    }}
                  />

                  <div className="coin-fallback">
                    {coin.symbol.charAt(0)}
                  </div>

                  <div className="coin-name">
                    <strong>
                      {coin.symbol}
                    </strong>

                    <span>
                      {coin.name}
                    </span>
                  </div>
                </div>

                <div className="coin-price">
                  <span>
                    ${formatPrice(
                      coin.current_price
                    )}
                  </span>
                </div>

                <div
                  className={`coin-change ${
                    positive
                      ? "positive"
                      : "negative"
                  }`}
                >
                  {positive ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </div>

                <div className="coin-market-cap">
                  {formatMarketCap(
                    coin.market_cap
                  )}
                </div>

                <a
                  href={`/trade?symbol=${coin.symbol.toUpperCase()}`}
                  className="trade-button"
                >
                  Trade
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <div className="bottom-space"></div>

      <nav className="bottom-nav">
        <a
          className="nav-item active"
          href="/exchange"
        >
          <Icon type="home" />
          <span>Home</span>
        </a>

        <a
          className="nav-item"
          href="/exchange"
        >
          <Icon type="markets" />
          <span>Markets</span>
        </a>

        <a
          className="nav-item"
          href="/trade"
        >
          <Icon type="trade" />
          <span>Trade</span>
        </a>

        <a
          className="nav-item"
          href="/futures"
        >
          <Icon type="futures" />
          <span>Futures</span>
        </a>

        <a
          className="nav-item"
          href="/assets"
        >
          <Icon type="assets" />
          <span>Assets</span>
        </a>
      </nav>

    <style jsx global>{`
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-width: 100% !important;
    min-height: 100%;
    background: #05080d !important;
  }

  body {
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }

  .page {
    position: relative;
    width: 100vw !important;
    max-width: none !important;
    min-width: 100vw !important;
    min-height: 100vh;
    min-height: 100dvh;
    margin: 0 !important;
    padding: 0 0 100px 0;
    background: #05080d;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  }

  .header,
  .hero,
  .stats,
  .markets-section {
    width: 100% !important;
    max-width: none !important;
  }

  .header {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    margin: 0;
    background: #05080d;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    color: white;
    text-decoration: none;
    font-size: 21px;
    font-weight: 800;
  }

  .brand-mark {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2bdca7;
    color: #03100b;
    font-size: 19px;
    font-weight: 900;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .login-button,
  .signup-button {
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 17px;
    border-radius: 9px;
  }

  .login-button {
    color: white;
    background: #0b1117;
  }

  .signup-button {
    color: #03100b;
    background: #2bdca7;
  }

  .hero {
    margin: 0;
    padding: 70px 40px 35px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 40px;
  }

  .eyebrow {
    color: #2bdca7;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    margin-bottom: 14px;
  }

  .hero h1 {
    margin: 0;
    font-size: clamp(38px, 5vw, 58px);
    line-height: 1;
  }

  .hero p {
    margin: 17px 0 0;
    color: #7d8794;
    font-size: 17px;
  }

  .market-status {
    min-width: 190px;
    text-align: right;
  }

  .status-label {
    color: #6f7986;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .live-status {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    font-size: 14px;
    font-weight: 700;
  }

  .live-status.live {
    color: #2bdca7;
  }

  .live-status.connecting {
    color: #e6b94a;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  .stats {
    margin: 0;
    padding: 0 40px 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .stat-card {
    background: #0b1117;
    border-radius: 13px;
    padding: 20px;
  }

  .stat-card span {
    display: block;
    color: #707b88;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .stat-card strong {
    font-size: 20px;
  }

  .online {
    color: #2bdca7;
  }

  .markets-section {
    margin: 0;
    padding: 0 40px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 18px 0;
  }

  .section-header h2 {
    margin: 0;
    font-size: 26px;
  }

  .section-header p {
    margin: 7px 0 0;
    color: #707b88;
    font-size: 13px;
  }

  .view-all {
    color: #2bdca7;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
  }

  .market-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .coin-row {
    width: 100%;
    min-height: 72px;
    padding: 12px 18px;
    background: #0b1117;
    border-radius: 13px;
    display: grid;
    grid-template-columns:
      minmax(220px, 2fr)
      minmax(130px, 1fr)
      minmax(100px, 0.8fr)
      minmax(120px, 1fr)
      78px;
    align-items: center;
    gap: 18px;
  }

  .coin-info {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
  }

  .coin-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .coin-fallback {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background: #18212b;
    color: white;
    font-weight: 800;
  }

  .coin-name {
    min-width: 0;
  }

  .coin-name strong {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .coin-name span {
    display: block;
    color: #6f7a87;
    font-size: 12px;
  }

  .coin-price {
    font-weight: 700;
  }

  .coin-change {
    font-weight: 700;
  }

  .positive {
    color: #2bdca7;
  }

  .negative {
    color: #ff5f67;
  }

  .coin-market-cap {
    color: #aeb7c2;
    font-size: 14px;
  }

  .trade-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 13px;
    border-radius: 8px;
    color: #2bdca7;
    background: #0b1714;
    text-decoration: none;
    font-size: 12px;
    font-weight: 800;
  }

  .bottom-space {
    height: 25px;
  }

  .bottom-nav {
    position: fixed;
    z-index: 100;
    left: 50%;
    bottom: 18px;
    transform: translateX(-50%);
    width: min(680px, calc(100vw - 24px));
    height: 66px;
    background: rgba(11, 17, 23, 0.96);
    border-radius: 17px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    padding: 5px;
  }

  .nav-item {
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #6e7885;
    text-decoration: none;
    font-size: 10px;
    font-weight: 700;
    border-radius: 12px;
  }

  .nav-item.active {
    color: #2bdca7;
    background: #10231e;
  }

  @media (max-width: 800px) {
    .header {
      padding: 0 20px;
    }

    .hero {
      padding: 48px 20px 30px;
      flex-direction: column;
      align-items: flex-start;
    }

    .market-status {
      text-align: left;
    }

    .live-status {
      justify-content: flex-start;
    }

    .stats {
      padding-left: 20px;
      padding-right: 20px;
      grid-template-columns: repeat(2, 1fr);
    }

    .markets-section {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  @media (max-width: 600px) {
    .header {
      height: 68px;
    }

    .hero {
      padding: 42px 18px 28px;
    }

    .hero h1 {
      font-size: 40px;
    }

    .stats {
      padding-left: 18px;
      padding-right: 18px;
    }

    .markets-section {
      padding-left: 18px;
      padding-right: 18px;
    }

    .coin-row {
      grid-template-columns:
        minmax(125px, 1.5fr)
        minmax(85px, 1fr)
        minmax(65px, 0.7fr)
        58px;
      gap: 8px;
    }
  }
`}</style>
    </main>
  );
}
