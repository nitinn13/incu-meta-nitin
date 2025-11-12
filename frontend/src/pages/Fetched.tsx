import React, { useEffect, useState } from "react";
import axios from "axios";

// Field/area options
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
type IncubatorDetails = {
  founder: string;
  invested_companies: string[];
  holdings: string[];
  growth_stats: string;
  dashboard_insights: string;
};

const Section = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <div style={{
    margin: "12px 0 10px 0",
    display: "flex",
    alignItems: "flex-start",
    gap: 11
  }}>
    <span style={{ fontSize: 22, lineHeight: "20px" }}>{icon}</span>
    <div>
      <div style={{
        fontSize: 13,
        color: "#6b7280",
        fontWeight: 700,
        marginBottom: 2,
        textTransform: "uppercase",
        letterSpacing: ".7px"
      }}>{label}</div>
      <div style={{
        fontSize: 16,
        color: "#133047",
        fontWeight: 600,
        lineHeight: 1.5,
        maxWidth: 320,
        wordBreak: "break-word"
      }}>{value || '—'}</div>
    </div>
  </div>
);

const IncubatorCards: React.FC = () => {
  const [field, setField] = useState<string>(FIELD_OPTIONS[0]);
  const [incubators, setIncubators] = useState<Incubator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedIncubator, setSelectedIncubator] = useState<Incubator | null>(null);
  const [details, setDetails] = useState<IncubatorDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Animation
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (selectedIncubator) setShowDetails(true);
  }, [selectedIncubator]);

  const fetchIncubators = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/incubators", {
        model: "gemini-2.0-flash",
        field
      });
      setIncubators(response.data.incubators);
    } catch (e) {
      setIncubators([]);
    }
    setLoading(false);
  };

  const fetchDetails = async (inc: Incubator) => {
    setSelectedIncubator(inc);
    setLoadingDetails(true);
    setDetails(null);
    setDetailsError(null);
    try {
      const response = await axios.post("http://localhost:3000/api/incubator-details", {
        model: "gemini-2.0-flash",
        incubator_name: inc.name
      });
      setDetails(response.data.details);
    } catch (e: any) {
      setDetails(null);
      setDetailsError("Failed to fetch details. Try again.");
    }
    setLoadingDetails(false);
  };

  useEffect(() => {
    fetchIncubators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Startup Incubators</h1>
          <p style={styles.subtitle}>
            Discover incubators by focus area to power your startup journey
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

      {/* Cards Grid */}
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
            <div
              key={`${inc.name}-${index}`}
              style={styles.card}
              onClick={() => fetchDetails(inc)}
              title="Click to view dashboard"
            >
              <div style={styles.cardHeader}>
                {inc.logo_url && (
                  <img
                    src={inc.logo_url}
                    alt={`${inc.name} logo`}
                    style={styles.logo}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/previews/024/121/970/non_2x/startup-icon-for-your-website-mobile-presentation-and-logo-design-free-vector.jpg'; }}
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

      {/* Details Popup Modal w/ animation and dashboard */}
      {selectedIncubator && (
        <div
          style={{
            ...styles.detailsPopupBackdrop,
            opacity: showDetails ? 1 : 0,
            pointerEvents: showDetails ? "all" : "none",
            transition: "opacity 250ms cubic-bezier(.5,1.5,.6,1)",
          }}
          onClick={() => {
            setShowDetails(false);
            setTimeout(() => {
              setSelectedIncubator(null);
              setDetails(null);
              setDetailsError(null);
            }, 250);
          }}
        >
          <div
            style={{
              ...styles.detailsPopup,
              transform: showDetails ? "translateY(0)" : "translateY(40px)",
              opacity: showDetails ? 1 : 0,
              transition: "all 250ms cubic-bezier(.5,1.5,.6,1)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={styles.detailsClose}
              onClick={() => {
                setShowDetails(false);
                setTimeout(() => {
                  setSelectedIncubator(null);
                  setDetails(null);
                  setDetailsError(null);
                }, 250);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 18
            }}>
              <img
                src={selectedIncubator.logo_url}
                alt={selectedIncubator.name + " logo"}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 14,
                  background: "#f1f5f9",
                  border: "1.5px solid #bde0fe"
                }}
                onError={e => (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/previews/024/121/970/non_2x/startup-icon-for-your-website-mobile-presentation-and-logo-design-free-vector.jpg'}
              />
              <div>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#233a4c",
                  margin: "0 0 2px 0"
                }}>{selectedIncubator.name}</h2>
                <span style={{
                  color: "#2563eb",
                  background: "#e0e7ff",
                  borderRadius: 10,
                  padding: "3px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  marginLeft: 3
                }}>{selectedIncubator.country}</span>
              </div>
            </div>
            <div style={{
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              padding: 14,
              marginBottom: 16,
              background: "#f8fafc",
              color: "#475569",
              fontSize: 14
            }}>
              {selectedIncubator.description}
            </div>
            {loadingDetails ? (
              <div style={{ textAlign: "center" }}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading dashboard...</p>
              </div>
            ) : detailsError ? (
              <div>
                <p style={{ color: "#ef4444", fontWeight: 600 }}>{detailsError}</p>
              </div>
            ) : details ? (
              <div>
                <Section icon="🧑‍💼" label="Founder" value={details.founder} />
                <Section icon="💹" label="Growth" value={details.growth_stats} />
                <Section
                  icon="📦"
                  label="Holdings"
                  value={details.holdings && details.holdings.length > 0
                    ? details.holdings.join(", ")
                    : "—"}
                />
                <Section
                  icon="🚀"
                  label="Invested Companies"
                  value={details.invested_companies && details.invested_companies.length > 0
                    ? details.invested_companies.join(", ")
                    : "—"}
                />
                <Section icon="📈" label="Summary" value={details.dashboard_insights} />
              </div>
            ) : null}
          </div>
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
    transition: "0.2s box-shadow, 0.2s transform",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    position: "relative",
    willChange: "box-shadow,transform",
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
    marginLeft: 6,
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
  detailsPopupBackdrop: {
    position: "fixed",
    zIndex: 200,
    left: 0, top: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.21)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 220ms",
  },
  detailsPopup: {
    background: "#fff",
    borderRadius: 22,
    padding: "30px 32px",
    minWidth: 340,
    maxWidth: 440,
    boxShadow: "0 16px 70px rgba(47,76,130,.17), 0 2px 8px #b6c2d9",
    position: "relative",
    overflowY: "auto",
    maxHeight: "87vh"
  },
  detailsClose: {
    position: "absolute",
    right: 12,
    top: 12,
    background: "#e5e7eb",
    border: "none",
    fontSize: 27,
    borderRadius: "100%",
    width: 34,
    height: 34,
    lineHeight: "34px",
    textAlign: "center",
    color: "#65799b",
    cursor: "pointer",
    boxShadow: "0 1px 4px #dbeafe",
    transition: "background 0.14s"
  }
};

export default IncubatorCards;
