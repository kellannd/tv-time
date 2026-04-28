
const EPISODE_FILES = {
  "1": {
    "Pilot":                       "data/scripts/season1/Pilot.json",
    "The Thing You Love Most":     "data/scripts/season1/The_Thing_You_Love_Most.json",
    "Snow Falls":                  "data/scripts/season1/Snow_Falls.json",
    "The Price of Gold":           "data/scripts/season1/The_Price_of_Gold.json",
    "That Still Small Voice":      "data/scripts/season1/That_Still_Small_Voice.json",
    "The Shepherd":                "data/scripts/season1/The_Shepherd.json",
    "The Heart Is a Lonely Hunter":"data/scripts/season1/The_Heart_Is_a_Lonely_Hunter.json",
    "Desperate Souls":             "data/scripts/season1/Desperate_Souls.json",
    "True North":                  "data/scripts/season1/True_North.json",
    "7:15 A.M.":                   "data/scripts/season1/715am.json",
    "Fruit of the Poisonous Tree": "data/scripts/season1/Fruit_of_the_Poisonous_Tree.json",
    "Skin Deep":                   "data/scripts/season1/Skin_Deep.json",
    "What Happened to Frederick":  "data/scripts/season1/What_Happened_to_Frederick.json",
    "Red-Handed":                  "data/scripts/season1/Red-Handed.json",
    "Heart of Darkness":           "data/scripts/season1/Heart_of_Darkness.json",
    "Hat Trick":                   "data/scripts/season1/Hat_Trick.json",
    "The Stable Boy":              "data/scripts/season1/The_Stable_Boy.json",
    "The Return":                  "data/scripts/season1/The_Return.json",
    "The Stranger":                "data/scripts/season1/The_Stranger.json",
    "An Apple Red as Blood":       "data/scripts/season1/An_Apple_Red_as_Blood.json",
    "A Land Without Magic":        "data/scripts/season1/A_Land_Without_Magic.json"
  },
  "2": {
    "Broken":                      "data/scripts/season2/Broken.json",
    "We Are Both":                 "data/scripts/season2/We_Are_Both.json",
    "Lady of the Lake":            "data/scripts/season2/Lady_of_the_Lake.json",
    "The Crocodile":               "data/scripts/season2/The_Crocodile.json",
    "The Doctor":                  "data/scripts/season2/The_Doctor.json",
    "Tallahassee":                 "data/scripts/season2/Tallahassee.json",
    "Child of the Moon":           "data/scripts/season2/Child_of_the_Moon.json",
    "Into the Deep":               "data/scripts/season2/Into_the_Deep.json",
    "Queen of Hearts":             "data/scripts/season2/Queen_of_Hearts.json",
    "The Cricket Game":            "data/scripts/season2/The_Cricket_Game.json",
    "The Outsider":                "data/scripts/season2/The_Outsider.json",
    "In the Name of the Brother":  "data/scripts/season2/In_the_Name_of_the_Brother.json",
    "Tiny":                        "data/scripts/season2/Tiny.json",
    "Manhattan":                   "data/scripts/season2/Manhattan.json",
    "The Queen Is Dead":           "data/scripts/season2/The_Queen_Is_Dead.json",
    "The Miller's Daughter":       "data/scripts/season2/The_Millers_Daughter.json",
    "Welcome to Storybrooke":      "data/scripts/season2/Welcome_to_Storybrooke.json",
    "Selfless, Brave and True":    "data/scripts/season2/Selfless,_Brave_and_True.json",
    "Lacey":                       "data/scripts/season2/Lacey.json",
    "The Evil Queen":              "data/scripts/season2/The_Evil_Queen.json",
    "Second Star to the Right":    "data/scripts/season2/Second_Star_to_the_Right.json",
    "And Straight On 'Til Morning":"data/scripts/season2/And_Straight_On_Til_Morning.json"
  },
  "3": {
    "The Heart of the Truest Believer":"data/scripts/season3/The_Heart_of_the_Truest_Believer.json",
    "Lost Girl":                   "data/scripts/season3/Lost_Girl.json",
    "Quite a Common Fairy":        "data/scripts/season3/Quite_a_Common_Fairy.json",
    "Nasty Habits":                "data/scripts/season3/Nasty_Habits.json",
    "Good Form":                   "data/scripts/season3/Good_Form.json",
    "Ariel":                       "data/scripts/season3/Ariel.json",
    "Dark Hollow":                 "data/scripts/season3/Dark_Hollow.json",
    "Save Henry":                  "data/scripts/season3/Save_Henry.json",
    "The New Neverland":           "data/scripts/season3/The_New_Neverland.json",
    "Going Home":                  "data/scripts/season3/Going_Home.json",
    "New York City Serenade":      "data/scripts/season3/New_York_City_Serenade.json",
    "Witch Hunt":                  "data/scripts/season3/Witch_Hunt.json",
    "The Tower":                   "data/scripts/season3/The_Tower.json",
    "Quiet Minds":                 "data/scripts/season3/Quiet_Minds.json",
    "It's Not Easy Being Green":   "data/scripts/season3/Its_Not_Easy_Being_Green.json",
    "The Jolly Roger":             "data/scripts/season3/The_Jolly_Roger.json",
    "Bleeding Through":            "data/scripts/season3/Bleeding_Through.json",
    "A Curious Thing":             "data/scripts/season3/A_Curious_Thing.json",
    "Kansas":                      "data/scripts/season3/Kansas.json",
    "Snow Drifts":                 "data/scripts/season3/Snow_Drifts.json",
    "There's No Place Like Home":  "data/scripts/season3/Theres_No_Place_Like_Home.json"
  }
};


const CHAR_NAME_MAP = {
  "Emma":              "Emma Swan",
  "Emma Swan":         "Emma Swan",
  "Mary Margaret":     "Snow White / Mary Margaret",
  "Snow White":        "Snow White / Mary Margaret",
  "Snow":              "Snow White / Mary Margaret",
  "Regina":            "Regina / Evil Queen",
  "Evil Queen":        "Regina / Evil Queen",
  "The Evil Queen":    "Regina / Evil Queen",
  "Mr. Gold":          "Rumplestiltskin / Mr. Gold",
  "Rumplestiltskin":   "Rumplestiltskin / Mr. Gold",
  "Rumple":            "Rumplestiltskin / Mr. Gold",
  "Gold":              "Rumplestiltskin / Mr. Gold",
  "David":             "Prince Charming / David",
  "Prince Charming":   "Prince Charming / David",
  "Charming":          "Prince Charming / David",
  "Hook":              "Hook / Killian Jones",
  "Killian":           "Hook / Killian Jones",
  "Captain Hook":      "Hook / Killian Jones",
  "Henry":             "Henry",
  "Neal":              "Neal / Baelfire",
  "Baelfire":          "Neal / Baelfire",
  "Bae":               "Neal / Baelfire",
  "Belle":             "Belle",
  "Zelena":            "Zelena / Wicked Witch",
  "Wicked Witch":      "Zelena / Wicked Witch",
  "Cora":              "Cora / Queen of Hearts",
  "Queen of Hearts":   "Cora / Queen of Hearts",
  "Red":               "Red / Ruby",
  "Ruby":              "Red / Ruby",
  "August":            "August / Pinocchio",
  "Pinocchio":         "August / Pinocchio",
  "Jiminy":            "Jiminy Cricket / Archie",
  "Archie":            "Jiminy Cricket / Archie",
  "Jiminy Cricket":    "Jiminy Cricket / Archie",
  "Grumpy":            "Grumpy / Leroy",
  "Leroy":             "Grumpy / Leroy",
  "Graham":            "Graham / The Huntsman",
  "The Huntsman":      "Graham / The Huntsman",
  "Jefferson":         "Jefferson / Mad Hatter",
  "Mad Hatter":        "Jefferson / Mad Hatter",
  "Kathryn":           "Kathryn / Princess Abigail",
  "Princess Abigail":  "Kathryn / Princess Abigail",
  "Sidney":            "Sidney / Magic Mirror",
  "Magic Mirror":      "Sidney / Magic Mirror",
  "Geppetto":          "Geppetto / Marco",
  "Marco":             "Geppetto / Marco",
  "Dr. Whale":         "Dr. Whale / Frankenstein",
  "Frankenstein":      "Dr. Whale / Frankenstein",
  "Whale":             "Dr. Whale / Frankenstein",
  "Peter Pan":         "Peter Pan",
  "Pan":               "Peter Pan",
  "Robin Hood":        "Robin Hood",
  "Mulan":             "Mulan",
  "Aurora":            "Aurora",
  "Tinker Bell":       "Tinker Bell",
  "Tink":              "Tinker Bell",
  "Tamara":            "Tamara",
  "Blue Fairy":        "Blue Fairy",
  "Blue":              "Blue Fairy",
  "Ariel":             "Ariel",
  "Felix":             "Felix",
  "Granny":            "Granny",
  "Anton":             "Anton"
};

function normalizeName(raw) {
  return CHAR_NAME_MAP[raw] || raw;
}


const _cache = {};
function fetchEpisode(path) {
  if (_cache[path]) return Promise.resolve(_cache[path]);
  return d3.json(path).then(function(data) {
    _cache[path] = data;
    return data;
  });
}


function countLines(episodeDatas) {
  const lines = {};
  const epCounts = {};
  episodeDatas.forEach(function(ep) {
    const seenThisEp = new Set();
    (ep.scenes || []).forEach(function(scene) {
      (scene.dialog || []).forEach(function(d) {
        const raw = d.character;
        if (!raw || !raw.trim()) return;          // skip blank names
        const name = normalizeName(raw.trim());
        if (!name || !name.trim()) return;
        lines[name] = (lines[name] || 0) + 1;
        seenThisEp.add(name);
      });
    });
    seenThisEp.forEach(function(name) {
      epCounts[name] = (epCounts[name] || 0) + 1;
    });
  });
  return { lines, epCounts };
}

function countsToChartData(result) {
  
  return Object.entries(result.lines)
    .filter(function([name]) { return name && name.trim(); })
    .map(function([character, lines]) {
      return { character: character, lines: lines, episodes: result.epCounts[character] || 1 };
    })
    .sort(function(a, b) { return b.lines - a.lines; });
}


function populateEpisodes(season) {
  const epSel = document.getElementById("episode-filter");
  epSel.innerHTML = '<option value="all">All Episodes</option>';
  if (season === "all") return;
  Object.keys(EPISODE_FILES[season] || {}).forEach(function(ep) {
    const opt = document.createElement("option");
    opt.value = ep;
    opt.textContent = ep;
    epSel.appendChild(opt);
  });
}

async function updateChart() {
  const charFilter   = document.getElementById("char-filter").value;
  const seasonFilter = document.getElementById("season-filter").value;
  const epFilter     = document.getElementById("episode-filter").value;

  
  let pool;
  if (seasonFilter === "all") {
    pool = window._allCharData || [];
  } else if (epFilter !== "all") {
    const path = (EPISODE_FILES[seasonFilter] || {})[epFilter];
    if (!path) return;
    const epData = await fetchEpisode(path);
    pool = countsToChartData(countLines([epData]));
  } else {
    const paths = Object.values(EPISODE_FILES[seasonFilter] || {});
    const allEps = await Promise.all(paths.map(fetchEpisode));
    pool = countsToChartData(countLines(allEps));
  }

  let chartData;
  if (charFilter === "all") {
    
    chartData = pool.slice(0, 100);
  } else {
   
    chartData = pool.filter(function(d) { return d.character === charFilter; });

    // If not found in this scope (e.g. character absent from the episode),
    // fall back to their aggregate stats so a bubble always appears
    if (chartData.length === 0 && window._allCharData) {
      chartData = window._allCharData.filter(function(d) { return d.character === charFilter; });
    }
  }

  window.drawBubbleChart(chartData);
}


document.addEventListener("DOMContentLoaded", function() {
  
  function populateChars() {
    if (!window._allCharData) { setTimeout(populateChars, 100); return; }
    const sel = document.getElementById("char-filter");
    window._allCharData.forEach(function(d) {
      const opt = document.createElement("option");
      opt.value = d.character;
      opt.textContent = d.character;
      sel.appendChild(opt);
    });
  }
  populateChars();

  document.getElementById("season-filter").addEventListener("change", function() {
    populateEpisodes(this.value);
    updateChart();
  });

  document.getElementById("char-filter").addEventListener("change", updateChart);
  document.getElementById("episode-filter").addEventListener("change", updateChart);
});
