import { FormEvent, useState } from "react";

type ReceiptStatus = "Committed" | "Disputed" | "Revealed";

type ReceiptData = {
  receiptId: string;
  commitment: string;
  clientAddress: string;
  projectTag: string;
  deliveryHash: string;
  salt: string;
  status: ReceiptStatus;
};

const emptyReceipt: ReceiptData = {
  receiptId: "",
  commitment: "",
  clientAddress: "",
  projectTag: "",
  deliveryHash: "",
  salt: "",
  status: "Committed"
};

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [commitmentForm, setCommitmentForm] = useState({
    commitment: "",
    clientAddress: "",
    projectTag: ""
  });

  const [disputeReceiptId, setDisputeReceiptId] = useState("");
  const [revealForm, setRevealForm] = useState({
    receiptId: "",
    deliveryHash: "",
    salt: ""
  });

  const [viewerReceiptId, setViewerReceiptId] = useState("");
  const [activeReceipt, setActiveReceipt] =
    useState<ReceiptData>(emptyReceipt);

  /* ------------------------
     Protocol Actions (Demo)
  -------------------------*/

  const handleCommit = (e: FormEvent) => {
    e.preventDefault();

    setActiveReceipt({
      receiptId: "1",
      deliveryHash: "",
      salt: "",
      ...commitmentForm,
      status: "Committed"
    });
  };

  const handleDispute = (e: FormEvent) => {
    e.preventDefault();

    setActiveReceipt((current) => ({
      ...current,
      status: "Disputed"
    }));

    setDisputeReceiptId("");
  };

  const handleReveal = (e: FormEvent) => {
    e.preventDefault();

    setActiveReceipt((current) => ({
      ...current,
      ...revealForm,
      status: "Revealed"
    }));
  };

  const handleViewerLoad = (e: FormEvent) => {
    e.preventDefault();

    setActiveReceipt((current) => ({
      ...current,
      receiptId: viewerReceiptId
    }));
  };

  return (
    <div className="page">
    {/* HERO */}
<header className="hero">
  <div>
    <p className="eyebrow">STARKNET PRIVACY PROTOCOL</p>

    <div className="wordmark">
      <svg
        className="seal"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a00" />
            <stop offset="100%" stopColor="#ffd60a" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#sealGradient)"
          strokeWidth="3"
          fill="none"
        />

        <circle
          cx="50"
          cy="50"
          r="28"
          stroke="url(#sealGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />

        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + 38 * Math.cos(angle);
          const y1 = 50 + 38 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 50 + 42 * Math.sin(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#sealGradient)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <h1>Stampd</h1>
    </div>

    <p className="tagline">
      Privacy-first proof of delivery on Starknet.
    </p>
  </div>

  <button
    className="primary-btn"
    onClick={() => setWalletConnected(!walletConnected)}
  >
    {walletConnected ? "Wallet Connected" : "Connect Wallet"}
  </button>
</header>
      {/* LIFECYCLE VISUAL */}
      <section className="lifecycle">
        <span
          className={
            activeReceipt.status === "Committed" ? "active" : ""
          }
        >
          Committed
        </span>
        <span
          className={
            activeReceipt.status === "Disputed" ? "active" : ""
          }
        >
          Disputed
        </span>
        <span
          className={
            activeReceipt.status === "Revealed" ? "active" : ""
          }
        >
          Revealed
        </span>
      </section>

      <main className="grid">
        {/* STAMP */}
        <section className="card">
          <h2>Stamp Commitment</h2>
          <form onSubmit={handleCommit} className="stack">
            <input
              placeholder="Commitment"
              value={commitmentForm.commitment}
              onChange={(e) =>
                setCommitmentForm((c) => ({
                  ...c,
                  commitment: e.target.value
                }))
              }
              required
            />
            <input
              placeholder="Client Address"
              value={commitmentForm.clientAddress}
              onChange={(e) =>
                setCommitmentForm((c) => ({
                  ...c,
                  clientAddress: e.target.value
                }))
              }
              required
            />
            <input
              placeholder="Project Tag"
              value={commitmentForm.projectTag}
              onChange={(e) =>
                setCommitmentForm((c) => ({
                  ...c,
                  projectTag: e.target.value
                }))
              }
              required
            />
            <button type="submit" className="secondary-btn">
              Commit Stamp
            </button>
          </form>
        </section>

        {/* DISPUTE */}
        <section className="card">
          <h2>Dispute Receipt</h2>
          <form onSubmit={handleDispute} className="stack">
            <input
              placeholder="Receipt ID"
              value={disputeReceiptId}
              onChange={(e) =>
                setDisputeReceiptId(e.target.value)
              }
              required
            />
            <button type="submit" className="secondary-btn">
              Open Dispute
            </button>
          </form>
        </section>

        {/* REVEAL */}
        <section className="card">
          <h2>Reveal Delivery</h2>
          <form onSubmit={handleReveal} className="stack">
            <input
              placeholder="Receipt ID"
              value={revealForm.receiptId}
              onChange={(e) =>
                setRevealForm((c) => ({
                  ...c,
                  receiptId: e.target.value
                }))
              }
              required
            />
            <input
              placeholder="Delivery Hash"
              value={revealForm.deliveryHash}
              onChange={(e) =>
                setRevealForm((c) => ({
                  ...c,
                  deliveryHash: e.target.value
                }))
              }
              required
            />
            <input
              placeholder="Salt"
              value={revealForm.salt}
              onChange={(e) =>
                setRevealForm((c) => ({
                  ...c,
                  salt: e.target.value
                }))
              }
              required
            />
            <button type="submit" className="secondary-btn">
              Reveal Proof
            </button>
          </form>
        </section>

        {/* VIEWER */}
        <section className="card viewer-card">
          <h2>Receipt Viewer</h2>

          <form onSubmit={handleViewerLoad} className="stack">
            <input
              placeholder="Receipt ID"
              value={viewerReceiptId}
              onChange={(e) =>
                setViewerReceiptId(e.target.value)
              }
              required
            />
            <button type="submit" className="secondary-btn">
              Load Receipt
            </button>
          </form>

          <div className="receipt-display">
            <h3>Receipt State</h3>
            <ul>
              <li><strong>ID:</strong> {activeReceipt.receiptId || "—"}</li>
              <li><strong>Status:</strong> {activeReceipt.status}</li>
              <li><strong>Commitment:</strong> {activeReceipt.commitment || "—"}</li>
              <li><strong>Client:</strong> {activeReceipt.clientAddress || "—"}</li>
              <li><strong>Project Tag:</strong> {activeReceipt.projectTag || "—"}</li>
              <li><strong>Delivery Hash:</strong> {activeReceipt.deliveryHash || "—"}</li>
              <li><strong>Salt:</strong> {activeReceipt.salt || "—"}</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;