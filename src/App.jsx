import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import './App.css'

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

function FilterPanel({
  searchTerm,
  selectedState,
  selectedSector,
  states,
  sectors,
  onSearchChange,
  onStateChange,
  onSectorChange,
  onClearFilters,
}) {
  return (
    <section className="filter-panel" aria-label="Opportunity filters">
      <label className="search-filter">
        Search
        <input
          type="search"
          value={searchTerm}
          placeholder="Search opportunities"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        State
        <select
          value={selectedState}
          onChange={(event) => onStateChange(event.target.value)}
        >
          <option value="">All states</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sector
        <select
          value={selectedSector}
          onChange={(event) => onSectorChange(event.target.value)}
        >
          <option value="">All sectors</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="secondary-button"
        onClick={onClearFilters}
      >
        Clear filters
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
  opportunities,
  loadStatus,
  shortlist,
  onView,
  onToggleShortlist,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const states = [
    ...new Set(opportunities.map((opportunity) => opportunity.state)),
  ]
    .filter(Boolean)
    .sort()
  const sectors = [
    ...new Set(opportunities.map((opportunity) => opportunity.sector)),
  ]
    .filter(Boolean)
    .sort()
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const searchableValues = [
      opportunity.title,
      opportunity.summary,
      opportunity.state,
      opportunity.sector,
      opportunity.opportunityType,
    ]
    const matchesSearch =
      normalizedSearchTerm === '' ||
      searchableValues.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(normalizedSearchTerm),
      )
    const matchesState =
      selectedState === '' || opportunity.state === selectedState
    const matchesSector =
      selectedSector === '' || opportunity.sector === selectedSector

    return matchesSearch && matchesState && matchesSector
  })

  function clearFilters() {
    setSearchTerm('')
    setSelectedState('')
    setSelectedSector('')
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Page 1 of 4</p>
        <h2>Opportunity List</h2>
        <p>Browse MockAPI opportunities by state and sector.</p>
      </section>

      <FilterPanel
        searchTerm={searchTerm}
        selectedState={selectedState}
        selectedSector={selectedSector}
        states={states}
        sectors={sectors}
        onSearchChange={setSearchTerm}
        onStateChange={setSelectedState}
        onSectorChange={setSelectedSector}
        onClearFilters={clearFilters}
      />

      {loadStatus === 'loading' && (
        <p role="status">Loading opportunity records…</p>
      )}

      {loadStatus === 'error' && (
        <p role="alert">
          Unable to load opportunities. Check the MockAPI configuration and
          try again.
        </p>
      )}

      {loadStatus === 'success' &&
        (filteredOpportunities.length === 0 ? (
          <section className="empty-state">
            <h3>No matching opportunities</h3>
            <p>Try a different search term or clear the filters.</p>
          </section>
        ) : (
          <section className="card-grid">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isShortlisted={shortlist.includes(String(opportunity.id))}
                onView={onView}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
          </section>
        ))}
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

function OpportunityDetailsRoute({
  opportunities,
  loadStatus,
  shortlist,
  onToggleShortlist,
}) {
  const navigate = useNavigate()
  const { opportunityId } = useParams()
  const opportunity = opportunities.find(
    (item) => String(item.id) === opportunityId,
  )

  if (loadStatus === 'loading') {
    return <p role="status">Loading opportunity details…</p>
  }

  if (loadStatus === 'error') {
    return <p role="alert">Unable to load this opportunity.</p>
  }

  if (!opportunity) {
    return <NotFound />
  }

  return (
    <OpportunityDetails
      opportunity={opportunity}
      isShortlisted={shortlist.includes(String(opportunity.id))}
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

function Shortlist({
  opportunities,
  shortlist,
  onView,
  onToggleShortlist,
}) {
  const shortlistedOpportunities = opportunities.filter((opportunity) =>
    shortlist.includes(String(opportunity.id)),
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
  const [opportunities, setOpportunities] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading')
  const [shortlist, setShortlist] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadOpportunities() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')

      if (!apiBaseUrl) {
        setLoadStatus('error')
        return
      }

      try {
        const response = await fetch(`${apiBaseUrl}/opportunities`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`MockAPI request failed with ${response.status}`)
        }

        const records = await response.json()

        if (!Array.isArray(records)) {
          throw new Error('MockAPI response must be an array')
        }

        setOpportunities(records)
        setLoadStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadStatus('error')
        }
      }
    }

    loadOpportunities()

    return () => controller.abort()
  }, [])

  function viewOpportunity(id) {
    navigate(`/opportunities/${id}`)
  }

  function toggleShortlist(id) {
    const opportunityId = String(id)

    setShortlist((currentShortlist) =>
      currentShortlist.includes(opportunityId)
        ? currentShortlist.filter((itemId) => itemId !== opportunityId)
        : [...currentShortlist, opportunityId],
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
                opportunities={opportunities}
                loadStatus={loadStatus}
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
                opportunities={opportunities}
                loadStatus={loadStatus}
                shortlist={shortlist}
                onToggleShortlist={toggleShortlist}
              />
            }
          />
          <Route
            path="/shortlist"
            element={
              <Shortlist
                opportunities={opportunities}
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
        Issues #5 and #9 · React Router with MockAPI opportunity records
      </footer>
    </div>
  )
}

export default App
