# Shared Agent Rules — Sheikh Ammar museum
These rules are shared across Claude Code and OpenAI Codex. Read docs/PROJECT_STATE.md in full before making changes. Then read applicable SKILL.md files under .claude/skills/ (Claude) or .agents/skills/ (Codex). The two copies are intentionally identical; keep both synced.

Mandatory workflow for every continued session: continuity-guard → domain-specific (royal-museum-qa) → proof-first-release before any release. State documents may be stale: corroborate with git, tests and build/deployment logs.

Never duplicate an existing project, fabricate tests or runtime, expand publication visibility, delete infrastructure or add paid services without authorization. Make proposed changes on a branch, use a draft PR, and preserve the canonical main and its current production/runtime configuration. Do not expose user secrets or private images/logs.

Completion report: exact commit, actual verification evidence, what is still NOT VERIFIED, the next concrete step and any necessary owner decision. Keep explanations concise and avoid repetition.
