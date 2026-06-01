# git-branch-cleanup-assistant

Safe local Git branch cleanup assistant. It lists stale/merged local branches and previews cleanup candidates.

## Usage

```bash
npm install -g git-branch-cleanup-assistant
git-branch-cleanup --stale 30
git-branch-cleanup --stale 30 --delete --dry-run
```

## Safety

- Read-only by default.
- Never selects current/protected branches.
- Actual deletion is refused in MVP; use dry-run preview first.
- Uses Git argument arrays, not shell string interpolation.

## Development

```bash
npm install
npm run build
npm test
```
