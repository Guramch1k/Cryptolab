"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
};

function Icon({
  type,
  size = 22,
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
        <path d="M3 18h2" />
        <path d="M8 15h2" />
        <path d="M13 19h2" />
        <path d="M18 13h2" />
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

function formatPrice(value: number) {
  if (value >= 1000) {
    return (
      "$" +
      value.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
    );
  }

  if (value >= 1) {
    return (
      "$" +
      value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  return (
    "$" +
    value.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  );
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) {
    return "$" + (value / 1_000_000_000_000).toFixed(2) + "T";
  }

  if (value >= 1_000_000_000) {
    return "$" + (value / 1_000_000_000).toFixed(2) + "B";
  }

  if (value >= 1_000_000) {
    return "$" + (value / 1_000_000).toFixed(2) + "M";
  }

  return "$" + value.toLocaleString("en-US");
}

export default function Home() {
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("CoinGecko request failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setCoins(data);

          setLastUpdated(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );

          setLoading(false);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMarkets();

    const interval = setInterval(loadMarkets, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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

        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(43,220,167,.08),
              transparent 34%
            ),
            #03070b;
          padding-bottom: 100px;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 34px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          background: rgba(3,7,11,.88);
          backdrop-filter: blur(20px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #06100d;
          background: #2bdca7;
          font-size: 18px;
          font-weight: 900;
          box-shadow: 0 0 24px rgba(43,220,167,.18);
        }

        .brand-text {
          color: #2bdca7;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .login-button,
        .signup-button {
          height: 38px;
          padding: 0 17px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s ease;
        }

        .login-button {
          color: #cbd5d2;
          background: transparent;
          border: 1px solid rgba(255,255,255,.12);
        }

        .login-button:hover {
          color: #2bdca7;
          border-color: rgba(43,220,167,.35);
          background: rgba(43,220,167,.04);
        }

        .signup-button {
          color: #06100d;
          background: #2bdca7;
          border: 1px solid #2bdca7;
          box-shadow: 0 0 20px rgba(43,220,167,.12);
        }

        .signup-button:hover {
          background: #45e5b5;
          border-color: #45e5b5;
          box-shadow: 0 0 28px rgba(43,220,167,.22);
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding-top: 38px;
        }

        .hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1;
          letter-spacing: -2px;
          color: #eef5f3;
        }

        .hero h1 span {
          color: #2bdca7;
        }

        .hero p {
          margin: 11px 0 0;
          color: #66757b;
          font-size: 13px;
        }

        .updated {
          color: #506067;
          font-size: 11px;
          white-space: nowrap;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }

        .stat {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 16px;
          background: rgba(10,17,22,.72);
          box-shadow: 0 15px 45px rgba(0,0,0,.12);
        }

        .stat-label {
          color: #627078;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .stat-value {
          margin-top: 9px;
          color: #eef5f3;
          font-size: 21px;
          font-weight: 750;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .section-title h2 {
          margin: 0;
          color: #eef5f3;
          font-size: 17px;
        }

        .section-title span {
          color: #526169;
          font-size: 11px;
        }

        .market {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 18px;
          background: rgba(7,13,18,.84);
        }

        .market-header,
        .coin-row {
          display: grid;
          grid-template-columns:
            60px
            minmax(190px, 1.7fr)
            minmax(130px, 1fr)
            minmax(120px, .8fr)
            minmax(120px, .8fr)
            100px;
          align-items: center;
          column-gap: 15px;
          padding: 0 22px;
        }

        .market-header {
          min-height: 44px;
          color: #536169;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .coin-row {
          min-height: 74px;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: background .2s ease;
        }

        .coin-row:last-child {
          border-bottom: 0;
        }

        .coin-row:hover {
          background: rgba(43,220,167,.025);
        }

        .rank {
          color: #4e5c63;
          font-size: 12px;
        }

        .coin-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coin-logo {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #111a1f;
          object-fit: cover;
        }

        .coin-title {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .coin-main {
          color: #eaf2ef;
          font-size: 13px;
          font-weight: 700;
        }

        .coin-symbol {
          color: #536169;
          font-size: 10px;
          text-transform: uppercase;
        }

        .price {
          color: #eef5f3;
          font-size: 13px;
          font-weight: 650;
        }

        .change {
          font-size: 12px;
          font-weight: 700;
        }

        .positive {
          color: #2bdca7;
        }

        .negative {
          color: #ff6679;
        }

        .market-cap {
          color: #91a09f;
          font-size: 12px;
        }

        .trade-button {
          border: 1px solid rgba(43,220,167,.2);
          border-radius: 9px;
          padding: 8px 12px;
          color: #2bdca7;
          background: rgba(43,220,167,.06);
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          transition: all .2s ease;
        }

        .trade-button:hover {
          background: rgba(43,220,167,.12);
          border-color: rgba(43,220,167,.4);
        }

        .loading {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #536169;
          font-size: 12px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          border: 2px solid rgba(43,220,167,.15);
          border-top-color: #2bdca7;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .bottom-nav {
          position: fixed;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          z-index: 50;
          width: min(620px, calc(100% - 28px));
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 8px;
          border: 1px solid rgba(43,220,167,.1);
          border-radius: 20px;
          background: rgba(6,13,17,.92);
          backdrop-filter: blur(22px);
          box-shadow:
            0 20px 60px rgba(0,0,0,.45),
            0 0 40px rgba(43,220,167,.04);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          min-height: 55px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: rgba(43,220,167,.48);
          cursor: pointer;
          transition: all .2s ease;
        }

        .nav-item:hover {
          color: rgba(43,220,167,.8);
          background: rgba(43,220,167,.04);
        }

        .nav-item.active {
          color: #2bdca7;
          background: rgba(43,220,167,.08);
          box-shadow: inset 0 0 20px rgba(43,220,167,.025);
        }

        .nav-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .3px;
        }

        @media (max-width: 850px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .market-header {
            display: none;
          }

          .coin-row {
            grid-template-columns:
              30px
              minmax(150px, 1fr)
              minmax(90px, .8fr)
              75px;
          }

          .coin-row > :nth-child(4),
          .coin-row > :nth-child(5) {
            display: none;
          }

          .trade-button {
            padding: 7px 9px;
          }
        }

        @media (max-width: 600px) {
          .topbar {
            height: 62px;
            padding: 0 17px;
          }

          .brand-text {
            font-size: 18px;
          }

          .brand-logo {
            width: 30px;
            height: 30px;
            font-size: 16px;
          }

          .auth-buttons {
            gap: 6px;
          }

          .login-button,
          .signup-button {
            height: 34px;
            padding: 0 11px;
            font-size: 10px;
          }

          .container {
            width: calc(100% - 24px);
            padding-top: 26px;
          }

          .hero {
            display: block;
          }

          .hero h1 {
            font-size: 35px;
          }

          .updated {
            display: block;
            margin-top: 12px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 9px;
          }

          .stat {
            padding: 15px;
          }

          .stat-value {
            font-size: 16px;
          }

          .market {
            border-radius: 15px;
          }

          .coin-row {
            grid-template-columns:
              24px
              minmax(120px, 1fr)
              minmax(85px, auto)
              62px;
            padding: 0 12px;
            column-gap: 7px;
            min-height: 68px;
          }

          .coin-logo {
            width: 30px;
            height: 30px;
          }

          .coin-main {
            font-size: 12px;
          }

          .coin-symbol {
            font-size: 9px;
          }

          .price {
            font-size: 11px;
          }

          .change {
            font-size: 10px;
          }

          .trade-button {
            padding: 6px 7px;
            font-size: 9px;
          }

          .bottom-nav {
            bottom: 10px;
            width: calc(100% - 18px);
            border-radius: 18px;
          }

          .nav-item {
            min-height: 50px;
          }

          .nav-label {
            font-size: 8px;
          }
        }
      `}</style>

      <main className="page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">C</div>
            <div className="brand-text">CryptoLab</div>
          </div>

          <div className="auth-buttons">
            <button
              className="login-button"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>

            <button
              className="signup-button"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        </header>

        <div className="container">
          <section className="hero">
            <div>
              <h1>
                Crypto<span> Markets</span>
              </h1>

              <p>
                Real-time cryptocurrency market overview
              </p>
            </div>

            <div className="updated">
              {lastUpdated
                ? `Updated ${lastUpdated}`
                : "Updating prices..."}
            </div>
          </section>

          <section className="stats">
            <div className="stat">
              <div className="stat-label">
                Tracked Assets
              </div>

              <div className="stat-value">
                10
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Market
              </div>

              <div className="stat-value">
                Live
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Update
              </div>

              <div className="stat-value">
                30 sec
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Exchange
              </div>

              <div className="stat-value">
                CryptoLab
              </div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Top cryptocurrencies</h2>
              <span>By market cap</span>
            </div>

            <div className="market">
              <div className="market-header">
                <div>#</div>
                <div>Asset</div>
                <div>Price</div>
                <div>24h</div>
                <div>Market Cap</div>
                <div />
              </div>

              {loading ? (
                <div className="loading">
                  <span className="spinner" />
                  Loading market data...
                </div>
              ) : coins.length === 0 ? (
                <div className="loading">
                  Market data temporarily unavailable
                </div>
              ) : (
                coins.map((coin) => {
                  const positive =
                    coin.price_change_percentage_24h >= 0;

                  return (
                    <div
                      className="coin-row"
                      key={coin.id}
                    >
                      <div className="rank">
                        {coin.market_cap_rank}
                      </div>

                      <div className="coin-name">
                        <img
                          className="coin-logo"
                          src={coin.image}
                          alt={coin.name}
                        />

                        <div className="coin-title">
                          <div className="coin-main">
                            {coin.name}
                          </div>

                          <div className="coin-symbol">
                            {coin.symbol}/USDT
                          </div>
                        </div>
                      </div>

                      <div className="price">
                        {formatPrice(coin.current_price)}
                      </div>

                      <div
                        className={`change ${
                          positive
                            ? "positive"
                            : "negative"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {coin.price_change_percentage_24h?.toFixed(
                          2
                        )}
                        %
                      </div>

                      <div className="market-cap">
                        {formatMarketCap(coin.market_cap)}
                      </div>

                      <div>
                        <button
                          className="trade-button"
                          onClick={() =>
                            router.push(
                              `/exchange?symbol=${coin.symbol.toUpperCase()}`
                            )
                          }
                        >
                          Trade
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <nav className="bottom-nav">
          <button
            className="nav-item active"
            onClick={() => router.push("/")}
          >
            <Icon type="home" />
            <span className="nav-label">Home</span>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <Icon type="markets" />
            <span className="nav-label">Markets</span>
          </button>

          <button
            className="nav-item"
            onClick={() => router.push("/exchange")}
          >
            <Icon type="trade" />
            <span className="nav-label">Trade</span>
          </button>

          <button
            className="nav-item"
            onClick={() => ={() => router.push("/futures")}
            }
          >
            <Icon type="futures" />
            <span className="nav-label">Futures</span>
          </button>

          <button
            className="nav-item"
            onClick={() => router.push("/assets")}
            }
          >
            <Icon type="assets" />
            <span className="nav-label">Assets</span>
          </button>
        </nav>
      </main>
    </>
  );
}
