# Real SaaS Product Documentation

This folder turns the existing attendance proof of concept into a structured starting point for a production SaaS serving companies with **2 to 20 people**.

The documents deliberately separate three kinds of statements:

- **Observed** — verified in the current repository.
- **Proposed** — a recommended direction, not yet approved or built.
- **Open** — a question that requires product or business discussion.

The POC is useful evidence that the basic interaction can work. It is **not production-ready** and should not be offered to customers in its current form.

## Document map

1. [Product vision](01-product-vision.md) — audience, problem, value, and principles.
2. [POC audit](02-poc-audit.md) — what exists, what is useful, and what must change.
3. [Product requirements](03-product-requirements.md) — MVP scope, rules, and non-goals.
4. [Users and journeys](04-users-and-journeys.md) — roles and end-to-end experiences.
5. [Concept model and policies](05-concept-model-and-policies.md) — the business concepts and rules the product must make clear.
6. [Trust and privacy](06-security-and-privacy.md) — customer-facing trust principles and policy questions.
7. [Business and subscriptions](07-business-and-subscriptions.md) — packaging and pricing hypotheses.
8. [Delivery roadmap](08-delivery-roadmap.md) — validation-to-launch sequence.
9. [Decisions and questions](09-decisions-and-questions.md) — decision log and brainstorming agenda.
10. [Success and acceptance](10-success-and-acceptance.md) — product metrics and release gates.
11. [Device onboarding and PTP](11-device-onboarding-and-ptp.md) — the central device-permission workflow.
12. [Credit-based payments](12-credit-based-payments.md) — the flexible commercial system behind subscriptions and one-time purchases.

## Current baseline

The repository contains a POC with employee clock-in/out, an attendance calendar, recent activity, PTP/device verification concepts, and admin user management. The refined concept makes **paid company creation and management** the business model, **credits** the common payment layer, and **PTP-based approval of each device** the central attendance-control mechanism.

## Recommended next use

Use this folder as the agenda for product discovery. Resolve the items in `09-decisions-and-questions.md`, validate them with potential customers, and then create a separate technology document after the product concept is stable. No technology or architecture choice is made here.

## Document status

- Version: `0.1 — discovery baseline`
- Created from repository review: `2026-09-16`
- Product decisions approved: none yet
- Technology decisions: intentionally deferred
- Production implementation started: no
