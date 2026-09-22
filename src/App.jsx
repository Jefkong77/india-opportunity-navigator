import { useState } from 'react'
import './App.css'

const opportunities = [
  {
    id: 1,
    title: 'Semiconductor Manufacturing Incentive',
    state: 'Gujarat',
    sector: 'Semiconductors',
    summary:
      'Placeholder opportunity for companies exploring manufacturing and supply-chain partnerships.',
    support: 'Capital support, infrastructure access and state facilitation.',
  },
  {
    id: 2,
    title: 'Life Sciences Expansion Programme',
    state: 'Telangana',
    sector: 'Biotechnology',
    summary:
      'Placeholder opportunity for biotechnology, pharmaceutical and research companies.',
    support: 'Research ecosystem, industrial parks and investor support.',
  },
  {
    id: 3,
    title: 'Digital Infrastructure Investment',
    state: 'Uttar Pradesh',
    sector: 'Infrastructure',
    summary:
      'Placeholder opportunity for data centres and digital infrastructure providers.',
    support: 'Land facilitation, connectivity and investment incentives.',
  },
]

function Navigation({ activePage, shortlistCount, onNavigate }) {
  const navigationItems = [
    { id: 'list', label: 'Opportunities' },
    { id: 'add', label: 'Add Opportunity' },
    { id: 'shortlist', label: `Shortlist (${shortlistCount})` },
  ]

  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Low-fidelity React wireframe</p>
        <h1>India Opportunity Navigator</h1>
      </div>

      <nav aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activePage === item.id ||
              (activePage === 'details' && item.id === 'list')
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function FilterPanel() {
  return (
    <section className="filter-panel" aria-label="Opportunity filters">
      <label>
        State
        <select defaultValue="">
          <option value="">All states</option>
          <option>Gujarat</option>
          <option>Telangana</option>
          <option>Uttar Pradesh</option>
        </select>
      </label>

      <label>
        Sector
        <select defaultValue="">
          <option value="">All sectors</option>
          <option>Semiconductors</option>
          <option>Biotechnology</option>
          <option>Infrastructure</option>
        </select>
      </label>

      <button type="button" className="secondary-button">
        Apply filters
      </button>
    </section>
  )
}

function OpportunityCard({
  opportunity,
  isShortlisted,
  onView,
  onToggleShortlist,
}) {
  return (
    <article className="opportunity-card">
      <div className="card-tags">
        <span>{opportunity.state}</span>
        <span>{opportunity.sector}</span>
      </div>

      <h3>{opportunity.title}</h3>
      <p>{opportunity.summary}</p>

      <div className="card-actions">
        <button type="button" onClick={() => onView(opportunity.id)}>
          View details
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onToggleShortlist(opportunity.id)}
        >
          {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        </button>
      </div>
    </article>
  )
}

function OpportunityList({
  shortlist,
  onView,
  onToggleShortlist,
}) {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Page 1 of 4</p>
        <h2>Opportunity List</h2>
        <p>Browse placeholder opportunities by state and sector.</p>
      </section>

      <FilterPanel />

      <section className="card-grid">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            isShortlisted={shortlist.includes(opportunity.id)}
            onView={onView}
            onToggleShortlist={onToggleShortlist}
          />
        ))}
      </section>
    </>
  )
}

function OpportunityDetails({
  opportunity,
  isShortlisted,
  onBack,
  onToggleShortlist,
}) {
  return (
    <section>
      <button type="button" className="text-button" onClick={onBack}>
        ← Back to opportunities
      </button>

      <div className="page-heading">
        <p className="eyebrow">Page 2 of 4</p>
        <h2>Opportunity Details</h2>
      </div>

      <article className="details-panel">
        <div className="card-tags">
          <span>{opportunity.state}</span>
          <span>{opportunity.sector}</span>
        </div>

        <h3>{opportunity.title}</h3>

        <h4>Opportunity summary</h4>
        <p>{opportunity.summary}</p>

        <h4>Indicative support</h4>
        <p>{opportunity.support}</p>

        <h4>Next step</h4>
        <p>Contact the relevant state agency for eligibility verification.</p>

        <button
          type="button"
          onClick={() => onToggleShortlist(opportunity.id)}
        >
          {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        </button>
      </article>
    </section>
  )
}

function AddOpportunityForm({ onDone }) {
  function handleSubmit(event) {
    event.preventDefault()
    onDone()
  }

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Page 3 of 4</p>
        <h2>Add Opportunity</h2>
        <p>Enter placeholder information for a new opportunity.</p>
      </div>

      <form className="opportunity-form" onSubmit={handleSubmit}>
        <label>
          Opportunity title
          <input required placeholder="Enter opportunity title" />
        </label>

        <label>
          State
          <select required defaultValue="">
            <option value="" disabled>
              Select a state
            </option>
            <option>Gujarat</option>
            <option>Telangana</option>
            <option>Uttar Pradesh</option>
          </select>
        </label>

        <label>
          Sector
          <select required defaultValue="">
            <option value="" disabled>
              Select a sector
            </option>
            <option>Semiconductors</option>
            <option>Biotechnology</option>
            <option>Infrastructure</option>
          </select>
        </label>

        <label>
          Summary
          <textarea
            required
            rows="5"
            placeholder="Enter a short opportunity summary"
          />
        </label>

        <div className="form-actions">
          <button type="submit">Save placeholder</button>
          <button
            type="button"
            className="secondary-button"
            onClick={onDone}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

function Shortlist({ shortlist, onView, onToggleShortlist }) {
  const shortlistedOpportunities = opportunities.filter((opportunity) =>
    shortlist.includes(opportunity.id),
  )

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Page 4 of 4</p>
        <h2>Shortlist</h2>
        <p>Review opportunities saved for follow-up.</p>
      </div>

      {shortlistedOpportunities.length === 0 ? (
        <div className="empty-state">
          <h3>No shortlisted opportunities</h3>
          <p>Add an opportunity from the Opportunity List.</p>
        </div>
      ) : (
        <div className="card-grid">
          {shortlistedOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isShortlisted
              onView={onView}
              onToggleShortlist={onToggleShortlist}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function App() {
  const [activePage, setActivePage] = useState('list')
  const [selectedId, setSelectedId] = useState(1)
  const [shortlist, setShortlist] = useState([2])

  const selectedOpportunity =
    opportunities.find((opportunity) => opportunity.id === selectedId) ??
    opportunities[0]

  function viewOpportunity(id) {
    setSelectedId(id)
    setActivePage('details')
  }

  function toggleShortlist(id) {
    setShortlist((currentShortlist) =>
      currentShortlist.includes(id)
        ? currentShortlist.filter((itemId) => itemId !== id)
        : [...currentShortlist, id],
    )
  }

  return (
    <div className="app-shell">
      <Navigation
        activePage={activePage}
        shortlistCount={shortlist.length}
        onNavigate={setActivePage}
      />

      <main>
        {activePage === 'list' && (
          <OpportunityList
            shortlist={shortlist}
            onView={viewOpportunity}
            onToggleShortlist={toggleShortlist}
          />
        )}

        {activePage === 'details' && (
          <OpportunityDetails
            opportunity={selectedOpportunity}
            isShortlisted={shortlist.includes(selectedOpportunity.id)}
            onBack={() => setActivePage('list')}
            onToggleShortlist={toggleShortlist}
          />
        )}

        {activePage === 'add' && (
          <AddOpportunityForm onDone={() => setActivePage('list')} />
        )}

        {activePage === 'shortlist' && (
          <Shortlist
            shortlist={shortlist}
            onView={viewOpportunity}
            onToggleShortlist={toggleShortlist}
          />
        )}
      </main>

      <footer>Issue #6 · Low-fidelity wireframe · Placeholder data only</footer>
    </div>
  )
}

export default App