# Credit-Based Payments

Credits are the common commercial layer for the entire application. They allow the business to create recurring subscriptions, fixed-price purchases, bundles, trials, promotions, and future paid capabilities without creating unrelated payment rules for each offer.

## Core model

```text
Money or approved promotion
            ↓
       Credits granted
            ↓
Company creation, management, or another paid capability
            ↓
       Credits consumed
```

The customer still sees the real-money price, currency, receipt, renewal terms, and refund policy. Credits provide flexibility inside the product; they must not hide the real cost.

## Ways to receive credits

- Recurring subscription grant
- One-time fixed credit pack
- Trial grant
- Promotional or referral grant
- Customer-support adjustment or compensation
- Refund or reversal of a previous consumption, where policy allows

Every grant states its source, amount, date, and any special expiry or restriction.

## Ways to use credits

Potential credit-consuming capabilities include:

- Creating a company
- Keeping a company actively managed for a period
- Supporting a defined number of active members
- Purchasing a fixed company package
- Enabling future optional premium capabilities

The exact list and amounts remain open. The first version should use the fewest consumption rules necessary to make the business sustainable and the owner’s cost predictable.

## Offer examples

These examples show flexibility, not final pricing:

- **Subscription:** pay a recurring amount and receive a recurring credit grant.
- **Fixed pack:** pay once and receive a fixed number of credits.
- **Fixed capability:** spend a disclosed number of credits for a defined capability or period.
- **Trial:** receive limited promotional credits to evaluate company management.
- **Custom promotion:** receive bonus credits without changing the normal product costs.

## Ownership model

The product must distinguish the payer from the company and its members. Recommended starting principle:

- Invited members do not need personal credits to participate.
- The owner funds the company’s paid usage.
- A person who creates another company must separately fund that company.
- Ownership transfer does not silently transfer private payment details or unrelated personal credits.

Whether credits technically belong to a personal balance, company balance, or both is a product-policy decision still to be finalized.

## Credit history

Every balance change should show:

- Credit amount added or removed
- Plain-language reason
- Purchase, subscription, promotion, capability, or company involved
- Date and time
- Previous and resulting balance
- Pending, completed, reversed, refunded, or expired state
- Reference to the related receipt or action where applicable

## Customer-protection rules

- Show the credit cost before confirmation.
- Never deduct twice for one completed action.
- Do not deduct for a failed action.
- Explain insufficient balance before asking the customer to purchase.
- Never use credits to disguise real-money price or renewal terms.
- Clearly separate paid credits from promotional credits if their rules differ.
- Disclose expiry before acquisition; do not introduce expiry retroactively.
- Preserve a permanent understandable history of corrections and reversals.
- Define treatment of unused credits before accepting payment.

## Financial and legal boundary

Before launch, decide whether credits are only non-transferable product units or behave like stored money. Cash redemption, person-to-person transfers, broad transfer between companies, or marketing credits as money can create additional accounting, tax, consumer-protection, and regulatory obligations. Keep the first model narrow and obtain professional review in the launch market before publishing final credit terms.

## Subscription behavior

A subscription is a recurring credit grant. The offer must state:

- Real-money recurring price and currency
- Credits granted each period
- Grant date and renewal frequency
- What happens when payment fails
- What happens to unused credits at renewal or cancellation
- Whether credits roll over or expire
- How the customer cancels

## Fixed-purchase behavior

A fixed purchase can either grant a credit pack or immediately exchange credits for a defined capability. The customer must know which one is happening and whether the purchase has a time limit.

## Restricted-access principle

Running out of credits may block creation, renewal, expansion, or another paid management capability. It should not unexpectedly erase attendance history. The precise read, export, correction, and grace-period access must be decided and published.

## Decisions still required

- Personal balance, company balance, or both?
- What exactly consumes credits in the first release?
- Is company creation a one-time credit cost, a recurring management cost, or both?
- Are member counts represented through credit consumption or through offer limits?
- Do unused subscription credits roll over?
- Do paid credits ever expire?
- Are promotional credits spent before or after paid credits?
- Can credits be transferred between owned companies?
- How are partial refunds and charge disputes reflected?
- What prevents misuse of promotional credits?
- Does a displayed credit have a stable real-money value or vary by package?

These decisions should be resolved through pricing exercises and customer comprehension testing before final offers are published.
