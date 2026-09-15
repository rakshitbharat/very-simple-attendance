# Users and Journeys

## Persona: owner/operator

Runs the business and may also handle HR and payroll preparation. Wants a reliable answer to “who worked and for how long?” without learning enterprise software.

**Jobs:** onboard the team, spot missing entries, correct exceptions, export the month, and control cost.

## Persona: team member

Wants clocking to be fast and records to be fair. May use a personal phone or shared workplace computer.

**Jobs:** clock in/out, confirm status, review history, and fix a mistake without an awkward manual process.

## Persona: manager

Handles daily attendance but should not control billing or destructive organization settings.

## Journey 1: owner starts a company

1. Owner creates and verifies an account.
2. Owner names the organization and chooses its time zone and workweek.
3. Product explains the trial/plan and member limit plainly.
4. Owner invites members by email or copies secure invite links.
5. Dashboard shows invite status and a first-day checklist.

**Success:** the owner and first member complete a test clock-in within ten minutes.

## Journey 2: member joins

1. Member opens an expiring invitation.
2. Member confirms identity, sets a password or uses an approved passwordless method, and accepts terms.
3. Product shows the organization and its attendance policy.
4. Member lands on a single prominent clock action.

**Failure handling:** expired, already-used, wrong-account, and revoked invitations each receive a specific recovery path.

## Journey 3: daily clocking

1. Member sees current state and organization-local time.
2. Member taps Clock in or Clock out once.
3. UI enters a pending state and prevents duplicate submission.
4. The product confirms membership and current state, records one valid session, and returns the confirmed state.
5. UI confirms the exact timestamp and offers “Report a mistake.”

**Failure handling:** offline state must be explicit. MVP should not pretend an unconfirmed local tap was recorded.

## Journey 4: correct a mistake

1. Member selects an attendance record or missing event.
2. Member proposes a change and gives a reason.
3. Manager receives an actionable notification or sees a pending badge.
4. Manager compares original and proposed values and approves or rejects.
5. Both parties see the result and audit history.

## Journey 5: close the month

1. Owner selects a month and sees exceptions first.
2. Owner resolves open sessions and pending corrections.
3. Product calculates durations consistently in organization time.
4. Owner downloads CSV and can reproduce its totals from on-screen records.

## Journey 6: offboard a member

1. Admin deactivates the membership and confirms the effective action.
2. Active sessions are revoked; an open attendance session is flagged for review.
3. Historical records remain visible and exportable.
4. Active-seat usage updates consistently with the billing policy.

## UX rules

- Do not hide state behind color alone.
- Always show the relevant organization time zone.
- Confirm destructive and irreversible actions.
- Show exact recorded timestamps after mutations.
- Separate “not clocked in,” “absent,” “on leave,” and “not scheduled” unless policy explicitly equates them.
- Never imply payroll or legal correctness when only elapsed attendance duration is calculated.
