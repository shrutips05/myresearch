---
name: add-medical-content
description: 'Shared file format, registration and safety rules for the placement study site in content/ and site/. Use when creating a new specialty, changing templates or the manifest, or adding content for a specialty that has no skill of its own.'
---

# Add medical content to the placement site

The site (`site/`) is static and renders everything from JSON in `content/`. Never hard-code content in `site/app.js`.

## Specialty skills

For content in an existing specialty, also load its own skill, which holds the specialty frameworks and conventions:

| Specialty | Skill |
|---|---|
| Paediatrics | `paediatrics-content` |
| General practice | `general-practice-content` |
| Psychiatry | `psychiatry-content` |
| Obs and gynae | `obs-gynae-content` |
| Cardiology | `cardiology-content` |

Keep specialty-specific guidance in the specialty skill and generic rules here. When the user gives feedback or a convention changes, append a line to that skill's Maintenance log.

## Layout

```
content/
  manifest.json                    # registry: every specialty and its files
  <specialty-slug>/
    overview.json                  # summary, core topics checklist, recommendations, resources
    study/<topic-slug>.json        # one study note per learning
    assessment/<set-slug>.json     # question sets (SBA, OSCE, viva, reflection)
```

## Add a study note

1. Create `content/<slug>/study/<topic-slug>.json` using [the study template](./templates/study.json).
2. Add the filename (without path) to `study` for that specialty in `content/manifest.json`.
3. If the topic is in `coreTopics` of `overview.json`, leave it; the checklist is ticked by the user in the browser.
4. Add a related assessment set or extend an existing one (see below).

## Add an assessment set

1. Create `content/<slug>/assessment/<set-slug>.json` using [the assessment template](./templates/assessment.json).
2. Register it under `assessment` in `content/manifest.json`.
3. Supported `type` values: `SBA` (options plus answer index), `OSCE`, `Viva`, `Reflection` (use `answer` as a model/prompt text, no `options`).

## Add a new specialty

1. Create the folder with `overview.json`, `study/` and `assessment/`.
2. Copy the shape of an existing `overview.json` (`name`, `icon`, `summary`, `placementFocus`, `coreTopics`, `recommendations`, `resources`).
3. Append `{ "slug", "study": [], "assessment": [] }` to `content/manifest.json`.
4. Create `.github/skills/<slug>-content/SKILL.md` by copying the structure of an existing specialty skill (frameworks, note requirements, assessment ideas, sources, maintenance log), and add it to the table above.

## Rules

- Anonymise: no names, DOB, hospital numbers, ward or hospital names, exact dates of events. Use "a 5-day-old term baby".
- Systematic framework first (for example pre-hepatic / hepatic / post-hepatic, or anatomical / physiological / pathological), then pathway or mechanism.
- Cite UK sources (NICE, RCPCH, BNFc, CKS, RCOG, Resus Council UK). Mark anything unverified with `"verify": true` in the relevant item or note it in `lookUp`.
- Keep the user's own words in `pearls`; record who taught it only as "consultant" or "registrar".
- Mermaid diagrams go in `pathway.mermaid` as a plain string (use `\n` for newlines, no code fences).
- Valid JSON only: no comments, no trailing commas. After editing, validate with `python3 -m json.tool <file>`.
- Do not change `site/` for content changes. Only change `site/` when adding a new field type, and then update both the templates and this skill.
- End each addition with 2-3 suggestions for what to study or practise next.
