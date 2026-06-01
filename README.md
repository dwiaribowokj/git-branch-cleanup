# git-branch-cleanup-assistant

[![CI](https://github.com/dwiaribowokj/git-branch-cleanup/actions/workflows/ci.yml/badge.svg)](https://github.com/dwiaribowokj/git-branch-cleanup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Safe local Git branch cleanup assistant. It lists stale/merged local branches and previews cleanup candidates.

## Why

Old local branches pile up fast. `git-branch-cleanup` gives you a quick read-only view of stale and merged branches so you can clean up confidently without accidentally deleting important work.

## Usage

```bash
npm install -g git-branch-cleanup-assistant
git-branch-cleanup --stale 30
git-branch-cleanup --stale 30 --delete --dry-run
```

Local development:

```bash
npm install
npm run build
node dist/cli.js --stale 30
```

## Example output

```txt
Git Branch Cleanup
✓ feature/old-login (47d old, merged) - safe cleanup candidate
! feature/payment-refactor (90d old, not merged) - stale but not merged
i main (2d old, merged) - protected

Would delete:
- feature/old-login

No branches deleted because --dry-run was used.
```

## Features

- Local branch analysis.
- Protected branch defaults: `main`, `master`, `develop`, `dev`, `staging`, `production`.
- Current branch protection.
- Merged branch detection.
- Stale branch detection by age.
- Dry-run cleanup preview.

## Safety

- Read-only by default.
- Never selects current/protected branches.
- Actual deletion is refused in MVP; use dry-run preview first.
- Uses Git argument arrays, not shell string interpolation.
- See [recovery notes](./docs/recovery.md).

## Development

```bash
npm install
npm run build
npm test
npm audit --audit-level=high
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

This project uses the [MIT License](./LICENSE), which means you can use, copy, modify, and distribute it freely as long as the license notice is included.

## Community

- Bug reports: use the GitHub issue template.
- Feature ideas: keep them small, practical, and safe by default.
- Security issues: please follow [SECURITY.md](./SECURITY.md).
