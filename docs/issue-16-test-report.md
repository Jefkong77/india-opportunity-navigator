# Issue #16 Test Report — Main Application Features

## Test summary

- **Issue:** #16 — Test main application features
- **Test date:** 27 September 2026
- **Branch:** `issue-16-main-app-testing`
- **Application:** India Opportunity Navigator
- **Environment:** Windows 11, Chrome, Vite development server and MockAPI
- **Overall result:** PASS

## Test approach

Issue #16 was verified using two complementary approaches:

1. A repeatable Vitest and React Testing Library integration suite.
2. A controlled live browser journey against the configured MockAPI resource.

Mocked API responses were used for repeatable automated tests. The live POST and DELETE checks used one clearly identified temporary record so that the original 12 opportunity records were not altered.

## Acceptance-criteria results

| Acceptance criterion | Verification | Result |
| --- | --- | --- |
| Test all routes and navigation | Tested the root redirect, Opportunity List, Add Opportunity, opportunity details, Shortlist, unknown route and invalid opportunity ID | PASS |
| Test GET, POST and DELETE | Tested automated GET, POST and DELETE flows, followed by a controlled live create-and-delete journey | PASS |
| Test filters and empty states | Tested search, State and Sector filters, combined filtering, no-match results, clear filters and an empty catalogue response | PASS |
| Test shortlist persistence | Added an opportunity, refreshed the browser, confirmed it remained shortlisted, opened the Shortlist route and removed it | PASS |
| Test validation and error handling | Tested missing required fields, invalid source URL, failed GET, retry recovery, unknown route and invalid opportunity ID | PASS |
| Record defects and retest fixes | Recorded the test-timeout issue below and confirmed the complete suite passed after adjustment | PASS |

## Automated integration testing

The integration suite is located at:

`src/test/App.test.jsx`

The suite contains 10 tests covering:

1. root-route redirection and the initial GET request;
2. navigation between the Opportunity List, Add Opportunity, Shortlist and details routes;
3. unknown routes and invalid opportunity IDs;
4. search, State and Sector filters, no-match results and clear filters;
5. the empty-catalogue state;
6. shortlist persistence through `localStorage`, browser reload and removal;
7. required-field and invalid-URL validation;
8. POST creation;
9. confirmed DELETE of a user-created opportunity; and
10. GET failure followed by successful retry.

Final automated result:

- **Test files:** 1 passed
- **Tests:** 10 passed out of 10

## Manual browser journey

The following checks were completed against the running application:

| Step | Expected result | Actual result |
| --- | --- | --- |
| Open `/` | Redirect to `/opportunities` | PASS |
| Load Opportunity List | MockAPI opportunities appear | PASS |
| Open Add Opportunity | Form route loads correctly | PASS |
| Submit an empty form | Required-field message appears | PASS |
| Submit `invalid-url` | Valid-URL message appears | PASS |
| Submit a valid temporary record | Record is created and displayed in the list | PASS |
| Open the temporary record | Details route displays the submitted data | PASS |
| Delete the temporary record | Confirmation appears and DELETE succeeds | PASS |
| Search for the deleted title | No matching opportunities appear | PASS |
| Clear filters | Original catalogue returns | PASS |
| Add an opportunity to Shortlist | Navigation count changes to 1 | PASS |
| Refresh the browser | Shortlist count remains 1 | PASS |
| Open Shortlist | Saved opportunity appears | PASS |
| Remove from Shortlist | Empty state appears and count returns to 0 | PASS |

## Controlled API cleanup

The temporary live-test record was named:

`Issue 16 Verification Opportunity`

It was created only to verify the POST and details flows. After verification, the same record was deleted through the application’s confirmed DELETE flow.

The original MockAPI opportunity records were retained, and the shortlist was returned to its empty state.

## Defect and retest record

### QA-16-01 — POST integration test exceeded the default timeout

- **Category:** Test infrastructure
- **Severity:** Low
- **Application impact:** None
- **Observation:** The POST test required form entry plus the application’s 1.2-second success redirect and exceeded Vitest’s default five-second test timeout.
- **Resolution:** Applied a 10-second timeout only to the POST integration test.
- **Retest result:** PASS — all 10 tests completed successfully.

No application defects remained after the final automated and manual verification.

## Technical quality gates

The following commands completed successfully:

```text
npm.cmd test
npm.cmd run lint
npm.cmd run build

The application is ready to proceed to the next project stage.