"use client";

import { useState } from "react";

const markets = [
  ["BTC/USDT", "67,842.50", "+2.84%"],
  ["ETH/USDT", "3,842.18", "+1.92%"],
  ["SOL/USDT", "186.42", "+4.31%"],
  ["BNB/USDT", "612.74", "-0.84%"],
];

const sells = [
  ["67,901.20", "0.842"],
  ["67,884.60", "0.391"],
  ["67,870.10", "1.284"],
  ["67,856.80", "0.642"],
  ["67,849.40", "0.218"],
];

const buys = [
  ["67,838.20", "0.451"],
  ["67,824.70", "1.120"],
  ["67,811.30", "0.783"],
  ["67,795.90", "0.324"],
  ["67,782.50", "1.842"],
];

export default function Home() {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  return (
    <main className="min-h-screen bg-[#05080d] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#070b11]">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-white">Crypto</span>
              <span className="text-emerald-400">Lab</span>
            </div>

            <nav className="hidden gap-7 text-sm text-gray-400 md:flex">
              <a className="text-white" href="#">Exchange</a>
              <a href="#" className="hover:text-white">Markets</a>
              <a href="#" className="hover:text-white">Trade</a>
              <a href="#" className="hover:text-white">Assets</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/5 md:block">
              Log in
            </button>

            <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* MARKET BAR */}
      <div className="border-b border-white/10 bg-[#070b11]">
        <div className="mx-auto flex max-w-[1500px] gap-7 overflow-x-auto px-4 py-3 lg:px-8">
          {markets.map(([name, price, change]) => (
            <div key={name} className="min-w-[150px]">
              <div className="text-xs text-gray-500">{name}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold">{price}</span>
                <span
                  className={
                    change.startsWith("+")
                      ? "text-xs text-emerald-400"
                      : "text-xs text-red-400"
                  }
                >
                  {change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-px bg-white/10 lg:grid-cols-[1fr_310px]">
        {/* LEFT */}
        <section className="bg-[#05080d]">
          {/* PAIR */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">BTC/USDT</h1>
                <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                  +2.84%
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Bitcoin / Tether
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-emerald-400">
                $67,842.50
              </div>
              <div className="text-xs text-gray-500">
                24h volume $2.84B
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="relative h-[430px] border-b border-white/10 bg-[#060a10] p-5">
            <div className="absolute left-5 top-4 flex gap-5 text-xs text-gray-500">
              <span className="text-white">5m</span>
              <span>15m</span>
              <span>1H</span>
              <span>4H</span>
              <span>1D</span>
            </div>

            <div className="mt-8 h-[350px] rounded-xl border border-white/5 bg-[#080d14] p-4">
              <svg
                viewBox="0 0 900 320"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[50, 110, 170, 230, 290].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="900"
                    y2={y}
                    stroke="white"
                    strokeOpacity=".06"
                  />
                ))}

                <path
                  d="M0 270 L55 250 L100 258 L145 220 L190 232 L235 190 L280 202 L325 160 L370 175 L415 135 L460 148 L505 105 L550 125 L595 92 L640 112 L685 75 L730 96 L775 54 L820 70 L865 38 L900 48 L900 320 L0 320 Z"
                  fill="url(#area)"
                />

                <path
                  d="M0 270 L55 250 L100 258 L145 220 L190 232 L235 190 L280 202 L325 160 L370 175 L415 135 L460 148 L505 105 L550 125 L595 92 L640 112 L685 75 L730 96 L775 54 L820 70 L865 38 L900 48"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          {/* ORDER BOOK + TRADES */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-r border-white/10">
              <div className="border-b border-white/10 px-5 py-4 text-sm font-semibold">
                Order Book
              </div>

              <div className="grid grid-cols-2 px-5 py-3 text-xs text-gray-500">
                <span>Price (USDT)</span>
                <span className="text-right">Amount (BTC)</span>
              </div>

              <div className="px-5">
                {sells.map(([price, amount]) => (
                  <div
                    key={price}
                    className="grid grid-cols-2 py-1.5 text-xs"
                  >
                    <span className="text-red-400">{price}</span>
                    <span className="text-right text-gray-400">{amount}</span>
                  </div>
                ))}

                <div className="my-2 border-y border-white/5 py-2 text-sm font-semibold text-white">
                  $67,842.50
                </div>

                {buys.map(([price, amount]) => (
                  <div
                    key={price}
                    className="grid grid-cols-2 py-1.5 text-xs"
                  >
                    <span className="text-emerald-400">{price}</span>
                    <span className="text-right text-gray-400">{amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="border-b border-white/10 px-5 py-4 text-sm font-semibold">
                Recent Trades
              </div>

              <div className="grid grid-cols-3 px-5 py-3 text-xs text-gray-500">
                <span>Price</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Time</span>
              </div>

              {[
                ["67,842.50", "0.021", "12:27"],
                ["67,841.90", "0.008", "12:27"],
                ["67,839.40", "0.043", "12:26"],
                ["67,845.10", "0.014", "12:26"],
                ["67,837.80", "0.031", "12:25"],
                ["67,850.20", "0.012", "12:25"],
              ].map(([price, amount, time], i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 px-5 py-2 text-xs"
                >
                  <span
                    className={
                      i % 2
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {price}
                  </span>
                  <span className="text-right text-gray-400">{amount}</span>
                  <span className="text-right text-gray-500">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT TRADING PANEL */}
        <aside className="bg-[#070b11]">
          <div className="border-b border-white/10 p-5">
            <div className="mb-5 text-sm font-semibold">Spot Trading</div>

            <div className="mb-5 grid grid-cols-2 rounded-lg bg-[#0b1119] p-1">
              <button
                onClick={() => setSide("buy")}
                className={`rounded-md py-2 text-sm font-semibold ${
                  side === "buy"
                    ? "bg-emerald-500 text-black"
                    : "text-gray-500"
                }`}
              >
                Buy
              </button>

              <button
                onClick={() => setSide("sell")}
                className={`rounded-md py-2 text-sm font-semibold ${
                  side === "sell"
                    ? "bg-red-500 text-white"
                    : "text-gray-500"
                }`}
              >
                Sell
              </button>
            </div>

            <div className="mb-5 flex justify-between text-xs text-gray-500">
              <span>Available</span>
              <span>
                {side === "buy" ? "10,000.00 USDT" : "0.1482 BTC"}
              </span>
            </div>

            <label className="mb-2 block text-xs text-gray-500">
              Price
            </label>

            <div className="mb-4 flex rounded-lg border border-white/10 bg-[#0b1119]">
              <input
                value="67,842.50"
                readOnly
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
              <span className="px-3 py-3 text-xs text-gray-500">USDT</span>
            </div>

            <label className="mb-2 block text-xs text-gray-500">
              Amount
            </label>

            <div className="mb-4 flex rounded-lg border border-white/10 bg-[#0b1119]">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
              <span className="px-3 py-3 text-xs text-gray-500">BTC</span>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex justify-between text-xs text-gray-500">
                <span>Total</span>
                <span>USDT</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0b1119] px-3 py-3 text-sm text-gray-400">
                {amount
                  ? (
                      Number(amount.replace(",", "")) * 67842.5
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </div>
            </div>

            <button
              className={`w-full rounded-lg py-3 text-sm font-bold ${
                side === "buy"
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-red-500 text-white hover:bg-red-400"
              }`}
              onClick={() =>
                alert(
                  "Demo mode: trading is not connected to real funds."
                )
              }
            >
              {side === "buy" ? "Buy BTC" : "Sell BTC"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-600">
              Demo trading only
            </p>
          </div>

          {/* ASSETS */}
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">My Assets</span>
              <span className="text-xs text-gray-500">Demo</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b1119] p-4">
              <div className="text-xs text-gray-500">
                Estimated Balance
              </div>

              <div className="mt-1 text-2xl font-bold">
                $20,438.72
              </div>

              <div className="mt-1 text-xs text-emerald-400">
                +$1,284.42 today
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">USDT</div>
                    <div className="text-xs text-gray-500">
                      Tether
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">10,000.00</div>
                    <div className="text-xs text-gray-500">
                      $10,000
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">BTC</div>
                    <div className="text-xs text-gray-500">
                      Bitcoin
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">0.1482</div>
                    <div className="text-xs text-gray-500">
                      $10,052
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#070b11]">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-3 px-5 py-5 text-xs text-gray-600 md:flex-row lg:px-8">
          <span>© 2026 CryptoLab</span>
          <span>Demo exchange interface — no real transactions</span>
        </div>
      </footer>
    </main>
  );
}
