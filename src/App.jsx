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
const SHORTLIST_STORAGE_KEY = 'india-opportunity-navigator-shortlist'

function loadStoredShortlist() {
  try {
    const storedShortlist = window.localStorage.getItem(
      SHORTLIST_STORAGE_KEY,
    )

    if (!storedShortlist) {
      return []
    }

    const parsedShortlist = JSON.parse(storedShortlist)

    if (!Array.isArray(parsedShortlist)) {
      return []
    }

    return [...new Set(parsedShortlist.map(String))]
  } catch {
    return []
  }
}
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
  onRetry,
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
    const hasActiveFilters =
    normalizedSearchTerm !== '' ||
    selectedState !== '' ||
    selectedSector !== ''
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
        <section className="empty-state" role="status">
          <h3>Loading opportunities</h3>
          <p>Fetching the latest opportunity records…</p>
        </section>
      )}

            {loadStatus === 'error' && (
        <section className="empty-state" role="alert">
          <h3>Unable to load opportunities</h3>
          <p>
            Check your connection and MockAPI configuration, then try again.
          </p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </section>
      )}

      {loadStatus === 'success' &&
        (opportunities.length === 0 ? (
          <section className="empty-state">
            <h3>No opportunities available</h3>
            <p>
              The catalogue is currently empty. Add an opportunity to get
              started.
            </p>
          </section>
        ) : filteredOpportunities.length === 0 && hasActiveFilters ? (
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
  onDelete,
  deleteStatus,
  deleteError,
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
        <h4>Record ID</h4>
        <p>{opportunity.id}</p>

        <h4>Record origin</h4>
        <p>
        {opportunity.isUserCreated
        ? 'User-created opportunity'
        : 'Curated demonstration record'}
        </p>
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
                {opportunity.isUserCreated === true && (
          <div className="delete-panel">
            <p>
              This opportunity was created by a user and can be permanently
              deleted.
            </p>

            <button
              type="button"
              className="danger-button"
              onClick={onDelete}
              disabled={deleteStatus === 'deleting'}
            >
              {deleteStatus === 'deleting'
                ? 'Deleting...'
                : 'Delete opportunity'}
            </button>

            {deleteError && (
              <p className="form-feedback error" role="alert">
                {deleteError}
              </p>
            )}
          </div>
        )}
      </article>
    </section>
  )
}

function OpportunityNotFound({ onBack }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">Opportunity not found</p>
      <h2>We could not find this opportunity.</h2>
      <p>The opportunity ID may be missing or invalid.</p>

      <button type="button" onClick={onBack}>
        Return to opportunities
      </button>
    </section>
  )
}

function OpportunityDetailsRoute({
  opportunities,
  loadStatus,
  shortlist,
  onToggleShortlist,
  onDeleteOpportunity,
  onRetry,
}) {
  const navigate = useNavigate()
  const { opportunityId } = useParams()
  const [deleteStatus, setDeleteStatus] = useState('idle')
  const [deleteError, setDeleteError] = useState('')
  const opportunity = opportunities.find(
    (item) => String(item.id) === opportunityId,
  )
  async function handleDelete() {
    if (!opportunity || opportunity.isUserCreated !== true) {
      return
    }

    const confirmed = window.confirm(
      `Delete "${opportunity.title}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setDeleteStatus('deleting')
    setDeleteError('')

    try {
      await onDeleteOpportunity(opportunity.id)
      navigate('/opportunities')
    } catch (error) {
      setDeleteStatus('error')
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete this opportunity.',
      )
    }
  }

    if (loadStatus === 'loading') {
    return (
      <section className="empty-state" role="status">
        <h2>Loading opportunity details</h2>
        <p>Fetching the latest opportunity record…</p>
      </section>
    )
  }
  if (loadStatus === 'error') {
    return (
      <section className="empty-state" role="alert">
        <h2>Unable to load this opportunity</h2>
        <p>
          Check your connection and MockAPI configuration, then try again.
        </p>
        <div className="form-actions">
          <button type="button" onClick={onRetry}>
            Try again
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/opportunities')}
          >
            Return to opportunities
          </button>
        </div>
      </section>
    )
  }
  if (!opportunity) {
  return (
    <OpportunityNotFound
      onBack={() => navigate('/opportunities')}
    />
  )
  }
  return (
    <OpportunityDetails
      opportunity={opportunity}
      isShortlisted={shortlist.includes(String(opportunity.id))}
      onBack={() => navigate('/opportunities')}
      onToggleShortlist={onToggleShortlist}
      onDelete={handleDelete}
      deleteStatus={deleteStatus}
      deleteError={deleteError}
    />
  )
}

const INITIAL_OPPORTUNITY_FORM = {
  title: '',
  state: '',
  sector: '',
  opportunityType: '',
  summary: '',
  description: '',
  whyItMatters: '',
  recommendedAction: '',
  sourceName: '',
  sourceUrl: '',
}

function AddOpportunityForm({ onCancel, onCreated }) {
  const [formValues, setFormValues] = useState(INITIAL_OPPORTUNITY_FORM)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  })

  const isBusy =
    submitStatus === 'submitting' || submitStatus === 'success'

  function handleChange(event) {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    if (feedback.message) {
      setFeedback({
        type: '',
        message: '',
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const submittedValues = Object.fromEntries(
      Object.entries(formValues).map(([field, value]) => [
        field,
        value.trim(),
      ]),
    )

    const hasEmptyRequiredField = Object.values(submittedValues).some(
      (value) => !value,
    )

    if (hasEmptyRequiredField) {
      setSubmitStatus('error')
      setFeedback({
        type: 'error',
        message: 'Please complete every required field before submitting.',
      })
      return
    }

    let validatedSourceUrl

    try {
      validatedSourceUrl = new URL(submittedValues.sourceUrl)

      if (!['http:', 'https:'].includes(validatedSourceUrl.protocol)) {
        throw new Error('Unsupported URL protocol')
      }
    } catch {
      setSubmitStatus('error')
      setFeedback({
        type: 'error',
        message:
          'Enter a valid source URL beginning with http:// or https://.',
      })
      return
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')

    if (!apiBaseUrl) {
      setSubmitStatus('error')
      setFeedback({
        type: 'error',
        message:
          'The MockAPI base URL is unavailable. Check the local environment configuration.',
      })
      return
    }

    const newOpportunity = {
      ...submittedValues,
      sourceUrl: validatedSourceUrl.toString(),
      isUserCreated: true,
    }

    setSubmitStatus('submitting')
    setFeedback({
      type: '',
      message: '',
    })

    try {
      const response = await fetch(`${apiBaseUrl}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOpportunity),
      })

      if (!response.ok) {
        throw new Error(`MockAPI request failed with ${response.status}`)
      }

      const createdOpportunity = await response.json()

      setFormValues(INITIAL_OPPORTUNITY_FORM)
      setSubmitStatus('success')
      setFeedback({
        type: 'success',
        message:
          'Opportunity created successfully. Returning to the opportunity list.',
      })

      window.setTimeout(() => {
        onCreated(createdOpportunity)
      }, 1200)
    } catch {
      setSubmitStatus('error')
      setFeedback({
        type: 'error',
        message:
          'The opportunity could not be saved. Please check the connection and try again.',
      })
    }
  }

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Page 3 of 4</p>
        <h2>Add Opportunity</h2>
        <p>
          Create a new evidence-linked opportunity for the shared catalogue.
        </p>
      </div>

      <form
        className="opportunity-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <label>
          Opportunity title
          <input
            name="title"
            value={formValues.title}
            onChange={handleChange}
            required
            placeholder="Enter opportunity title"
          />
        </label>

        <label>
          State
          <select
            name="state"
            value={formValues.state}
            onChange={handleChange}
            required
          >
            <option value="">Select a state</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
          </select>
        </label>

        <label>
          Sector
          <select
            name="sector"
            value={formValues.sector}
            onChange={handleChange}
            required
          >
            <option value="">Select a sector</option>
            <option value="Semiconductors">Semiconductors</option>
            <option value="Electronics">Electronics</option>
            <option value="Biotechnology">Biotechnology</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </label>

        <label>
          Opportunity type
          <select
            name="opportunityType"
            value={formValues.opportunityType}
            onChange={handleChange}
            required
          >
            <option value="">Select an opportunity type</option>
            <option value="Investment">Investment</option>
            <option value="Partnership">Partnership</option>
            <option value="Market Entry">Market Entry</option>
            <option value="Sourcing">Sourcing</option>
          </select>
        </label>

        <label>
          Summary
          <textarea
            name="summary"
            value={formValues.summary}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter a short opportunity summary"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe the opportunity"
          />
        </label>

        <label>
          Why it matters
          <textarea
            name="whyItMatters"
            value={formValues.whyItMatters}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Explain why this opportunity matters"
          />
        </label>

        <label>
          Recommended action
          <textarea
            name="recommendedAction"
            value={formValues.recommendedAction}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe the recommended next action"
          />
        </label>

        <label>
          Source name
          <input
            name="sourceName"
            value={formValues.sourceName}
            onChange={handleChange}
            required
            placeholder="Enter the evidence source name"
          />
        </label>

        <label>
          Source URL
          <input
            name="sourceUrl"
            value={formValues.sourceUrl}
            onChange={handleChange}
            required
            type="url"
            placeholder="https://example.com/source"
          />
        </label>

        {feedback.message && (
          <p
            className={`form-feedback ${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isBusy}>
            {submitStatus === 'submitting'
              ? 'Saving opportunity...'
              : submitStatus === 'success'
                ? 'Opportunity saved'
                : 'Create opportunity'}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isBusy}
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
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [shortlist, setShortlist] = useState(loadStoredShortlist)
  useEffect(() => {
      try {
     window.localStorage.setItem(
      SHORTLIST_STORAGE_KEY,
      JSON.stringify(shortlist),
      )
     } catch {
      // Keep the shortlist available in React state if storage is unavailable.
     }
      }, [shortlist])
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
  }, [loadAttempt])
  function retryLoadOpportunities() {
    setLoadStatus('loading')
    setLoadAttempt((currentAttempt) => currentAttempt + 1)
  }
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
    async function deleteOpportunity(opportunityId) {
    const opportunityIdText = String(opportunityId)
    const opportunity = opportunities.find(
      (item) => String(item.id) === opportunityIdText,
    )

    if (!opportunity || opportunity.isUserCreated !== true) {
      throw new Error('Only user-created opportunities can be deleted.')
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')

    if (!apiBaseUrl) {
      throw new Error('The MockAPI base URL is not configured.')
    }

    const response = await fetch(
      `${apiBaseUrl}/opportunities/${opportunityIdText}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      throw new Error(`MockAPI deletion failed with ${response.status}`)
    }

    setOpportunities((currentOpportunities) =>
      currentOpportunities.filter(
        (item) => String(item.id) !== opportunityIdText,
      ),
    )

    setShortlist((currentShortlist) =>
      currentShortlist.filter((itemId) => itemId !== opportunityIdText),
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
                onRetry={retryLoadOpportunities}
              />
            }
          />
          <Route
            path="/opportunities/new"
            element={
              <AddOpportunityForm
              onCancel={() => navigate('/opportunities')}
              onCreated={(createdOpportunity) => {
              setOpportunities((currentOpportunities) => [
               ...currentOpportunities,
                createdOpportunity,
               ])
              navigate('/opportunities')
            }}
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
                onDeleteOpportunity={deleteOpportunity}
                onRetry={retryLoadOpportunities}
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
        India Opportunity Navigator · MockAPI-powered opportunity catalogue
      </footer>
    </div>
  )
}

export default App
