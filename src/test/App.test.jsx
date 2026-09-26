import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import App from '../App'

const API_BASE_URL = 'https://example.mockapi.io/api/v1'
const SHORTLIST_STORAGE_KEY =
  'india-opportunity-navigator-shortlist'

const opportunities = [
  {
    id: '1',
    title: 'Gujarat Semiconductor Expansion',
    state: 'Gujarat',
    sector: 'Semiconductors',
    opportunityType: 'Investment',
    summary: 'Semiconductor manufacturing opportunity in Gujarat.',
    description: 'Expand advanced manufacturing capacity in Gujarat.',
    whyItMatters: 'Supports semiconductor supply-chain development.',
    recommendedAction: 'Review the investment requirements.',
    sourceName: 'Invest India',
    sourceUrl: 'https://example.com/gujarat',
    isUserCreated: false,
  },
  {
    id: '2',
    title: 'Telangana Biotechnology Partnership',
    state: 'Telangana',
    sector: 'Biotechnology',
    opportunityType: 'Partnership',
    summary: 'Biotechnology partnership opportunity in Telangana.',
    description: 'Partner with biotechnology organisations in Telangana.',
    whyItMatters: 'Supports research and commercial collaboration.',
    recommendedAction: 'Contact the programme coordinator.',
    sourceName: 'Telangana Life Sciences',
    sourceUrl: 'https://example.com/telangana',
    isUserCreated: true,
  },
]

function createResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

function renderApp(path = '/opportunities') {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    ),
  }
}

async function completeOpportunityForm(
  user,
  { sourceUrl = 'https://example.com/new-opportunity' } = {},
) {
  await user.type(
    screen.getByLabelText('Opportunity title'),
    'New Electronics Opportunity',
  )
  await user.selectOptions(screen.getByLabelText('State'), 'Karnataka')
  await user.selectOptions(screen.getByLabelText('Sector'), 'Electronics')
  await user.selectOptions(
    screen.getByLabelText('Opportunity type'),
    'Market Entry',
  )
  await user.type(
    screen.getByLabelText('Summary'),
    'A new electronics market-entry opportunity.',
  )
  await user.type(
    screen.getByLabelText('Description'),
    'Detailed electronics opportunity description.',
  )
  await user.type(
    screen.getByLabelText('Why it matters'),
    'It supports regional market expansion.',
  )
  await user.type(
    screen.getByLabelText('Recommended action'),
    'Contact the programme owner.',
  )
  await user.type(screen.getByLabelText('Source name'), 'Official Source')
  await user.type(screen.getByLabelText('Source URL'), sourceUrl)
}

describe('India Opportunity Navigator', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL)
    vi.stubGlobal('fetch', vi.fn())
    fetch.mockResolvedValue(createResponse(opportunities))
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('redirects the root route and loads opportunities with GET', async () => {
    renderApp('/')

    expect(
      await screen.findByRole('heading', {
        name: 'Opportunity List',
      }),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(opportunities[0].title),
    ).toBeInTheDocument()

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/opportunities`,
      expect.objectContaining({
        signal: expect.any(Object),
      }),
    )
  })

  it('supports navigation between list, add, shortlist and details', async () => {
    const { user } = renderApp()

    await screen.findByText(opportunities[0].title)

    await user.click(
      screen.getByRole('button', { name: 'Add Opportunity' }),
    )

    expect(
      screen.getByRole('heading', { name: 'Add Opportunity' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: /^Shortlist/ }),
    )

    expect(
      screen.getByRole('heading', { name: 'Shortlist' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Opportunities' }),
    )

    const opportunityHeading = await screen.findByRole('heading', {
      name: opportunities[0].title,
    })
    const opportunityCard = opportunityHeading.closest('article')

    await user.click(
      within(opportunityCard).getByRole('button', {
        name: 'View details',
      }),
    )

    expect(
      screen.getByRole('heading', { name: 'Opportunity Details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(opportunities[0].description),
    ).toBeInTheDocument()
  })

  it('shows the correct messages for unknown pages and opportunity IDs', async () => {
    const firstRender = renderApp('/unknown-page')

    expect(
      screen.getByRole('heading', {
        name: 'The page you requested does not exist.',
      }),
    ).toBeInTheDocument()

    firstRender.unmount()

    renderApp('/opportunities/missing-id')

    expect(
      await screen.findByRole('heading', {
        name: 'We could not find this opportunity.',
      }),
    ).toBeInTheDocument()
  })

  it('combines filters, displays no matches and clears the filters', async () => {
    const { user } = renderApp()

    await screen.findByText(opportunities[0].title)

    await user.type(
      screen.getByRole('searchbox', { name: 'Search' }),
      'no such opportunity',
    )

    expect(
      screen.getByRole('heading', {
        name: 'No matching opportunities',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Clear filters' }),
    )

    expect(screen.getByText(opportunities[0].title)).toBeInTheDocument()
    expect(screen.getByText(opportunities[1].title)).toBeInTheDocument()

    await user.selectOptions(
      screen.getByLabelText('State'),
      'Gujarat',
    )
    await user.selectOptions(
      screen.getByLabelText('Sector'),
      'Semiconductors',
    )

    expect(screen.getByText(opportunities[0].title)).toBeInTheDocument()
    expect(
      screen.queryByText(opportunities[1].title),
    ).not.toBeInTheDocument()
  })

  it('shows the catalogue empty state when GET returns no records', async () => {
    fetch.mockResolvedValue(createResponse([]))

    renderApp()

    expect(
      await screen.findByRole('heading', {
        name: 'No opportunities available',
      }),
    ).toBeInTheDocument()
  })

  it('persists shortlist changes through localStorage and reload', async () => {
    const firstRender = renderApp()

    const opportunityHeading = await screen.findByRole('heading', {
      name: opportunities[0].title,
    })
    const opportunityCard = opportunityHeading.closest('article')

    await firstRender.user.click(
      within(opportunityCard).getByRole('button', {
        name: 'Add to shortlist',
      }),
    )

    expect(
      screen.getByRole('button', { name: 'Shortlist (1)' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(
        JSON.parse(
          window.localStorage.getItem(SHORTLIST_STORAGE_KEY),
        ),
      ).toEqual(['1'])
    })

    firstRender.unmount()

    const secondRender = renderApp('/shortlist')

    const shortlistedHeading = await screen.findByRole('heading', {
      name: opportunities[0].title,
    })
    const shortlistedCard = shortlistedHeading.closest('article')

    await secondRender.user.click(
      within(shortlistedCard).getByRole('button', {
        name: 'Remove from shortlist',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'No shortlisted opportunities',
      }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(
        JSON.parse(
          window.localStorage.getItem(SHORTLIST_STORAGE_KEY),
        ),
      ).toEqual([])
    })
  })

  it('validates required fields and the source URL', async () => {
    const { user } = renderApp('/opportunities/new')

    await screen.findByRole('heading', { name: 'Add Opportunity' })

    await user.click(
      screen.getByRole('button', { name: 'Create opportunity' }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please complete every required field before submitting.',
    )

    await completeOpportunityForm(user, {
      sourceUrl: 'not-a-valid-url',
    })

    await user.click(
      screen.getByRole('button', { name: 'Create opportunity' }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a valid source URL beginning with http:// or https://.',
    )
  })

  it('creates a user opportunity with POST', async () => {
    const createdOpportunity = {
      id: '3',
      title: 'New Electronics Opportunity',
      state: 'Karnataka',
      sector: 'Electronics',
      opportunityType: 'Market Entry',
      summary: 'A new electronics market-entry opportunity.',
      description: 'Detailed electronics opportunity description.',
      whyItMatters: 'It supports regional market expansion.',
      recommendedAction: 'Contact the programme owner.',
      sourceName: 'Official Source',
      sourceUrl: 'https://example.com/new-opportunity',
      isUserCreated: true,
    }

    fetch.mockImplementation((requestUrl, options = {}) => {
      if (
        requestUrl === `${API_BASE_URL}/opportunities` &&
        options.method === 'POST'
      ) {
        return Promise.resolve(
          createResponse(createdOpportunity, { status: 201 }),
        )
      }

      return Promise.resolve(createResponse(opportunities))
    })

    const { user } = renderApp('/opportunities/new')

    await screen.findByRole('heading', { name: 'Add Opportunity' })
    await completeOpportunityForm(user)

    await user.click(
      screen.getByRole('button', { name: 'Create opportunity' }),
    )

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Opportunity created successfully.',
    )

    const postCall = fetch.mock.calls.find(
      ([requestUrl, options]) =>
        requestUrl === `${API_BASE_URL}/opportunities` &&
        options?.method === 'POST',
    )

    expect(postCall).toBeDefined()
    expect(JSON.parse(postCall[1].body)).toEqual(
      expect.objectContaining({
        title: 'New Electronics Opportunity',
        isUserCreated: true,
      }),
    )

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Opportunity List' },
        { timeout: 2500 },
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('New Electronics Opportunity'),
    ).toBeInTheDocument()
  }, 10000)

  it('deletes only a confirmed user-created opportunity with DELETE', async () => {
    const confirmDelete = vi
      .spyOn(window, 'confirm')
      .mockReturnValue(true)

    fetch.mockImplementation((requestUrl, options = {}) => {
      if (
        requestUrl === `${API_BASE_URL}/opportunities/2` &&
        options.method === 'DELETE'
      ) {
        return Promise.resolve(createResponse({}, { status: 200 }))
      }

      return Promise.resolve(createResponse(opportunities))
    })

    const { user } = renderApp('/opportunities/2')

    expect(
      await screen.findByRole('heading', {
        name: 'Opportunity Details',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Delete opportunity' }),
    )

    expect(confirmDelete).toHaveBeenCalledWith(
      expect.stringContaining(
        'Telangana Biotechnology Partnership',
      ),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Opportunity List',
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(opportunities[1].title),
    ).not.toBeInTheDocument()

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/opportunities/2`,
      {
        method: 'DELETE',
      },
    )
  })

  it('shows a GET error and successfully retries', async () => {
    fetch
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(createResponse(opportunities))

    const { user } = renderApp()

    expect(
      await screen.findByRole('heading', {
        name: 'Unable to load opportunities',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Try again' }),
    )

    expect(
      await screen.findByText(opportunities[0].title),
    ).toBeInTheDocument()

    expect(fetch).toHaveBeenCalledTimes(2)
  })
})