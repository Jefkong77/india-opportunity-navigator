# india-opportunity-navigator
A React application for Singapore SMEs and market advisors exploring evidence-linked opportunities across Indian states and sectors.


## MockAPI configuration

The project uses a MockAPI `opportunities` resource containing 12 curated demonstration records.

### Local environment setup

1. Copy `.env.example` and rename the copy to `.env.local`.
2. Replace the placeholder project ID with the assigned MockAPI project ID.
3. Do not commit `.env.local` or any credentials.

```env
VITE_API_BASE_URL=https://your-project-id.mockapi.io/api/v1
```

### Opportunities resource

The application can access the resource through:

```text
${VITE_API_BASE_URL}/opportunities
```

Each opportunity contains:

- `id`
- `createdAt`
- `title`
- `state`
- `sector`
- `summary`
- `support`
- `nextStep`

The demonstration data is fictional and intended only for application development and testing.
