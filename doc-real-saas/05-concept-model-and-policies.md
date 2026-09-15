# Concept Model and Product Policies

This document defines the language of the product without choosing how it will be built.

## Core concepts

### Organization

The subscribing small company. It owns its settings, membership list, attendance policy, reports, and subscription.

### Person and membership

A person has an account. A membership connects that person to an organization and gives them a role and an active or inactive status. This distinction lets one person potentially work with more than one organization later.

### Role

- **Owner:** commercial and ultimate administrative responsibility
- **Manager/admin:** day-to-day team and attendance responsibility
- **Member:** records and reviews their own attendance

The need for a separate manager role must be validated.

### Attendance session

A period beginning with clock-in and ending with clock-out. It may be open, completed, flagged, or corrected. A person may have several completed sessions in a day but only one open session at a time within an organization.

### Correction

A transparent change process containing the original record, proposed change, reason, requester, decision, reviewer, and time of decision. A correction is not a silent overwrite.

### Attendance policy

The organization’s shared rules: time zone, working days, expected hours if used, overnight handling, maximum open-session duration, correction method, and any grace rules.

### Subscription

The commercial agreement that defines trial or paid status, included active members, renewal, and access when payment or cancellation state changes.

## Product states that must remain distinct

- Invited vs active vs deactivated member
- Not yet clocked in vs absent vs not scheduled vs on leave
- Open vs completed vs missing clock-out attendance
- Original vs corrected record
- Pending vs approved vs rejected correction
- Trial vs active vs payment problem vs canceled subscription

Combining these states may make the interface look simpler but creates inaccurate reports and disputes.

## Proposed policy defaults

- The organization chooses one primary time zone.
- A member can have only one open attendance session in an organization.
- More than one completed session per day is allowed.
- Missing clock-out is flagged; the product does not invent an end time silently.
- Every manual change needs a reason and history.
- Deactivation blocks future attendance while preserving history.
- Pending invitations do not count as paid active members.
- Canceling a subscription preserves service until the paid period ends.
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

PTP currently stands for Permanent Time Password. The future product should not carry this concept forward only because it exists in the mock. First identify the job it serves and test whether users understand it. It may be removed, renamed, or replaced after product discovery.

## Technology boundary

No framework, database, hosting provider, authentication implementation, billing provider, or application architecture is selected in this product concept. Those decisions belong in a later technical design based on approved requirements.
