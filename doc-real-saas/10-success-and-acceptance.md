# Success Metrics and Acceptance Gates

## North-star behavior

An active organization reliably records attendance for most active members and completes a monthly review/export with few unresolved exceptions.

This is more meaningful than registrations or raw clock-event counts.

## Product funnel

- **Acquisition:** qualified owner starts signup
- **Activation:** company configured, first member joined, first device PTP-approved, and first successful clock-in/out completed
- **Habit:** organization records attendance on expected working days
- **Value:** owner reviews and exports a reporting period
- **Revenue:** trial converts and subscription remains active
- **Retention:** organization continues the routine across reporting periods

## Initial metric definitions

- Setup completion rate
- Median time from signup to first completed attendance session
- Invitation acceptance rate
- Device-approval completion rate and time to approval
- PTP failure and recovery rate
- Additional-device onboarding success rate
- Clock mutation success and duplicate/error rate
- Organizations with activity on expected days
- Open sessions older than policy threshold
- Correction request rate and median resolution time
- Monthly export completion rate
- Trial-to-paid conversion
- Credit purchase and recurring-credit renewal success
- Credit consumption per active company
- Unused-credit balance and expiry/refund complaints
- 30/90-day organization retention
- Support requests per active organization

Targets should be set after a pilot baseline, not invented before real usage.

## MVP acceptance scenarios

### Company privacy

- A member of Organization A cannot view, infer, change, or export any Organization B data through any normal or manipulated product action.

### Authentication

- Invalid, expired, revoked, and logged-out sessions fail safely.
- Signing out or revoking product access ends the appropriate sessions without affecting the person’s Google account.
- No person can claim another identity or role by changing information in the interface or request.

### Login and company selection

- Personal Google login opens the only company automatically when exactly one membership exists.
- With multiple memberships, the person sees and can select only their companies.
- A person with no membership can accept a valid invitation or begin paid company creation.

### Device onboarding and PTP

- Joining a company does not automatically approve the current device for attendance.
- Successful PTP onboarding approves only the intended person-company-device combination.
- The same Google account on a new device requires separate PTP onboarding.
- Approval in one company does not approve the device in another company.
- A pending or revoked device cannot clock in or out.
- An approved device can perform only its granted attendance actions.
- Only an owner or person with delegated device-approval rights can approve, change, or revoke device permission.
- Revoking one device leaves the member’s other approved devices unchanged.
- Failed or abandoned PTP onboarding never leaves the device partly approved.

### Attendance correctness

- Two near-simultaneous clock-in actions create only one open session.
- Repeated clock-out does not create contradictory state.
- UTC storage and organization-local display agree across tested time zones and DST boundaries.
- Overnight sessions follow the documented policy.
- The immediate confirmation and refreshed screen show the same state.

### Corrections and audit

- A member can propose but not silently apply a protected correction.
- Approval/rejection permissions are enforced.
- Original values, actor, reason, and decision remain auditable.

### Membership lifecycle

- Deactivation immediately prevents new protected actions and preserves history.
- The last owner cannot be removed without transferring ownership or deleting the organization.
- Seat usage changes consistently with activation state.

### Billing

- Duplicate or delayed billing notifications do not duplicate charges or product effects.
- A successful subscription, fixed purchase, trial, or promotion grants exactly the disclosed credits.
- Every paid capability shows its credit cost before confirmation and consumes the correct amount once.
- Failed or canceled actions do not leave an unexplained deduction.
- Reversal and refund behavior produces a clear credit history and resulting balance.
- Insufficient credits block only the intended paid action and explain how to continue.
- Trial end, payment failure, cancellation, and reactivation produce the documented credit and access behavior.
- Customers retain the promised read/export access during restricted states.

### Export

- On-screen records and CSV totals reconcile for the same range and time zone.
- Export escapes spreadsheet formulas and does not include secrets or cross-tenant data.

## Release gates

### Pilot gate

- Critical end-to-end scenarios verified
- Company privacy scenarios passing
- Restore test completed
- Monitoring and support channel operating
- Privacy/terms/retention reviewed for the pilot market
- No known critical security defect

### Public launch gate

- Pilot demonstrates recurring usage and month-end value
- Complete billing lifecycle tested before charging customers
- Accessibility review of core flows completed
- Incident and rollback drills completed
- Support load is sustainable
- Product claims match implemented behavior
