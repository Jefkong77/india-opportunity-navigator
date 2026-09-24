import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../apiConfig";
import "./OpportunityList.css";

const AddOpportunity = () => {
  const navigate = useNavigate();

  // 1. Core Form States
  const [formData, setFormData] = useState({
    title: "",
    state: "",
    sector: "",
    type: "",
    summary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // 2. Dynamic Input Tracking Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Form Submission Handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Basic fields verification validation rule
    if (
      !formData.title ||
      !formData.state ||
      !formData.sector ||
      !formData.type ||
      !formData.summary
    ) {
      setValidationError(
        "All form fields are mandatory. Please fill in all spaces.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.OPPORTUNITIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          "Server refused submission payload configuration profiles.",
        );
      }

      alert("Success! New career opportunity added successfully.");
      navigate("/"); // Return seamlessly to home page workspace view upon success
    } catch (err) {
      setValidationError(
        err.message ||
          "Failed to sync record entries with the database server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="list-container">
      <div className="controls-header">
        <h2>＋ Create Opportunity</h2>
        {/* 🟢 Back navigation confirmation path mapping */}
        <button className="refresh-btn" onClick={() => navigate("/")}>
          ← Back to Browse
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="filter-panel"
        style={{ gap: "16px", display: "flex", flexDirection: "column" }}
      >
        <div>
          <label
            style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
          >
            Opportunity Title
          </label>
          <input
            type="text"
            name="title"
            className="search-input"
            placeholder="e.g., Senior Systems Analyst"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="select-group">
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Location (State)
            </label>
            <input
              type="text"
              name="state"
              className="search-input"
              placeholder="e.g., NSW, QLD, VIC"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Industry Sector
            </label>
            <input
              type="text"
              name="sector"
              className="search-input"
              placeholder="e.g., Technology, Finance"
              value={formData.sector}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
          >
            Employment Type
          </label>
          <select
            name="type"
            className="filter-select"
            style={{ width: "100%" }}
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">-- Choose Option --</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
          >
            Description Summary
          </label>
          <textarea
            name="summary"
            rows="4"
            className="search-input"
            style={{ fontFamily: "inherit", resize: "vertical" }}
            placeholder="Outline core responsibilities, capabilities, and role requirements..."
            value={formData.summary}
            onChange={handleChange}
          />
        </div>

        {validationError && (
          <p className="error-message" style={{ margin: 0 }}>
            ⚠️ {validationError}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            className="tab-btn active"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            disabled={isSubmitting}
          >
            {/* 🟢 Render a micro-spinner directly inside the button text during submissions */}
            {isSubmitting ? (
              <>
                <div
                  className="loading-spinner"
                  style={{
                    width: "16px",
                    height: "16px",
                    borderSize: "2px",
                    borderTopColor: "#fff",
                    margin: 0,
                  }}
                ></div>
                <span>Saving to Database...</span>
              </>
            ) : (
              "🚀 Submit Record"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOpportunity;
