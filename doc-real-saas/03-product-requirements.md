# Product Requirements

Status: **proposed MVP**, awaiting discovery decisions.

## MVP outcome

A company with 2–20 people can create an account, invite its team, record daily attendance, resolve mistakes transparently, and export a trustworthy monthly report under a paid or trial subscription.

## Functional scope

### Company setup

- An owner creates one organization and verifies their email.
- The owner sets organization name, time zone, workweek, and expected daily hours.
- The service creates an owner membership and starts a trial or selected plan.
- The organization supports a maximum of 20 active members in the initial product.

### People and access

- Owner/admin can invite, resend, deactivate, reactivate, and change roles for members.
- An invitation expires and can be revoked.
- Deactivation prevents new sessions and clock actions but preserves historical records.
- A person may eventually belong to multiple organizations; MVP UI may support one active organization at a time.

### Attendance

- A member can clock in when no open attendance session exists.
- A member can clock out only when an open session exists.
- The product records a clear, authoritative time and displays it in the organization time zone.
- Repeated taps must not create duplicate or contradictory attendance entries.
- An open session may span midnight; policy determines how it is displayed and reported.
- Members can view their current status, current session duration, and history.

### Corrections

- A member can request a correction with proposed times and a reason.
- An authorized admin can approve or reject the request.
- The original record remains recoverable; corrections create an audit event.
- An admin direct edit, if enabled, also requires a reason and creates an audit event.

### Admin review and reporting

- Today view shows present, absent/not-started, completed, and missing-clock-out states.
- Date-range view shows each member’s sessions and total duration.
- Admin can filter by member and date.
- Monthly CSV export includes organization, member, local date, clock-in, clock-out, duration, status, and correction indicator.
- Totals are labelled “attendance duration,” not guaranteed payroll hours.

### Subscription

- Owner can see plan, active-member usage, trial state, invoices/receipts where supported, and renewal state.
- At limit, existing records remain accessible; adding or reactivating a member is blocked with a clear upgrade path.
- Cancellation stops renewal but preserves access until the paid period ends.

### Account and data controls

- Users can change or reset passwords and revoke sessions.
- Owner can export organization data.
- Organization deletion uses a deliberate confirmation and retention workflow.

## Roles and permissions

| Action | Owner | Admin/manager | Member |
|---|---:|---:|---:|
| Manage subscription/delete organization | Yes | No | No |
| Manage organization settings | Yes | Optional | No |
| Invite/deactivate members | Yes | Yes | No |
| Review team attendance | Yes | Yes | No |
| Approve corrections | Yes | Yes | No |
| Clock own attendance | Yes | Yes | Yes |
| View own attendance | Yes | Yes | Yes |
| View audit log | Yes | Limited | Own events only |

The exact admin/manager role name is open.

## Core business rules

1. A membership belongs to exactly one organization and all attendance access is scoped through it.
2. One member can have at most one open attendance session per organization.
3. The recorded time is authoritative and is displayed in the organization’s time zone.
4. Attendance events are never silently overwritten.
5. Deactivated users remain in historical reports.
6. Paid member counts include active memberships and exclude pending invitations.
7. Admins cannot view passwords, password hashes, recovery tokens, or device secrets.

## Experience and service requirements

- Mobile-first responsive web experience
- Common attendance actions feel immediate and always show confirmed or failed state
- WCAG 2.2 AA target for key workflows
- Customer records are protected, recoverable, and auditable
- Time-zone and daylight-saving behavior is verified before launch
- Supported-browser policy documented before launch

## Explicit MVP non-goals

- Payroll calculation or statutory compliance engine
- Employee scheduling and shift swaps
- Leave management
- Biometric recognition or continuous location tracking
- Native mobile apps
- Hardware time clocks
- Public API and broad integrations
- More than 20 active members per organization
- Complex custom roles

## Later candidates

Email reminders, kiosk mode, holiday calendars, geofenced verification, QR attendance, manager summaries, accounting/payroll exports, multi-location support, and SSO should be prioritized only from customer evidence.
