# Success Metrics and Acceptance Gates

## North-star behavior

An active organization reliably records attendance for most active members and completes a monthly review/export with few unresolved exceptions.

This is more meaningful than registrations or raw clock-event counts.

## Product funnel

- **Acquisition:** qualified owner starts signup
- **Activation:** organization configured, first member joined, first successful clock-in/out completed
- **Habit:** organization records attendance on expected working days
- **Value:** owner reviews and exports a reporting period
- **Revenue:** trial converts and subscription remains active
- **Retention:** organization continues the routine across reporting periods

## Initial metric definitions

- Setup completion rate
- Median time from signup to first completed attendance session
- Invitation acceptance rate
- Clock mutation success and duplicate/error rate
- Organizations with activity on expected days
- Open sessions older than policy threshold
- Correction request rate and median resolution time
- Monthly export completion rate
- Trial-to-paid conversion
- 30/90-day organization retention
- Support requests per active organization

Targets should be set after a pilot baseline, not invented before real usage.

## MVP acceptance scenarios

### Company privacy

- A member of Organization A cannot view, infer, change, or export any Organization B data through any normal or manipulated product action.

### Authentication

- Invalid, expired, revoked, and logged-out sessions fail safely.
- Password reset invalidates appropriate existing sessions.
- No person can claim another identity or role by changing information in the interface or request.

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
- Trial end, successful payment, failure/grace, cancellation, and reactivation produce documented entitlements.
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
