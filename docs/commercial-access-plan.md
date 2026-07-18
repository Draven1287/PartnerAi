# Learning AI commercial access plan

## Decision

Learning AI is not a subscription course. The core product is a coherent 50-lesson path that a learner can finish once and keep using.

- **AI Control Essentials:** 10 complete, permanently free lessons distributed across all 10 arcs: 1, 7, 11, 16, 21, 26, 31, 36, 41, and 46. These are full lessons with feedback and exit checks, not excerpts.
- **Core 50:** one purchase, permanent access to all 50 lessons, corrections, accessibility improvements, and the learner's records. No monthly payment is required.
- **Continuum:** not part of launch. It may become an optional subscription only if there is durable recurring value: reviewed updates, new scenarios, coached practice, or team pathways. Cancelling it must never remove Core 50 or learner records.

No sales prompt may appear inside a lesson gate, before feedback, during an exit check, in a locked-Next state, or immediately after an incorrect answer.

## Backend contract now implemented

Migration 6 adds provider-neutral `access_products`, `user_entitlements`, and idempotent `payment_events` tables. The learner access response exposes:

- the permanent-core commercial model;
- always-free lesson IDs;
- allowed lesson IDs;
- Core and Continuum status;
- active entitlements;
- machine-readable promises that Core is permanent and not subscription-dependent.

`ENFORCE_COURSE_ACCESS` defaults off. This keeps the existing course usable during deployment and QA. It must remain off until checkout, webhook verification, account recovery, refund handling, and entitlement restoration have been tested in production.

## Checkout sequence

1. Choose a payment provider and merchant account.
2. Create one one-time Core 50 price. Do not create a required recurring price.
3. Start checkout from the separate Access page, never from inside a lesson.
4. Attach the signed-in learner ID through provider-supported metadata.
5. Verify provider webhook signatures before storing the event.
6. Record every provider event idempotently in `payment_events`.
7. Grant `core-50` only after a verified successful payment.
8. Keep a permanent entitlement unless an administrator records a verified refund or revocation.
9. Test duplicate events, delayed events, refunds, account email changes, and restored access.
10. Only then set `ENFORCE_COURSE_ACCESS=true`.

## Price decision still required

Price is deliberately not invented in code or copy. It should be chosen after testing willingness to pay with the complete free path and after the real delivery and support costs are known. The product can launch its free path before paid checkout is enabled.
