import React, { useEffect, useState } from "react";
import axios from "axios";

function DownloadPDF() {
  const [referenceNumber, setReferenceNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // URL-ல இருந்து (உதாரணம்: ?ref=REF-12345) ID-ஐ எடுக்குறோம்
    const queryParams = new URLSearchParams(window.location.search);
    const ref = queryParams.get("ref");
    setReferenceNumber(ref);
  }, []);

  const handleDownload = async () => {
    if (!referenceNumber) return;
    
    try {
      setLoading(true);

      // Node.js Backend-ஐ கூப்பிடுறோம்
      const response = await axios.get(
        `http://localhost:3000/api/downloadpdf?ref=${referenceNumber}`,
        { responseType: "blob" } // இது PDF file என்பதால் blob format-ல வாங்குறோம்
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Anchor tag உருவாக்கி தானா டவுன்லோட் ஆக வைக்குறோம்
      const link = document.createElement("a");
      link.href = url;
      link.download = referenceNumber + "_signed.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <header style={styles.header}>
          <div style={styles.successIconBadge}>✓</div>
          <h1 style={styles.title}>Document <span style={styles.greenText}>Signed</span></h1>
          <p style={styles.subtitle}>The digital signature process is complete.</p>
        </header>

        <div style={styles.fadeDown}>
          <div style={styles.whiteParamBox}>
            <div style={styles.paramItem}>
              <span style={styles.paramLabel}>Transaction Ref</span>
              <span style={styles.paramValue}>
                {referenceNumber || "Fetching..."}
              </span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading || !referenceNumber}
            style={loading ? styles.disabledBtn : styles.downloadBtn}
          >
            {loading ? "Downloading..." : "⬇ Download Signed PDF"}
          </button>
          
          <div style={styles.footerNote}>
            Secure link expires in 15 minutes.
          </div>
        </div>
      </div>

      <div style={styles.blobGreen}></div>
      <div style={styles.blobBlue}></div>
    </div>
  );
}

// உங்களோட CSS Styles அப்படியே இங்க வரும்...
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8dade", 
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glassCard: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px 24px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "360px",
    zIndex: 10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
  },
  header: { marginBottom: "24px" },
  successIconBadge: {
    fontSize: "32px", width: "60px", height: "60px",
    margin: "0 auto 16px auto", display: "flex", alignItems: "center",
    justifyContent: "center", background: "rgba(16, 185, 129, 0.15)",
    color: "#10b981", borderRadius: "50%",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
  },
  title: { color: "#f8fafc", fontSize: "20px", margin: "0 0 6px 0", fontWeight: "500" },
  greenText: { fontWeight: "800", color: "#10b981" },
  subtitle: { color: "#94a3b8", fontSize: "13px", margin: 0 },
  whiteParamBox: {
    background: "#ffffff", borderRadius: "12px", padding: "16px",
    marginBottom: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
    borderLeft: "4px solid #10b981",
  },
  paramItem: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  paramLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" },
  paramValue: { fontSize: "13px", color: "#0f172a", fontFamily: "monospace", fontWeight: "600", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  downloadBtn: {
    width: "100%", background: "linear-gradient(to right, #3b82f6, #2563eb)",
    color: "white", border: "none", padding: "14px", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)", transition: "transform 0.2s",
  },
  disabledBtn: { width: "100%", background: "#334155", color: "#94a3b8", padding: "14px", borderRadius: "10px", border: "none", cursor: "not-allowed" },
  footerNote: { marginTop: "16px", fontSize: "11px", color: "#64748b" },
  fadeDown: { animation: "fadeIn 0.5s ease-out" },
  blobGreen: { position: "absolute", width: "300px", height: "300px", background: "#10b981", filter: "blur(120px)", borderRadius: "50%", top: "-5%", right: "10%", opacity: 0.2 },
  blobBlue: { position: "absolute", width: "300px", height: "300px", background: "#3b82f6", filter: "blur(120px)", borderRadius: "50%", bottom: "-5%", left: "10%", opacity: 0.15 },
};

export default DownloadPDF;