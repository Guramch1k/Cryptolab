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

  const width = 180;
  const height = 55;

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
      width="180"
      height="55"
      viewBox="0 0 180 55"
      className={`mini-chart ${positive ? "positive" : "negative"}`}
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
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  const btc = coins.find((coin) => coin.symbol.toLowerCase() === "btc");

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="header">
        <Link href="/" className="logo">
          <div className="logo-mark">C</div>
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

        <Link href="/exchange" className="header-button">
          Trade
        </Link>
      </header>

      <section className="hero">
        <div>
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
            Track the world's leading cryptocurrencies by market
            capitalization.
          </p>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-label">TOP 10 MARKET CAP</div>

          <div className="stat-value">
            {loading ? "Loading..." : formatMoney(totalMarketCap)}
          </div>

          <div className="stat-description">
            Combined market capitalization
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">24H VOLUME</div>

          <div className="stat-value">
            {loading ? "Loading..." : formatMoney(totalVolume)}
          </div>

          <div className="stat-description">
            Trading volume across markets
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">BITCOIN</div>

          <div className="stat-value">
            {btc ? formatPrice(btc.current_price) : "—"}
          </div>

          <div
            className={`stat-change ${
              btc && btc.price_change_percentage_24h >= 0
                ? "positive"
                : "negative"
            }`}
          >
            {btc ? formatPercent(btc.price_change_percentage_24h) : "—"}
            <span> 24h</span>
          </div>
        </div>
      </section>

      <section className="markets-section">
        <div className="section-header">
          <div>
            <h2>Top cryptocurrencies</h2>
            <p>Ranked by market capitalization</p>
          </div>

          <div className="updated">
            <span className="live-dot" />

            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}`
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
            Array.from({ length: 10 }).map((_, index) => (
              <div className="coin-row loading-row" key={index}>
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
            ))}

          {!loading &&
            coins.map((coin) => {
              const positive =
                coin.price_change_percentage_24h >= 0;

              return (
                <div className="coin-row" key={coin.id}>
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
                    {formatPrice(coin.current_price)}
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
                      data={coin.sparkline_in_7d?.price}
                      positive={positive}
                    />
                  </div>

                  <div className="market-cap">
                    {formatMoney(coin.market_cap)}
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
              <strong>Market data unavailable</strong>

              <span>
                {error}
              </span>

              <button onClick={loadMarkets}>
                Try again
              </button>
            </div>
          )}
        </div>
      </section>

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

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(38, 84, 255, 0.12),
              transparent 35%
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
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.08;
        }

        .glow-one {
          top: -250px;
          left: -150px;
          background: #2864ff;
        }

        .glow-two {
          right: -250px;
          bottom: -250px;
          background: #00d4ff;
        }

        .header {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(5,8,13,0.75);
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: white;
          font-size: 20px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #3675ff, #6c42ff);
          font-weight: 800;
          box-shadow: 0 8px 30px rgba(55,100,255,0.25);
        }

        nav {
          display: flex;
          gap: 34px;
          margin-left: 80px;
        }

        nav a {
          color: #7d8796;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        nav a:hover,
        nav a.active {
          color: white;
        }

        .header-button {
          color: white;
          text-decoration: none;
          background: #2864ff;
          border-radius: 9px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
        }

        .hero {
          max-width: 1380px;
          margin: auto;
          padding: 82px 5% 55px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8994a4;
          font-size: 11px;
          letter-spacing: 1.7px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee887;
          box-shadow: 0 0 12px rgba(46,232,135,0.75);
          display: inline-block;
        }

        h1 {
          font-size: clamp(42px, 6vw, 78px);
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
          font-size: 16px;
          margin-top: 25px;
          max-width: 540px;
          line-height: 1.6;
        }

        .stats {
          max-width: 1380px;
          margin: auto;
          padding: 0 5% 60px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .stat-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(13,18,27,0.72);
          border-radius: 15px;
          padding: 24px;
        }

        .stat-label {
          color: #707b8b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .stat-value {
          margin-top: 13px;
          font-size: 27px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .stat-description {
          margin-top: 7px;
          color: #687384;
          font-size: 12px;
        }

        .stat-change {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .stat-change span {
          color: #667181;
          font-weight: 500;
        }

        .markets-section {
          max-width: 1380px;
          margin: auto;
          padding: 0 5% 80px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 22px;
        }

        h2 {
          margin: 0;
          font-size: 27px;
          letter-spacing: -1px;
        }

        .section-header p {
          margin: 7px 0 0;
          color: #6e7888;
          font-size: 13px;
        }

        .updated {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #657080;
          font-size: 11px;
        }

        .market-table {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(9,13,20,0.85);
        }

        .table-header,
        .coin-row {
          display: grid;
          grid-template-columns:
            35px
            minmax(190px, 1.4fr)
            130px
            90px
            90px
            90px
            190px
            125px
            80px;
          align-items: center;
          gap: 15px;
          padding: 0 22px;
        }

        .table-header {
          height: 48px;
          color: #596373;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .coin-row {
          min-height: 82px;
          border-bottom: 1px solid rgba(255,255,255,0.045);
          font-size: 12px;
        }

        .coin-row:last-child {
          border-bottom: none;
        }

        .coin-row:hover {
          background: rgba(255,255,255,0.025);
        }

        .rank {
          color: #687384;
          font-size: 12px;
        }

        .asset {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .coin-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        .coin-name {
          font-size: 13px;
          font-weight: 700;
          color: #f1f4f8;
        }

        .coin-symbol {
          color: #687384;
          font-size: 10px;
          margin-top: 3px;
          font-weight: 600;
        }

        .coin-price {
          font-size: 13px;
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
          color: #35d98b;
          opacity: 0.85;
        }

        .chart-wrapper .negative {
          color: #ff6375;
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
          height: 31px;
          border: 1px solid rgba(55,110,255,0.35);
          border-radius: 7px;
          color: #72a0ff;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          transition: 0.2s;
        }

        .trade-button:hover {
          background: #2864ff;
          color: white;
          border-color: #2864ff;
        }

        .loading-row {
          opacity: 0.8;
        }

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

        .skeleton.avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        .asset-loading {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .skeleton.name {
          width: 90px;
          height: 11px;
        }

        .skeleton.price {
          width: 75px;
          height: 11px;
        }

        .skeleton.percent {
          width: 45px;
          height: 11px;
        }

        .skeleton.chart {
          width: 140px;
          height: 35px;
        }

        .skeleton.marketcap {
          width: 75px;
          height: 11px;
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

        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          color: #505b6b;
          font-size: 11px;
        }

        .footer-logo {
          color: #a3adbb;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .table-header,
          .coin-row {
            grid-template-columns:
              30px
              minmax(170px, 1.5fr)
              110px
              70px
              70px
              70px
              140px
              100px
              70px;
            gap: 10px;
            padding: 0 15px;
          }

          .chart-wrapper {
            transform: scale(0.8);
            transform-origin: left center;
          }
        }

        @media (max-width: 850px) {
          .header {
            padding: 0 20px;
          }

          nav {
            display: none;
          }

          .hero {
            padding: 65px 20px 40px;
          }

          .stats {
            padding: 0 20px 45px;
            grid-template-columns: 1fr;
          }

          .markets-section {
            padding: 0 20px 60px;
          }

          .section-header {
            align-items: start;
            flex-direction: column;
            gap: 15px;
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
            gap: 10px;
            flex-direction: column;
            align-items: start;
          }
        }

        @media (max-width: 500px) {
          h1 {
            letter-spacing: -2.5px;
          }

          .header-button {
            padding: 9px 13px;
          }
        }
      `}</style>
    </main>
  );
}
