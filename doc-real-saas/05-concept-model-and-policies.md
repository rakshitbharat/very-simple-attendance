# Concept Model and Product Policies

This document defines the language of the product without choosing how it will be built.

## Core concepts

### Organization

The subscribing small company. It owns its settings, membership list, attendance policy, reports, and subscription.

### Person and membership

A person signs in using a personal Google account. A membership connects that person to an organization and gives them a role and an active or inactive status. One person may belong to several organizations.

### Company selection

If a person has one company, it opens by default. If the person has more than one, the product presents a list. The active company controls the visible membership, attendance, device approvals, and permissions.

### Role

- **Owner:** commercial and ultimate administrative responsibility
- **Manager/admin:** day-to-day team and attendance responsibility
- **Member:** records and reviews their own attendance

The need for a separate manager role must be validated.

### Attendance session

A period beginning with clock-in and ending with clock-out. It may be open, completed, flagged, or corrected. A person may have several completed sessions in a day but only one open session at a time within an organization.

### Device

A phone, tablet, computer, or other installation from which a member uses the application. Approval belongs to the combination of person, company, and device—not merely to the person’s Google account.

### PTP onboarding

The company-controlled process that approves a specific device for a member. An owner or delegated person with device-approval rights participates by providing or approving the PTP. A second device requires a separate onboarding.

### Device permission

A company-granted ability on an approved device. The initial protected actions are Clock in and Clock out. The product may grant both together or separately, pending a product decision.

### Correction

A transparent change process containing the original record, proposed change, reason, requester, decision, reviewer, and time of decision. A correction is not a silent overwrite.

### Attendance policy

The organization’s shared rules: time zone, working days, expected hours if used, overnight handling, maximum open-session duration, correction method, and any grace rules.

### Subscription

A recurring way for an owner to receive credits. A subscription is one funding method inside the credit system, not a separate entitlement system.

### Credit account

The visible balance and history used for paid product capabilities. It belongs to the payer or company according to the ownership policy still to be decided.

### Credit transaction

Any addition, reservation, consumption, reversal, refund, adjustment, transfer, or expiry of credits. Every transaction has a clear business reason and remains visible in history.

### Paid capability

Any action or period of access with a defined credit cost—for example company creation, continued company management, an optional package, or a future premium capability.

## Product states that must remain distinct

- Invited vs active vs deactivated member
- Pending vs approved vs revoked device
- Approved device vs Clock-in permission vs Clock-out permission
- Not yet clocked in vs absent vs not scheduled vs on leave
- Open vs completed vs missing clock-out attendance
- Original vs corrected record
- Pending vs approved vs rejected correction
- Trial vs active vs payment problem vs canceled subscription
- Available vs reserved vs consumed vs reversed vs expired credits

Combining these states may make the interface look simpler but creates inaccurate reports and disputes.

## Proposed policy defaults

- The organization chooses one primary time zone.
- A member can have only one open attendance session in an organization.
- More than one completed session per day is allowed.
- Missing clock-out is flagged; the product does not invent an end time silently.
- Every manual change needs a reason and history.
- Deactivation blocks future attendance while preserving history.
- Pending invitations do not count as paid active members.
- Every additional device requires its own company-approved PTP onboarding.
- Company membership and device approval are separate states.
- Device approval is company-specific and never carries automatically to another company.
- Canceling a subscription preserves service until the paid period ends.
- Subscriptions and one-time purchases both operate through credits.
- Credit cost is shown before confirmation.
- One paid action causes at most one final credit deduction.
- Credit history is understandable to the owner without financial jargon.
- Customers can export their attendance data.

These are recommendations to discuss, not approved decisions.

## Questions behind “hours worked”

Before the product uses this phrase, decide:

- Are breaks included?
- Are overnight sessions split between dates?
- Are durations rounded?
- Does an expected schedule exist?
- Are late/early labels needed?
- Does approval make the duration payroll-ready or merely reviewed?

Until these are answered, the safer label is **recorded attendance duration**.

## PTP concept

PTP is the company’s mechanism for onboarding a member’s device and enabling protected attendance actions. It is not the person’s login identity; Google login answers “who is this person?” while company membership answers “which company may they enter?” and PTP device approval answers “may this device clock attendance here?” The exact PTP creation, delivery, expiry, reuse, and recovery behavior remains to be decided.

## Technology boundary

No framework, database, hosting provider, authentication implementation, billing provider, or application architecture is selected in this product concept. Those decisions belong in a later technical design based on approved requirements.
