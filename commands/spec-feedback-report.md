---
description: Prepare and document feedback report artifacts
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Glob, Grep, LS, Update
argument-hint: <feature-name>
version: 1.0.0
---

# Specification Feedback Report

Prepare the development feedback deliverables for feature **{{feature_name}}**.

## Context
- Spec directory: `.kiro/specs/{{feature_name}}`
- Feedback artifacts directory: `.kiro/specs/{{feature_name}}/feedback/`
- Suggested base filename: `{{suggested_base}}`

## Pre-execution Checklist
- [ ] Confirm `requirements.md`, `design.md`, and `tasks.md` are present (note any missing documents explicitly)
- [ ] Gather the latest discussion notes, risk logs, and review comments
- [ ] Align on severity definitions with the team (`blocker`, `major`, `minor`, `info`)
- [ ] Identify who will own each follow-up action once the report is published

## Task 1: Capture Feedback Inputs
1. Document each issue, risk, or improvement as a structured feedback item containing:
   - `title` (concise summary)
   - `severity`
   - `impact` (why this matters)
   - `recommendation` (proposed fix or direction)
   - `targets` (one or more of `requirements`, `design`, `tasks`)
   - `updates` arrays with Markdown snippets or checklist entries for each target
2. Ensure every item is actionable and references the affected requirement, component, or task when possible.

## Task 2: Produce Report Artifacts
1. Create a JSON report at `feedback/{{suggested_base}}.json` with the structured feedback array:
   ```json
   {
     "feature": "{{feature_name}}",
     "generated_at": "YYYY-MM-DDThh:mm:ssZ",
     "items": [
       {
         "id": "FB-001",
         "title": "...",
         "severity": "major",
         "impact": "...",
         "recommendation": "...",
         "targets": ["requirements", "design"],
         "updates": {
           "requirements": ["..."],
           "design": ["..."],
           "tasks": []
         }
       }
     ],
     "approvals_to_reset": ["requirements", "design"]
   }
   ```
2. Generate a Markdown summary at `feedback/{{suggested_base}}.md` highlighting:
   - Total item count and severity distribution
   - Recommended approval resets (requirements/design/tasks)
   - Detailed sections per feedback item (ID, title, context, recommended updates)
3. Double-check that item IDs are stable (`FB-001`, `FB-002`, …) to support future references.

## Task 3: Communicate Results
1. Share the Markdown summary with stakeholders (developers, reviewers, PM).
2. Capture questions that need follow-up discussion.
3. Schedule or note the next feedback review checkpoint.

## Output Requirements
- JSON report: `feedback/{{suggested_base}}.json`
- Markdown summary: `feedback/{{suggested_base}}.md`
- Explicit list of approvals to reset before the next spec phase
- Assigned owners for each feedback item or action

## Output Instructions
- At the end of this response, output two code blocks ready to persist:
  1. ```json (labeled as `feedback/{{suggested_base}}.json`)``` containing the final structured report.
  2. ```markdown (labeled as `feedback/{{suggested_base}}.md`)``` containing the human-readable summary.
- Populate both artifacts using the feedback items derived from the user’s latest proposals and observations in this conversation.
- Ensure item IDs, severity, and targets accurately reflect the provided feedback.

## Post-Run Actions
- Attach the report to the latest status update or retrospective notes.
- Remind document owners to run `spec-feedback --mode apply --report {{suggested_base}}.json` once ready to integrate the changes.
