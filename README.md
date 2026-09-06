# 1Fi Marketplace

A new **1Fi Marketplace** section built into the existing **Shop** page of the 1Fi app,
where users browse products and pay in EMIs backed by their mutual funds.

Built for the 1Fi SDE Intern assignment.

---

## What was built

The Shop page keeps its existing hero banner and gains a third tab alongside the two
that already ship:

| Tab | Status |
| --- | --- |
| Top Brands | Intentionally blank — not required by the assignment |
| Nearby Stores | Intentionally blank — not required by the assignment |
| **1Fi Marketplace** | **Fully designed and implemented** |

The Marketplace flow:

1. **Product listing** — search, category filters, product cards showing price and
   "EMI from ₹X/mo", with skeleton loaders, error/retry, empty state and pagination.
2. **Product detail** — image, price with MRP and discount, variant pickers that
   re-price and re-image live, highlights, specifications.
3. **EMI plans** — the tenure ladder from 3 to 60 months, each row showing the rate
   and monthly instalment. Selecting a row drives the sticky CTA.
4. **Order review** — full repayment breakdown, then confirmation.

---

## Running it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The app redirects to Home; tap **Shop** in the bottom
navigation, then the **1Fi Marketplace** tab.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (currently zero warnings) |

### Seeing the error states

Append `?simulateError=1` to any URL. Every API request then fails with a 503, so the
retry UI on the listing, the product page and the EMI list can all be exercised
without touching code.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS v4, design tokens in `globals.css` |
| Data fetching | TanStack Query v5 |
| Icons | lucide-react |
| Typeface | Plus Jakarta Sans |

---

## Architecture

The guiding rule: **no component ever imports product or EMI data directly.** Everything
travels over HTTP through real API routes, exactly as it would against a live backend.

```
 Component            useProducts / useProduct / useEmiPlans      React Query
     |                            |                              cache, loading,
     |  renders                   |  calls                       error, retry
     v                            v
 ProductGrid  ------------>  marketplaceService  ------------>  apiGet()
                                                                    |
                                                                    |  fetch()
                                                                    v
                                                         /api/products/...
                                                         (Next.js route handler)
                                                                    |
                                                                    v
                                                            server/repository.ts
                                                                    |
                                                                    v
                                                          server/data/*.ts
                                                        (server-only, never bundled)
```

Each layer has one job:

- **`src/server/data/`** — the catalog and the lender's plan terms. Server-only.
- **`src/server/repository.ts`** — search, filtering, pagination, EMI quoting.
- **`src/app/api/`** — HTTP surface, validation, error envelopes, simulated latency.
- **`src/lib/`** — pure logic with no React and no I/O (`emi.ts`, `variants.ts`, `format.ts`).
- **`src/services/`** — one typed function per endpoint.
- **`src/hooks/`** — React Query wrappers exposing `{ data, isLoading, error, refetch }`.
- **`src/components/`** — presentation only.

Swapping the mock catalog for a real database or commerce backend means rewriting
`repository.ts` and nothing else.

### Project structure

```
src/
├─ app/
│  ├─ (tabs)/                    screens that keep the bottom navigation
│  │  ├─ shop/
│  │  │  ├─ layout.tsx           hero banner + 3-tab segmented control
│  │  │  ├─ top-brands/          blank
│  │  │  ├─ nearby-stores/       blank
│  │  │  └─ marketplace/         product listing
│  │  └─ home, emi-dues, limit, profile
│  ├─ marketplace/[slug]/        product detail (pushed, no bottom nav)
│  │  └─ review/                 order review and confirmation
│  ├─ api/products/              mock API route handlers
│  └─ globals.css                design tokens
├─ components/
│  ├─ ui/                        Button, Card, Badge, SearchField, Skeleton,
│  │                             EmptyState, ErrorState, SectionHeading
│  ├─ layout/                    PhoneFrame, BottomNav, ScreenHeader
│  ├─ shop/                      ShopHeroBanner, SegmentedTabs
│  └─ marketplace/               listing, detail, EMI and review components
├─ hooks/         services/      lib/         server/        types/
```

---

## EMI calculation

All instalment maths lives in **`src/lib/emi.ts`** as pure functions and runs
**server-side** inside the `/api/products/[id]/emi-plans` route. The browser never
recomputes it.

Inputs are deliberately split:

- **`src/server/data/emi-plans.ts`** holds *terms only* — tenure, rate, fee percentage,
  fee cap, minimum principal. No rupee amounts.
- The **principal** is the price of the variant the user selected.

Because amounts are derived at request time, a price change can never leave a stale
instalment figure behind.

### The formula

Standard reducing-balance amortisation:

```
                P × r × (1 + r)ⁿ
    EMI  =  ──────────────────────
                 (1 + r)ⁿ − 1
```

where `P` is the principal, `r` the monthly rate (annual ÷ 12) and `n` the tenure in
months.

### Worked example — iPhone 17 Pro 256 GB on the 24-month plan

```
P                 = ₹1,34,900
annual rate       = 4.49% p.a.   →   r = 0.0449 / 12 = 0.0037416667
n                 = 24 months

(1 + r)ⁿ          = 1.09377216
exact instalment  = ₹5,887.4875
```

### Rounding, and why the last instalment differs

₹5,887.4875 is not a chargeable amount. Rounding each instalment and multiplying by 24
drifts the total away from the true figure — enough that a *no-cost* plan can display
₹1 of interest. So the schedule total is fixed first and the final instalment absorbs
the remainder, which is how lenders actually handle it:

```
monthly instalment  = ceil(5,887.4875)        = ₹5,888     (never under-collect)
scheduled total     = round(5,887.4875 × 24)  = ₹1,41,300
final instalment    = 1,41,300 − (5,888 × 23) = ₹5,876
```

**23 payments of ₹5,888, then one of ₹5,876** — which sums to exactly ₹1,41,300.
The review screen surfaces the adjusted final instalment whenever it differs.

### No-cost plans

Tenures up to 18 months are 0% p.a. The rate is forced to zero, so the formula collapses
to a straight division, and the scheduled total is pinned to the principal:

```
₹1,34,900 ÷ 18      = ₹7,494.44
monthly instalment  = ₹7,495
scheduled total     = ₹1,34,900          ← pinned, not computed
final instalment    = 1,34,900 − (7,495 × 17) = ₹7,485
total interest      = ₹0                 ← guaranteed, not approximately zero
```

### Processing fee

```
fee = min(principal × feePct, feeCap)
    = min(₹1,34,900 × 0.5%, ₹999)
    = min(₹674.50, ₹999)  =  ₹675
```

Charged separately from the instalments, so
**total payable = ₹1,41,300 + ₹675 = ₹1,41,975**.

### Which plans are offered

Every plan carries a `minPrincipal`. The ₹25,900 AirPods Pro 3 clears seven of the nine
gates and is offered 3 to 36 months; the ₹1,34,900 iPhone clears all nine and reaches
60 months. This is why the ladder is shorter on inexpensive items.

### Which plan is pre-selected

`pickRecommended()` prefers a no-cost plan, since it is strictly cheaper. Among plans
with equal totals it takes the **longest tenure**, which gives the smallest monthly
outgo. With no no-cost plan available it falls back to the lowest total payable.

For the iPhone that selects **18 months at ₹7,495/mo** — the same ₹1,34,900 total as
every other 0% plan, at the lowest monthly amount.

### Full ladder for ₹1,34,900

| Tenure | Rate | Monthly | Total payable |
| ---: | --- | ---: | ---: |
| 3 months | 0% p.a. | ₹44,967 | ₹1,34,900 |
| 6 months | 0% p.a. | ₹22,484 | ₹1,34,900 |
| 9 months | 0% p.a. | ₹14,989 | ₹1,34,900 |
| 12 months | 0% p.a. | ₹11,242 | ₹1,34,900 |
| **18 months** | **0% p.a.** | **₹7,495** | **₹1,34,900** |
| 24 months | 4.49% p.a. | ₹5,888 | ₹1,41,975 |
| 36 months | 6.49% p.a. | ₹4,134 | ₹1,49,497 |
| 48 months | 7.49% p.a. | ₹3,262 | ₹1,57,342 |
| 60 months | 7.99% p.a. | ₹2,735 | ₹1,64,887 |

---

## API reference

All three endpoints accept `?simulateError=1` and carry a 420 ms simulated latency.

### `GET /api/products`

| Query | Type | Notes |
| --- | --- | --- |
| `search` | string | Matches name, brand and category |
| `category` | string | `all`, `mobiles`, `laptops`, `audio`, `wearables`, `appliances` |
| `cursor` | string | From a previous response's `nextCursor` |
| `limit` | number | Defaults to 6, capped at 24 |

```jsonc
{
  "items": [
    {
      "id": "iphone-17-pro",
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "category": "mobiles",
      "image": "/products/iphone-17-pro-blue.svg",
      "rating": 4.8,
      "ratingCount": 12486,
      "price": 134900,
      "mrp": 139900,
      "inStock": true,
      "emiFrom": 2735          // cheapest instalment, computed server-side
    }
  ],
  "nextCursor": "6",
  "total": 10
}
```

### `GET /api/products/:id`

Full product including every variant and both variant axes. Returns `404` with code
`PRODUCT_NOT_FOUND` for an unknown id.

### `GET /api/products/:id/emi-plans?variantId=`

Prices the ladder against that variant. Returns `400 VARIANT_REQUIRED` when the
parameter is missing, `404 VARIANT_NOT_FOUND` when it does not exist.

```jsonc
{
  "productId": "iphone-17-pro",
  "variantId": "256gb-blue",
  "principal": 134900,
  "plans": [
    {
      "id": "tenure-18",
      "tenureMonths": 18,
      "annualInterestRate": 0,
      "isNoCost": true,
      "monthlyInstalment": 7495,
      "finalInstalment": 7485,
      "totalInterest": 0,
      "processingFee": 0,
      "totalPayable": 134900,
      "recommended": true
    }
  ]
}
```

### Error envelope

Every failure returns the same shape:

```json
{ "error": { "code": "UPSTREAM_UNAVAILABLE", "message": "The catalog service is temporarily unavailable." } }
```

---

## Design decisions

**Consistency with the existing app.** Colours, radii, shadows and spacing were sampled
from the live app and live as tokens in `globals.css`. The hero banner gradient
(`#2a129a → #5b2be0`) is sampled directly from the artwork PNG so the image blends into
the panel. Re-skinning the Marketplace is a change to that one file.

**The Marketplace tab is the default landing tab.** The live app opens on Top Brands,
but that tab is out of scope here and renders empty, which would make the first screen
look broken. `/shop` therefore redirects to `/shop/marketplace`.

**EMI rows are selectable.** The live app's plan list is read-only — you view rates and
tap Continue. The assignment requires selecting a plan and a CTA that proceeds with it,
so the rows keep the app's exact visual language (`Starts at ₹X/mo` header, Show/Hide
plans, `N months · X% p.a.` rows) and add a radio affordance.

**Variant and plan travel in the URL.** The review screen reads `?variant=&plan=` and
re-validates both against the API, so refreshing or sharing the link works and a
hand-edited link fails gracefully instead of rendering wrong numbers.

**Selection state is derived, not synchronised.** The product page stores only what the
user actively chose and computes the fallback each render. A variant change therefore
cannot leave a plan selected that is no longer offered — no effect is needed to repair
state afterwards.

**Product images are URLs, not imports.** The catalog stores `/products/*.svg` paths
exactly as it would reference a CDN, so replacing the generated artwork with real
photography is a file drop with no code change.

**Two assumptions the live app does not surface**, both documented in
`src/server/data/emi-plans.ts`:

- `minPrincipal` gates long tenures on inexpensive items, so a pair of earbuds is not
  offered a 60-month plan.
- Processing fees apply only to interest-bearing tenures, keeping the "no charges"
  promise on the 0% plans intact.

---

## Known limitations

- **The OnePlus 13, MacBook Air and Dell XPS share one photo across their colourways**,
  since only a single image was available for each. The colour swatches still indicate
  the selection; the image simply does not change. The iPhone, Galaxy S25 Ultra, Sony
  XM6 and both watches do swap image on colour change.
- **Orders are not persisted.** Confirming an order shows the success screen but writes
  nothing; there is no cart, no authentication and no payment integration.
- **No automated tests yet.** The EMI engine is the natural first candidate — its
  rounding behaviour is the part most worth pinning down.
- **Top Brands and Nearby Stores are blank**, as the assignment allows.
