---
description: Apply feedback updates across specification documents
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Glob, Grep, LS, Update
argument-hint: <feature-name> [--report <filename>]
version: 1.0.0
---

# Specification Feedback Application

Apply the agreed feedback updates for feature **{{feature_name}}**.

## Context
- Report reference: {{report_reference}}
- Spec documents to update: `requirements.md`, `design.md`, `tasks.md`
- Metadata file: `spec.json`

## Pre-execution Checklist
- [ ] Confirm the referenced report JSON is available and up to date
- [ ] Review each feedback item and align on ownership per document
- [ ] Notify stakeholders that specification updates are in progress
- [ ] Prepare to reset approvals for any document receiving edits

## Task 1: Review the Report
1. Read the JSON report and Markdown summary together.
2. Highlight which feedback items map to requirements, design, or tasks.
3. Note dependencies or cross-document impacts before editing.

## Task 2: Update Specification Files
1. **requirements.md**
   - Locate the impacted EARS statements (or add new ones) directly inside the relevant sections.
   - Update acceptance criteria, context, and rationale inline so reviewers see the latest canonical wording.
2. **design.md**
   - Edit the affected components/sections in place, adjusting architecture decisions, diagrams, and integration notes.
   - Record new alternatives or trade-offs where appropriate.
3. **tasks.md**
   - Modify existing tasks to reflect new work (status, owners, details) rather than duplicating entries.
   - Add new checklist items only when additional work is required, appending them near related tasks to preserve ordering.

## Task 3: Update spec.json Metadata
1. Set `updated_at` to the current timestamp (UTC).
2. For each document modified, set `approvals.<doc>.approved = false`.
3. Update or create the `feedback` block:
   ```json
   "feedback": {
     "last_report_path": "feedback/<report-filename>.json",
     "last_applied_at": "YYYY-MM-DDThh:mm:ssZ",
     "applied_item_ids": ["FB-001", "FB-002"]
   }
   ```
4. Preserve existing `generated` flags and any additional metadata.

## Completion Checklist
- [ ] requirements.md updated with feedback details
- [ ] design.md updated with architectural changes
- [ ] tasks.md updated with follow-up checklist items
- [ ] spec.json approvals reset and feedback metadata recorded
- [ ] `spec-status {{feature_name}}` re-run to confirm state
