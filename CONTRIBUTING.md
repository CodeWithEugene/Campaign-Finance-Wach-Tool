# Contributing to Campaign Finance Watch Tool

Thank you for your interest in contributing to the Campaign Finance Watch Tool. This project is part of the TI-Kenya Campaign Finance Watch Tool Hackathon, aimed at enhancing transparency and accountability in political financing in Kenya.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)

---

## Code of Conduct

- Be respectful and inclusive in all interactions
- Welcome contributors of all backgrounds and skill levels
- Focus on constructive feedback
- Respect the project's mission: promoting transparency in political finance

---

## How Can I Contribute?

### Reporting Bugs

1. **Check** if the bug has already been reported in [Issues](../../issues)
2. **Open a new issue** with a clear, descriptive title
3. **Include**:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Your environment (OS, browser, Node version)
   - Screenshots or error messages if applicable

### Suggesting Features

1. **Review** [FEATURES.md](./FEATURES.md) to see the planned feature set
2. **Open an issue** with the `enhancement` label
3. **Describe** the feature, why it's valuable, and how it fits the hackathon goals
4. **Reference** the relevant section in FEATURES.md if applicable

### Contributing Code

1. **Find an issue** to work on (look for `good first issue` or `help wanted` labels)
2. **Comment** on the issue to claim it
3. **Fork** the repository and create a branch
4. **Make your changes** following our coding standards
5. **Submit a pull request** (see [Pull Request Process](#pull-request-process))

### Other Ways to Contribute

- **Documentation**: Improve README, FEATURES.md, or add inline comments
- **Translations**: Help with Kiswahili, Kikuyu, Luo, or other Kenyan languages
- **Testing**: Test features and report issues
- **Design**: UI/UX feedback, accessibility improvements

---

## Development Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** or **yarn**
- **Git**

### Getting Started

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Campaign-Finance-Wach-Tool.git
   cd Campaign-Finance-Wach-Tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your keys (see [Environment Variables](#environment-variables)).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the project root. **Never commit `.env`** — it contains secrets.

| Variable | Description | Required |
|----------|-------------|----------|
| `PAYSTACK_SECRET_KEY` | Paystack secret key (server-side) | For Mchango |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key (client-side) | For Mchango |
| `AFRICAS_TALKING_USERNAME` | Africa's Talking sandbox/prod username | For USSD/SMS |
| `AFRICAS_TALKING_API_KEY` | Africa's Talking API key | For USSD/SMS |

See `.env.example` for the full list (create it if it doesn't exist).

---

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or: fix/bug-description
   ```

2. **Make your changes**:
   - Write clear, focused commits
   - Follow the [Coding Standards](#coding-standards)
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**:
   - Use a clear title (e.g., "Add USSD report submission flow")
   - Reference the issue: `Closes #123`
   - Describe what changed and why
   - Ensure CI passes (if configured)

6. **Address review feedback** promptly.

7. **Squash or rebase** if requested before merge.

---

## Coding Standards

### General

- **Readability** over cleverness
- **Consistent** naming and formatting
- **Comment** complex logic; avoid obvious comments

### JavaScript/TypeScript

- Use **TypeScript** for new code when possible
- Prefer **const** and **let** over **var**
- Use **async/await** over raw Promises
- Handle errors explicitly

### React / Next.js

- Use **functional components** and hooks
- Keep components small and focused
- Colocate styles or use a consistent CSS approach

### Accessibility

- Use semantic HTML (`nav`, `main`, `article`, etc.)
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers when possible

### Terminology

- Use **neutral language** (see [FEATURES.md](./FEATURES.md) Section 11)
- Avoid "high risk" / "low risk"; use "transparency score" instead
- Use "alleged" / "reported" for unverified content

---

## Project Structure

```
Campaign-Finance-Wach-Tool/
├── app/                 # Next.js App Router (if applicable)
├── components/          # React components
├── lib/                 # Utilities, API clients
├── public/              # Static assets
├── FEATURES.md          # Detailed feature specification
├── CONTRIBUTING.md      # This file
├── README.md
└── LICENSE              # MIT License
```

---

## Questions?

- Open a [Discussion](../../discussions) for general questions
- Open an [Issue](../../issues) for bugs or feature requests
- Reach out to the maintainers for hackathon-specific coordination

Thank you for contributing to a more transparent Kenya.
