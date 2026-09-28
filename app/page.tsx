export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05080c",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", margin: 0 }}>
          CryptoLab
        </h1>

        <p style={{ color: "#8b98a8", marginTop: "12px" }}>
          Crypto Exchange
        </p>
      </div>
    </main>
  );
}
