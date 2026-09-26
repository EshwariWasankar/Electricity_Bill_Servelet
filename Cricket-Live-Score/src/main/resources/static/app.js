const state = { matches: [], selectedId: "live-01", view: "live", outcome: null, detail: null, commentaryExpanded: false };
const $ = (selector) => document.querySelector(selector);
const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

async function loadMatches() {
  const response = await fetch("/api/matches");
  if (!response.ok) throw new Error("Could not load fixtures");
  state.matches = await response.json();
  if (!state.matches.some((match) => match.id === state.selectedId)) state.selectedId = state.matches[0]?.id;
  renderFixtures();
  if (state.view === "live") await loadDetail();
}

async function loadDetail() {
  if (!state.selectedId) return;
  const response = await fetch(`/api/matches/${encodeURIComponent(state.selectedId)}`);
  if (!response.ok) throw new Error("Could not load match details");
  state.detail = await response.json();
  renderMatch(state.detail);
}

function renderMatch(detail) {
  const match = detail.match;
  $("#match-meta").textContent = match.tournament;
  $("#ground-name").textContent = match.venue;
  $("#ground-small").textContent = `${match.venue.split(",").at(-1).trim()} · Innings in progress`;
  $("#home-name").textContent = match.home.name;
  $("#home-crest").textContent = match.home.shortName;
  $("#home-score").textContent = match.home.runs;
  $("#home-overs").textContent = `/${match.home.wickets} (${match.home.overs})`;
  $("#away-name").textContent = match.away.name;
  $("#away-crest").textContent = match.away.shortName;
  $("#away-score").textContent = match.away.runs;
  $("#away-overs").textContent = `/${match.away.wickets} (${match.away.overs})`;
  $("#home-innings-label").textContent = match.targetRuns ? "INNINGS 1 · COMPLETE" : "INNINGS 1 · LIVE";
  $("#away-innings-label").textContent = match.status === "RESULT" ? "INNINGS 2 · COMPLETE" : match.targetRuns ? "INNINGS 2 · LIVE" : "INNINGS 2 · NEXT";
  $("#match-equation").textContent = match.result || match.requiredRate;
  $("#batting-team-heading").textContent = match.battingTeam;
  const current = match.battingTeam === match.home.name ? match.home : match.away;
  const oversParts = current.overs.split(".").map(Number);
  const ballCount = oversParts[0] * 6 + (oversParts[1] || 0);
  const currentRate = ballCount ? (current.runs / (ballCount / 6)).toFixed(2) : "0.00";
  const isChase = match.battingTeam === match.away.name;
  const runsNeeded = Math.max(0, match.targetRuns - match.away.runs);
  const ballsLeft = Math.max(0, 120 - (Number(match.away.overs.split(".")[0]) * 6 + Number(match.away.overs.split(".")[1] || 0)));
  $("#current-rate").textContent = currentRate;
  $("#required-rate").textContent = isChase && ballsLeft ? (runsNeeded * 6 / ballsLeft).toFixed(2) : "—";
  $("#partnership").innerHTML = `${Math.max(0, current.runs % 43)} <small>(${Math.max(0, ballCount % 28)})</small>`;
  $("#last-six").innerHTML = detail.recentBalls.map((ball) => `<span class="ball ball-${ball === "W" ? "wicket" : ball === "4" || ball === "6" ? "boundary" : ball === "0" ? "dot" : "run"}">${safe(ball)}</span>`).join("");
  $("#batting-body").innerHTML = detail.battingCard.map((player) => {
    const strikeRate = player.balls ? (player.runs * 100 / player.balls).toFixed(1) : "—";
    return `<tr><td><strong>${safe(player.name)}</strong><small>${safe(player.role)}</small></td><td class="numeric strong-cell">${player.runs}</td><td class="numeric">${player.balls}</td><td class="numeric">${player.fours}</td><td class="numeric">${player.sixes}</td><td class="numeric">${strikeRate}</td><td class="status-cell">${safe(player.status)}</td></tr>`;
  }).join("");
  $("#bowling-body").innerHTML = detail.bowlingCard.map((player) => `<tr><td><strong>${safe(player.name)}</strong><small>${safe(player.role)}</small></td><td class="numeric strong-cell">${player.wickets}</td><td class="numeric">${safe(player.economy)}</td><td class="status-cell">${safe(player.status || "—")}</td></tr>`).join("");
  const latest = detail.commentary[0];
  $("#latest-call").innerHTML = latest ? `<span class="call-number">${safe(latest.over)}</span><p>${safe(latest.text)}</p>` : "";
  const olderCommentary = detail.commentary.slice(1);
  const visibleCommentary = state.commentaryExpanded ? olderCommentary : olderCommentary.slice(0, 4);
  $("#commentary-list").innerHTML = visibleCommentary.map((entry) => `<div class="commentary-item"><span>${safe(entry.over)}</span><p>${safe(entry.text)}</p></div>`).join("");
  $("#commentary-list").classList.toggle("expanded", state.commentaryExpanded);
  $("#commentary-more").classList.toggle("hidden", olderCommentary.length === 0);
  $("#commentary-more").setAttribute("aria-expanded", String(state.commentaryExpanded));
  $("#commentary-more").innerHTML = state.commentaryExpanded ? 'SHOW LESS <span>↑</span>' : 'VIEW FULL COMMENTARY <span>↗</span>';
  $("#record-button").disabled = match.status !== "LIVE";
  $("#record-button").querySelector("span:first-child").textContent = match.status === "LIVE" ? "Record ball" : "Innings complete";
  $("#end-innings-button").disabled = match.status !== "LIVE";
  $("#end-innings-button").textContent = match.battingTeam === match.home.name ? "End 1st innings" : "End 2nd innings";
}

function renderFixtures() {
  $("#fixture-count").textContent = `${String(state.matches.length).padStart(2, "0")} MATCHES`;
  $("#fixture-list").innerHTML = state.matches.map((match) => `<button class="fixture-row ${match.id === state.selectedId ? "selected" : ""}" data-match-id="${safe(match.id)}"><div class="fixture-detail"><span class="fixture-status ${match.status === "LIVE" ? "is-live" : ""}">${match.status === "LIVE" ? "<i></i> LIVE" : "RESULT"}</span><b>${safe(match.tournament)}</b><small>${safe(match.venue)}</small></div><div class="fixture-team"><span class="fixture-code">${safe(match.home.shortName)}</span><b>${match.home.runs}/${match.home.wickets}</b><small>${safe(match.home.overs)} ov</small></div><span class="fixture-vs">v</span><div class="fixture-team"><span class="fixture-code away-code">${safe(match.away.shortName)}</span><b>${match.away.runs}/${match.away.wickets}</b><small>${safe(match.away.overs)} ov</small></div><span class="fixture-result">${safe(match.result || match.requiredRate)}</span><span class="fixture-arrow">↗</span></button>`).join("");
  document.querySelectorAll(".fixture-row").forEach((row) => row.addEventListener("click", () => {
    state.selectedId = row.dataset.matchId;
    state.view = "live";
    switchView("live");
    loadDetail().catch(showError);
  }));
}

function switchView(view) {
  state.view = view;
  $("#live-view").classList.toggle("hidden", view !== "live");
  $("#fixtures-view").classList.toggle("hidden", view !== "fixtures");
  $("#page-title").innerHTML = view === "live" ? "Match <em>centre.</em>" : "Fixtures <em>& results.</em>";
  $("#page-subtitle").textContent = view === "live" ? "Every ball. Every moment. Right now." : "The league schedule, from first ball to final result.";
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === view));
  if (view === "live") loadDetail().catch(showError);
}

function setConnection(connected) {
  const indicator = $("#connection");
  indicator.classList.toggle("connected", connected);
  indicator.querySelector("span").textContent = connected ? "Live feed" : "Reconnecting";
}

function showError(error) {
  $("#desk-feedback").textContent = error.message || "Connection interrupted. Retrying…";
  setConnection(false);
}

async function recordBall() {
  const button = $("#record-button");
  button.disabled = true;
  $("#desk-feedback").textContent = "Sending update…";
  try {
    const response = await fetch(`/api/matches/${encodeURIComponent(state.selectedId)}/score`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome: state.outcome || undefined })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Score update failed");
    state.outcome = null;
    document.querySelectorAll(".outcome-picker button").forEach((choice) => choice.classList.remove("chosen"));
    $("#desk-feedback").textContent = "Score updated";
    await loadMatches();
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
  }
}

$(".primary-nav").addEventListener("click", (event) => {
  const view = event.target.closest("[data-view]")?.dataset.view;
  if (view) switchView(view);
});
document.querySelectorAll(".outcome-picker button").forEach((button) => button.addEventListener("click", () => {
  state.outcome = button.dataset.outcome === "·" ? "0" : button.dataset.outcome;
  document.querySelectorAll(".outcome-picker button").forEach((choice) => choice.classList.toggle("chosen", choice === button));
}));
$("#record-button").addEventListener("click", recordBall);
$("#refresh-button").addEventListener("click", () => loadMatches().catch(showError));
$("#commentary-more").addEventListener("click", () => {
  state.commentaryExpanded = !state.commentaryExpanded;
  if (state.detail) renderMatch(state.detail);
});
$("#end-innings-button").addEventListener("click", async () => {
  const button = $("#end-innings-button");
  button.disabled = true;
  $("#desk-feedback").textContent = "Completing innings…";
  try {
    const response = await fetch(`/api/matches/${encodeURIComponent(state.selectedId)}/innings/complete`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Could not complete innings");
    state.commentaryExpanded = true;
    $("#desk-feedback").textContent = payload.status === "LIVE" ? "Innings complete. Chase is live." : "Match complete.";
    await loadMatches();
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
  }
});

loadMatches().then(() => {
  const events = new EventSource("/api/events");
  events.addEventListener("open", () => setConnection(true));
  events.addEventListener("score-update", async (event) => {
    state.matches = JSON.parse(event.data);
    renderFixtures();
    if (state.view === "live") await loadDetail();
    setConnection(true);
  });
  events.addEventListener("error", () => setConnection(false));
}).catch(showError);
