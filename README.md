# Placement Study Hub

A personal, local study website for medical placements. Content lives in JSON files under `content/` and the site in `site/` displays it. Nothing is uploaded anywhere.

> Revision aid only, not clinical advice. Never store patient-identifiable information. Verify against NICE and local guidance.

## Run the site

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8000`.
3. Open `http://localhost:8000/site/` in your browser.
4. Stop the server with `Ctrl+C`.

Opening `site/index.html` by double-clicking will not work, because the page needs to load the JSON files.

## Using the site

- **Dashboard:** progress per specialty and a suggested revision routine.
- **Overview tab:** placement focus, core topics checklist, recommendations, resources and a personal notes box.
- **Study tab:** your notes with frameworks, pathway diagrams, investigations, red flags, pearls and a self-test.
- **Assessment tab:** SBA questions (scored), and OSCE, viva and reflection prompts (show or hide the model answer).
- **Search box:** searches every note and question.
- **Print:** use the Print button on a note to save it as PDF.

Ticks, personal notes and SBA scores are stored in your browser only. Clearing browser data removes them. Pathway diagrams need an internet connection.

## Folder layout

```
.github/
  agents/placement-tutor.agent.md      # the tutor agent
  skills/
    add-medical-content/               # shared format and rules, plus templates
    paediatrics-content/               # one skill per specialty
    general-practice-content/
    psychiatry-content/
    obs-gynae-content/
    cardiology-content/
content/
  manifest.json                        # registry of specialties and their files
  <specialty>/
    overview.json
    study/<topic>.json
    assessment/<set>.json
site/                                  # the web page (index.html, app.js, style.css)
```

## Everyday: add a new learning (recommended)

Use the tutor agent in VS Code chat. After a ward session, write short anonymised notes, then ask:

> Using the placement-tutor agent, log a learning in paediatrics: [your anonymised notes]. Add 5 SBAs and a self-test.

The agent follows the shared skill and the matching specialty skill. It creates the study note, registers it in `content/manifest.json`, and adds questions. Refresh the browser to see it.

Other requests that work:

- "Add 5 SBAs on heart failure to cardiology."
- "Add an OSCE station on explaining phototherapy to a parent."
- "Add a new core topic 'Croup' to the paediatrics checklist."
- "Create a new specialty: Emergency Medicine, with its own skill."
- "Review my cardiology notes and suggest gaps to study next."

Always check the new content against the cited source, and correct anything your supervisor tells you.

## Everyday: add content by hand

### New study note

1. Copy `.github/skills/add-medical-content/templates/study.json` to `content/<specialty>/study/<topic-slug>.json`.
2. Fill it in. Use an anonymised presentation, such as "a 5-day-old term baby".
3. Add `"<topic-slug>"` to the `study` list for that specialty in `content/manifest.json`.
4. Refresh the browser.

### New assessment set

1. Copy `templates/assessment.json` to `content/<specialty>/assessment/<set-slug>.json`.
2. For SBAs, set `"type": "SBA"`. `answer` is the zero-based index of the correct option (A is 0, B is 1, and so on).
3. For OSCE, viva or reflection, set `"type"` accordingly and use `answer` as a model answer text with no `options`.
4. Add `"<set-slug>"` to the `assessment` list in `content/manifest.json`.

### New core topic or recommendation

Edit `coreTopics`, `recommendations` or `resources` in `content/<specialty>/overview.json`.

### New specialty

1. Create `content/<slug>/overview.json` by copying an existing one, plus empty `study/` and `assessment/` folders.
2. Add `{ "slug": "<slug>", "study": [], "assessment": [] }` to `content/manifest.json`.
3. Create `.github/skills/<slug>-content/SKILL.md`, copying the structure of an existing specialty skill.

## Checks

- JSON must be valid, with no comments or trailing commas. Validate with `python3 -m json.tool <file>`.
- Every name in `manifest.json` must match a real file name without `.json`. If the site shows "Could not load content", check this first.
- Diagrams use Mermaid syntax in the `pathway.mermaid` string, with `\n` for line breaks.

## Suggested routine

1. Same day: write anonymised notes and ask the agent to log them.
2. Within 48 hours: take the self-test and tick the core topic.
3. Weekly: redo missed SBAs and write one reflection.
4. End of placement: list three gaps to study next.

## Keeping it safe

- No names, dates of birth, hospital numbers, ward or hospital names, or rare identifying details.
- Keep the folder private. If you use git, use a private repository.
- Follow Warwick and GMC confidentiality guidance for all notes.
