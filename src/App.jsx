import { useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import './App.css'

const opportunities = [
  {
    id: 1,
    title: 'Semiconductor Manufacturing Incentive',
    state: 'Gujarat',
    sector: 'Semiconductors',
    opportunityType: 'Investment',
    summary:
      'Placeholder opportunity for companies exploring manufacturing and supply-chain partnerships.',
    description:
      'A fictional demonstration opportunity for establishing semiconductor manufacturing capacity in Gujarat.',
    whyItMatters:
      'It illustrates how the navigator can connect a sector opportunity with a specific Indian state.',
    recommendedAction:
      'Review the supporting evidence and contact the relevant state agency to confirm current eligibility.',
    sourceName: 'Demonstration source',
    sourceUrl: 'https://example.com',
    isUserCreated: false,
  },
  {
    id: 2,
    title: 'Life Sciences Expansion Programme',
    state: 'Telangana',
    sector: 'Biotechnology',
    opportunityType: 'Partnership',
    summary:
      'Placeholder opportunity for biotechnology, pharmaceutical and research companies.',
    description:
      'A fictional demonstration opportunity for research and commercial partnerships in Telangana.',
    whyItMatters:
      'It shows how sector strengths can be presented with a clear partnership pathway.',
    recommendedAction:
      'Assess potential partners and verify the programme details with the named source.',
    sourceName: 'Demonstration source',
    sourceUrl: 'https://example.com',
    isUserCreated: false,
  },
  {
    id: 3,
    title: 'Digital Infrastructure Investment',
    state: 'Maharashtra',
    sector: 'Infrastructure',
    opportunityType: 'Market Entry',
    summary:
      'Placeholder opportunity for data centres and digital infrastructure providers.',
    description:
      'A fictional demonstration opportunity for entering Maharashtra’s digital infrastructure market.',
    whyItMatters:
      'It demonstrates how market-entry opportunities can be compared alongside investment and partnership options.',
    recommendedAction:
      'Validate demand, location requirements and applicable incentives before proceeding.',
    sourceName: 'Demonstration source',
    sourceUrl: 'https://example.com',
    isUserCreated: false,
  },
]

function Navigation({ shortlistCount }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activePage =
    pathname === '/opportunities/new'
      ? 'add'
      : pathname === '/shortlist'
        ? 'shortlist'
        : pathname === '/opportunities' ||
            pathname.startsWith('/opportunities/')
          ? 'list'
          : null

  const navigationItems = [
    { id: 'list', label: 'Opportunities', path: '/opportunities' },
    { id: 'add', label: 'Add Opportunity', path: '/opportunities/new' },
    {
      id: 'shortlist',
      label: `Shortlist (${shortlistCount})`,
      path: '/shortlist',
    },
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
            onClick={() => navigate(item.path)}
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
          <option>Karnataka</option>
          <option>Maharashtra</option>
          <option>Tamil Nadu</option>
          <option>Telangana</option>
        </select>
      </label>

      <label>
        Sector
        <select defaultValue="">
          <option value="">All sectors</option>
          <option>Semiconductors</option>
          <option>Electronics</option>
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
        <span>{opportunity.opportunityType}</span>
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
          <span>{opportunity.opportunityType}</span>
        </div>

        <h3>{opportunity.title}</h3>

        <h4>Opportunity summary</h4>
        <p>{opportunity.summary}</p>

        <h4>Description</h4>
        <p>{opportunity.description}</p>

        <h4>Why it matters</h4>
        <p>{opportunity.whyItMatters}</p>

        <h4>Recommended action</h4>
        <p>{opportunity.recommendedAction}</p>

        <h4>Evidence</h4>
        <p>
          <a
            href={opportunity.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {opportunity.sourceName}
          </a>
        </p>

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

function OpportunityDetailsRoute({ shortlist, onToggleShortlist }) {
  const navigate = useNavigate()
  const { opportunityId } = useParams()
  const opportunity = opportunities.find(
    (item) => String(item.id) === opportunityId,
  )

  if (!opportunity) {
    return <NotFound />
  }

  return (
    <OpportunityDetails
      opportunity={opportunity}
      isShortlisted={shortlist.includes(opportunity.id)}
      onBack={() => navigate('/opportunities')}
      onToggleShortlist={onToggleShortlist}
    />
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
            <option>Karnataka</option>
            <option>Maharashtra</option>
            <option>Tamil Nadu</option>
            <option>Telangana</option>
          </select>
        </label>

        <label>
          Sector
          <select required defaultValue="">
            <option value="" disabled>
              Select a sector
            </option>
            <option>Semiconductors</option>
            <option>Electronics</option>
            <option>Biotechnology</option>
            <option>Infrastructure</option>
          </select>
        </label>

        <label>
          Opportunity type
          <select required defaultValue="">
            <option value="" disabled>
              Select an opportunity type
            </option>
            <option>Investment</option>
            <option>Partnership</option>
            <option>Market Entry</option>
            <option>Sourcing</option>
          </select>
        </label>

        <label>
          Summary
          <textarea
            required
            rows="3"
            placeholder="Enter a short opportunity summary"
          />
        </label>

        <label>
          Description
          <textarea
            required
            rows="5"
            placeholder="Describe the opportunity"
          />
        </label>

        <label>
          Why it matters
          <textarea
            required
            rows="3"
            placeholder="Explain why this opportunity matters"
          />
        </label>

        <label>
          Recommended action
          <textarea
            required
            rows="3"
            placeholder="Describe the recommended next action"
          />
        </label>

        <label>
          Source name
          <input required placeholder="Enter the evidence source name" />
        </label>

        <label>
          Source URL
          <input
            required
            type="url"
            placeholder="https://example.com/source"
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

function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="empty-state">
      <p className="eyebrow">Page not found</p>
      <h2>The page you requested does not exist.</h2>
      <button type="button" onClick={() => navigate('/opportunities')}>
        Return to opportunities
      </button>
    </section>
  )
}

function App() {
  const navigate = useNavigate()
  const [shortlist, setShortlist] = useState([2])

  function viewOpportunity(id) {
    navigate(`/opportunities/${id}`)
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
        shortlistCount={shortlist.length}
      />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/opportunities" replace />} />
          <Route
            path="/opportunities"
            element={
              <OpportunityList
                shortlist={shortlist}
                onView={viewOpportunity}
                onToggleShortlist={toggleShortlist}
              />
            }
          />
          <Route
            path="/opportunities/new"
            element={
              <AddOpportunityForm
                onDone={() => navigate('/opportunities')}
              />
            }
          />
          <Route
            path="/opportunities/:opportunityId"
            element={
              <OpportunityDetailsRoute
                shortlist={shortlist}
                onToggleShortlist={toggleShortlist}
              />
            }
          />
          <Route
            path="/shortlist"
            element={
              <Shortlist
                shortlist={shortlist}
                onView={viewOpportunity}
                onToggleShortlist={toggleShortlist}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        Issue #5 · React Router · Field contract aligned with Issues #2 and #8
      </footer>
    </div>
  )
}

export default App
