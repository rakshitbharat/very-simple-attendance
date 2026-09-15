# Product Requirements

Status: **proposed MVP**, awaiting discovery decisions.

## MVP outcome

An owner can obtain credits, spend the required credits to create and manage a 2–20 person company, invite members who use personal Google accounts, approve each member device through PTP onboarding, and control which approved devices may record attendance.

## Functional scope

### Company setup

- Every person signs in with their own personal Google account.
- Creating a company requires the defined credit amount or a credit-backed trial/grant.
- The creator becomes the company owner and controls the subscription.
- The owner sets organization name, time zone, workweek, and expected daily hours.
- The organization supports a maximum of 20 active members in the initial product.
- A person who belongs to one company enters it automatically after login.
- A person who belongs to multiple companies sees a company list and chooses which one to open.
- A person with no company sees invited-company actions and the paid Create company option.

### People and access

- Owner or an authorized person can invite, resend, deactivate, reactivate, and change allowed roles for members.
- An invitation expires and can be revoked.
- An invited person accepts the company invitation using the intended personal Google account.
- Joining makes the person a company member but does not automatically approve the current device for attendance.
- Deactivation prevents company access and clock actions but preserves historical records.
- A person may belong to multiple companies and uses one selected company at a time.

### Device onboarding and PTP

- Every device is treated as a separate attendance device for a member within a company.
- After accepting a company invitation, the member reaches a final device-onboarding step.
- The owner, admin, or another role with device-approval rights provides or approves the PTP.
- Successful PTP onboarding marks that specific device as approved for that member and company.
- Installing or opening the application on another device requires a new device-onboarding approval, even for the same Google account.
- A company can view approved and pending devices and revoke a device.
- Revoking one device does not remove the member or automatically revoke their other approved devices.
- Device approval can carry explicit permissions, initially Clock in and Clock out.
- A device without the required permission can view allowed information but cannot perform the protected attendance action.

### Attendance

- A member can clock in when no open attendance session exists.
- A member can clock out only when an open session exists.
- Clock in and clock out require the appropriate permission on the current approved device.
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

### Credits and payment

- Credits are the common payment unit for every paid capability in the application.
- Credits may come from a recurring subscription, a one-time fixed purchase, a package, a trial, a promotion, or an administrative grant.
- The owner can see available credits, reserved credits if used, upcoming charges, purchases, grants, consumption, reversals, expiry if applicable, and the reason for every balance change.
- A subscription grants credits according to its recurring terms; it does not bypass the credit system.
- A fixed-cost offer grants a defined amount of credits or consumes a defined amount for a capability.
- Creating or continuing to manage a company consumes credits according to the active commercial rule.
- The product checks and clearly displays the credit cost before a paid action is confirmed.
- Insufficient credits never create a hidden charge or unclear partial result.
- Existing attendance records remain available according to the agreed restricted-access and retention policy if credits run out.
- Invited members do not need personal credits merely to join and use a company whose owner has funded it.

### Account and data controls

- Users access the product through their personal Google account and can sign out of product sessions.
- Owner can export organization data.
- Organization deletion uses a deliberate confirmation and retention workflow.

## Roles and permissions

| Action | Owner | Admin/manager | Member |
|---|---:|---:|---:|
| Manage subscription/delete organization | Yes | No | No |
| Buy, receive, or allocate company credits | Yes | No | No |
| View company credit history | Yes | Optional view-only | No |
| Manage organization settings | Yes | Optional | No |
| Invite/deactivate members | Yes | If granted | No |
| Approve or revoke attendance devices | Yes | If granted | No |
| Assign device permissions | Yes | If granted | No |
| Review team attendance | Yes | Yes | No |
| Approve corrections | Yes | Yes | No |
| Clock own attendance | Yes | Yes | Yes |
| View own attendance | Yes | Yes | Yes |
| View audit log | Yes | Limited | Own events only |

The exact admin/manager role name is open.

## Core business rules

1. A Google account identifies a person; it does not by itself grant company membership or device permission.
2. A membership connects a person to one company.
3. Device approval is separate for each person, company, and device.
4. A newly used device is pending until a company-authorized person completes PTP onboarding.
5. Clock in and clock out are allowed only when the current device has the required company permission.
6. One member can have at most one open attendance session per organization.
7. Attendance events are never silently overwritten.
8. Deactivated users and revoked devices remain in historical records.
9. Invited members do not individually pay merely to join; company creation and management consume owner/company credits.
10. Every credit addition or deduction has an amount, reason, time, and visible resulting balance.
11. Credits are never deducted twice for one completed paid action.
12. A failed or canceled action does not consume credits unless a clearly disclosed policy says otherwise.

## Experience and service requirements

- Easy installation and mobile-first experience
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
- Hardware time clocks
- Public API and broad integrations
- More than 20 active members per organization
- Complex custom roles

## Later candidates

Email reminders, kiosk mode, holiday calendars, geofenced verification, QR attendance, manager summaries, accounting/payroll exports, multi-location support, and SSO should be prioritized only from customer evidence.
