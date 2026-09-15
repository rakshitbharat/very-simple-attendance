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
| D-006 | How is a personal Google account matched to invitations and existing memberships? | Defines entry and recovery experience | Require the invited Google-account email initially |
| D-007 | How exactly is a PTP created, delivered, used, expired, and recovered? | This is the core device-control workflow | Treat it as device onboarding, not personal login |
| D-008 | Which first offers grant credits? | Determines positioning and willingness-to-pay test | Test one recurring grant and one fixed pack |
| D-009 | What data retention and deletion policy applies? | Impacts trust, legal work, recovery, and offboarding | Decide before paid pilot |
| D-010 | How does multi-company navigation work? | One account may have several memberships | Auto-open one company; list companies when there are multiple |
| D-011 | Are Clock in and Clock out permissions always granted together? | Defines device permission complexity | Start together unless a real use case requires separation |
| D-012 | Who may approve a device? | Central to control and daily operations | Owner plus explicitly delegated roles |
| D-013 | Is payment required before company creation or after a trial? | Defines conversion and onboarding | Test both; never make the charge surprising |
| D-014 | Who owns credits: the person, the company, or both through separate balances? | Affects transfers, refunds, and multi-company use | Keep company funds separate from personal purchases |
| D-015 | Which actions consume credits, and how often? | Determines whether cost feels predictable | Begin with very few, clearly priced actions |
| D-016 | Do purchased or granted credits expire? | Affects trust, accounting, and renewal behavior | Never expire paid credits without a compelling reviewed reason |
| D-017 | What happens to unused credits after cancellation, refund, or company deletion? | Prevents disputes and hidden loss | Publish a simple rule before sale |
| D-018 | Can credits move between companies owned by the same person? | Affects flexibility and abuse | Keep closed initially; validate demand |

## P1 product questions

- Are owners also expected to clock attendance?
- Is a manager role needed at launch or can owner/admin be one role?
- How long can an attendance session remain open before it is flagged?
- Are multiple work sessions per day common?
- Do teams need breaks represented explicitly?
- Which CSV columns and formats match the current month-end process?
- Does every employee have an appropriate personal Google account?
- Can the inviter correct an invitation sent to the wrong Google-account email?
- Can PTP onboarding happen remotely, or must owner and member be together?
- Is the PTP single-use, time-limited, reusable, member-specific, or device-specific?
- What happens when a member loses a device or clears/reinstalls the application?
- Must a PTP approver already use an approved device?
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
