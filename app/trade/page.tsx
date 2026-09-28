"use client";

import Link from "next/link";

export default function TradePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05080d",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>CryptoLab Trade</h1>

      <p style={{ color: "#7d8794" }}>
        Trade page is working
      </p>

      <Link
        href="/exchange"
        style={{
          color: "#05080d",
          background: "#ffffff",
          padding: "12px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Back to Exchange
      </Link>
    </main>
  );
}
