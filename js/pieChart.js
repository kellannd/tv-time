class Pie {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 625,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 80, right: 20, bottom: 50, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15,
      onClick: _config.onClick || null
    };
    this.data = _data;
    this.initVis();
  }

  initVis(){
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.radius = Math.min(vis.width - 200, vis.height - 200) / 2;

    // SVG
    vis.svg = d3
  .select(vis.config.parentElement)
  .append("svg")
  .attr("width", vis.config.containerWidth)
  .attr("height", vis.config.containerHeight);

    // Main chart group
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(
          ${vis.config.containerWidth / 2},
          ${vis.config.containerHeight / 2}
        )`
      );

    // Color scale
    vis.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // Pie generator
    vis.pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    // Arc generator
    vis.arc = d3
      .arc()
      .innerRadius(0) // set > 0 for donut chart
      .outerRadius(vis.radius);

    vis.outerArc = d3
  .arc()
  .innerRadius(vis.radius * 1.1)
  .outerRadius(vis.radius * 1.1);

    vis.updateVis();
  }

  updateVis(newData) {
  let vis = this;

  if (newData) {
    vis.data = newData;
  }

  const pieData = vis.pie(vis.data);

  const arcs = vis.chart
    .selectAll(".arc")
    .data(pieData);

  const arcsEnter = arcs
    .enter()
    .append("g")
    .attr("class", "arc");

  // SLICES
  arcsEnter
    .append("path")
    .merge(arcs.select("path"))
    .attr("d", vis.arc)
    .attr("fill", (d, i) => vis.colorScale(i))
    .on("mouseover", (event, d) => {
      d3.select("#tooltip")
        .style("display", "block")
        .style("left", event.pageX + vis.config.tooltipPadding + "px")
        .style("top", event.pageY + vis.config.tooltipPadding + "px")
        .html(`
          <p><strong>${d.data.name}</strong></p>
          <p>Value: ${d.data.value}</p>
        `);
    })
    .on("mousemove", (event) => {
      d3.select("#tooltip")
        .style("left", event.pageX + vis.config.tooltipPadding + "px")
        .style("top", event.pageY + vis.config.tooltipPadding + "px");
    })
    .on("mouseleave", () => {
      d3.select("#tooltip").style("display", "none");
    })
    .transition()
    .duration(750)
    .attr("d", vis.arc);

  const midAngle = (d) =>
  d.startAngle + (d.endAngle - d.startAngle) / 2;

  // LABELS
  arcsEnter
  .append("text")
  .merge(arcs.select("text"))
  .transition()
  .duration(750)
  .attr("transform", (d) => {
    const pos = vis.outerArc.centroid(d);

    // move labels left/right depending on slice side
    pos[0] = vis.radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);

    return `translate(${pos})`;
  })
  .attr("text-anchor", (d) =>
    midAngle(d) < Math.PI ? "start" : "end"
  )
  .text((d) => {
      const percent =
    (d.data.value / d3.sum(vis.data, d => d.value)) * 100;

  if (d.data.name === "Other") {
    return percent > 5 ? "Other or Not Specified" : ""
  }

  return percent > 5 ? d.data.name : "";
})
  .attr("fill", "white");

  // POLYLINES
arcsEnter
  .append("polyline")
  .merge(arcs.select("polyline"))
  .transition()
  .duration(750)
  .attr("points", (d) => {
    const percent =
    (d.data.value / d3.sum(vis.data, d => d.value)) * 100;
    if (percent <= 5) return null;

    const posA = vis.arc.centroid(d); // slice center
    const posB = vis.outerArc.centroid(d); // line bend
    const posC = vis.outerArc.centroid(d); // label position

    posC[0] = vis.radius * 1.05 * (midAngle(d) < Math.PI ? 1 : -1);

    return [posA, posB, posC];
  })
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 1);

  arcs.exit().remove();
}
}
