<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:parallel-session-rules -->
# Parallel-session coordination (this repo)

Simon sometimes runs more than one Claude session against `~/ehc-site/` at the same time. Two incidents on 2026-06-25 (misleading commit fd3d324, orphaned unstaged mods to `app/page.tsx` + `app/producers/[slug]/page.tsx`) prove the coordination is missing. These rules close the gap.

## Before you touch anything in this repo
1. Run `git status`. If there are unstaged or staged changes you did not make, STOP. Surface them to Simon and ask whether to commit, discard, or wait. Never `git stash` or `git checkout --` someone else's work.
2. Run `git log -1 --stat` so you know what the most recent commit actually shipped.

## Before you commit
1. Stage explicit files by name. Never `git add -A` or `git add .` in this repo, since a parallel session's edits may be sitting unstaged in the working tree.
2. The commit message subject must name the full scope of the bundle, not just the headline feature. If a Position-content drop also includes a UI control change, say so in the subject. Misleading subjects are the bug, not unbundled commits.

## If you find your own unstaged work after a parallel session has pushed
Rebase your unstaged work onto the new main before commit. Don't force-push. Don't amend the parallel session's commit. Land a clean, honest follow-up commit.
<!-- END:parallel-session-rules -->
