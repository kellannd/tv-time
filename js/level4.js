let data, locPieChart, tensePieChart;
let s1Btn = false,
  s2Btn = false,
  s3Btn = false;
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

let season1 = [
  "Pilot",
  "The Thing You Love Most",
  "Snow Falls",
  "The Price of Gold",
  "That Still Small Voice",
  "The Shepherd",
  "The Heart Is a Lonely Hunter",
  "Desperate Souls",
  "True North",
  "7:15 A.M.",
  "Fruit of the Poisonous Tree",
  "Skin Deep",
  "What Happened to Frederick",
  "Dreamy",
  "Red-Handed",
  "Heart of Darkness",
  "Hat Trick",
  "The Stable Boy",
  "The Return",
  "The Stranger",
  "An Apple Red as Blood",
  "A Land Without Magic",
];
let season2 = [
  "Broken",
  "We Are Both",
  "Lady of the Lake",
  "The Crocodile",
  "The Doctor",
  "Tallahassee",
  "Child of the Moon",
  "Into the Deep",
  "Queen of Hearts",
  "The Cricket Game",
  "The Outsider",
  "In the Name of the Brother",
  "Tiny",
  "Manhattan",
  "The Queen Is Dead",
  "The Miller's Daughter",
  "Welcome to Storybrooke",
  "Selfish",
  "The Evil Queen",
  "The Page 23",
  "Second Star to the Right",
  "And Straight On 'Til Morning",
];
let season3 = [
  "The Heart of the Truest Believer",
  "Lost Girl",
  "Quite a Common Fairy",
  "Nasty Habits",
  "Good Form",
  "Ariel",
  "Dark Hollow",
  "Think Lovely Thoughts",
  "Save Henry",
  "The New Neverland",
  "Going Home",
  "New York City Serenade",
  "Witch Hunt",
  "The Tower",
  "Quiet Minds",
  "It's Not Easy Being Green",
  "The Jolly Roger",
  "Bleeding Through",
  "A Curious Thing",
  "Kansas",
  "Snow Drifts",
  "There's No Place Like Home",
];

d3.json("data/scenes_info.json").then((_data) => {
  data = _data;

  const { locChart, tenseChart } = formatData(data);

  locPieChart = new Pie({ parentElement: "#locationChart" }, locChart);

  tensePieChart = new Pie({ parentElement: "#tenseChart" }, tenseChart);
});

// populates dropdown
function dropdown() {
  const dropdown = document.getElementById("episodes");

  let placeholder = document.createElement("option");
  placeholder.label = "Select an option";
  placeholder.selected = true;
  dropdown.append(placeholder);

  let s1Section = document.createElement("optgroup");
  s1Section.label = "Season 1";
  dropdown.append(s1Section);

  let episode;
  for (ep in season1) {
    episode = document.createElement("option");
    episode.value = season1[ep];
    episode.innerHTML = season1[ep];

    if (season1[ep] == "Dreamy") {
      episode.disabled = true;
    }

    dropdown.append(episode);
  }

  let s2Section = document.createElement("optgroup");
  s2Section.label = "Season 2";
  dropdown.append(s2Section);

  for (ep in season2) {
    episode = document.createElement("option");
    episode.value = season2[ep];
    episode.innerHTML = season2[ep];

    dropdown.append(episode);
  }

  let s3Section = document.createElement("optgroup");
  s3Section.label = "Season 3";
  dropdown.append(s3Section);

  for (ep in season3) {
    episode = document.createElement("option");
    episode.value = season3[ep];
    episode.innerHTML = season3[ep];

    if (season3[ep] == "Think Lovely Thoughts") {
      episode.disabled = true;
    }

    dropdown.append(episode);
  }
}

dropdown();

const element = document.querySelector("#episodes");

element.addEventListener("change", (event) => {
  let episode = "";
  for (ep in data) {
    if (data[ep]["episode"] == event.target.value) {
      episode = data[ep];
    }
  }

  let locChart, tenseChart;
  if (episode) {
    ({ locChart, tenseChart } = formatData([episode]));
  } else {
    ({ locChart, tenseChart } = formatData(data));
  }
  locPieChart.updateVis(locChart);
  tensePieChart.updateVis(tenseChart);
});

d3.select("#season1").on("click", function (event, d) {
  s1Btn = !s1Btn;
  getBySeason();
});

d3.select("#season2").on("click", function (event, d) {
  s2Btn = !s2Btn;
  getBySeason();
});

d3.select("#season3").on("click", function (event, d) {
  s3Btn = !s3Btn;
  getBySeason();
});

function getBySeason() {
  updateData = [];
  for (const ep in data) {
    if (s1Btn) {
      if (data[ep]["season"] == "season1") {
        updateData.push(data[ep]);
      }
    }
    if (s2Btn) {
      if (data[ep]["season"] == "season2") {
        updateData.push(data[ep]);
      }
    }
    if (s3Btn) {
      if (data[ep]["season"] == "season3") {
        updateData.push(data[ep]);
      }
    }
  }

  const { locChart, tenseChart } = formatData(updateData);

  locPieChart.updateVis(locChart);
  tensePieChart.updateVis(tenseChart);
}

function formatData(input) {
  const locChart = [
    { name: "Storybrooke", value: 0 },
    { name: "The Enchanted Forest", value: 0 },
    { name: "Other", value: 0 },
  ];

  const tenseChart = [
    { name: "Past", value: 0 },
    { name: "Present", value: 0 },
    { name: "Other", value: 0 },
  ];

  for (const entry of input) {
    locChart[0].value += entry.SB_Count;
    locChart[1].value += entry.EF_Count;
    locChart[2].value += entry.Other_Loc_Count;

    tenseChart[0].value += entry.PastScenes;
    tenseChart[1].value += entry.PresentScenes;
    tenseChart[2].value += entry.OtherScenes;
  }

  return { locChart, tenseChart };
}
