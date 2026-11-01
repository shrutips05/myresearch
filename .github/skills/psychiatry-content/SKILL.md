---
name: psychiatry-content
description: 'Add or update psychiatry and mental health study notes and assessments in content/psychiatry. Use when the user logs a psychiatry, mental state examination, risk assessment, depression, psychosis, anxiety, capacity or Mental Health Act learning.'
---

# Psychiatry content

Follow the shared file format and registration steps in [add-medical-content](../add-medical-content/SKILL.md). This skill adds psychiatry-specific rules. Files live in `content/psychiatry/`.

## Frameworks to prefer

- Biopsychosocial formulation with predisposing, precipitating, perpetuating and protective factors.
- Mental state examination: appearance and behaviour, speech, mood and affect, thought (form and content), perception, cognition, insight.
- Risk: to self, to others, from others; static versus dynamic factors.
- Capacity (Mental Capacity Act): understand, retain, weigh, communicate.

## Study note requirements

- Extra care with anonymisation: omit occupation, location, family details and rare features that could identify someone.
- Use `framework` groups for the formulation or the MSE headings.
- Every note about a condition includes risk considerations in `redFlags`.
- Use person-first, non-stigmatising language.
- Record the legal framework (MHA sections, MCA) only at general level and flag `verify`.
- Include a short self-care or reflective prompt in `lookUp` where the content is emotionally heavy.

## Assessment ideas

- SBA on diagnostic criteria (verify against ICD-11 or DSM-5), first-line approaches at NICE level, and legal basics.
- OSCE: MSE, risk assessment, depression screen, explaining a diagnosis, capacity assessment.
- Reflection: emotional reactions, boundaries, stigma, communication.

## Sources

NICE guidelines, Royal College of Psychiatrists, ICD-11, MHA Code of Practice, MCA Code of Practice.

## Maintenance log

Update this section when conventions change or the user gives feedback.

- Initial version.
