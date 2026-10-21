# Farmigo — Farm-to-Consumer Produce Connect

A responsive Farmigo MVP built with React + Vite, Supabase, and Vercel. Connects farmers with hostel kitchens and individual consumers.

## Features
- Farmer and hostel/buyer workspace switch
- Browse and search produce listings
- Add crop listings with quantity, unit, price, location and delivery date
- Place bulk produce requests
- Track orders and update delivery status from the farmer view
- Supply and order dashboard
- Separate Farmer and Consumer/Buyer portals
- Add-to-cart, cart quantity editing, and checkout
- Delivery address capture and order delivery address
- Preorder checkbox and preferred delivery date
- Region/location search and nearby-region suggestions
- Purchase-history-based recommendations from orders in the current session
- Order ratings and customer feedback portal
- Report an order or service issue portal
- React Vite plugin configuration to avoid the React-not-defined white-screen issue
- Demand Board that compares available listed stock with open order quantities and highlights shortages/surplus
- Preview mode with sample data if Supabase credentials are not set

## What's included
- `src/App.jsx` — farmer/buyer portals, listings, cart, delivery address, preorders, recommendations, feedback and reports
- `src/styles.css` — responsive startup-style dashboard UI
- `supabase/schema.sql` — database tables, demo policies and sample crops
- `src/lib/supabaseClient.js` — Supabase connection
- `vercel.json` — single-page-app routing for Vercel

## 1. Run locally
Install Node.js LTS, then in this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:5173).

## 2. Connect Supabase
1. Create a project at https://supabase.com/dashboard.
2. Open SQL Editor and run the complete `supabase/schema.sql` file.
3. Open Project Settings / Connect and copy your Project URL and publishable key.
4. Copy `.env.example` to `.env.local`.
5. Put the real values into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

6. Stop and restart `npm run dev` after editing environment variables.
7. Refresh the app. The top-right indicator should say Database connected.

Only use the Supabase publishable/anon key in frontend environment variables. Never put a `service_role` or secret key in frontend code or in a `VITE_` variable.

**Security note:** `supabase/schema.sql` intentionally enables permissive anonymous policies for a quick classroom/hackathon demo. Anyone who can reach the app can read and modify demo data. Do not use these policies with real users or sensitive data. Before production, add Supabase Auth and restrict policies so farmers can manage only their own listings and buyers can see/manage only their own orders.

## 3. Deploy to Vercel
### GitHub method
1. Create a GitHub repository and upload/push this project.
2. Sign in at https://vercel.com and choose Add New → Project.
3. Import your repository.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. In Vercel Project Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Deploy. After changing environment variables, redeploy.
7. Open the deployed URL and test adding a crop and placing an order.

The included `vercel.json` enables SPA routing.

## Suggested 4-hour schedule
- 0:00–0:25 — Install Node, run the starter project
- 0:25–1:10 — Create Supabase project and run SQL
- 1:10–2:20 — Test listing, bulk request and status updates
- 2:20–3:00 — Adjust project name, sample data and presentation
- 3:00–4:00 — Push to GitHub, deploy on Vercel and verify on another device

## Troubleshooting
- **Preview mode remains visible:** verify `.env.local` variable names and values, then restart Vite.
- **relation does not exist:** run `supabase/schema.sql` in the correct Supabase project.
- **permission denied / RLS error:** check the SQL policies and ensure the Data API is enabled for these tables.
- **Vercel shows an old version:** redeploy after pushing the latest commit.

## Run locally
1. Install Node.js LTS.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the Local URL printed by Vite.

## Supabase setup
Run `supabase/schema.sql` in Supabase SQL Editor. Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable/anon key. Restart Vite after changing environment variables. If you already ran the older schema, this updated script adds the new order columns and creates feedback/report tables.

## Prototype limitations
Cart, feedback, reports and saved address are currently held in frontend session state; connect their submit handlers to Supabase tables for cross-device persistence. The recommendations use orders currently loaded into this session, not an ML model. Location matching is text-based, not GPS/routing. The preorder flag records intent but does not guarantee future stock. Public demo RLS policies are not production-safe; add authentication and owner-based policies before real customer use.
