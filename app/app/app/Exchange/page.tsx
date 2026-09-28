"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: #03070b;
          color: #eef5f3;
          font-family: Inter, Arial, sans-serif;
        }

        .landing {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 38%, rgba(36, 220, 165, .12), transparent 25%),
            radial-gradient(circle at 15% 85%, rgba(27, 109, 93, .08), transparent 25%),
            #03070b;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: .22;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 55px 55px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .glow {
          position: absolute;
          width: 550px;
          height: 550px;
          left: 50%;
          top: 40%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(39, 221, 169, .08);
          box-shadow:
            0 0 100px rgba(34, 214, 163, .06),
            inset 0 0 100px rgba(34, 214, 163, .03);
        }

        .glow::before,
        .glow::after {
          content: "";
          position: absolute;
          inset: 70px;
          border-radius: 50%;
          border: 1px solid rgba(39, 221, 169, .06);
        }

        .glow::after {
          inset: 150px;
        }

        .nav {
          height: 76px;
          position: relative;
          z-index: 5;
          padding: 0 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(3,7,11,.65);
          backdrop-filter: blur(15px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: linear-gradient(145deg, #35e5b0, #11785f);
          color: #03100c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          font-weight: 900;
          box-shadow: 0 0 28px rgba(35,220,166,.18);
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.6px;
        }

        .brand-name span {
          color: #2adca7;
        }

        .brand-caption {
          color: #566576;
          font-size: 7px;
          letter-spacing: 2.5px;
          margin-top: 2px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid rgba(36,220,165,.18);
          border-radius: 7px;
          color: #35dca9;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .7px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2be0a7;
          box-shadow: 0 0 9px #2be0a7;
        }

        .hero {
          min-height: calc(100vh - 76px);
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 50px 20px 80px;
        }

        .hero-icon {
          width: 100px;
          height: 100px;
          border-radius: 29px;
          padding: 2px;
          background: linear-gradient(145deg, #37e8b2, #126d58);
          box-shadow:
            0 0 65px rgba(39,220,167,.18),
            0 20px 80px rgba(0,0,0,.4);
          margin-bottom: 28px;
        }

        .hero-icon-inner {
          width: 100%;
          height: 100%;
          border-radius: 27px;
          background: #07100f;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #30e3ad;
          font-size: 52px;
          font-weight: 900;
        }

        .eyebrow {
          color: #2bdba6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
          margin-bottom: 15px;
        }

        h1 {
          margin: 0;
          font-size: clamp(55px, 9vw, 105px);
          line-height: .95;
          letter-spacing: -6px;
          font-weight: 850;
        }

        h1 span {
          color: #29dca7;
        }

        .subtitle {
          max-width: 590px;
          margin: 25px auto 0;
          color: #778596;
          font-size: 15px;
          line-height: 1.7;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 35px;
        }

        .launch {
          height: 52px;
          padding: 0 29px;
          border-radius: 8px;
          border: 1px solid rgba(58,236,184,.35);
          background: linear-gradient(135deg, #31dfaa, #1dbd91);
          color: #03110c;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: .2px;
          box-shadow: 0 12px 35px rgba(31,211,157,.13);
          cursor: pointer;
          transition: .2s;
        }

        .launch:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        .learn {
          height: 52px;
          padding: 0 25px;
          border-radius: 8px;
          border: 1px solid #202c37;
          background: rgba(10,16,23,.7);
          color: #8a97a7;
          font-size: 12px;
          cursor: pointer;
        }

        .features {
          margin-top: 70px;
          width: min(850px, 100%);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid #18232d;
          border-radius: 13px;
          overflow: hidden;
          background: rgba(7,12,18,.65);
          backdrop-filter: blur(12px);
        }

        .feature {
          padding: 24px 20px;
          border-right: 1px solid #18232d;
        }

        .feature:last-child {
          border-right: 0;
        }

        .feature-icon {
          color: #2cdaa7;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .feature strong {
          display: block;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .feature span {
          color: #566577;
          font-size: 9px;
          line-height: 1.5;
        }

        .demo {
          margin-top: 24px;
          color: #3f4e5f;
          font-size: 9px;
          letter-spacing: .4px;
        }

        @media (max-width: 650px) {
          .nav {
            padding: 0 16px;
          }

          .status {
            display: none;
          }

          .hero {
            padding-top: 40px;
          }

          h1 {
            letter-spacing: -4px;
          }

          .subtitle {
            font-size: 13px;
          }

          .actions {
            width: 100%;
            flex-direction: column;
          }

          .launch,
          .learn {
            width: min(330px, 100%);
          }

          .features {
            grid-template-columns: 1fr;
          }

          .feature {
            border-right: 0;
            border-bottom: 1px solid #18232d;
          }

          .feature:last-child {
            border-bottom: 0;
          }

          .glow {
            width: 380px;
            height: 380px;
          }
        }
      `}</style>

      <main className="landing">
        <div className="grid" />
        <div className="glow" />

        <nav className="nav">
          <div className="brand">
            <div className="brand-icon">C</div>

            <div>
              <div className="brand-name">
                Crypto<span>Lab</span>
              </div>
              <div className="brand-caption">
                DIGITAL EXCHANGE
              </div>
            </div>
          </div>

          <div className="nav-right">
            <div className="status">
              <span className="status-dot" />
              SYSTEM OPERATIONAL
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-icon">
            <div className="hero-icon-inner">C</div>
          </div>

          <div className="eyebrow">
            NEXT GENERATION TRADING TERMINAL
          </div>

          <h1>
            Crypto<span>Lab</span>
          </h1>

          <p className="subtitle">
            A modern digital asset trading interface built
            for fast markets, real-time analytics and a
            professional trading experience.
          </p>

          <div className="actions">
            <button
              className="launch"
              onClick={() => router.push("/exchange")}
            >
              LAUNCH EXCHANGE →
            </button>

            <button
              className="learn"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              EXPLORE PLATFORM
            </button>
          </div>

          <div className="features" id="features">
            <div className="feature">
              <div className="feature-icon">◈</div>
              <strong>Advanced Markets</strong>
              <span>
                Multiple trading pairs with live-style
                market visualization.
              </span>
            </div>

            <div className="feature">
              <div className="feature-icon">⌁</div>
              <strong>Professional Terminal</strong>
              <span>
                Candlestick charts, order book and
                trading tools in one interface.
              </span>
            </div>

            <div className="feature">
              <div className="feature-icon">◆</div>
              <strong>Demo Environment</strong>
              <span>
                Explore the platform safely without
                real transactions or funds.
              </span>
            </div>
          </div>

          <div className="demo">
            CRYPTOLAB DEMO · DIGITAL ASSET EXCHANGE
          </div>
        </section>
      </main>
    </>
  );
}
