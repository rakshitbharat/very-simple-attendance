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

1. Owner signs in with a personal Google account.
2. Owner chooses Create company and sees the price or trial terms before confirming.
3. Owner names the organization and chooses its time zone and workweek.
4. Payment or trial activation creates the company and owner role.
5. Owner invites members using their personal Google-account email addresses.
6. Dashboard shows membership, device-approval, and first-day status.

**Success:** the owner and first member complete a test clock-in within ten minutes.

## Journey 2: member joins

1. Member installs/opens the application and signs in with the invited personal Google account.
2. Member opens and accepts the company invitation.
3. Product shows the company and its attendance policy.
4. Product explains that the current device still needs company approval.
5. Owner or another authorized person supplies/approves the PTP for this device.
6. Product confirms the device permissions and then enables the allowed attendance actions.

**Failure handling:** expired, already-used, wrong-account, and revoked invitations each receive a specific recovery path.

## Journey 3: returning login and company selection

1. Person signs in with their personal Google account.
2. If they belong to exactly one company, that company opens automatically.
3. If they belong to multiple companies, the product shows a company list.
4. The person selects a company and sees whether the current device is approved there.
5. Device approval in one company does not imply approval in another.

## Journey 4: daily clocking

1. Member sees current state and organization-local time.
2. Product confirms that the current device has permission for the requested action.
3. Member taps Clock in or Clock out once.
4. UI enters a pending state and prevents duplicate submission.
5. The product records one valid session and returns the confirmed state.
6. UI confirms the exact timestamp and offers “Report a mistake.”

**Failure handling:** offline state must be explicit. MVP should not pretend an unconfirmed local tap was recorded.

## Journey 5: add a second device

1. Existing member installs/opens the application on another phone, tablet, or computer.
2. Member signs in with the same personal Google account and opens the company.
3. Product recognizes that this device is not yet approved for attendance.
4. An authorized company person completes PTP onboarding for this new device.
5. The new device receives only its assigned attendance permissions; existing devices remain unchanged.

## Journey 6: correct a mistake

1. Member selects an attendance record or missing event.
2. Member proposes a change and gives a reason.
3. Manager receives an actionable notification or sees a pending badge.
4. Manager compares original and proposed values and approves or rejects.
5. Both parties see the result and audit history.

## Journey 7: close the month

1. Owner selects a month and sees exceptions first.
2. Owner resolves open sessions and pending corrections.
3. Product calculates durations consistently in organization time.
4. Owner downloads CSV and can reproduce its totals from on-screen records.

## Journey 8: offboard a member or device

1. Admin chooses whether to revoke one device or deactivate the entire membership.
2. Device revocation blocks attendance only from that device.
3. Member deactivation blocks the person from the company on every device; an open attendance session is flagged for review.
4. Historical membership, device, approval, and attendance records remain visible to authorized people.
5. Active-member usage updates consistently with the billing policy.

## UX rules

- Do not hide state behind color alone.
- Always show the relevant organization time zone.
- Confirm destructive and irreversible actions.
- Show exact recorded timestamps after mutations.
- Separate “not clocked in,” “absent,” “on leave,” and “not scheduled” unless policy explicitly equates them.
- Never imply payroll or legal correctness when only elapsed attendance duration is calculated.
