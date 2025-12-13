# claude-base

A foundation for Claude Code projects, built on principles from the [Anthropic Engineering Blog](https://www.anthropic.com/engineering).

## What This Is

A starting point for projects where Claude Code is a primary developer. Not a framework to learn—a foundation to build on.

**This repo contains:**
- Configuration for TypeScript, linting, testing (Vitest + Playwright)
- Docker Compose for local Postgres
- GitHub Actions for CI/CD and PR checks
- Tools for Discord communication and GitHub issue management
- Screenshot framework for visual verification
- Pre-commit hooks that block secrets
- Instructions for Claude instances (CLAUDE.md)

**This repo does not contain:**
- Significant example code to delete
- Opinions about your domain logic
- MCP servers or SKILLS
- Vendor lock-in beyond standard tools

## Quick Start

### Option 1: Initialize a New Project (Recommended)

```bash
# Clone claude-base once (keep it around for future projects)
git clone https://github.com/bedwards/claude-base.git ~/claude-base

# Create and initialize your new project
mkdir my-project && cd my-project
~/claude-base/bin/init.ts --name my-project

# Setup
npm install
cp .env.example .env
cp .secrets.example .secrets
# Edit both files with your values

# Start services
npm run db:up      # Postgres via Docker
npm run dev        # API + Frontend
```

Init options:
- `--name <name>` - Project name (default: directory name)
- `--no-substack` - Exclude blog content directory
- `--no-git` - Don't initialize git repo
- `--force` - Overwrite existing files

### Option 2: Fork the Repository

```bash
# Fork on GitHub, then:
git clone <your-fork-url>
cd claude-base
npm install

# Configure
cp .env.example .env
cp .secrets.example .secrets
# Edit both files with your values

# Start
npm run db:up
npm run dev
```

## Project Structure

```
claude-base/
├── .github/workflows/     # CI, PR checks, deploy
├── .husky/                # Pre-commit hooks
├── bin/
│   └── init.ts            # Initialize new projects from this base
├── content/substack/      # Blog post content (optional)
├── screenshots/           # Visual verification outputs
├── src/
│   ├── api/               # Express API server
│   ├── db/                # Database migrations & seeds
│   └── frontend/          # Vite frontend
├── tests/e2e/             # Playwright E2E tests
├── tools/
│   ├── discord/           # Discord read/write tools
│   ├── github/            # Issue creation, PR comments, rate limits
│   └── screenshots/       # Capture and compare screenshots
├── CLAUDE.md              # Instructions for Claude instances
├── docker-compose.yml     # Local Postgres
└── package.json
```

## For Claude Instances

**Read [CLAUDE.md](./CLAUDE.md) completely before starting work.**

Key points:
- You own your PRs—don't wait for human review
- You own the main branch—fix it if it breaks
- Check Discord before acting on shared resources
- Use the screenshot framework to verify UI work
- Never commit secrets (pre-commit hook will block you)
- Create issues for unrelated work you notice

## Tools

### Screenshots

Capture and compare screenshots for visual verification:

```bash
# Capture
npm run screenshot -- --url http://localhost:3000 --name homepage

# Compare against baseline
npm run screenshot:compare -- --name homepage
```

### Discord

Communicate with team (or other Claude instances):

```bash
# Send
npm run discord:send -- --message "Starting feature X" --branch feature/x

# Read recent messages
npm run discord:read -- --limit 10 --filter "main branch"
```

Requires `DISCORD_WEBHOOK_URL` in `.env`. For reading, also needs `DISCORD_BOT_TOKEN` and `DISCORD_CHANNEL_ID`.

### GitHub Issues

Create issues with rate limit awareness:

```bash
# Check rate limits first
npm run gh:rate-limit

# Create issue
npm run gh:issue -- --title "Bug: login fails" --labels "bug,priority:high"
```

Uses `gh` CLI which must be authenticated (`gh auth login`).

### PR Comments

Read comments from the Claude GitHub integration:

```bash
npx tsx tools/github/pr-comments.ts --pr 123 --claude
```

## Testing

```bash
npm run test              # Unit tests (Vitest)
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:e2e          # E2E tests (Playwright)
npm run test:e2e:ui       # Playwright UI mode
```

Coverage thresholds are set at 70%. E2E tests run against localhost by default.

## Database

Local development uses Postgres in Docker:

```bash
npm run db:up             # Start container
npm run db:down           # Stop container
npm run db:migrate        # Run migrations
npm run db:seed           # Seed data
```

Connection: `postgresql://postgres:postgres@localhost:5432/app`

For production, configure `DATABASE_URL` with Neon, Supabase, or your preferred Postgres provider.

## Deployment

GitHub Actions handles CI. For deployment:

**Vercel:**
```bash
vercel                    # Preview deploy
vercel --prod             # Production deploy
```

**Cloudflare Pages (via Wrangler):**
```bash
npx wrangler pages deploy dist/frontend --project-name=your-project
```

Set secrets in GitHub Actions for automated deploys.

## Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `.secrets.example` | Sensitive credentials template |
| `discord.config.json` | Discord tool configuration |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.js` | ESLint rules |
| `vitest.config.ts` | Test configuration |
| `playwright.config.ts` | E2E test configuration |
| `docker-compose.yml` | Local services |

## Customizing for Your Project

### Using the Init Script (Recommended)

The init script handles steps 1-4 automatically:

```bash
mkdir my-app && cd my-app
~/claude-base/bin/init.ts --name my-app --no-substack
```

Then:
1. `npm install`
2. Copy `.env.example` → `.env` and fill values
3. Copy `.secrets.example` → `.secrets` and fill values
4. Modify `src/db/init.sql` with your schema
5. Start building

### Manual Setup (Forking)

1. Fork this repo
2. Update `package.json` (name, description)
3. Update `discord.config.json` (projectName)
4. Copy `.env.example` → `.env` and fill values
5. Copy `.secrets.example` → `.secrets` and fill values
6. Modify `src/db/init.sql` with your schema
7. Delete `content/substack/` if not needed
8. Start building

## Architecture Decisions

**Why Postgres?** Full-featured, production-ready, local dev matches production.

**Why Vitest over Jest?** Native ESM, faster, better Vite integration.

**Why Express?** Widest ecosystem, most examples, least friction. (Swap for Hono/Fastify if you prefer.)

**Why no MCP/SKILLS?** This is a general foundation. Add integrations as your project needs them.

**Why Discord for coordination?** Claude instances need to communicate. Discord is accessible, has good APIs, and many teams already use it.

## Sources

This project implements principles from Anthropic's engineering blog (Summer-Fall 2025):

- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Progress files, incremental features, checkpoint design
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Context as finite resource, high-signal token selection
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — Tool consolidation, efficiency over comprehensiveness
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) — Visual verification, agent loops
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — Error cascades, checkpoint recovery
- [Beyond permission prompts](https://www.anthropic.com/engineering/claude-code-sandboxing) — Sandboxing reduces friction

---

## Appendix: The Prompt That Created This

This repo was created by Claude Code from a single prompt. The prompt is included here as both documentation and an example of how to structure comprehensive requests:

> Read all the Anthropic Engineering blog posts since summer 2025. Create a foundation for Claude Code projects, adhering to the Anthropic engineering blog standards.
>
> Absolutely no MCP servers. Absolutely no SKILLS. Utilize git, gh, gh-pages, vercel, wrangler, neon, supabase CLIs. Use GitHub issues, feature branches, Pull Requests, GitHub Actions, PR checks, a default main branch. Update the README.md. Create a CLAUDE.md.
>
> Create a screenshot framework. Create a Postgres database in a docker-compose.yml file. Create other foundational files from advice in the Anthropic Engineering blog posts. Document and link to the blog posts with excerpt quotes and first principles—no jargon—differentiate concepts from similar concepts and their opposites. Be opinionated and defend choices. Keep it general but not too general—able to apply to a wide range of projects. No placeholders.
>
> Use .env for environment variables. Use .secrets for secrets that do not go into .env. Have examples of both files checked in but actual secrets and env files gitignored. Include a pre-commit hook.
>
> Write a tool for communicating (reading/writing) on Discord. Make it configurable. An easy place to put metadata to customize for an actual project.
>
> Assume there is a Postgres database, an API layer, and a frontend. Do not use Jest. Create a framework for linting, typecheck (assume TypeScript), and tests with code coverage.
>
> Instruct future Claude instances to not check in secrets. Lean heavily on the automated screenshot framework and ad hoc (LLM-led) targeted end-to-end testing (although the various automated guardrails are important too).
>
> Instruct future Claudes to take ownership of their pull requests—do not wait for others to code review. Write a tool to create issues on GitHub taking into account rate limits—check actual rate limits using gh CLI. The gh CLI uses mostly the GitHub GraphQL API, not the traditional API. Instruct Claude to not change global config for gh and other CLIs and instead use local config in the local directory because other Claude instances are using this same machine.
>
> Tell Claude to look for pull request comments from "Claude" the GitHub Claude integration (and to install this integration).
>
> This repo should serve as somewhat of a working example but very limited example production code—hopefully none at all. I don't want to have to learn a structure or delete example code when starting a real project.
>
> Tag issues. Establish a process of assigning and marking in-progress a GitHub issue. Tell future Claudes to own the default main branch—clean it up immediately, yes it is their responsibility no matter what they are working on—but read and write Discord messages to see if anyone else is fixing the main branch.
>
> Tell Claude that it is way faster than it thinks so it should modify assumptions from its training data and lean more on the Anthropic Engineering blog posts and ai-2027.com projections to understand its current and future capabilities.
>
> Instruct Claudes to take on big hairy goals and not be too concerned with scope or risks or time. Favor tasks that make a big impact to real end users. Use expert UI/UX knowledge and read screenshots created using the framework to direct UI/UX choices.
>
> Create new GitHub issues when noticing chunks of work that are completely unrelated but prefer owning the fix now and fixing it immediately. Second to end user impact is future dev speed. Limit interactions with the human prompter. Limit waiting. Work in an infinite dev loop in general unless given another specific task like creating issues or cleaning up the main branch or deploying.
>
> Install the best tools available. Do not use alternative tools or approaches because tools are not authenticated—in that case stop immediately, report back to the human prompter with specific instructions on the actions to be taken by the human prompter, but only actions that Claude is absolutely not capable of doing.
>
> Claude has permission to set secrets and environment variables on GitHub and other remote systems. Record all of these in the local .secrets file that is gitignored.
>
> Use `git remote -v` to figure out the GitHub web UI public URL.

---

## License

[GNU Affero General Public License v3.0](LICENSE)
