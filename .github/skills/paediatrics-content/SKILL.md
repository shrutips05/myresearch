---
name: paediatrics-content
description: 'Add or update paediatrics (0-2 years) study notes and assessments in content/paediatrics. Use when the user logs a paediatric, neonatal, infant, baby, child ward or newborn learning, or asks for paediatric SBAs, OSCE or reflection.'
---

# Paediatrics (0-2 years) content

Follow the shared file format and registration steps in [add-medical-content](../add-medical-content/SKILL.md). This skill adds paediatric-specific rules. Files live in `content/paediatrics/`.

## Frameworks to prefer

- Causes by pathway or level (for example pre-hepatic / hepatic / post-hepatic).
- Timing and age bands: first 24 hours, days 2-14, beyond 14 or 21 days; neonate (under 28 days), infant (under 1 year), toddler.
- Unwell infant: airway and breathing effort, circulation (capillary refill, heart rate), disability (tone, alertness), hydration, feeding, temperature.
- Developmental domains: gross motor, fine motor and vision, language and hearing, social.

## Study note requirements

- State the age or gestation band in the `presentation` (anonymised, e.g. "5-day-old term baby").
- Include age-specific normal values or thresholds in a `tables` entry and flag them `verify` in `sources` until checked against NICE or RCPCH.
- `redFlags` should include feeding, tone, colour, breathing, and safeguarding concerns where relevant.
- Add a parent-communication line to `pearls` or `lookUp` when relevant.
- Mention weight-based dosing only as "check BNFc"; never state doses.

## Assessment ideas

- SBA on age-based differentials and interpretation of results.
- OSCE: newborn exam, explaining a condition to a parent, infant hydration assessment, developmental screen.
- Reflection: family-centred communication, escalation, safeguarding awareness.

## Sources

NICE (e.g. NG98), RCPCH, BNFc, NICE CKS, Healthy Child Programme.

## Maintenance log

Update this section when conventions change or the user gives feedback.

- Initial version.
