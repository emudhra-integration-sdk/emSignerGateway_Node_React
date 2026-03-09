import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import jsonData from "./assets/DataEntity.json";

function FormComponent() {
  const [loading, setLoading] = useState(false);
  const [parameters, setParameters] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    setParameters(null);

    try {
      const requestPayload = {
        ...jsonData,
        ReferenceNumber: uuidv4(),
      };

      const response = await axios.post(
        "http://10.80.245.103:3000/emSignerParameters",
        requestPayload
      );

      setParameters(response.data);
    } catch (error) {
      console.error("Error calling API:", error);
      setErrorMsg("Connection failed. Check network.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.glassCard}>
        {/* Compact Header */}
        <header style={styles.header}>
          <div style={styles.iconWrapper}>🔐</div>
          <h1 style={styles.title}>
            emSigner <span style={styles.highlightText}>Pro</span>
          </h1>
          {!parameters && <p style={styles.subtitle}>Secure Gateway</p>}
        </header>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {!parameters ? (
            <div style={styles.initState}>
              <button
                onClick={fetchData}
                disabled={loading}
                style={loading ? styles.btnLoading : styles.btnPrimary}
              >
                {loading ? "Connecting..." : "Initialize Session"}
              </button>
              {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}
            </div>
          ) : (
            <div style={styles.activeState}>
              <div style={styles.statusBadge}>✅ SESSION ACTIVE</div>

              {/* White Box: Reduced vertical padding */}
              <div style={styles.whiteBox}>
                {["Parameter1", "Parameter2", "Parameter3"].map((key, index) => (
                  <div 
                    key={key} 
                    style={{
                      ...styles.paramRow,
                      borderBottom: index === 2 ? "none" : "1px solid #f1f5f9"
                    }}
                  >
                    <div style={styles.textGroup}>
                      <span style={styles.paramLabel}>{key}</span>
                      <span style={styles.paramValue} title={parameters[key]}>
                        {parameters[key] || "—"}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleCopy(key, parameters[key])}
                      style={styles.copyBtn}
                      title="Copy value"
                    >
                      {copiedKey === key ? (
                        <span style={{color: "#10b981", fontSize: "16px"}}>✓</span>
                      ) : (
                        <span style={{fontSize: "14px"}}>📋</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Form & Buttons */}
              <form
                method="post"
                action="https://demogateway-core.emsigner.com/Secure/index"
                style={{ width: "100%" }}
              >
                <input type="hidden" name="Parameter1" value={parameters.Parameter1 || ""} />
                <input type="hidden" name="Parameter2" value={parameters.Parameter2 || ""} />
                <input type="hidden" name="Parameter3" value={parameters.Parameter3 || ""} />

                <div style={styles.actionRow}>
                  <button
                    type="button"
                    onClick={() => setParameters(null)}
                    style={styles.btnSecondary}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.btnSuccess}>
                    Confirm & Sign →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Background Ambience */}
      <div style={styles.glowOrb1}></div>
      <div style={styles.glowOrb2}></div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8dadeff", 
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glassCard: {
    width: "500px", // WIDE WIDTH KEPT
    background: "rgba(30, 41, 59, 0.75)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    padding: "24px", // Reduced padding (was 32px) to save height
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: "16px", // Reduced margin (was 24px)
  },
  iconWrapper: {
    fontSize: "24px",
    marginBottom: "8px", // Reduced margin
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.05)",
    width: "48px", // Smaller icon circle
    height: "48px",
    borderRadius: "50%",
  },
  title: {
    color: "#f8fafc",
    fontSize: "22px", // Slightly smaller font
    margin: "0 0 2px 0",
    fontWeight: "500",
  },
  highlightText: {
    fontWeight: "800",
    color: "#38bdf8",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: 0,
  },
  contentArea: {
    width: "100%",
  },
  
  /* Buttons */
  initState: { width: "100%" },
  btnPrimary: {
    width: "100%",
    padding: "12px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
  btnLoading: {
    width: "100%",
    padding: "12px",
    background: "#1e293b",
    color: "#64748b",
    border: "1px solid #334155",
    borderRadius: "10px",
    cursor: "wait",
  },
  
  /* Active State */
  activeState: {
    width: "100%",
    animation: "fadeIn 0.3s ease-out",
  },
  statusBadge: {
    textAlign: "center",
    color: "#10b981",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "12px", // Reduced margin
  },
  
  /* White Box */
  whiteBox: {
    background: "#dfc7c7ff",
    borderRadius: "12px",
    padding: "12px 20px", // Reduced vertical padding inside box
    marginBottom: "16px", // Reduced margin below box
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  paramRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0", // Tighter rows
    gap: "10px",
  },
  textGroup: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  },
  paramLabel: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "2px",
  },
  paramValue: {
    fontSize: "13px",
    color: "#0f172a",
    fontFamily: "monospace",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  copyBtn: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    width: "28px", // Smaller button
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  
  /* Footer Buttons */
  actionRow: {
    display: "flex",
    gap: "12px",
  },
  btnSecondary: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  btnSuccess: {
    flex: 2,
    padding: "12px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
  },
  errorMsg: {
    marginTop: "10px",
    color: "#f87171",
    fontSize: "12px",
    textAlign: "center",
  },
  
  /* Backgrounds */
  glowOrb1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#38bdf8",
    filter: "blur(100px)",
    borderRadius: "50%",
    top: "10%",
    left: "10%",
    opacity: 0.15,
  },
  glowOrb2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#818cf8",
    filter: "blur(100px)",
    borderRadius: "50%",
    bottom: "10%",
    right: "10%",
    opacity: 0.15,
  }
};

export default FormComponent;