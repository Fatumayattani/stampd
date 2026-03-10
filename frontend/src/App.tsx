import { FormEvent, useState } from "react";
import { Contract } from "starknet";
import { STAMPD_CONTRACT } from "./config";
import { STAMPD_ABI } from "./abi/stampd";
import logo from "./assets/stampd-logo.svg";

declare global {
  interface Window {
    starknet?: any;
  }
}

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
  const [walletAddress, setWalletAddress] = useState("");

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
     WALLET CONNECT
  -------------------------*/

  const connectWallet = async () => {
    if (!window.starknet) {
      alert("Ready Wallet not detected");
      return;
    }

    try {
      const accounts = await window.starknet.enable();

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const getContract = () => {
  if (!window.starknet?.account) {
    throw new Error("Wallet not connected");
  }

  return new Contract(
    STAMPD_ABI,
    STAMPD_CONTRACT,
    window.starknet.account as any
  );
};

  /* ------------------------
     STAMP
  -------------------------*/

  const handleCommit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const contract = getContract();

      const tx = await contract.stamp(
  commitmentForm.commitment.toString(),
  commitmentForm.clientAddress,
  commitmentForm.projectTag.toString()
);

      console.log("STAMP TX:", tx);

      setActiveReceipt({
        receiptId: "pending",
        deliveryHash: "",
        salt: "",
        ...commitmentForm,
        status: "Committed"
      });

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  /* ------------------------
     DISPUTE
  -------------------------*/

  const handleDispute = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const contract = getContract();

      const tx = await contract.dispute(disputeReceiptId.toString());

      console.log("DISPUTE TX:", tx);

      setActiveReceipt((current) => ({
        ...current,
        status: "Disputed"
      }));

      setDisputeReceiptId("");

    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------------
     REVEAL
  -------------------------*/

  const handleReveal = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const contract = getContract();

      const tx = await contract.reveal(
  revealForm.receiptId.toString(),
  revealForm.deliveryHash.toString(),
  revealForm.salt.toString()
);

      console.log("REVEAL TX:", tx);

      setActiveReceipt((current) => ({
        ...current,
        ...revealForm,
        status: "Revealed"
      }));

    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------------
     VIEW RECEIPT
  -------------------------*/

  const handleViewerLoad = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const contract = getContract();

      const receipt = await contract.get_receipt(viewerReceiptId);

      setActiveReceipt({
        receiptId: viewerReceiptId,
        commitment: receipt.commitment,
        clientAddress: receipt.client,
        projectTag: receipt.project_tag,
        deliveryHash: "",
        salt: "",
        status: receipt.status
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">

      <header className="hero">

        <div>
          <p className="eyebrow">STARKNET PRIVACY PROTOCOL</p>

          <div className="wordmark">
          <img src={logo} className="logo" alt="Stampd logo" />
            <h1>Stampd</h1>
          </div>

          <p className="tagline">
            Privacy-first proof of delivery on Starknet.
          </p>
        </div>

        <button className="primary-btn" onClick={connectWallet}>
          {walletConnected
            ? shortenAddress(walletAddress)
            : "Connect Wallet"}
        </button>

      </header>

      <section className="lifecycle">
        <span className={activeReceipt.status === "Committed" ? "active" : ""}>
          Committed
        </span>
        <span className={activeReceipt.status === "Disputed" ? "active" : ""}>
          Disputed
        </span>
        <span className={activeReceipt.status === "Revealed" ? "active" : ""}>
          Revealed
        </span>
      </section>

      <main className="grid">

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