---
name: cardiology-content
description: 'Add or update cardiology and cardiovascular study notes and assessments in content/cardiology. Use when the user logs a cardiology, ECG, chest pain, heart failure, arrhythmia, murmur, hypertension or cardiac ward learning.'
---

# Cardiology content

Follow the shared file format and registration steps in [add-medical-content](../add-medical-content/SKILL.md). This skill adds cardiology-specific rules. Files live in `content/cardiology/`.

## Frameworks to prefer

- Chest pain: cardiac, vascular, respiratory, gastrointestinal, musculoskeletal; "must not miss" first (ACS, PE, dissection, pneumothorax).
- ECG: rate, rhythm, axis, P waves, PR interval, QRS, ST segment, T waves, QT.
- Cardiac cycle and physiology before murmurs and heart sounds.
- Heart failure: aetiology, precipitants, symptoms by side (left/right), and treatment pillars.
- Cardiovascular examination order: hands, pulse, BP, face, JVP, praecordium, peripheries.

## Study note requirements

- Put `pathway.mermaid` to good use: physiology flow, ACS pathway, or conduction system.
- Include `tables` for ECG findings by territory or murmur by timing and location.
- `investigations` should state what each result changes (troponin timing, echo findings).
- `redFlags` must include time-critical features (for example ongoing chest pain with ST change).
- Treatment: describe drug classes and reasons only; never state doses; reference BNF and NICE.

## Assessment ideas

- SBA on ECG interpretation, ACS management at class level, murmurs, risk factors.
- OSCE: cardiovascular exam, chest pain history, explaining an ECG, BP measurement.
- Reflection: handling an unwell patient on the ward, escalation (NEWS2).

## Sources

NICE (CG95, NG185 ACS, NG106 chronic heart failure), ESC guidelines, Resuscitation Council UK, BNF.

## Maintenance log

Update this section when conventions change or the user gives feedback.

- Initial version.
