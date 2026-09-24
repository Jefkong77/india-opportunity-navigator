import "./OpportunityCard.css";

const OpportunityCard = ({ opportunity, onViewDetails, onShortlist }) => {
  const { title, state, sector, type, summary } = opportunity;

  return (
    <div className="opportunity-card">
      <h3>{title}</h3>
      <p>
        <strong>State:</strong> {state}
      </p>
      <p>
        <strong>Sector:</strong> {sector}
      </p>
      <p>
        <strong>Type:</strong> {type}
      </p>
      <p className="card-summary">{summary}</p>

      <div className="card-actions">
        <button
          onClick={() => onViewDetails(opportunity)}
          className="card-btn view-btn"
        >
          View Details
        </button>
        <button
          onClick={() => onShortlist(opportunity)}
          className="card-btn shortlist-btn"
        >
          Shortlist
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
