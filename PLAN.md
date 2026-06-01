# git-branch-cleanup-assistant Plan

## Goal
A safe assistant for finding stale and merged local Git branches without accidental data loss.

## MVP Scope
- List local branches.
- Mark current/protected branches.
- Detect merged branches.
- Detect stale branches by last commit age.
- Preview safe cleanup candidates.
- Support `--delete --dry-run` only in MVP.

## Non-goals for MVP
- No actual deletion yet.
- No remote branch deletion.
- No force delete.
- No automated cleanup without confirmation.

## Roadmap
- Interactive confirmation for local `git branch -d`.
- JSON plan output.
- Protected glob patterns like `release/*` and `hotfix/*`.
- Upstream/unpushed commit checks.
- Reflog recovery instructions.

## Safety Notes
- Read-only by default.
- Never select current/protected branches.
- Use argument arrays, not shell interpolation.
- Avoid `git branch -D` unless a future explicit force mode exists.
