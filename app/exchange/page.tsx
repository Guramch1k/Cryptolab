"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
};

function formatPrice(price: number) {
  if (price >= 1000) {
    return `$${price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  }

  if (price >= 1) {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })}`;
}

function formatMoney(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  return `$${value.toLocaleString("en-US")}`;
}

function formatPercent(value?: number) {
  if (value === undefined || value === null) return "—";

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function MiniChart({
  data,
  positive,
}: {
  data?: number[];
  positive: boolean;
}) {
  if (!data || data.length < 2) {
    return <div className="chart-empty">—</div>;
  }

  const width = 150;
  const height = 44;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="150"
      height="44"
      viewBox="0 0 150 44"
      className={positive ? "mini-chart positive" : "mini-chart negative"}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  async function loadMarkets() {
    try {
      setError("");

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Market data request failed");
      }

      const data = await response.json();

      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Unable to load market data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarkets();

    const interval = setInterval(() => {
      loadMarkets();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const totalMarketCap = coins.reduce(
    (sum, coin) => sum + coin.market_cap,
    0
  );

  const totalVolume = coins.reduce(
    (sum, coin) => sum + coin.total_volume,
    0
  );

  const btc = coins.find(
    (coin) => coin.symbol.toLowerCase() === "btc"
  );

  /* =========================
     ORIGINAL GREEN SPLASH
  ========================= */

  if (showSplash) {
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

          .splash {
            min-height: 100vh;
            width: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(
                circle at 50% 45%,
                rgba(38, 222, 169, .14),
                transparent 27%
              ),
              #03070b;
            color: #eef5f3;
            font-family:
              Inter,
              Arial,
              sans-serif;
          }

          .grid {
            position: absolute;
            inset: 0;
            opacity: .2;
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
            background-size: 55px 55px;
            mask-image:
              linear-gradient(
                to bottom,
                transparent,
                black 25%,
                black 75%,
                transparent
              );
          }

          .circle {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            border: 1px solid rgba(42, 224, 171, .07);
            box-shadow:
              0 0 100px rgba(42,224,171,.05),
              inset 0 0 100px rgba(42,224,171,.03);
            animation: pulse 3s ease-in-out infinite;
          }

          .circle::before {
            content: "";
            position: absolute;
            inset: 80px;
            border-radius: 50%;
            border: 1px solid rgba(42,224,171,.07);
          }

          .circle::after {
            content: "";
            position: absolute;
            inset: 160px;
            border-radius: 50%;
            border: 1px solid rgba(42,224,171,.07);
          }

          .content {
            position: relative;
            z-index: 2;
            text-align: center;
            animation: appear .7s ease-out both;
          }

          .logo {
            width: 92px;
            height: 92px;
            padding: 2px;
            margin: 0 auto 26px;
            border-radius: 27px;
            background:
              linear-gradient(
                145deg,
                #3be8b4,
                #11745b
              );
            box-shadow:
              0 0 65px rgba(42,224,171,.22),
              0 15px 50px rgba(0,0,0,.4);
          }

          .logo-inner {
            width: 100%;
            height: 100%;
            border-radius: 25px;
            background: #07100f;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #30e2ad;
            font-size: 48px;
            font-weight: 900;
          }

          .title {
            font-size: clamp(48px, 8vw, 76px);
            line-height: 1;
            letter-spacing: -4px;
            font-weight: 850;
          }

          .title span {
            color: #2bdca7;
          }

          .subtitle {
            margin-top: 10px;
            color: #697889;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 5px;
          }

          .loader {
            width: 180px;
            height: 3px;
            margin: 38px auto 14px;
            overflow: hidden;
            border-radius: 20px;
            background: #131c25;
          }

          .loader-bar {
            width: 45%;
            height: 100%;
            border-radius: 20px;
            background: #2bdca7;
            box-shadow: 0 0 14px #2bdca7;
            animation: loading 1.25s ease-in-out infinite;
          }

          .loading-text {
            color: #465466;
            font-size: 8px;
            letter-spacing: 2.5px;
          }

          .fade {
            position: absolute;
            inset: 0;
            background: #03070b;
            z-index: 10;
            pointer-events: none;
            opacity: 0;
            animation: fadeout 1.7s ease forwards;
          }

          @keyframes appear {
            from {
              opacity: 0;
              transform: translateY(12px) scale(.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(.98);
              opacity: .7;
            }

            50% {
              transform: scale(1.03);
              opacity: 1;
            }
          }

          @keyframes loading {
            0% {
              transform: translateX(-150%);
            }

            100% {
              transform: translateX(330%);
            }
          }

          @keyframes fadeout {
            0%, 75% {
              opacity: 0;
            }

            100% {
              opacity: 1;
            }
          }

          @media (max-width: 600px) {
            .circle {
              width: 350px;
              height: 350px;
            }

            .circle::before {
              inset: 55px;
            }

            .circle::after {
              inset: 110px;
            }

            .logo {
              width: 80px;
              height: 80px;
              border-radius: 23px;
            }

            .logo-inner {
              border-radius: 21px;
              font-size: 42px;
            }

            .subtitle {
              font-size: 8px;
              letter-spacing: 3px;
            }
          }
        `}</style>

        <main className="splash">
          <div className="grid" />
          <div className="circle" />

          <div className="content">
            <div className="logo">
              <div className="logo-inner">
                C
              </div>
            </div>

            <div className="title">
              Crypto<span>Lab</span>
            </div>

            <div className="subtitle">
              DIGITAL ASSET EXCHANGE
            </div>

            <div className="loader">
              <div className="loader-bar" />
            </div>

            <div className="loading-text">
              INITIALIZING TRADING TERMINAL
            </div>
          </div>

          <div className="fade" />
        </main>
      </>
    );
  }

  /* =========================
     MAIN HOME
  ========================= */

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* HEADER */}

      <header className="header">
        <Link href="/" className="brand">
          <div className="brand-symbol">
            C
          </div>

          <div className="brand-text">
            Crypto<span>Lab</span>
          </div>
        </Link>

        <div className="header-actions">
          <button className="login-button">
            Log In
          </button>

          <button className="signup-button">
            Sign Up
          </button>
        </div>
      </header>

      {/* HOME CONTENT */}

      {activeTab === "home" && (
        <>
          <section className="hero">
            <div className="eyebrow">
              <span className="live-dot" />
              LIVE MARKET DATA
            </div>

            <h1>
              Crypto markets,
              <br />
              <span>in real time.</span>
            </h1>

            <p>
              Track the world's leading cryptocurrencies
              by market capitalization.
            </p>
          </section>

          <section className="stats">
            <div className="stat-card">
              <div className="stat-label">
                TOP 10 MARKET CAP
              </div>

              <div className="stat-value">
                {loading
                  ? "Loading..."
                  : formatMoney(totalMarketCap)}
              </div>

              <div className="stat-description">
                Combined market capitalization
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                24H VOLUME
              </div>

              <div className="stat-value">
                {loading
                  ? "Loading..."
                  : formatMoney(totalVolume)}
              </div>

              <div className="stat-description">
                Trading volume across top markets
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                BITCOIN
              </div>

              <div className="stat-value">
                {btc
                  ? formatPrice(btc.current_price)
                  : "—"}
              </div>

              <div
                className={
                  btc &&
                  btc.price_change_percentage_24h >= 0
                    ? "stat-change positive"
                    : "stat-change negative"
                }
              >
                {btc
                  ? formatPercent(
                      btc.price_change_percentage_24h
                    )
                  : "—"}

                <span> 24h</span>
              </div>
            </div>
          </section>

          <section className="markets-section">
            <div className="section-header">
              <div>
                <div className="section-eyebrow">
                  MARKET
                </div>

                <h2>
                  Top cryptocurrencies
                </h2>

                <p>
                  Ranked by market capitalization
                </p>
              </div>

              <div className="updated">
                <span className="live-dot" />

                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}`
                  : "Updating..."}
              </div>
            </div>

            <div className="market-table">
              <div className="table-header">
                <div>#</div>
                <div>Asset</div>
                <div>Price</div>
                <div>1H</div>
                <div>24H</div>
                <div>7D</div>
                <div>7D Chart</div>
                <div>Market Cap</div>
                <div />
              </div>

              {loading &&
                Array.from({ length: 10 }).map(
                  (_, index) => (
                    <div
                      className="coin-row"
                      key={index}
                    >
                      <div className="skeleton small" />

                      <div className="asset-loading">
                        <div className="skeleton avatar" />
                        <div className="skeleton name" />
                      </div>

                      <div className="skeleton price" />
                      <div className="skeleton percent" />
                      <div className="skeleton percent" />
                      <div className="skeleton percent" />
                      <div className="skeleton chart" />
                      <div className="skeleton marketcap" />
                      <div />
                    </div>
                  )
                )}

              {!loading &&
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

                      <div className="asset">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="coin-icon"
                        />

                        <div>
                          <div className="coin-name">
                            {coin.name}
                          </div>

                          <div className="coin-symbol">
                            {coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="coin-price">
                        {formatPrice(
                          coin.current_price
                        )}
                      </div>

                      <div
                        className={
                          (coin.price_change_percentage_1h_in_currency ??
                            0) >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatPercent(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>

                      <div
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatPercent(
                          coin.price_change_percentage_24h
                        )}
                      </div>

                      <div
                        className={
                          (coin.price_change_percentage_7d_in_currency ??
                            0) >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatPercent(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>

                      <div className="chart-wrapper">
                        <MiniChart
                          data={
                            coin.sparkline_in_7d?.price
                          }
                          positive={positive}
                        />
                      </div>

                      <div className="market-cap">
                        {formatMoney(
                          coin.market_cap
                        )}
                      </div>

                      <Link
                        href="/exchange"
                        className="trade-button"
                      >
                        Trade
                      </Link>
                    </div>
                  );
                })}

              {error && (
                <div className="error-box">
                  <strong>
                    Market data unavailable
                  </strong>

                  <span>{error}</span>

                  <button onClick={loadMarkets}>
                    Try again
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* MARKETS */}

      {activeTab === "markets" && (
        <section className="simple-page">
          <div className="simple-eyebrow">
            MARKET
          </div>

          <h1>Markets</h1>

          <p>
            Explore the top cryptocurrencies by
            market capitalization.
          </p>

          <div className="mobile-market-list">
            {coins.map((coin) => (
              <Link
                href="/exchange"
                className="mobile-market-card"
                key={coin.id}
              >
                <div className="mobile-coin-left">
                  <img
                    src={coin.image}
                    alt={coin.name}
                  />

                  <div>
                    <strong>
                      {coin.name}
                    </strong>

                    <span>
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mobile-coin-right">
                  <strong>
                    {formatPrice(
                      coin.current_price
                    )}
                  </strong>

                  <span
                    className={
                      coin.price_change_percentage_24h >=
                      0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {formatPercent(
                      coin.price_change_percentage_24h
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FUTURES */}

      {activeTab === "futures" && (
        <section className="simple-page centered-page">
          <div className="feature-icon">↗</div>

          <div className="simple-eyebrow">
            DERIVATIVES
          </div>

          <h1>Futures</h1>

          <p>
            CryptoLab Futures is coming soon.
          </p>

          <div className="coming-soon">
            COMING SOON
          </div>
        </section>
      )}

      {/* ASSETS */}

      {activeTab === "assets" && (
        <section className="simple-page">
          <div className="simple-eyebrow">
            PORTFOLIO
          </div>

          <h1>Your Assets</h1>

          <div className="balance-card">
            <span>Total Balance</span>

            <strong>
              $0.00
            </strong>

            <small>
              Demo account
            </small>
          </div>

          <div className="asset-empty">
            <div className="empty-icon">
              C
            </div>

            <strong>
              No assets yet
            </strong>

            <p>
              Your cryptocurrency balances will
              appear here.
            </p>
          </div>
        </section>
      )}

      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-nav">
        <button
          className={
            activeTab === "home"
              ? "bottom-item active"
              : "bottom-item"
          }
          onClick={() => setActiveTab("home")}
        >
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>

        <button
          className={
            activeTab === "markets"
              ? "bottom-item active"
              : "bottom-item"
          }
          onClick={() => setActiveTab("markets")}
        >
          <span className="nav-icon">◈</span>
          <span>Markets</span>
        </button>

        <Link
          href="/exchange"
          className="bottom-item trade-nav"
        >
          <span className="trade-circle">
            ⇄
          </span>

          <span>Trade</span>
        </Link>

        <button
          className={
            activeTab === "futures"
              ? "bottom-item active"
              : "bottom-item"
          }
          onClick={() => setActiveTab("futures")}
        >
          <span className="nav-icon">↗</span>
          <span>Futures</span>
        </button>

        <button
          className={
            activeTab === "assets"
              ? "bottom-item active"
              : "bottom-item"
          }
          onClick={() => setActiveTab("assets")}
        >
          <span className="nav-icon">▣</span>
          <span>Assets</span>
        </button>
      </nav>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        :global(html),
        :global(body) {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background: #03070b;
        }

        :global(body) {
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(42,224,171,0.075),
              transparent 30%
            ),
            #03070b;
          color: #eef5f3;
          font-family:
            Inter,
            Arial,
            sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 100px;
        }

        .background-glow {
          position: fixed;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(160px);
          pointer-events: none;
          opacity: 0.06;
          z-index: 0;
        }

        .glow-one {
          top: -300px;
          left: -220px;
          background: #2bdca7;
        }

        .glow-two {
          right: -300px;
          bottom: -300px;
          background: #16a77e;
        }

        /* HEADER */

        .header {
          position: sticky;
          top: 0;
          z-index: 20;
          width: 100%;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid
            rgba(255,255,255,0.055);
          background: rgba(3,7,11,0.82);
          backdrop-filter: blur(22px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
        }

        .brand-symbol {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              145deg,
              #3be8b4,
              #11745b
            );
          color: #07100f;
          font-size: 20px;
          font-weight: 900;
          box-shadow:
            0 0 25px rgba(42,224,171,0.18);
        }

        .brand-text {
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.7px;
        }

        .brand-text span {
          color: #2bdca7;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-button,
        .signup-button {
          height: 36px;
          padding: 0 15px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-button {
          color: #aab5c1;
          background: transparent;
          border: 1px solid
            rgba(255,255,255,0.1);
        }

        .login-button:hover {
          color: white;
          border-color:
            rgba(43,220,167,0.35);
        }

        .signup-button {
          color: #03100c;
          background: #2bdca7;
          border: 1px solid #2bdca7;
        }

        .signup-button:hover {
          background: #3be8b4;
        }

        /* HERO */

        .hero {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 72px 5% 48px;
        }

        .eyebrow,
        .section-eyebrow,
        .simple-eyebrow {
          color: #2bdca7;
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2bdca7;
          box-shadow:
            0 0 12px rgba(43,220,167,0.75);
          display: inline-block;
        }

        h1 {
          font-size: clamp(43px, 6vw, 74px);
          line-height: 0.98;
          letter-spacing: -4px;
          margin: 0;
          font-weight: 850;
        }

        .hero h1 span {
          color: #61716f;
        }

        .hero p {
          color: #697889;
          font-size: 14px;
          margin-top: 23px;
          max-width: 540px;
          line-height: 1.6;
        }

        /* STATS */

        .stats {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 5% 55px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
        }

        .stat-card {
          border: 1px solid
            rgba(255,255,255,0.065);
          background:
            rgba(9,17,18,0.76);
          border-radius: 14px;
          padding: 22px;
        }

        .stat-label {
          color: #657572;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .stat-value {
          margin-top: 12px;
          font-size: 26px;
          font-weight: 780;
          letter-spacing: -1px;
        }

        .stat-description {
          margin-top: 7px;
          color: #596967;
          font-size: 10px;
        }

        .stat-change {
          margin-top: 8px;
          font-size: 12px;
        }

        .stat-change span {
          color: #596967;
        }

        /* MARKETS */

        .markets-section {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 5% 70px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 20px;
        }

        .section-eyebrow {
          margin-bottom: 8px;
        }

        h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .section-header p {
          margin: 7px 0 0;
          color: #63716f;
          font-size: 11px;
        }

        .updated {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #596967;
          font-size: 9px;
        }

        .market-table {
          width: 100%;
          border: 1px solid
            rgba(255,255,255,0.065);
          border-radius: 15px;
          overflow: hidden;
          background:
            rgba(5,12,13,0.9);
        }

        .table-header,
        .coin-row {
          display: grid;
          grid-template-columns:
            35px
            minmax(180px, 1.4fr)
            125px
            75px
            75px
            75px
            165px
            115px
            65px;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
        }

        .table-header {
          height: 46px;
          color: #536260;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid
            rgba(255,255,255,0.055);
        }

        .coin-row {
          min-height: 78px;
          border-bottom: 1px solid
            rgba(255,255,255,0.04);
          font-size: 10px;
        }

        .coin-row:last-child {
          border-bottom: none;
        }

        .coin-row:hover {
          background:
            rgba(43,220,167,0.025);
        }

        .rank {
          color: #61706e;
        }

        .asset {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .coin-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
        }

        .coin-name {
          color: #edf5f2;
          font-size: 11px;
          font-weight: 750;
        }

        .coin-symbol {
          color: #5e6d6b;
          font-size: 8px;
          margin-top: 3px;
          font-weight: 700;
        }

        .coin-price {
          font-size: 11px;
          font-weight: 750;
        }

        .positive {
          color: #2bdca7;
          font-weight: 700;
        }

        .negative {
          color: #ff6476;
          font-weight: 700;
        }

        .chart-wrapper {
          opacity: 0.9;
        }

        .mini-chart {
          display: block;
        }

        .mini-chart.positive {
          color: #2bdca7;
        }

        .mini-chart.negative {
          color: #ff6476;
        }

        .chart-empty {
          color: #4d5a58;
        }

        .market-cap {
          color: #929e9c;
          font-weight: 600;
        }

        .trade-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 29px;
          border: 1px solid
            rgba(43,220,167,0.3);
          border-radius: 7px;
          color: #2bdca7;
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
          transition: 0.2s;
        }

        .trade-button:hover {
          background: #2bdca7;
          color: #03100c;
          border-color: #2bdca7;
        }

        /* LOADING */

        .skeleton {
          background: linear-gradient(
            90deg,
            #0d1618 25%,
            #152321 50%,
            #0d1618 75%
          );
          background-size: 200% 100%;
          animation: skeleton 1.4s infinite;
          border-radius: 6px;
        }

        .skeleton.small {
          width: 15px;
          height: 10px;
        }

        .asset-loading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skeleton.avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
        }

        .skeleton.name {
          width: 90px;
          height: 10px;
        }

        .skeleton.price {
          width: 75px;
          height: 10px;
        }

        .skeleton.percent {
          width: 42px;
          height: 10px;
        }

        .skeleton.chart {
          width: 135px;
          height: 28px;
        }

        .skeleton.marketcap {
          width: 70px;
          height: 10px;
        }

        @keyframes skeleton {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }

        .error-box {
          padding: 45px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #71807d;
        }

        .error-box strong {
          color: white;
        }

        .error-box button {
          margin-top: 10px;
          background: #2bdca7;
          border: none;
          color: #03100c;
          padding: 9px 17px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 800;
        }

        /* SIMPLE PAGES */

        .simple-page {
          position: relative;
          z-index: 2;
          min-height: calc(100vh - 72px);
          padding: 60px 5%;
        }

        .simple-page h1 {
          margin-top: 12px;
          font-size: clamp(40px, 6vw, 65px);
        }

        .simple-page > p {
          color: #687875;
          font-size: 14px;
          margin-top: 18px;
        }

        .centered-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: calc(100vh - 160px);
        }

        .feature-icon {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: rgba(43,220,167,0.08);
          border: 1px solid
            rgba(43,220,167,0.2);
          color: #2bdca7;
          font-size: 28px;
          margin-bottom: 24px;
        }

        .coming-soon {
          margin-top: 28px;
          padding: 10px 17px;
          border: 1px solid
            rgba(43,220,167,0.22);
          border-radius: 20px;
          color: #2bdca7;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        /* MOBILE MARKET CARDS */

        .mobile-market-list {
          margin-top: 35px;
          display: grid;
          gap: 9px;
          max-width: 700px;
        }

        .mobile-market-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: rgba(9,17,18,0.78);
          border: 1px solid
            rgba(255,255,255,0.06);
          border-radius: 13px;
          text-decoration: none;
          color: white;
        }

        .mobile-coin-left {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .mobile-coin-left img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
        }

        .mobile-coin-left strong {
          display: block;
          font-size: 12px;
        }

        .mobile-coin-left span {
          display: block;
          color: #596967;
          font-size: 9px;
          margin-top: 3px;
        }

        .mobile-coin-right {
          text-align: right;
        }

        .mobile-coin-right strong {
          display: block;
          font-size: 12px;
        }

        .mobile-coin-right span {
          display: block;
          font-size: 9px;
          margin-top: 4px;
        }

        /* ASSETS */

        .balance-card {
          margin-top: 30px;
          max-width: 500px;
          padding: 25px;
          border-radius: 16px;
          border: 1px solid
            rgba(43,220,167,0.15);
          background:
            linear-gradient(
              135deg,
              rgba(43,220,167,0.08),
              rgba(8,15,17,0.9)
            );
        }

        .balance-card span,
        .balance-card small {
          display: block;
          color: #63716f;
          font-size: 10px;
        }

        .balance-card strong {
          display: block;
          margin: 10px 0;
          font-size: 34px;
          letter-spacing: -1px;
        }

        .asset-empty {
          margin-top: 25px;
          padding: 30px;
          max-width: 500px;
          border: 1px solid
            rgba(255,255,255,0.06);
          border-radius: 15px;
          text-align: center;
          background: rgba(8,13,15,0.7);
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(43,220,167,0.09);
          color: #2bdca7;
          font-weight: 900;
        }

        .asset-empty strong {
          display: block;
          font-size: 13px;
        }

        .asset-empty p {
          color: #596967;
          font-size: 11px;
        }

        /* BOTTOM NAVIGATION */

        .bottom-nav {
          position: fixed;
          z-index: 50;
          left: 0;
          right: 0;
          bottom: 0;
          height: 76px;
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);
          align-items: center;
          padding:
            6px max(10px, env(safe-area-inset-right))
            calc(6px + env(safe-area-inset-bottom))
            max(10px, env(safe-area-inset-left));
          background:
            rgba(3,7,11,0.94);
          border-top: 1px solid
            rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
        }

        .bottom-item {
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: none;
          background: transparent;
          color: #53615f;
          text-decoration: none;
          font-family: inherit;
          font-size: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .bottom-item.active {
          color: #2bdca7;
        }

        .nav-icon {
          font-size: 20px;
          line-height: 20px;
        }

        .trade-nav {
          position: relative;
        }

        .trade-circle {
          width: 45px;
          height: 45px;
          margin-top: -18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background:
            linear-gradient(
              145deg,
              #3be8b4,
              #11745b
            );
          border: 4px solid #03070b;
          color: #03100c;
          font-size: 20px;
          font-weight: 900;
          box-shadow:
            0 0 24px rgba(43,220,167,0.2);
        }

        /* DESKTOP */

        @media (min-width: 851px) {
          .bottom-nav {
            height: 68px;
            width: min(650px, 80%);
            left: 50%;
            right: auto;
            transform: translateX(-50%);
            bottom: 16px;
            border: 1px solid
              rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 3px 10px;
          }

          .bottom-item {
            height: 58px;
          }
        }

        /* TABLET */

        @media (max-width: 1100px) {
          .table-header,
          .coin-row {
            grid-template-columns:
              30px
              minmax(165px, 1.4fr)
              110px
              70px
              70px
              70px
              135px
              100px
              65px;
            gap: 9px;
            padding: 0 15px;
          }
        }

        /* MOBILE */

        @media (max-width: 850px) {
          .header {
            height: 64px;
            padding: 0 17px;
          }

          .brand-text {
            font-size: 18px;
          }

          .brand-symbol {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }

          .login-button,
          .signup-button {
            height: 33px;
            padding: 0 10px;
            font-size: 9px;
          }

          .hero {
            padding: 53px 20px 35px;
          }

          .stats {
            padding: 0 20px 42px;
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 19px;
          }

          .markets-section {
            padding: 0 20px 45px;
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 13px;
          }

          .market-table {
            display: none;
          }

          .markets-section::after {
            content: "Use Markets below to view all assets";
            display: block;
            margin-top: 18px;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid
              rgba(255,255,255,0.055);
            color: #596967;
            text-align: center;
            font-size: 10px;
          }

          h1 {
            font-size: 44px;
            letter-spacing: -2.8px;
          }

          .simple-page {
            padding: 50px 20px 35px;
          }

          .simple-page h1 {
            font-size: 45px;
            letter-spacing: -3px;
          }

          .bottom-nav {
            height: calc(
              70px + env(safe-area-inset-bottom)
            );
          }

          .page {
            padding-bottom: 95px;
          }
        }

        @media (max-width: 500px) {
          .hero p {
            font-size: 13px;
          }

          .stat-value {
            font-size: 23px;
          }

          .bottom-item {
            font-size: 7px;
          }

          .nav-icon {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
