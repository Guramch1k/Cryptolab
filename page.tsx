"use client";

import { useState } from "react";
import {
  ArrowDownToLine, ArrowUpFromLine, BarChart3, ChevronDown,
  CircleUserRound, LayoutDashboard, Menu, Search, Settings,
  ShieldCheck, Wallet, X
} from "lucide-react";

const markets = [
  { pair: "BTC/USDT", price: "67,842.12", change: "+2.41%", volume: "1.82B" },
  { pair: "ETH/USDT", price: "2,614.38", change: "+1.73%", volume: "824M" },
  { pair: "TRX/USDT", price: "0.3448", change: "+0.92%", volume: "126M" },
  { pair: "SOL/USDT", price: "161.24", change: "-0.38%", volume: "493M" }
];

const balances = [
  { asset: "USDT", name: "Tether", amount: "12,480.52", value: "$12,480.52" },
  { asset: "BTC", name: "Bitcoin", amount: "0.0842", value: "$5,712.31" },
  { asset: "ETH", name: "Ethereum", amount: "1.42", value: "$3,712.82" }
];

const nav = [
  ["Dashboard", LayoutDashboard],
  ["Markets", BarChart3],
  ["Wallets", Wallet],
  ["Deposit", ArrowDownToLine],
  ["Withdraw", ArrowUpFromLine],
  ["Security", ShieldCheck],
  ["Settings", Settings]
] as const;

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070a0f] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070a0f]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-7">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-white/60 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">C</div>
              <span className="text-lg font-bold tracking-tight">CryptoLab</span>
            </div>
          </div>

          <div className="hidden w-[360px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
            <Search size={17} className="text-white/35" />
            <span className="text-sm text-white/30">Search markets</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden rounded-lg px-3 py-2 text-sm text-white/65 md:block">English</button>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2">
              <CircleUserRound size={18} />
              <span className="hidden text-sm md:block">Demo User</span>
              <ChevronDown size={14} className="text-white/45" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className={`fixed inset-y-16 left-0 z-20 w-64 border-r border-white/10 bg-[#070a0f] p-4 transition-transform md:static md:block md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="space-y-1">
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => { setActive(label); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active === label
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/60">
              <ShieldCheck size={15} /> Account status
            </div>
            <div className="text-sm font-medium">Demo account</div>
            <p className="mt-1 text-xs leading-5 text-white/35">
              Trading and wallet balances are simulated in this prototype.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-4 md:p-7">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-1 text-sm text-white/40">Overview</p>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Welcome to CryptoLab
              </h1>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">
                Deposit
              </button>
              <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold">
                Withdraw
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total Balance", "$21,905.65", "+4.82%"],
              ["Available", "$18,240.31", "+2.17%"],
              ["In Orders", "$3,665.34", "12 orders"],
              ["24h P&L", "+$486.20", "+2.27%"]
            ].map(([title, value, meta]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <p className="text-xs text-white/40">{title}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
                <p className="mt-2 text-xs text-emerald-400">{meta}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Market overview</h2>
                  <p className="mt-1 text-xs text-white/35">Simulated market data</p>
                </div>
                <button className="text-xs text-white/45">View all</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="text-xs text-white/30">
                    <tr>
                      <th className="pb-3">Market</th>
                      <th className="pb-3">Last price</th>
                      <th className="pb-3">24h</th>
                      <th className="pb-3 text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m) => (
                      <tr key={m.pair} className="border-t border-white/6">
                        <td className="py-4 font-medium">{m.pair}</td>
                        <td className="py-4">{m.price}</td>
                        <td className={`py-4 ${m.change.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                          {m.change}
                        </td>
                        <td className="py-4 text-right text-white/55">{m.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Assets</h2>
                <button className="text-xs text-white/45">Wallets</button>
              </div>
              <div className="space-y-2">
                {balances.map((b) => (
                  <div key={b.asset} className="flex items-center justify-between rounded-xl bg-white/[0.025] px-3 py-3">
                    <div>
                      <div className="font-medium">{b.asset}</div>
                      <div className="text-xs text-white/35">{b.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{b.amount}</div>
                      <div className="text-xs text-white/35">{b.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Portfolio performance</h2>
                <p className="mt-1 text-xs text-white/35">Demo visualization — 30 days</p>
              </div>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55">30D</button>
            </div>
            <div className="flex h-40 items-end gap-1.5">
              {[38,45,42,53,49,62,58,66,61,70,68,76,73,82,79,88,84,92,87,96,91,100,95,106,102,112,108,118,114,124].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-white/[0.16]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}