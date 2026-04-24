const stopWords = new Set([
  "a", "about", "after", "again", "all", "also", "am", "an", "and", "any", "are", "as", "at",
  "be", "because", "been", "before", "being", "but", "by", "can", "could", "did", "do", "does",
  "doing", "down", "for", "from", "had", "has", "have", "he", "her", "here", "hers", "him",
  "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more",
  "most", "my", "no", "not", "now", "of", "off", "on", "once", "only", "or", "other", "our",
  "out", "over", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their",
  "them", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under",
  "up", "very", "was", "we", "were", "what", "when", "where", "which", "who", "why", "will",
  "with", "would", "you", "your", "yours", "yeah", "yes", "oh", "uh", "um"
]);

const aliasMap = {
  "emma": "Emma Swan",
  "emma swan": "Emma Swan",
  "mary margaret": "Snow White / Mary Margaret",
  "mary margaret blanchard": "Snow White / Mary Margaret",
  "snow white": "Snow White / Mary Margaret",
  "snow": "Snow White / Mary Margaret",
  "david": "Prince Charming / David",
  "david nolan": "Prince Charming / David",
  "prince charming": "Prince Charming / David",
  "charming": "Prince Charming / David",
  "mr gold": "Rumplestiltskin / Mr. Gold",
  "mr. gold": "Rumplestiltskin / Mr. Gold",
  "gold": "Rumplestiltskin / Mr. Gold",
  "rumplestiltskin": "Rumplestiltskin / Mr. Gold",
  "regina": "Regina / Evil Queen",
  "regina mills": "Regina / Evil Queen",
  "evil queen": "Regina / Evil Queen",
  "hook": "Hook / Killian Jones",
  "captain hook": "Hook / Killian Jones",
  "killian": "Hook / Killian Jones",
  "killian jones": "Hook / Killian Jones",
  "neal": "Neal / Baelfire",
  "baelfire": "Neal / Baelfire",
  "henry": "Henry",
  "henry mills": "Henry",
  "belle": "Belle"
};

const characterSelect = document.getElementById("character-select");
const seasonSelect = document.getElementById("season-select");
const wordCloudEl = document.getElementById("word-cloud");
const topWordsEl = document.getElementById("top-words");
const topPhrasesEl = document.getElementById("top-phrases");
const seasonBreakdownEl = document.getElementById("season-breakdown");

let allEntries = [];
let characters = [];
let seasons = [];

loadPage();

async function loadPage() {
  try {
    wordCloudEl.innerHTML = '<div class="empty-state">Loading dialogue...</div>';

    const characterStats = await d3.json("data/character_stats.json");
    const manifest = await d3.json("data/script_manifest.json");

    characters = characterStats.map((item) => item.character);
    seasons = [...new Set(manifest.map((item) => item.season))].sort();

    characterSelect.innerHTML = characters
      .map((character) => `<option value="${escapeHtml(character)}">${escapeHtml(character)}</option>`)
      .join("");

    seasonSelect.innerHTML += seasons
      .map((season) => `<option value="${season}">${formatSeason(season)}</option>`)
      .join("");

    const episodes = await Promise.all(
      manifest.map((item) => d3.json(`data/${item.path}`))
    );

    allEntries = [];

    for (let i = 0; i < episodes.length; i += 1) {
      const episode = episodes[i];
      const season = manifest[i].season;

      for (const scene of episode.scenes) {
        for (const line of scene.dialog) {
          allEntries.push({
            season,
            episode: episode.episode,
            character: fixCharacterName(line.character),
            tokens: Array.isArray(line.dialogSplit) ? line.dialogSplit : []
          });
        }
      }
    }

    characterSelect.addEventListener("change", renderPage);
    seasonSelect.addEventListener("change", renderPage);
    renderPage();
  } catch (error) {
    console.error(error);
    wordCloudEl.innerHTML = '<div class="empty-state">Could not load the data. Run this with a local server.</div>';
  }
}

function renderPage() {
  const selectedCharacter = characterSelect.value || characters[0];
  const selectedSeason = seasonSelect.value;
  const selectedEntries = [];
  const characterEntries = [];

  for (const entry of allEntries) {
    if (entry.character === selectedCharacter) {
      characterEntries.push(entry);

      if (selectedSeason === "all" || entry.season === selectedSeason) {
        selectedEntries.push(entry);
      }
    }
  }

  const wordCounts = countWords(selectedEntries);
  const phraseCounts = countPhrases(selectedEntries);

  renderWordCloud(wordCounts.slice(0, 25));
  renderList(topWordsEl, wordCounts.slice(0, 12), "word");
  renderList(topPhrasesEl, phraseCounts.slice(0, 10), "phrase");
  renderSeasonBreakdown(characterEntries);
}

function fixCharacterName(rawName) {
  if (!rawName) {
    return "";
  }

  const cleaned = rawName
    .toLowerCase()
    .replace(/[':;,.()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return aliasMap[cleaned] || rawName.trim();
}

function countWords(entries) {
  const counts = {};

  for (const entry of entries) {
    for (const token of entry.tokens) {
      const word = cleanWord(token);
      if (!word || word.length <= 2 || stopWords.has(word)) {
        continue;
      }

      counts[word] = (counts[word] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function countPhrases(entries) {
  const counts = {};

  for (const entry of entries) {
    const words = [];

    for (const token of entry.tokens) {
      const word = cleanWord(token);
      if (word && word.length > 1) {
        words.push(word);
      }
    }

    for (let size = 2; size <= 4; size += 1) {
      for (let i = 0; i <= words.length - size; i += 1) {
        const phraseWords = words.slice(i, i + size);
        const hasRealWord = phraseWords.some((word) => !stopWords.has(word));

        if (!hasRealWord) {
          continue;
        }

        const phrase = phraseWords.join(" ");
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 1)
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function renderWordCloud(words) {
  if (!words.length) {
    wordCloudEl.innerHTML = '<div class="empty-state">No dialogue found for this selection.</div>';
    return;
  }

  const maxCount = words[0].value;

  wordCloudEl.innerHTML = words.map((item, index) => {
    const size = 16 + (item.value / maxCount) * 28;
    const hue = 185 + (index % 5) * 7;

    return `
      <span class="cloud-word" style="font-size:${size.toFixed(1)}px; color:hsl(${hue}, 55%, 83%)">
        ${escapeHtml(item.label)}
      </span>
    `;
  }).join("");
}

function renderList(container, items, type) {
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">No ${type}s found.</div>`;
    return;
  }

  container.innerHTML = `
    <ul>
      ${items.map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${item.value}</strong></li>`).join("")}
    </ul>
  `;
}

function renderSeasonBreakdown(entries) {
  seasonBreakdownEl.innerHTML = seasons.map((season) => {
    const seasonEntries = entries.filter((entry) => entry.season === season);
    const topWords = countWords(seasonEntries)
      .slice(0, 3)
      .map((item) => item.label)
      .join(", ");

    return `
      <article class="season-card">
        <h4>${formatSeason(season)}</h4>
        <p><strong>${seasonEntries.length}</strong> lines</p>
        <p>Top words: ${topWords || "None"}</p>
      </article>
    `;
  }).join("");
}

function cleanWord(word) {
  const cleaned = word
    .toLowerCase()
    .replace(/[“”"?!.,;:()[\]{}]/g, "")
    .replace(/[^a-z'-]/g, "")
    .replace(/^'+|'+$/g, "");

  if (["i'm", "you're", "we're", "they're", "he's", "she's", "it's", "i've", "you've", "we've", "they've", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd"].includes(cleaned)) {
    return "";
  }

  return cleaned;
}

function formatSeason(season) {
  return season.replace("season", "Season ");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
