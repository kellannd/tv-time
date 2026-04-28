d3.json("data/character_stats.json").then(function(data) {

  data = data.slice(0, 40);

  const width = 900;
  const height = 900;

  const format = d3.format(",d");

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const characterImages = {
    "Belle": "images/characters/Belle.png",
    "Emma Swan": "images/characters/Emma.png",
    "Regina / Evil Queen": "images/characters/Evil Queen.png",
    "Henry": "images/characters/Henry.png",
    "Hook / Killian Jones": "images/characters/Hook.png",
    "Neal / Baelfire": "images/characters/Neal.png",
    "Prince Charming / David": "images/characters/Prince Charming.png",
    "Rumplestiltskin / Mr. Gold": "images/characters/Rumple.png",
    "Snow White / Mary Margaret": "images/characters/Snow White.png",
    "Zelena / Wicked Witch": "images/characters/Wicked Witch.png"
  };

  function patternId(name) {
    return "img-" + name.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
  }

  const pack = d3.pack()
    .size([width - 2, height - 2])
    .padding(4);

  const root = pack(
    d3.hierarchy({ children: data })
      .sum(d => d.lines)
  );

  const svg = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-1, -1, width, height])
      .attr("style", "max-width: 100%; height: auto; font-family: Georgia, 'Times New Roman', serif; font-size: 11px;")
      .attr("text-anchor", "middle");

  const defs = svg.append("defs");
  Object.entries(characterImages).forEach(([name, imgPath]) => {
    const pid = patternId(name);
    const pattern = defs.append("pattern")
      .attr("id", pid)
      .attr("patternUnits", "objectBoundingBox")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pattern.append("image")
      .attr("href", imgPath)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1)
      .attr("preserveAspectRatio", "xMidYMid slice");
  });

  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "rgba(5,13,29,0.93)")
    .style("color", "#f4f4f2")
    .style("padding", "16px 22px")
    .style("border-radius", "12px")
    .style("border", "1px solid rgba(210,227,255,0.2)")
    .style("font", "15px Georgia, 'Times New Roman', serif")
    .style("line-height", "1.8")
    .style("opacity", 0)
    .style("transition", "opacity 0.15s");

  const node = svg.append("g")
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
    .attr("fill-opacity", 0.85)
    .attr("fill", d => characterImages[d.data.character]
      ? `url(#${patternId(d.data.character)})`
      : color(d.data.character))
    .attr("r", d => d.r)
    .on("mouseover", function(_event, d) {
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.data.character}</strong><br>${format(d.data.lines)} lines &nbsp;·&nbsp; ${d.data.episodes} episodes`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 14) + "px")
        .style("top", (event.pageY - 36) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });

  const MIN_R_STATS = 55;

  const text = node.append("text")
    .attr("clip-path", d => `circle(${d.r})`)
    .attr("fill", "#ffffff")
    .attr("stroke", "rgba(0,0,0,0.7)")
    .attr("stroke-width", 3)
    .attr("paint-order", "stroke fill")
    .attr("font-weight", "bold");

  text.append("tspan")
    .attr("x", 0)
    .attr("y", d => d.r >= MIN_R_STATS ? "-0.5em" : "0.35em")
    .attr("font-size", d => Math.min(13, Math.floor(d.r / 3.5)) + "px")
    .text(d => {
      const short = d.data.character.split(" / ")[0];
      const fs = Math.min(13, Math.floor(d.r / 3.5));
      const maxChars = Math.floor((d.r * 1.8) / (fs * 0.6));
      return short.length > maxChars ? short.slice(0, maxChars - 1) + "…" : short;
    });

  text.filter(d => d.r >= MIN_R_STATS).append("tspan")
    .attr("x", 0)
    .attr("y", "0.75em")
    .attr("font-size", d => Math.min(11, Math.floor(d.r / 5)) + "px")
    .attr("stroke-width", 2)
    .text(d => `${format(d.data.lines)} lines`);

  text.filter(d => d.r >= MIN_R_STATS).append("tspan")
    .attr("x", 0)
    .attr("y", "1.85em")
    .attr("font-size", d => Math.min(11, Math.floor(d.r / 5)) + "px")
    .attr("stroke-width", 2)
    .text(d => `${d.data.episodes} eps`);
});
