# Project Name

**Team Members:** Ikran Warsame, Kelly Deal, Faith Rider, Fareena Khan

[Live Application](https://kellannd.github.io/tv-time/index.html)

---

## Motivation

Once Upon a Time has a huge cast of fairy-tale characters and a lot going on across the show. With so many overlapping storylines, it can be hard to tell who actually drives the show, how the focus shifts over time, and how characters connect to each other.

We built this app to make those patterns easier to see. We pulled the transcripts from the first 3 seasons (64 episodes total) and used them to explore things like:

- Which characters get the most lines, and when?
- What words and phrases are each character known for?
- Who talks to who, and how do those relationships change across seasons?
- How does the setting (Storybrooke, the Enchanted Forest, Neverland, etc.) shape the story?

---

## Data

[fill in]

**Source:** [fill in]

### Data Collection & Processing

[fill in]

Processing scripts:
- [`webscrape_main.py`](webscrape_main.py) — [fill in]
- [`webscrape_other.py`](webscrape_other.py) — [fill in]
- [`characters_alias.py`](characters_alias.py) — [fill in]
- [`preprocess.py`](preprocess.py) — [fill in]
- [`stemming.py`](stemming.py) — [fill in]

Final processed data lives in [`data/`](data/).

---

## Visualization Components

[fill in]

### Design Sketches & Justifications

[fill in]

---

## Findings

[fill in]

### Finding 1: [fill in]

[fill in]

### Finding 2: [fill in]

[fill in]

### Finding 3: [fill in]

[fill in]

---

## Process

### Libraries & Tools

We mostly used D3 (v6) for the charts and plain HTML/CSS/JS for everything else. For the data side we used Python with `requests` and `BeautifulSoup` to scrape the transcripts off the Once Upon a Time Fandom wiki, and `nltk` (PorterStemmer) to stem the dialogue. Everything gets saved as JSON for the front end to read.

### Code Structure

```
tv-time/
├── *.html                      # one page per level (Overview, Dialogue, Interactions, Advanced)
├── css/                        # styles
├── js/                         # D3 + the per-level visualization code
├── data/                       # processed JSON the front end reads
├── preprocessing-scripts/      # Python scripts we used to scrape and clean the data
└── images/                     # backgrounds and character portraits
```

### Running Locally

It's all static, so you just need a local server:

```bash
git clone https://github.com/kellannd/tv-time>
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

The data is already in `data/`, so you don't need to do anything else to run the app. The scripts in `preprocessing-scripts/` are how we built that data in the first place. They aren't really one big pipeline though since they have hardcoded paths and we ran them on whatever we needed at the time. If you want to mess with them you'll need:

```bash
pip install requests beautifulsoup4 nltk
```

**Live application:** <https://kellannd.github.io/tv-time/index.html>

---

## Demo Video

[fill in]

---

## Team Contributions

| Member | Components |
|--------|------------|
| Fareena | Dialogue Analysis, Documentation |
| Ikran | Show Overview |
| Kelly | Scripting, Advanced Analysis |
| Faith | Character Interactions |

who deployed the site?