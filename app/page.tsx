"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/exchange");
    }, 1700);

    return () => clearTimeout(timer);
  }, [router]);

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
