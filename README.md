# Block Market

Draft product notes for the Block Market app/website.

## Product Direction

- Start with a website.
- Later, ship an app version of the same product.

## Core Idea

Block Market connects buyers who want food ordered with blocks and sellers who are willing to use their blocks to place those orders for a fee.

## Buyer Experience

- The buyer UI should feel similar to Grubhub.
- Buyers enter the restaurant and what they want to order.
- Buyers should be able to see the prices other people are paying, without seeing the rest of the order details.

## Seller Experience

- The seller UI should feel more like Uber Eats.
- Sellers see available buyer requests and choose which ones they want to fulfill.

## Fees

- Take a $0.05 fee from the seller side.
- Example: if a buyer offers $7.00 for a block order, the seller sees that they will receive $6.95.

## Identity And Verification

- Both parties should verify in some way with `andrewID`.
- Sellers should submit proof of purchase.
- Proof of purchase should ideally be verified with some kind of computer vision workflow.

## Escrow Flow

1. Buyer sends money to a Block Market escrow account.
2. Seller places the order using their block.
3. Seller sends verification of purchase.
4. The verification is checked.
5. The buyer receives the verification and the seller receives payment at the same time.

## Open Questions

- Exact escrow implementation details.
- Dispute handling if a buyer reports a scam.
- Appeal flow for sellers who need to prove they completed the purchase.
