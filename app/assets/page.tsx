"use client";

import { useRouter } from "next/navigation";

type Asset = {
  symbol: string;
  name: string;
  balance: string;
  price: string;
  value: string;
  icon: string;
  iconClass: string;
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

const assets: Asset[] = [
  {
    symbol: "USDT",
    name: "Tether",
    balance: "0.00",
    price: "$1.00",
    value: "$0.00",
    icon: "$",
    iconClass: "usdt",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: "0.00000000",
    price: "$83,617",
    value: "$0.00",
    icon: "₿",
    iconClass: "btc",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "0.00000000",
    price: "$2,691",
    value: "$0.00",
    icon: "◆",
    iconClass: "eth",
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: "0.00000000",
    price: "$198.42",
    value: "$0.00",
    icon: "S",
    iconClass: "sol",
  },
  {
    symbol: "BNB",
    name: "BNB",
    balance: "0.00000000",
    price: "$766.59",
    value: "$0.00",
    icon: "◆",
    iconClass: "bnb",
  },
];

export default function AssetsPage() {
  const router = useRouter();

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
          padding-bottom: 105px;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(43,220,167,.08),
              transparent 34%
            ),
            #03070b;
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

        .signup-button {
          color: #06100d;
          background: #2bdca7;
          border: 1px solid #2bdca7;
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding-top: 38px;
        }

        .hero {
          margin-bottom: 30px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(36px, 5vw, 52px);
          line-height: 1;
          letter-spacing: -2px;
        }

        .hero h1 span {
          color: #2bdca7;
        }

        .hero p {
          margin: 12px 0 0;
          color: #66757b;
          font-size: 13px;
        }

        .balance-card {
          position: relative;
          overflow: hidden;
          padding: 30px;
          margin-bottom: 28px;
          border: 1px solid rgba(43,220,167,.12);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(43,220,167,.1),
              transparent 30%
            ),
            rgba(7,15,19,.88);
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }

        .balance-card::after {
          content: "";
          position: absolute;
          width: 240px;
          height: 240px;
          right: -100px;
          bottom: -140px;
          border-radius: 50%;
          border: 1px solid rgba(43,220,167,.08);
        }

        .balance-label {
          color: #66757b;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .balance-value {
          margin-top: 8px;
          font-size: clamp(38px, 7vw, 58px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: -2px;
        }

        .balance-change {
          margin-top: 10px;
          color: #536169;
          font-size: 11px;
        }

        .balance-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        .deposit-button,
        .withdraw-button {
          height: 42px;
          padding: 0 22px;
          border-radius: 11px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 750;
          transition: all .2s ease;
        }

        .deposit-button {
          color: #06100d;
          background: #2bdca7;
          border: 1px solid #2bdca7;
        }

        .deposit-button:hover {
          background: #45e5b5;
          box-shadow: 0 0 25px rgba(43,220,167,.18);
        }

        .withdraw-button {
          color: #2bdca7;
          background: rgba(43,220,167,.05);
          border: 1px solid rgba(43,220,167,.2);
        }

        .withdraw-button:hover {
          background: rgba(43,220,167,.1);
          border-color: rgba(43,220,167,.4);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }

        .stat {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 16px;
          background: rgba(10,17,22,.72);
        }

        .stat-label {
          color: #627078;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .stat-value {
          margin-top: 8px;
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
          font-size: 18px;
        }

        .section-title span {
          color: #526169;
          font-size: 11px;
        }

        .asset-list {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 18px;
          background: rgba(7,13,18,.84);
        }

        .asset-header,
        .asset-row {
          display: grid;
          grid-template-columns:
            minmax(220px, 1.5fr)
            minmax(150px, 1fr)
            minmax(130px, .8fr)
            minmax(130px, .8fr);
          align-items: center;
          column-gap: 20px;
          padding: 0 22px;
        }

        .asset-header {
          min-height: 44px;
          color: #536169;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .asset-row {
          min-height: 78px;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: background .2s ease;
        }

        .asset-row:last-child {
          border-bottom: 0;
        }

        .asset-row:hover {
          background: rgba(43,220,167,.025);
        }

        .asset-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .asset-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          font-size: 17px;
          font-weight: 800;
        }

        .asset-icon.usdt {
          background: #26a17b;
        }

        .asset-icon.btc {
          background: #f7931a;
        }

        .asset-icon.eth {
          background: #202a3a;
        }

        .asset-icon.sol {
          background: #161b25;
          color: #2bdca7;
        }

        .asset-icon.bnb {
          background: #c9a227;
        }

        .asset-title {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .asset-symbol {
          color: #eaf2ef;
          font-size: 13px;
          font-weight: 750;
        }

        .asset-fullname {
          color: #536169;
          font-size: 10px;
        }

        .asset-balance,
        .asset-price,
        .asset-value {
          color: #dce6e2;
          font-size: 12px;
          font-weight: 600;
        }

        .asset-value {
          color: #eef5f3;
          font-weight: 700;
        }

        .activity {
          margin-top: 32px;
        }

        .activity-card {
          padding: 18px 22px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 18px;
          background: rgba(7,13,18,.84);
        }

        .empty-activity {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #536169;
          font-size: 12px;
          text-align: center;
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
        }

        .nav-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .3px;
        }

        @media (max-width: 700px) {
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

          .hero h1 {
            font-size: 36px;
          }

          .hero p {
            font-size: 12px;
          }

          .balance-card {
            padding: 22px;
            border-radius: 17px;
          }

          .balance-value {
            font-size: 42px;
          }

          .balance-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .deposit-button,
          .withdraw-button {
            width: 100%;
            padding: 0 10px;
          }

          .stats {
            gap: 9px;
          }

          .stat {
            padding: 15px;
          }

          .stat-value {
            font-size: 16px;
          }

          .asset-header {
            display: none;
          }

          .asset-row {
            grid-template-columns:
              minmax(140px, 1fr)
              minmax(100px, .8fr)
              80px;
            padding: 0 13px;
            column-gap: 8px;
            min-height: 72px;
          }

          .asset-row > :nth-child(3) {
            display: none;
          }

          .asset-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .asset-symbol {
            font-size: 12px;
          }

          .asset-fullname {
            font-size: 9px;
          }

          .asset-balance,
          .asset-value {
            font-size: 10px;
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
            <h1>
              My <span>Assets</span>
            </h1>

            <p>
              Manage your cryptocurrency portfolio
            </p>
          </section>

          <section className="balance-card">
            <div className="balance-label">
              Total Balance
            </div>

            <div className="balance-value">
              $0.00
            </div>

            <div className="balance-change">
              Portfolio value in USDT
            </div>

            <div className="balance-actions">
              <button
                className="deposit-button"
                onClick={() =>
                  alert("Deposit module is coming soon")
                }
              >
                Deposit
              </button>

              <button
                className="withdraw-button"
                onClick={() =>
                  alert("Withdraw module is coming soon")
                }
              >
                Withdraw
              </button>
            </div>
          </section>

          <section className="stats">
            <div className="stat">
              <div className="stat-label">
                Available
              </div>

              <div className="stat-value">
                $0.00
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                In Orders
              </div>

              <div className="stat-value">
                $0.00
              </div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Your Assets</h2>
              <span>5 assets</span>
            </div>

            <div className="asset-list">
              <div className="asset-header">
                <div>Asset</div>
                <div>Balance</div>
                <div>Price</div>
                <div>USD Value</div>
              </div>

              {assets.map((asset) => (
                <div
                  className="asset-row"
                  key={asset.symbol}
                >
                  <div className="asset-name">
                    <div
                      className={`asset-icon ${asset.iconClass}`}
                    >
                      {asset.icon}
                    </div>

                    <div className="asset-title">
                      <div className="asset-symbol">
                        {asset.symbol}
                      </div>

                      <div className="asset-fullname">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="asset-balance">
                    {asset.balance}
                  </div>

                  <div className="asset-price">
                    {asset.price}
                  </div>

                  <div className="asset-value">
                    {asset.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="activity">
            <div className="section-title">
              <h2>Recent Activity</h2>
              <span>Latest transactions</span>
            </div>

            <div className="activity-card">
              <div className="empty-activity">
                No transactions yet
              </div>
            </div>
          </section>
        </div>

        <nav className="bottom-nav">
          <button
  className="nav-item"
  onClick={() => router.push("/exchange")}
>
            <Icon type="home" />
            <span className="nav-label">Home</span>
          </button>

          <button
            className="nav-item"
            onClick={() => router.push("/")}
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
            onClick={() =>
              alert("Futures module is coming soon")
            }
          >
            <Icon type="futures" />
            <span className="nav-label">Futures</span>
          </button>

          <button
            className="nav-item active"
          >
            <Icon type="assets" />
            <span className="nav-label">Assets</span>
          </button>
        </nav>
      </main>
    </>
  );
}
