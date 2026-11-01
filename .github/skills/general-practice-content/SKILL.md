---
name: general-practice-content
description: 'Add or update general practice (GP, primary care) study notes and assessments in content/general-practice. Use when the user logs a GP surgery, community, consultation, safety-netting, long-term condition or primary care learning.'
---

# General Practice content

Follow the shared file format and registration steps in [add-medical-content](../add-medical-content/SKILL.md). This skill adds GP-specific rules. Files live in `content/general-practice/`.

## Frameworks to prefer

- Consultation model (Calgary-Cambridge): initiate, gather information, physical exam, explain and plan, close.
- Ideas, concerns, expectations (ICE).
- "Common things are common, but exclude the serious": list the likely diagnosis, then the red-flag diagnosis to exclude.
- Safety-netting: expected course, specific warning signs, how and when to seek help.
- Long-term condition review: monitor, optimise, educate, screen for complications.

## Study note requirements

- Use `framework` groups such as "Likely", "Must not miss", "Primary care management" or "Refer when".
- Include a `redFlags` list that matches an urgent referral or 2-week-wait pathway only when verified (mark with `verify`).
- Put a safety-netting statement in `management`.
- Capture the communication technique observed in `pearls`.
- Do not state prescribing doses; reference BNF and local formulary.

## Assessment ideas

- SBA on diagnosis in primary care, referral thresholds, screening.
- OSCE: focused history (cough, headache, tired all the time), explaining a diagnosis, safety-netting, health promotion.
- Reflection: consultation skills, uncertainty, continuity of care, health inequalities.

## Sources

NICE CKS, NICE guidelines, RCGP, BNF, NHS screening programmes.

## Maintenance log

Update this section when conventions change or the user gives feedback.

- Initial version.
