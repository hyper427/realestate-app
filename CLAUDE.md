# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a task board application (currently in initial setup). Update this section as the project evolves.

## Git Workflow

**Push to GitHub after every code change.**

```powershell
git add <changed-files>
git commit -m "describe what changed and why"
git push
```

- Stage specific files rather than `git add -A` to avoid committing unintended files.
- Always push immediately after committing — do not batch pushes.
- If the repository has no remote yet, set one up before starting work:
  ```powershell
  git remote add origin https://github.com/<user>/<repo>.git
  git push -u origin main
  ```

## Commands

> Populate this section once the tech stack is decided (e.g., `npm run dev`, `npm test`, `npm run lint`).
