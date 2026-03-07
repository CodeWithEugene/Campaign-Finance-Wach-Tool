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
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (see Admin login below) |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for Africa's Talking and other optional variables.

### Admin login

Admin sign-in is at **`/{locale}/admin/login`** (e.g. [http://localhost:3000/en/admin/login](http://localhost:3000/en/admin/login)). It uses `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from your env.

**Next.js expands `$` in `.env`**, so a raw bcrypt hash (which contains `$2a$10$...`) gets corrupted unless each `$` is escaped as `\$`.

1. **Set `ADMIN_EMAIL`** to the admin email (e.g. `admin@cfwt.com`).
2. **Set `ADMIN_PASSWORD_HASH`** to a bcrypt hash with **escaped dollars**:
   - **Easiest:** run `node scripts/generate-admin-hash.js` (or `node scripts/generate-admin-hash.js "YourPassword"`) and paste the two lines it prints into your `.env`.
   - Or copy the `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` lines from `.env.example` into `.env` (the hash there is escaped and works with password `Admin123!`).
3. Restart the dev server after changing `.env`.
4. On **Vercel**, add both variables in Settings → Environment Variables. For the hash, paste the value **with** backslashes before each `$` (e.g. `\$2a\$10\$...`).

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
   - **`NEXT_PUBLIC_CONVEX_URL`** – Your Convex deployment URL (from [Convex Dashboard](https://dashboard.convex.dev)). The app builds without it (uses a placeholder), but map, reports, signup, and Mchango need it in production.
   - **`ADMIN_EMAIL`** and **`ADMIN_PASSWORD_HASH`** – If you use admin login.
   - **`PAYSTACK_SECRET_KEY`** and **`PAYSTACK_PUBLIC_KEY`** – For Mchango payments (optional).
3. Enable the variables for **Production** (and **Preview** if you want them on PR deployments), then redeploy.

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
