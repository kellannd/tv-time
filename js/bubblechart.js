d3.json("data/character_stats.json").then(function(data) {

  data = data.slice(0, 40);

  const width = 900;
  const height = 900;

  const format = d3.format(",d");

  const color = d3.scaleOrdinal(d3.schemeTableau10);

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
      .attr("style", "max-width: 100%; height: auto; font: 11px sans-serif;")
      .attr("text-anchor", "middle");

  const node = svg.append("g")
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);


  node.append("title")
    .text(d => `${d.data.character}\n${format(d.data.lines)} lines\n${d.data.episodes} episodes`);

  
  node.append("circle")
    .attr("fill-opacity", 0.8)
    .attr("fill", d => color(d.data.character))
    .attr("r", d => d.r);

  
  const text = node.append("text")
    .attr("clip-path", d => `circle(${d.r})`);

  text.append("tspan")
    .attr("x", 0)
    .attr("y", "-0.6em")
    .attr("font-weight", "bold")
    .text(d => d.data.character);

  text.append("tspan")
    .attr("x", 0)
    .attr("y", "0.6em")
    .attr("fill-opacity", 0.85)
    .text(d => `${format(d.data.lines)} lines`);

  text.append("tspan")
    .attr("x", 0)
    .attr("y", "1.7em")
    .attr("fill-opacity", 0.85)
    .text(d => `${d.data.episodes} eps`);
});
