# Recovery Notes

This MVP does not delete branches directly. Future versions may support confirmed local deletion with `git branch -d`.

If you delete a local branch manually by mistake, you may be able to recover it with:

```bash
git reflog
git branch recovered-branch <commit-sha>
```

Remote branch deletion is riskier and is intentionally out of scope for the MVP.
