# Proof-of-Concept Audit

## Executive assessment

**Observed:** the POC demonstrates the intended core interaction and provides useful product-learning and UI ideas. It is a concept demonstration, not a complete SaaS. This audit focuses on what the concept proves and what the product definition still lacks. Technology choices are outside the scope of this folder.

## What the POC currently demonstrates

- Login and account-access screens
- A four-digit PTP and device-registration concept
- Employee clock-in, clock-out, status, recent activity, and calendar views
- Admin dashboard counts and recent activity
- Admin creation, editing, password changes, PTP resets, and deletion restrictions

## Useful assets to carry forward

- The small-team scope and straightforward navigation
- The employee dashboard concept
- The one-button clock-in/clock-out interaction
- Personal calendar and recent-activity concepts
- Basic admin roster and summary concepts
- Existing screenshots as historical product references

Reuse should be decided component by component. Existing behavior must not be assumed secure because the UI looks complete.

## What the POC does not yet define

- How separate customer companies and their people are kept distinct
- What “present,” “absent,” “late,” and “working hours” mean
- The policy for overnight work, breaks, weekends, holidays, and time zones
- How mistakes are requested, reviewed, corrected, and explained
- What an owner, manager, and employee may each see or change
- How a member is invited, deactivated, or leaves a company
- Which information appears in monthly reports and exports
- How subscriptions, trials, member limits, cancellation, and payment failure behave
- How long records are retained and how customers export or delete their data
- What customer promise differentiates the product from a spreadsheet

## Important product trust lesson

The PTP is not a second login. Its product purpose is now defined as **company-controlled onboarding of each attendance device**. Personal Google login identifies the person, company membership grants entry to the company, and PTP approval grants attendance permission to that particular device. The remaining discovery work is to make the PTP exchange understandable, safe, and recoverable without weakening this separation.

## Feature reality map

| Capability | Status | Notes |
|---|---|---|
| Login | POC | Demonstrates entry into the product; final access experience is undecided |
| Employee attendance | POC | Core actions exist; policy and race handling missing |
| Personal history | POC | Recent records and current-month calendar exist |
| Admin roster | POC | Basic CRUD exists; authorization must be replaced |
| Reports/export | Not found | Mentioned in docs, not established in code |
| Corrections/approvals | Not found | Required for real-world use |
| Separate companies | Not found | Required for a multi-customer SaaS concept |
| Subscription/billing | Not found | Required for paid service |
| Audit log | Not found | Mentioned in docs, not established in schema |
| Leave, shifts, payroll | Not found | Explicitly outside first MVP unless validated |

## Recommendation

Use the POC as a visual conversation starter. First define the product promise and policies, then validate a complete customer journey: company setup → invitation → access → clock in/out → correction → admin review → monthly export → subscription renewal. Decide technology separately after these concepts are stable.
