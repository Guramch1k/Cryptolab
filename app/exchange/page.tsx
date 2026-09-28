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

  const width = 170;
  const height = 50;

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
      width="170"
      height="50"
      viewBox="0 0 170 50"
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

  if (showSplash) {
    return (
      <main className="splash">
        <div className="splash-glow glow-a" />
        <div className="splash-glow glow-b" />

        <div className="splash-content">
          <div className="brand-logo">
            <div className="brand-symbol">
              C
            </div>

            <div className="brand-name">
              CryptoLab
            </div>
          </div>

          <div className="loading-line">
            <div className="loading-progress" />
          </div>
        </div>

        <style jsx>{`
          * {
            box-sizing: border-box;
          }

          .splash {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            min-height: 100svh;
            background: #05080d;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: white;
          }

          .splash-glow {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.13;
          }

          .glow-a {
            background: #2864ff;
            top: -250px;
            left: -180px;
          }

          .glow-b {
            background: #7048ff;
            right: -250px;
            bottom: -250px;
          }

          .splash-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: splashIn 0.8s ease;
          }

          .brand-logo {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .brand-symbol {
            width: 54px;
            height: 54px;
            border-radius: 15px;
            display: grid;
            place-items: center;
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(
              135deg,
              #3675ff,
              #6c42ff
            );
            box-shadow:
              0 0 40px rgba(54,117,255,0.3),
              inset 0 1px 0 rgba(255,255,255,0.2);
          }

          .brand-name {
            font-size: 30px;
            font-weight: 750;
            letter-spacing: -1px;
          }

          .loading-line {
            width: 145px;
            height: 2px;
            margin-top: 28px;
            background: rgba(255,255,255,0.08);
            overflow: hidden;
            border-radius: 20px;
          }

          .loading-progress {
            height: 100%;
            width: 0%;
            background: #4d7cff;
            animation: progress 1.55s ease forwards;
          }

          @keyframes progress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }

          @keyframes splashIn {
            from {
              opacity: 0;
              transform: scale(0.97);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* HEADER */}

      <header className="header">
        <Link href="/" className="logo">
          <div className="logo-symbol">
            C
          </div>

          <span>CryptoLab</span>
        </Link>

        <nav>
          <Link href="/" className="active">
            Markets
          </Link>

          <Link href="/exchange">
            Exchange
          </Link>
        </nav>

        <div className="auth-buttons">
          <button className="login-button">
            Log In
          </button>

          <button className="signup-button">
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO */}

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
          Track the world's leading cryptocurrencies by
          market capitalization.
        </p>
      </section>

      {/* MARKET STATS */}

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

      {/* TOP 10 */}

      <section className="markets-section">
        <div className="section-header">
          <div>
            <h2>Top cryptocurrencies</h2>

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
                  className="coin-row loading-row"
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
                      coin.price_change_percentage_24h >=
                      0
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
                        coin.sparkline_in_7d
                          ?.price
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

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-logo">
          CryptoLab
        </div>

        <div>
          Market data provided by CoinGecko
        </div>

        <div>
          Demo exchange interface
        </div>
      </footer>

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
          background: #05080d;
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
              rgba(38,84,255,0.11),
              transparent 32%
            ),
            #05080d;
          color: #f5f7fa;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          position: relative;
          overflow: hidden;
        }

        .background-glow {
          position: fixed;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          opacity: 0.08;
          z-index: 0;
        }

        .glow-one {
          top: -260px;
          left: -170px;
          background: #2864ff;
        }

        .glow-two {
          right: -270px;
          bottom: -270px;
          background: #7048ff;
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid
            rgba(255,255,255,0.055);
          background: rgba(5,8,13,0.82);
          backdrop-filter: blur(22px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: white;
          font-size: 20px;
          font-weight: 750;
          letter-spacing: -0.6px;
        }

        .logo-symbol {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #3675ff,
            #6c42ff
          );
          font-weight: 800;
          box-shadow:
            0 8px 30px rgba(55,100,255,0.24);
        }

        nav {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 34px;
        }

        nav a {
          color: #737e8e;
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
          transition: 0.2s;
        }

        nav a:hover,
        nav a.active {
          color: white;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .login-button,
        .signup-button {
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-button {
          color: #c3cad5;
          background: transparent;
          border: 1px solid
            rgba(255,255,255,0.1);
        }

        .login-button:hover {
          color: white;
          border-color:
            rgba(255,255,255,0.22);
          background:
            rgba(255,255,255,0.04);
        }

        .signup-button {
          color: white;
          background: #2864ff;
          border: 1px solid #2864ff;
          box-shadow:
            0 7px 25px rgba(40,100,255,0.2);
        }

        .signup-button:hover {
          background: #3973ff;
          border-color: #3973ff;
        }

        /* HERO */

        .hero {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 78px 5% 52px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8994a4;
          font-size: 10px;
          letter-spacing: 1.7px;
          font-weight: 750;
          margin-bottom: 20px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee887;
          box-shadow:
            0 0 12px rgba(46,232,135,0.75);
          display: inline-block;
        }

        h1 {
          font-size: clamp(43px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -4px;
          margin: 0;
          font-weight: 800;
        }

        h1 span {
          color: #687386;
        }

        .hero p {
          color: #788395;
          font-size: 15px;
          margin-top: 24px;
          max-width: 540px;
          line-height: 1.6;
        }

        /* STATS */

        .stats {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 5% 58px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .stat-card {
          border: 1px solid
            rgba(255,255,255,0.065);
          background:
            rgba(13,18,27,0.72);
          border-radius: 14px;
          padding: 23px;
        }

        .stat-label {
          color: #707b8b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .stat-value {
          margin-top: 12px;
          font-size: 27px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .stat-description {
          margin-top: 7px;
          color: #687384;
          font-size: 11px;
        }

        .stat-change {
          margin-top: 8px;
          font-size: 12px;
        }

        .stat-change span {
          color: #667181;
          font-weight: 500;
        }

        /* MARKETS */

        .markets-section {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 5% 75px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 21px;
        }

        h2 {
          margin: 0;
          font-size: 26px;
          letter-spacing: -1px;
        }

        .section-header p {
          margin: 7px 0 0;
          color: #6e7888;
          font-size: 12px;
        }

        .updated {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #657080;
          font-size: 10px;
        }

        .market-table {
          width: 100%;
          border: 1px solid
            rgba(255,255,255,0.065);
          border-radius: 15px;
          overflow: hidden;
          background:
            rgba(9,13,20,0.86);
        }

        .table-header,
        .coin-row {
          display: grid;
          grid-template-columns:
            35px
            minmax(180px, 1.4fr)
            125px
            80px
            80px
            80px
            180px
            120px
            70px;
          align-items: center;
          gap: 13px;
          padding: 0 20px;
        }

        .table-header {
          height: 47px;
          color: #596373;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid
            rgba(255,255,255,0.055);
        }

        .coin-row {
          min-height: 80px;
          border-bottom: 1px solid
            rgba(255,255,255,0.04);
          font-size: 11px;
        }

        .coin-row:last-child {
          border-bottom: none;
        }

        .coin-row:hover {
          background:
            rgba(255,255,255,0.022);
        }

        .rank {
          color: #687384;
        }

        .asset {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coin-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }

        .coin-name {
          color: #f1f4f8;
          font-size: 12px;
          font-weight: 700;
        }

        .coin-symbol {
          color: #687384;
          font-size: 9px;
          margin-top: 3px;
          font-weight: 650;
        }

        .coin-price {
          font-size: 12px;
          font-weight: 700;
        }

        .positive {
          color: #35d98b;
          font-weight: 650;
        }

        .negative {
          color: #ff6375;
          font-weight: 650;
        }

        .chart-wrapper {
          opacity: 0.85;
        }

        .mini-chart {
          display: block;
        }

        .mini-chart.positive {
          color: #35d98b;
        }

        .mini-chart.negative {
          color: #ff6375;
        }

        .chart-empty {
          color: #4c5562;
        }

        .market-cap {
          color: #a0a8b5;
          font-weight: 600;
        }

        .trade-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          border: 1px solid
            rgba(55,110,255,0.35);
          border-radius: 7px;
          color: #72a0ff;
          text-decoration: none;
          font-size: 9px;
          font-weight: 750;
          transition: 0.2s;
        }

        .trade-button:hover {
          background: #2864ff;
          color: white;
          border-color: #2864ff;
        }

        /* LOADING */

        .skeleton {
          background: linear-gradient(
            90deg,
            #111721 25%,
            #19212d 50%,
            #111721 75%
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
          width: 35px;
          height: 35px;
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
          width: 140px;
          height: 30px;
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
          color: #788395;
        }

        .error-box strong {
          color: white;
        }

        .error-box button {
          margin-top: 10px;
          background: #2864ff;
          border: none;
          color: white;
          padding: 9px 17px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 700;
        }

        /* FOOTER */

        .footer {
          width: 100%;
          min-height: 72px;
          border-top: 1px solid
            rgba(255,255,255,0.055);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          color: #505b6b;
          font-size: 10px;
        }

        .footer-logo {
          color: #a3adbb;
          font-weight: 700;
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
            padding: 0 18px;
          }

          nav {
            display: none;
          }

          .hero {
            padding: 58px 20px 40px;
          }

          .stats {
            padding: 0 20px 45px;
            grid-template-columns: 1fr;
          }

          .markets-section {
            padding: 0 20px 55px;
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .market-table {
            overflow-x: auto;
          }

          .table-header,
          .coin-row {
            min-width: 900px;
          }

          .footer {
            padding: 20px;
            gap: 9px;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 500px) {
          .logo span {
            font-size: 18px;
          }

          .logo-symbol {
            width: 32px;
            height: 32px;
          }

          .auth-buttons {
            gap: 5px;
          }

          .login-button,
          .signup-button {
            padding: 0 10px;
            font-size: 10px;
          }

          h1 {
            font-size: 43px;
            letter-spacing: -2.5px;
          }
        }
      `}</style>
    </main>
  );
}
