const seasonSelect = document.getElementById("season-select");
const thresholdSelect = document.getElementById("threshold-select");
const maxEdgesSelect = document.getElementById("max-edges-select");
const selectedCharacterLabel = document.getElementById("selected-character");
const networkSummary = document.getElementById("network-summary");
const partnersList = document.getElementById("partners-list");
const svg = d3.select("#network-svg");
const chordSvg = d3.select("#chord-svg");

let focusCharacter = null;

let manifest = [];
let allEpisodes = [];
let characters = [];

// alias map copied from level2
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

function fixCharacterName(rawName) {
  if (!rawName) return "";

  const cleaned = String(rawName)
    .toLowerCase()
    .replace(/[':;,.()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return aliasMap[cleaned] || String(rawName).trim();
}

window.addEventListener("load", () => {
  loadPage();
});

async function loadPage() {
  try {
    const charStats = await d3.json("data/character_stats.json");
    manifest = await d3.json("data/script_manifest.json");

    characters = charStats.map((d) => d.character);

    // populate selects
    seasonSelect.innerHTML += [...new Set(manifest.map((m) => m.season))]
      .sort()
      .map((s) => `<option value="${s}">${s.replace("season", "Season ")}</option>`)
      .join("");

    // load episodes
    const episodeData = await Promise.all(manifest.map((m) => d3.json(`data/${m.path}`)));
    allEpisodes = episodeData.map((ep, i) => ({ ep, season: manifest[i].season }));

    seasonSelect.addEventListener("change", renderNetwork);
    thresholdSelect.addEventListener("change", renderNetwork);
    maxEdgesSelect.addEventListener("change", renderNetwork);
    maxEdgesSelect.addEventListener("input", renderNetwork);

    requestAnimationFrame(() => renderNetwork());
  } catch (err) {
    console.error("Data loading error:", err);
    const msg = `Failed to load data: ${err.message}`;
    if (svg && svg.node()) {
      svg.append("text").attr("x",20).attr("y",40).text(msg).style("fill", "white").style("font-size", "14px");
    }
    alert(msg);
  }
}

// build co-occurrence
function buildPairs(mode, seasonFilter) {
  const edgeCounts = new Map();
  const nodeCounts = new Map();

  for (const { ep, season } of allEpisodes) {
    if (seasonFilter && seasonFilter !== "all" && season !== seasonFilter) continue;

    for (const scene of ep.scenes || []) {
      const present = [];
      for (const line of scene.dialog || []) {
        const who = fixCharacterName(line.character);
        if (!who) continue;
        present.push(who);
        nodeCounts.set(who, (nodeCounts.get(who) || 0) + 1);
      }

      if (mode === "scene") {
        const unique = Array.from(new Set(present));
        for (let i = 0; i < unique.length; i++) {
          for (let j = i + 1; j < unique.length; j++) {
            const a = unique[i];
            const b = unique[j];
            const key = a < b ? `${a}|||${b}` : `${b}|||${a}`;
            edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
          }
        }
      } else if (mode === "adjacency") {
        for (let i = 0; i < present.length - 1; i++) {
          const a = present[i];
          const b = present[i + 1];
          if (!a || !b || a === b) continue;
          const key = a < b ? `${a}|||${b}` : `${b}|||${a}`;
          edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
        }
      }
    }
  }

  const nodesMap = new Map();
  for (const [name, cnt] of nodeCounts.entries()) nodesMap.set(name, { id: name, count: cnt });

  const edges = [];
  for (const [k, v] of edgeCounts.entries()) {
    const [a, b] = k.split("|||");
    if (!nodesMap.has(a)) nodesMap.set(a, { id: a, count: 0 });
    if (!nodesMap.has(b)) nodesMap.set(b, { id: b, count: 0 });
    edges.push({ source: a, target: b, value: v });
  }

  const nodes = Array.from(nodesMap.values());
  return { nodes, edges };
}

function renderNetwork() {
  const season = seasonSelect.value || "all";
  const threshold = Number(thresholdSelect.value) || 1;
  const maxEdges = Number(maxEdgesSelect.value) || 140;

  const { nodes, edges } = buildPairs("scene", season);

  // render both force graph and chord diagram
  renderForceGraph(nodes, edges, threshold, maxEdges);
  renderChord(nodes, edges, season);
}

function renderForceGraph(nodes, edges, threshold, maxEdges) {
  const filteredEdges = edges.filter((e) => e.value >= threshold);
  const edgeData = filteredEdges.map(e => ({ source: e.source, target: e.target, value: e.value }));

  // keep a larger slice when the threshold is low so the graph changes more visibly
  const displayBudget = Math.min(maxEdges, Math.max(80, Math.round(filteredEdges.length * 0.4)));

  // limit edges drawn to top-N by weight
  const topEdges = filteredEdges.slice().sort((a,b)=>b.value-a.value).slice(0, displayBudget);
  const nodeIds = new Set();
  topEdges.forEach((e) => { nodeIds.add(e.source); nodeIds.add(e.target); });
  const filteredNodes = nodes.filter((n) => nodeIds.has(n.id));

  if (networkSummary) {
    networkSummary.textContent = `Threshold ${threshold}: showing ${topEdges.length} of ${filteredEdges.length} matching ties.`;
  }

  svg.selectAll("*").remove();
  const width = svg.node().getBoundingClientRect().width || 900;
  const height = svg.node().getBoundingClientRect().height || 520;
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // create simulation
  const simulation = d3.forceSimulation(filteredNodes)
    .force("link", d3.forceLink(topEdges).id(d => d.id).distance(120).strength(0.15))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => 8 + Math.sqrt(d.count || 1) * 2))
    .velocityDecay(0.6);

  for (let i=0;i<300;i++) simulation.tick();
  simulation.stop();

  const link = svg.append("g").attr("stroke", "rgba(200,210,220,0.45)")
    .selectAll("line").data(topEdges).enter().append("line")
    .attr("stroke-width", d => Math.sqrt(d.value))
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  const node = svg.append("g").selectAll("g").data(filteredNodes).enter().append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
    .attr("r", d => 6 + Math.sqrt(d.count || 1))
    .attr("fill", (d, i) => color(i % 10))
    .attr("stroke", "rgba(10,10,10,0.4)")
    .on("mouseover", (event, d) => showTooltip(event, `${d.id}`))
    .on("mouseout", hideTooltip)
    .on("click", (event, d) => { focusCharacter = d.id; updatePartnersList(edgeData, focusCharacter); });

  node.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .attr("font-size", 11)
    .attr("fill", "#e6f2ef")
    .text(d => d.id)
    .style("pointer-events", "none");

  updatePartnersList(edgeData, focusCharacter);
}

function updatePartnersList(edges, focus) {
  if (!focus) {
    if (selectedCharacterLabel) selectedCharacterLabel.textContent = "Selected Character: All Characters";
    const top = edges.slice().sort((a,b) => b.value - a.value).slice(0,15);
    partnersList.innerHTML = top.length ? `<ul>${top.map(e => `<li><span>${escapeHtml(e.source)} — ${escapeHtml(e.target)}</span><strong>${e.value}</strong></li>`).join("")}</ul>` : '<div class="empty-state">No edges at this threshold.</div>';
    return;
  }

  if (selectedCharacterLabel) selectedCharacterLabel.textContent = `Selected Character: ${focus}`;
  const partners = [];
  for (const e of edges) {
    if (e.source === focus) partners.push({ partner: e.target, v: e.value });
    else if (e.target === focus) partners.push({ partner: e.source, v: e.value });
  }

  partners.sort((a,b) => b.v - a.v);
  partnersList.innerHTML = partners.length ? `<ul>${partners.slice(0,15).map(p => `<li><span>${escapeHtml(p.partner)}</span><strong>${p.v}</strong></li>`).join("")}</ul>` : '<div class="empty-state">No partners for this character in selection.</div>';
}

function updateStats(nodes, edges) {
  statsEl.innerHTML = `
    <ul>
      <li><span>Nodes</span><strong>${nodes.length}</strong></li>
      <li><span>Edges</span><strong>${edges.length}</strong></li>
    </ul>
  `;
}

function renderChord(nodes, edges, season) {
  // pick top characters by node count
  const top = nodes.slice().sort((a,b) => b.count - a.count).slice(0,12).map(d=>d.id);

  const index = new Map(top.map((d,i) => [d,i]));
  const matrix = Array.from({length: top.length}, () => new Array(top.length).fill(0));

  for (const { ep, season: s } of allEpisodes) {
    if (season && season !== 'all' && s !== season) continue;
    for (const scene of ep.scenes || []) {
      const present = Array.from(new Set((scene.dialog||[]).map(l => fixCharacterName(l.character)).filter(Boolean)));
      for (let i=0;i<present.length;i++){
        for (let j=i+1;j<present.length;j++){
          const a = present[i], b = present[j];
          if (index.has(a) && index.has(b)) {
            matrix[index.get(a)][index.get(b)] += 1;
            matrix[index.get(b)][index.get(a)] += 1;
          }
        }
      }
    }
  }

  chordSvg.selectAll("*").remove();
  const width = chordSvg.node().getBoundingClientRect().width || 480;
  const height = chordSvg.node().getBoundingClientRect().height || 380;
  const outerRadius = Math.min(width, height) * 0.35;
  const innerRadius = outerRadius - 18;

  const chord = d3.chord().padAngle(0.03).sortSubgroups(d3.descending)(matrix);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const ribbon = d3.ribbon().radius(innerRadius - 1);
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(top.length));

  const g = chordSvg.append('g').attr('transform', `translate(${width/2},${height/2})`);

  const group = g.append('g').selectAll('g').data(chord.groups).enter().append('g');

  group.append('path')
    .style('fill', d => color(d.index))
    .style('stroke', d => d3.rgb(color(d.index)).darker())
    .attr('d', arc)
    .on('mouseover', (event, d) => showTooltip(event, `${top[d.index]} (${d.value} connections)`))
    .on('mouseout', hideTooltip);

  group.append('text')
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr('dy', '.35em')
    .attr('transform', d => `rotate(${(d.angle * 180 / Math.PI - 90)}) translate(${innerRadius + 6}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`)
    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .text(d => truncate(top[d.index], 16))
    .style('fill', '#f3fbf9')
    .style('font-size', 10);

  g.append('g')
    .attr('fill-opacity', 0.75)
    .selectAll('path')
    .data(chord)
    .enter().append('path')
    .attr('d', ribbon)
    .style('fill', d => color(d.source.index))
    .style('stroke', d => d3.rgb(color(d.source.index)).darker())
    .on('mouseover', (event, d) => showTooltip(event, `${top[d.source.index]} → ${top[d.target.index]}: ${matrix[d.source.index][d.target.index]}`))
    .on('mouseout', hideTooltip);

  // update partner list for chord
  if (focusCharacter === null) {
    if (selectedCharacterLabel) selectedCharacterLabel.textContent = "Selected Character: All Characters";
    const partners = top.map((id, i) => ({ id, total: matrix[i].reduce((a,b)=>a+b,0) }));
    partners.sort((a,b)=>b.total-a.total);
    partnersList.innerHTML = `<ul>${partners.slice(0,15).map(p => `<li><span>${escapeHtml(p.id)}</span><strong>${p.total}</strong></li>`).join('')}</ul>`;
  }
}

function fixCharacter(raw) {
  return fixCharacterName(raw);
}

function truncate(s, n) { return s.length>n? s.slice(0,n-1)+'…': s; }

function showTooltip(event, html) {
  let tt = document.getElementById('tooltip');
  if (!tt) {
    tt = document.createElement('div');
    tt.id = 'tooltip';
    document.body.appendChild(tt);
  }
  tt.style.color = '#fff';
  tt.style.display = 'block';
  tt.style.left = (event.pageX + 12) + 'px';
  tt.style.top = (event.pageY + 12) + 'px';
  tt.innerHTML = `<div class="tooltip-title" style="color:#fff;">${escapeHtml(html)}</div>`;
}

function hideTooltip() {
  const tt = document.getElementById('tooltip');
  if (tt) tt.style.display = 'none';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
