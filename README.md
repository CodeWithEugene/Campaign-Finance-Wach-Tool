<div align="center">

# Campaign Finance Watch Tool

[![GitHub stars](https://img.shields.io/github/stars/CodeWithEugene/Campaign-Finance-Wach-Tool?style=flat-square)](https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool/stargazers) [![GitHub forks](https://img.shields.io/github/forks/CodeWithEugene/Campaign-Finance-Wach-Tool?style=flat-square)](https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool/network/members) [![GitHub issues](https://img.shields.io/github/issues/CodeWithEugene/Campaign-Finance-Wach-Tool?style=flat-square)](https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool/issues) [![GitHub license](https://img.shields.io/github/license/CodeWithEugene/Campaign-Finance-Wach-Tool?style=flat-square)](https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool/blob/main/LICENSE) [![GitHub last commit](https://img.shields.io/github/last-commit/CodeWithEugene/Campaign-Finance-Wach-Tool?style=flat-square)](https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool/commits/main)

A digital platform to **track political financing**, **visualize campaign finance data**, and **monitor misuse of public resources** in Kenya. Built for the [TI-Kenya Campaign Finance Watch Tool Hackathon](https://ilabafrica.strathmore.edu/).

**Live:** [campaign-finance-wach-tool.vercel.app](https://campaign-finance-wach-tool.vercel.app/)

</div>

---

## Overview

The Campaign Finance Watch Tool empowers Kenyan citizens to:

- **Learn** how political parties and candidates are funded (0.3% Political Parties Fund, legal limits, disclosure requirements)
- **Report** suspected misuse of campaign funds via web, SMS, or USSD
- **Contribute** to parties and candidates through Mchango (crowdfunding)
- **Explore** reports on an interactive map with heat maps and filters
- **Download** data for press and research

---

## Features

| Feature | Description |
|---------|-------------|
| **Information & Education** | Explains campaign funding, PPF formula, legal limits, and spending rules |
| **Mchango** | Crowdfunding via Paystack (M-Pesa, cards) to support parties/candidates |
| **Public Reporting** | Upload evidence (photos, videos) of campaign finance misuse |
| **Report Categorization** | Vote buying, illegal donations, misuse of public resources, etc. |
| **Geo-Mapping** | Interactive map and heat maps of incidents (Ushahidi-inspired) |
| **USSD & SMS** | Report via feature phones (*384*1234# or shortcode) |
| **Multi-Language** | English, Kiswahili, Kikuyu, Luo, Luhya, and more |
| **Accessibility** | Screen reader support, keyboard nav, high contrast |
| **Dashboards** | Visualizations, transparency index, trends |
| **Alerts** | Newsletter and SMS notifications for new reports |
| **Export** | Download reports as CSV, PDF for journalists |

See [FEATURES.md](./FEATURES.md) for the full specification.

---

## Tech Stack

- **Framework:** Next.js (Vercel)
- **Database & backend:** Convex
- **Auth:** NextAuth (Credentials for admin)
- **Payments:** Paystack
- **USSD/SMS:** Africa's Talking
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/CodeWithEugene/Campaign-Finance-Wach-Tool.git
cd Campaign-Finance-Wach-Tool
npm install
```

### Environment Variables

Copy the example env and add your keys:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL (from [Convex Dashboard](https://dashboard.convex.dev) or after `npx convex dev`) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random string (e.g. `openssl rand -base64 32`) |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for Africa's Talking and other optional variables.

### Admin login

Admin sign-in is at **`/{locale}/admin/login`** (e.g. [http://localhost:3000/en/admin/login](http://localhost:3000/en/admin/login)). Admin credentials are stored in the Convex **admins** table (no env vars needed).

**One-time setup:** seed the default admin so login works:

1. Ensure Convex is in sync: run `npx convex dev` (or deploy), then in another terminal:
   ```bash
   npx convex run admins:seedDefaultAdmin
   ```
2. Default credentials: **admin@cfwt.com** / **Admin123!**

### Convex setup

1. Run Convex dev to create/link a project and generate types:
   ```bash
   npx convex dev
   ```
2. Set `NEXT_PUBLIC_CONVEX_URL` in `.env` (the URL printed by `convex dev` or from the [Convex Dashboard](https://dashboard.convex.dev)).
3. Seed parties (Mchango dropdown): from the Convex Dashboard run the `parties:seed` mutation once, or call it from the app when the parties list is empty.

### Run Locally

```bash
npm run dev
```

In another terminal, keep Convex in sync:

```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploying to Vercel

1. Push to GitHub and import the repo in [Vercel](https://vercel.com). Vercel will detect Next.js and use `npm run build` by default.
2. **Environment variables** – In the Vercel project, go to **Settings → Environment Variables** and set at least:
   - **`NEXTAUTH_URL`** – Your production URL (e.g. `https://your-app.vercel.app`). Required for auth and redirects.
   - **`NEXTAUTH_SECRET`** or **`AUTH_SECRET`** – Same as local (e.g. `openssl rand -base64 32`).
   - **`CONVEX_URL`** – Your Convex deployment URL (same as below). **Required for login** so the server can verify credentials.
   - **`NEXT_PUBLIC_CONVEX_URL`** – Same Convex URL (for **dashboard**, map, reports, signup). **Required** or the dashboard/map/reports will show zeros. Example: `https://neighborly-albatross-355.convex.cloud`.
   - Admin login uses the Convex **admins** table; run `npx convex run admins:seedDefaultAdmin` once if you use admin login.
   - **`PAYSTACK_SECRET_KEY`** and **`PAYSTACK_PUBLIC_KEY`** – For Mchango payments (optional).
3. Enable the variables for **Production** (and **Preview** if you want them on PR deployments), then **redeploy** (Deployments → … → Redeploy). The dashboard and reports need `NEXT_PUBLIC_CONVEX_URL` at build time to connect to your Convex backend.

---

## Contributing

We welcome contributions. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- How to report bugs and suggest features
- Development setup
- Pull request process
- Coding standards

---

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- **TI-Kenya** (Transparency International Kenya) for the hackathon and mission
- **ELGIA**, **URAI Trust**, **CMD**, and **FCDO** for KISP support
- **@iLabAfrica** at Strathmore University for organizing

---

## Links

- [Live App](https://campaign-finance-wach-tool.vercel.app/)
- [Feature Specification](./FEATURES.md)
- [Contributing Guide](./CONTRIBUTING.md)
