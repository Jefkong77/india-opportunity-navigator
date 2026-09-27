# Issue #19 Presentation Outline

## Presentation format

- Total duration: 10 to 15 minutes
- Slides: approximately 5 minutes
- Live demonstration: approximately 7 minutes
- Closing and contingency buffer: 1 to 2 minutes
- Target duration: approximately 13 to 14 minutes
- Keep every slide brief and visual
- Prefer application screenshots and the working demonstration over dense text
- Use no more than three main points on most slides

## Slide plan

### Slide 1: India Opportunity Navigator

**Purpose:** Introduce the application and team.

**On-slide content:**

- India Opportunity Navigator
- Helping Singapore SMEs organise India market opportunities
- Jeffrey Kong and Kelvin Lee
- NTU SCTP Advanced Professional Certificate in AI Engineering

**Visual:**

Use the opportunity catalogue screenshot as the main background or featured image.

**Speaker:** Kelvin

**Time:** 20 seconds

---

### Slide 2: Problem and target users

**Purpose:** Explain why the application was created.

**On-slide content:**

**Problem**

India opportunities span many states, sectors and support programmes. Singapore SMEs need a consistent way to review and compare them.

**Target users**

- Singapore SMEs exploring India
- Market and business advisors
- International business-development teams

**Visual:**

Use a large screenshot of the opportunity catalogue with the State and Sector information visible.

**Speaker:** Kelvin

**Time:** 40 seconds

---

### Slide 3: Application solution

**Purpose:** Show the main user journey.

**On-slide content:**

1. Browse and filter opportunities
2. Review details and evidence
3. Add, shortlist and prioritise opportunities

**Visual:**

Use screenshots showing:

- the catalogue and filters;
- an opportunity-details page; and
- the shortlist.

**Speaker:** Kelvin

**Time:** 45 seconds

---

### Slide 4: Main application features

**Purpose:** Summarise what the working application demonstrates.

**On-slide content:**

- Browse, search and filter 12 opportunity records
- Add and delete opportunities through a controlled form
- Save, reorder and retain shortlist selections

**Visual:**

Use two large screenshots:

- opportunity catalogue; and
- shortlist drag-and-drop.

Avoid lengthy feature descriptions because the live demonstration will show the actual interactions.

**Speaker:** Jeffrey

**Time:** 40 seconds

---

### Slide 5: Technical architecture

**Purpose:** Explain how the application works without presenting detailed source code.

**On-slide content:**

- Vite and React provide the application interface
- React Router manages client-side navigation
- MockAPI stores opportunity records
- `localStorage` preserves shortlist order
- Netlify hosts the public application

**Visual structure:**

```text
User
  ↓
React interface and React Router
  ↓
React state and controlled events
  ↓
MockAPI records and localStorage shortlist
  ↓
Netlify deployment

### Slide 6: React concepts applied

**Purpose:** Demonstrate how the project applies Module 2 learning.

**On-slide content:**

- Functional components, JSX and props
- `useState` for filters, forms and shortlist behaviour
- `useEffect` for MockAPI data fetching and persistence
- Conditional rendering for loading, errors and empty results
- React Router for catalogue, details, form and shortlist routes

**Visual:**

Use a small application screenshot beside a simplified component and state diagram.

Do not place source-code screenshots on this slide unless they are needed during questions.

**Speaker:** Jeffrey

**Time:** 60 seconds

---

### Slide 7: Collaboration and quality checks

**Purpose:** Show how the team worked through GitHub and verified the application.

**On-slide content:**

- Issues, feature branches and pull requests recorded the work
- GitHub Project showed ownership, status and deadlines
- 10 automated tests passed
- Lint and production build passed
- Browser and Netlify checks completed

**Visual:**

Use a screenshot of the GitHub Project board or pull-request history.

Add a small verification summary:

- 10 tests passed
- Lint passed
- Build passed
- Netlify verified

**Speaker:** Jeffrey

**Time:** 50 seconds

---

### Slide 8: Team learning and challenges

**Purpose:** Meet the project-brief requirement for individual learning and project challenges.

**On-slide content:**

**Kelvin**

- Translating requirements into interface and data features
- Working with shared branches, issues and pull requests

**Jeffrey**

- Integrating features against a shared data contract
- Strengthening state, testing, deployment and documentation

**Shared challenges**

- Aligning older branch work with the approved routes and data fields
- Combining independently developed features
- Preparing a reliable deployment within a short timeline

**Visual:**

Use two team-member sections with one shared challenge section. Keep the wording short.

**Speakers:** Kelvin and Jeffrey

**Time:** 60 seconds

---

## Live demonstration sequence

### Demonstration timing

Target duration: approximately 7 minutes.

### Kelvin's demonstration section

1. Open the deployed Netlify application.
2. Show the complete opportunity catalogue.
3. Search for an opportunity.
4. Filter by State and Sector.
5. Open an opportunity-details page.
6. Point out the source or evidence link.

**Target time:** 3 minutes

### Jeffrey's demonstration section

1. Open the Add Opportunity form.
2. Explain that the form uses controlled React inputs.
3. Create one temporary demonstration opportunity.
4. Add two opportunities to the shortlist.
5. Drag one shortlisted card into a new position.
6. Refresh the page to confirm that the order remains stored.
7. Delete the temporary demonstration opportunity.
8. Confirm that the catalogue updates correctly.

**Target time:** 4 minutes

## Speaking-role summary

### Kelvin

- Slides 1 to 3
- Problem, target users and solution
- Browse, filter and details demonstration

### Jeffrey

- Slides 4 to 7
- Features, architecture, React concepts and collaboration
- Add, shortlist, drag-and-drop and delete demonstration

### Shared

- Slide 8
- Team learning, challenges and final conclusion

The speaking roles can be adjusted during rehearsal, but both team members should be able to explain any part of the application.

## Demonstration preparation

Before presenting:

- Open the Netlify application in a clean browser tab
- Confirm that MockAPI is responding
- Remove unnecessary test records
- Keep the GitHub repository and Project board open in separate tabs
- Prepare the temporary opportunity information in a text file
- Test drag-and-drop and refresh persistence
- Confirm that the delete action works
- Close unrelated browser tabs and notifications

## Backup demonstration plan

If the Netlify application or network is unavailable:

1. Run the application locally with `npm.cmd run dev`.
2. Use the local application for the demonstration.
3. Keep screenshots of every main feature in the presentation folder.
4. Prepare a short screen recording of the complete demonstration.
5. Keep a PDF copy of the slide deck.
6. Keep the Netlify URL, GitHub URL and local project ready.

## Rehearsal checklist

- Complete one rehearsal without interruption
- Keep the presentation within 15 minutes
- Practise the handover between Kelvin and Jeffrey
- Practise explaining the architecture in plain language
- Confirm that both members can explain the main React code
- Test the Netlify and local versions
- Confirm that the backup screenshots and recording can be opened
- Complete a final rehearsal before 1 October 2026