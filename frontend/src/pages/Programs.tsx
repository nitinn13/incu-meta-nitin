import React, { useEffect, useState } from "react";
import axios from "axios";

// Field/area options (customize or fetch from backend)
const FIELD_OPTIONS = [
  "Artificial Intelligence",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Clean Energy",
  "Agritech",
  "Blockchain",
  "Other"
];

type Incubator = {
  name: string;
  description: string;
  country: string;
  most_invested_field: string;
  logo_url: string;
};

const IncubatorCards: React.FC = () => {
  const [field, setField] = useState<string>(FIELD_OPTIONS[0]);
  const [incubators, setIncubators] = useState<Incubator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchIncubators = async () => {
    setLoading(true);
    try {
      // Always use gemini-2.0-flash, pass selected field to backend
      const response = await axios.post("http://localhost:3000/api/programs", {
        model: "gemini-2.0-flash",
        field
      });
      setIncubators(response.data.incubators);
    } catch (e) {
      console.error("API error:", e);
      setIncubators([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncubators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Incubation Programs</h1>
          <p style={styles.subtitle}>
            Discover incubation programs by focus area to power your startup journey
          </p>
        </div>
      </div>

      {/* Field Selector */}
      <div style={styles.controlsBar}>
        <div style={styles.selectWrapper}>
          <label style={styles.label}>Field</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            style={styles.select}
          >
            {FIELD_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <button onClick={fetchIncubators} style={styles.refreshButton}>
          <span style={styles.refreshIcon}>↻</span>
          Refresh
        </button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading incubators...</p>
        </div>
      ) : incubators.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No incubators found</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {incubators.map((inc, index) => (
            <div key={`${inc.name}-${index}`} style={styles.card}>
              <div style={styles.cardHeader}>
                {/* Logo display */}
                {inc.logo_url && (
                  <img
                    src={inc.logo_url}
                    alt={`${inc.name} logo`}
                    style={styles.logo}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?'; }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={styles.cardTitle}>{inc.name}</h3>
                  <span style={styles.badge}>{inc.country}</span>
                </div>
              </div>
              <p style={styles.description}>{inc.description}</p>
              <div style={styles.cardFooter}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Focus Area</span>
                  <span style={styles.metaValue}>{inc.most_invested_field}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


  




const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "32px 24px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: 32,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    margin: 0,
    fontWeight: 400,
  },
  controlsBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  selectWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  select: {
    padding: "10px 16px",
    fontSize: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease",
    minWidth: 200,
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(59, 130, 246, 0.3)",
  },
  refreshIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
    gap: 16,
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
    flex: 1,
    lineHeight: 1.3,
  },
  badge: {
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    whiteSpace: "nowrap",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 20px 0",
  },
  cardFooter: {
    paddingTop: 16,
    borderTop: "1px solid #f3f4f6",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: "contain",
    marginRight: 16,
    borderRadius: 8,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
  },

};

export default IncubatorCards;
