import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpportunityCard from "./OpportunityCard";
import { API_ENDPOINTS } from "../apiConfig";
import "./OpportunityList.module.css";

const OpportunityList = ({ viewMode }) => {
  const { id } = useParams(); // Extract the dynamic ID parameter from the URL string
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize shortlist state from browser LocalStorage
  const [shortlistedItems, setShortlistedItems] = useState(() => {
    const savedShortlist = localStorage.getItem("user_shortlist");
    return savedShortlist ? JSON.parse(savedShortlist) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Automatically sync shortlist to LocalStorage whenever changes occur
  useEffect(() => {
    localStorage.setItem("user_shortlist", JSON.stringify(shortlistedItems));
  }, [shortlistedItems]);

  // Stable API fetch callback function
  const fetchOpportunities = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.OPPORTUNITIES);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      // 🟢 Add a brief artificial timeout delay during local development
      // to let you visually see and test your animation effects
      setTimeout(() => {
        setOpportunities(data);
        setLoading(false);
        setRefreshing(false);
      }, 1000); // 1-second delay
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Safe initial data loader on mounting
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      if (isMounted) await fetchOpportunities();
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [fetchOpportunities]);

  // Derived arrays matching filter drop-down arrays dynamically from the API data
  const uniqueSectors = [
    ...new Set(opportunities.map((opp) => opp.sector)),
  ].filter(Boolean);
  const uniqueTypes = [...new Set(opportunities.map((opp) => opp.type))].filter(
    Boolean,
  );

  // Search and Filter computation logic
  const getFilteredList = (listToFilter) => {
    return listToFilter.filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector =
        selectedSector === "" || opp.sector === selectedSector;
      const matchesType = selectedType === "" || opp.type === selectedType;
      return matchesSearch && matchesSector && matchesType;
    });
  };

  const filteredAvailable = getFilteredList(opportunities);
  const filteredShortlist = getFilteredList(shortlistedItems);

  // 🟢 FIXED: Derived selected opportunity synchronously from the URL ID parameter.
  // This completely replaces the extra state variables and useEffect render warnings.
  const selectedOpp = id
    ? opportunities.find((o) => String(o.id) === String(id))
    : null;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSector("");
    setSelectedType("");
  };

  const handleViewDetails = (item) => {
    // Navigate dynamically to the details route parameter matching the selected card
    if (viewMode === "shortlist") {
      navigate(`/shortlist/opportunity-details/${item.id}`);
    } else {
      navigate(`/opportunity-details/${item.id}`);
    }
  };

  const handleCloseModal = () => {
    // 🟢 Simply navigate backward via paths to safely pull down the overlay element
    if (viewMode === "shortlist") {
      navigate("/shortlist");
    } else {
      navigate("/");
    }
  };

  const handleShortlist = (item) => {
    const alreadyShortlisted = shortlistedItems.some(
      (fav) => fav.id === item.id,
    );
    if (alreadyShortlisted) {
      alert(`"${item.title}" is already in your shortlist!`);
      return;
    }
    setShortlistedItems([...shortlistedItems, item]);
    alert(`Success! "${item.title}" has been saved.`);
  };

  const handleRemoveFromShortlist = (item) => {
    const updatedList = shortlistedItems.filter((fav) => fav.id !== item.id);
    setShortlistedItems(updatedList);
  };

  // 🟢 Update the early loading check block to render the CSS Spinner
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        <p>Fetching latest career opportunities...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      {/* Search & Filter Controls Panel Layout */}
      <div className="controls-header">
        <span style={{ fontSize: "14px", color: "#666" }}>
          Dashboard Configurations
        </span>
        <button
          className="refresh-btn"
          onClick={() => fetchOpportunities(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh Data"}
        </button>
      </div>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search parameters..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="select-group">
          <select
            className="filter-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">All Sectors</option>
            {uniqueSectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {(searchTerm || selectedSector || selectedType) && (
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              ❌ Clear Filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="error-message">Error fetching parameters: {error}</p>
      )}

      {/* Conditional Layout Switching Logic */}
      {viewMode === "shortlist" ? (
        <div>
          <h2>My Saved Shortlist ({filteredShortlist.length} matching)</h2>
          {filteredShortlist.length === 0 ? (
            <p className="empty-text">
              No items inside your personal shortlist folder configuration.
            </p>
          ) : (
            filteredShortlist.map((opp) => (
              <div key={opp.id} className="card-wrapper">
                <OpportunityCard
                  opportunity={opp}
                  onViewDetails={handleViewDetails}
                  onShortlist={handleShortlist}
                />
                <button
                  onClick={() => handleRemoveFromShortlist(opp)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          <h2>
            Available Database Records ({filteredAvailable.length} matching)
          </h2>
          {filteredAvailable.length === 0 ? (
            <p className="empty-text">
              No records matched your specific filtration scope profile.
            </p>
          ) : (
            filteredAvailable.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onViewDetails={handleViewDetails}
                onShortlist={handleShortlist}
              />
            ))
          )}
        </div>
      )}

      {/* Pop-up Details Modal Overlay powered safely by React Router parameter state */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              ✕
            </button>
            <h2 style={{ marginTop: 0 }}>{selectedOpp.title}</h2>
            <hr />
            <div className="modal-body">
              <p>
                <strong>State:</strong> {selectedOpp.state}
              </p>
              <p>
                <strong>Sector:</strong> {selectedOpp.sector}
              </p>
              <p>
                <strong>Type:</strong> {selectedOpp.type}
              </p>
              <p>
                <strong>Summary:</strong>
              </p>
              <p className="modal-summary-box">{selectedOpp.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityList;