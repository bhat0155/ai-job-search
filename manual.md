# Job Search Manual

Follow these steps in order each time you search and apply for jobs.

---

## Step-by-Step Workflow

1. `/scrape` — Searches job portals (LinkedIn, etc.) for new postings that match your profile and saves them to the tracker.

2. `/rank` — Scores all newly scraped jobs against your profile and returns a ranked shortlist so you know where to focus `/apply` effort.

3. `/apply <job URL or pasted text>` — Runs the full two-agent drafter-reviewer workflow: evaluates fit, tailors your CV, writes a cover letter, compiles both to PDF, and copies the `.tex` + `.pdf` into `resumes/software`, `resumes/cloud`, or `resumes/support` based on the role type.

4. `/interview <company or role>` — Builds a stage-specific prep pack (STAR answers, tough questions, questions to ask) for a scheduled interview on a tracked application.

5. `/outcome <company or role>` — Records what happened to an application (interview invite, offer, rejection, no response) into the tracker and outcome archive.

---

## Supporting Commands

- `/gmail-sync` — Scans Gmail for status signals on tracked applications (interview invites, rejections, offers) and proposes updates to the tracker for your approval.

- `/html-report` — Generates a single self-contained HTML dashboard from your tracker CSV so you can see all applications at a glance in a browser.

- `/notion-sync` — Pushes ranked jobs and application data into your Notion workspace as a read-only view.

- `/expand` — Enriches your candidate profile by pulling competencies from your documents and public online presence (LinkedIn, blog, GitHub).

- `/upskill` — Compares tracked job postings against your profile, identifies skill gaps, and generates a prioritized learning plan with resources.

- `/add-portal <portal URL>` — Adds a new job board (local, niche, or country-specific) to your scraping setup so `/scrape` picks it up.

- `/add-template` — Registers a custom LaTeX CV or cover letter template with the framework so `/apply` uses it automatically.

- `/setup` — Runs first-time onboarding: collects your professional information and populates all profile files so the rest of the workflow works.

- `/reset` — Wipes candidate profile data so you can start fresh with `/setup`. Destructive — asks for confirmation first.
