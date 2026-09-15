# Decisions and Brainstorming Agenda

## How to use this file

For each decision, record the chosen option, reason, owner, and date. Do not allow an unresolved question to become an accidental code decision.

## P0 decisions before the product is finalized

| ID | Question | Why it matters | Initial recommendation |
|---|---|---|---|
| D-001 | Which customer segment and launch geography come first? | Determines policy, language, payments, and legal needs | Choose one segment through interviews |
| D-002 | What exactly does “attendance” mean for the first customer? | Prevents drifting into payroll/scheduling | Recorded presence sessions plus transparent corrections |
| D-003 | Is attendance duration informational or used for payroll input? | Changes liability and report rigor | Informational/export input, not payroll calculation |
| D-004 | How are overnight sessions assigned to report days? | Affects totals and exceptions | Make organization policy explicit |
| D-005 | Can admins edit directly, or only approve requests? | Balances speed and trust | Allow direct edit with mandatory reason and audit |
| D-006 | What access experience is acceptable for owners and employees? | Balances trust, recovery, and daily friction | Test normal account access without assuming PTP |
| D-007 | Is workplace/device verification genuinely required? | Could add friction and privacy risk | Validate need before building |
| D-008 | Which subscription model is tested first? | Determines positioning and willingness-to-pay test | Simple included-seat tiers or base-plus-seat discovery |
| D-009 | What data retention and deletion policy applies? | Impacts trust, legal work, recovery, and offboarding | Decide before paid pilot |
| D-010 | Can one person join multiple companies? | Affects the account and navigation concept | Allow for it conceptually, even if MVP shows one company at a time |

## P1 product questions

- Are owners also expected to clock attendance?
- Is a manager role needed at launch or can owner/admin be one role?
- How long can an attendance session remain open before it is flagged?
- Are multiple work sessions per day common?
- Do teams need breaks represented explicitly?
- Which CSV columns and formats match the current month-end process?
- Are email invitations viable for every employee in the first segment?
- What happens to an open session when a member is deactivated?
- Do customers need holidays, weekends, or expected schedules in the MVP?
- What languages and date formats are required?

## P1 business questions

- What concrete event makes a customer start looking for attendance software?
- Who pays and who administers the tool?
- What alternatives are used today and what do they cost in time or money?
- Is the purchase monthly, annual, or seasonal?
- What support response does this segment expect?
- Which acquisition channel gives access to many similar businesses?

## Later questions

- Kiosk/shared-device mode
- Location or network validation
- QR codes or passkeys
- Notifications and reminders
- Native apps
- Payroll/accounting integrations
- Multi-location and teams
- Public API

## Decision record template

```md
### D-XXX — Short title

- Status: proposed | accepted | superseded
- Date:
- Owner:
- Context:
- Options considered:
- Decision:
- Consequences:
- Follow-up:
```

## Initial decision log

No business, product, or technology decisions are considered approved by this documentation. Recommendations remain proposals until reviewed with the product owner and validated with customers. Technology will be documented separately later.
