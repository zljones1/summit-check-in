// @ts-nocheck
const maxAttendees = 50;
const storageKey = "summit-checkins-v1";

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const teamColors = {
  water: { color: "#0b6e91", backgroundColor: "#e7f6fb" },
  zero: { color: "#0f7a4b", backgroundColor: "#e8f8ef" },
  power: { color: "#b45309", backgroundColor: "#fff6e8" },
};

function element(tag, text) {
  const node = document.createElement(tag);
  node.style.boxSizing = "border-box";
  if (text) node.textContent = text;
  return node;
}

function paint(node, rules) {
  const keys = Object.keys(rules);
  for (let i = 0; i < keys.length; i++) {
    node.style[keys[i]] = rules[keys[i]];
  }
  return node;
}

function isTeam(value) {
  return value === "water" || value === "zero" || value === "power";
}

export function mountSummit(root) {
  const assets =
    document.body.dataset.summitHost === "react"
      ? { bg: "/summit/bg.jpg", logo: "/summit/intel-logo.svg" }
      : { bg: "img/bg.jpg", logo: "img/intel-logo.svg" };

  if (root === document.body) {
    document.body.style.margin = "0";
  }

  root.replaceChildren();
  const app = element("div");
  app.id = "summit-app";
  paint(app, {
    minHeight: "100vh",
    margin: "0",
    fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
    backgroundColor: "#eef3f8",
    color: "#10243d",
    lineHeight: "1.5",
  });
  root.appendChild(app);

  const hero = element("header");
  paint(hero, { position: "relative", overflow: "hidden", color: "#ffffff", textAlign: "center" });
  const photo = document.createElement("img");
  photo.alt = "";
  photo.src = assets.bg;
  paint(photo, {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  });
  const scrim = element("div");
  paint(scrim, {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    backgroundImage:
      "linear-gradient(135deg, rgba(0,113,197,0.9), rgba(0,90,158,0.88) 52%, rgba(0,60,116,0.92))",
  });
  const heroContent = element("div");
  paint(heroContent, {
    position: "relative",
    maxWidth: "48rem",
    margin: "0 auto",
    padding: "3.5rem 1.25rem 4.5rem",
  });
  const logo = document.createElement("img");
  logo.alt = "Intel";
  logo.src = assets.logo;
  paint(logo, {
    display: "block",
    height: "2.75rem",
    margin: "0 auto 1.5rem",
    filter: "brightness(0) invert(1)",
  });
  const title = element("h1", "Team Sustainability Summit");
  paint(title, {
    margin: "0",
    fontFamily: '"Arial Narrow", Impact, sans-serif',
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    lineHeight: "1.05",
  });
  const divider = element("div");
  paint(divider, { width: "6rem", height: "2px", margin: "1.25rem auto", backgroundColor: "#00aeef" });
  const subtitle = element("p", "Check-in for sustainability event attendees");
  paint(subtitle, { margin: "0", fontSize: "1.15rem", fontWeight: "300" });
  heroContent.append(logo, title, divider, subtitle);
  hero.append(photo, scrim, heroContent);

  const wrap = element("main");
  const panel = element("section");
  paint(panel, {
    padding: "1.75rem 1.25rem 2rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "1rem",
    boxShadow: "0 18px 50px -28px rgba(0,60,116,0.55)",
  });

  const attendance = element("p", "Attendance ");
  paint(attendance, {
    display: "flex",
    gap: "0.4rem",
    alignItems: "baseline",
    justifyContent: "center",
    margin: "0",
    color: "#5c6e86",
  });
  const countEl = element("span", "0");
  countEl.id = "attendeeCount";
  paint(countEl, { color: "#0071c5", fontWeight: "800", fontSize: "1.6rem", fontVariantNumeric: "tabular-nums" });
  const percentEl = element("span", "0%");
  percentEl.id = "percentLabel";
  paint(percentEl, { color: "#0071c5", fontWeight: "800", fontVariantNumeric: "tabular-nums" });
  attendance.append(countEl, document.createTextNode(" / " + maxAttendees + " "), percentEl);

  const track = element("div");
  track.id = "progressTrack";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  track.setAttribute("aria-valuenow", "0");
  track.setAttribute("aria-label", "Share of the attendance goal");
  paint(track, {
    width: "min(100%, 32rem)",
    height: "1rem",
    margin: "1rem auto 0",
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
  });
  const bar = element("div");
  bar.id = "progressBar";
  paint(bar, {
    width: "0%",
    height: "100%",
    backgroundImage: "linear-gradient(90deg, #0071c5, #00aeef)",
    borderRadius: "999px",
  });
  track.appendChild(bar);

  const celebration = element("div");
  celebration.id = "celebration";
  celebration.hidden = true;
  paint(celebration, {
    marginTop: "1.5rem",
    padding: "1.25rem 1rem",
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#003c74",
    borderRadius: "0.8rem",
  });
  const greeting = element("p");
  greeting.id = "greeting";
  greeting.hidden = true;
  paint(greeting, {
    margin: "1.5rem 0 0",
    padding: "0.85rem 1rem",
    textAlign: "center",
    fontWeight: "600",
    color: "#003c71",
    backgroundColor: "#e8f4fc",
    borderRadius: "0.6rem",
  });

  const form = document.createElement("form");
  form.id = "checkInForm";
  paint(form, { marginTop: "1.5rem", padding: "1.25rem", backgroundColor: "#f7fafc", borderRadius: "1rem" });
  const label = element("label", "Attendee check-in");
  label.htmlFor = "attendeeName";
  paint(label, { display: "block", marginBottom: "0.75rem", color: "#5c6e86", fontSize: "0.9rem", fontWeight: "600" });
  const formGroup = element("div");
  const inputs = element("div");
  paint(inputs, { flex: "1", minWidth: "0" });
  const nameInput = document.createElement("input");
  nameInput.id = "attendeeName";
  nameInput.type = "text";
  nameInput.placeholder = "Enter name...";
  nameInput.maxLength = 60;
  nameInput.required = true;
  const teamSelect = document.createElement("select");
  teamSelect.id = "teamSelect";
  teamSelect.required = true;
  const placeholder = element("option", "Select team...");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  teamSelect.appendChild(placeholder);
  const teamIds = ["water", "zero", "power"];
  for (let i = 0; i < teamIds.length; i++) {
    const option = element("option", teamLabels[teamIds[i]]);
    option.value = teamIds[i];
    teamSelect.appendChild(option);
  }
  const checkInBtn = element("button", "Check in");
  checkInBtn.id = "checkInBtn";
  checkInBtn.type = "submit";
  paint(checkInBtn, {
    height: "3.5rem",
    padding: "0 1.4rem",
    color: "#ffffff",
    fontWeight: "700",
    backgroundColor: "#0071c5",
    border: "0",
    borderRadius: "0.75rem",
    whiteSpace: "nowrap",
    cursor: "pointer",
  });
  checkInBtn.addEventListener("mouseenter", function () {
    if (!checkInBtn.disabled) checkInBtn.style.backgroundColor = "#005a9e";
  });
  checkInBtn.addEventListener("mouseleave", function () {
    checkInBtn.style.backgroundColor = "#0071c5";
  });
  inputs.append(nameInput, teamSelect);
  formGroup.append(inputs, checkInBtn);
  form.append(label, formGroup);

  function fieldLook(node) {
    paint(node, {
      height: "3.5rem",
      padding: "0 1rem",
      color: "#10243d",
      backgroundColor: "#ffffff",
      border: "2px solid #e2e8f0",
      borderRadius: "0.75rem",
      font: "inherit",
    });
    node.addEventListener("focus", function () {
      node.style.borderColor = "#0071c5";
      node.style.outline = "none";
    });
    node.addEventListener("blur", function () {
      node.style.borderColor = "#e2e8f0";
    });
  }
  fieldLook(nameInput);
  fieldLook(teamSelect);
  paint(nameInput, { flex: "1", minWidth: "0" });

  const teamSection = element("section");
  paint(teamSection, { marginTop: "2rem", paddingTop: "1.6rem", borderTop: "1px solid #e2e8f0" });
  const teamHeading = element("h2", "Team attendance");
  paint(teamHeading, {
    margin: "0",
    color: "#5c6e86",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textAlign: "center",
    textTransform: "uppercase",
  });
  const grid = element("div");
  paint(grid, { display: "grid", gap: "0.75rem", marginTop: "1rem" });
  const cards = {};
  const counts = {};
  const shorts = { water: "Water Wise", zero: "Net Zero", power: "Renewables" };
  for (let i = 0; i < teamIds.length; i++) {
    const id = teamIds[i];
    const card = element("article");
    card.id = id + "Card";
    paint(card, {
      display: "flex",
      flexDirection: "column",
      gap: "0.35rem",
      padding: "1rem",
      borderRadius: "0.75rem",
      color: teamColors[id].color,
      backgroundColor: teamColors[id].backgroundColor,
    });
    const count = element("span", "0");
    count.id = id + "Count";
    paint(count, { fontSize: "1.8rem", fontWeight: "800", fontVariantNumeric: "tabular-nums" });
    card.append(element("span", shorts[id]), count);
    cards[id] = card;
    counts[id] = count;
    grid.appendChild(card);
  }
  teamSection.append(teamHeading, grid);

  const listSection = element("section");
  paint(listSection, { marginTop: "2rem", paddingTop: "1.6rem", borderTop: "1px solid #e2e8f0" });
  const listHead = element("div");
  paint(listHead, { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" });
  const listHeading = element("h2", "Attendees");
  paint(listHeading, {
    margin: "0",
    color: "#5c6e86",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  });
  const resetBtn = element("button", "Reset roster");
  resetBtn.id = "resetBtn";
  resetBtn.type = "button";
  resetBtn.disabled = true;
  paint(resetBtn, {
    border: "0",
    backgroundColor: "transparent",
    color: "#5c6e86",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "not-allowed",
  });
  resetBtn.addEventListener("mouseenter", function () {
    if (!resetBtn.disabled) resetBtn.style.color = "#0071c5";
  });
  resetBtn.addEventListener("mouseleave", function () {
    resetBtn.style.color = "#5c6e86";
  });
  listHead.append(listHeading, resetBtn);
  const list = element("ul");
  list.id = "attendeeList";
  paint(list, {
    margin: "1rem 0 0",
    padding: "0",
    overflow: "auto",
    maxHeight: "20rem",
    listStyle: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
  });
  const empty = element("p", "No attendees yet. Add a name and a team to start the count.");
  empty.id = "emptyList";
  paint(empty, {
    margin: "1rem 0 0",
    padding: "2rem 1rem",
    textAlign: "center",
    color: "#5c6e86",
    border: "1px dashed #e2e8f0",
    borderRadius: "0.75rem",
  });
  listSection.append(listHead, list, empty);

  panel.append(attendance, track, celebration, greeting, form, teamSection, listSection);
  wrap.appendChild(panel);

  const footer = element("footer");
  paint(footer, { padding: "1.25rem 1rem 2.5rem", textAlign: "center", color: "#5c6e86", fontSize: "0.9rem" });
  footer.appendChild(document.createTextNode("Team Sustainability Summit · "));
  const goals = element("a", "Sustainability goals");
  goals.href = "https://www.intel.com/content/www/us/en/corporate-responsibility/2030-goals.html";
  paint(goals, { color: "inherit" });
  goals.addEventListener("mouseenter", function () {
    goals.style.color = "#0071c5";
  });
  goals.addEventListener("mouseleave", function () {
    goals.style.color = "inherit";
  });
  footer.appendChild(goals);
  app.append(hero, wrap, footer);

  function applyLayout() {
    const narrow = window.matchMedia("(max-width: 720px)").matches;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const titlePx = Math.max(38, Math.min(54, window.innerWidth * 0.06));
    title.style.fontSize = titlePx + "px";
    paint(wrap, {
      width: narrow ? "calc(100% - 1.5rem)" : "min(100% - 1.5rem, 44rem)",
      margin: "-1.5rem auto 0",
      paddingBottom: "0.5rem",
    });
    paint(formGroup, { display: "flex", gap: "0.75rem", flexDirection: narrow ? "column" : "row" });
    paint(inputs, { display: "flex", gap: "0.75rem", flex: "1", minWidth: "0", flexDirection: narrow ? "column" : "row" });
    nameInput.style.width = narrow ? "100%" : "";
    teamSelect.style.width = narrow ? "100%" : "";
    teamSelect.style.minWidth = narrow ? "0" : "11rem";
    checkInBtn.style.width = narrow ? "100%" : "";
    grid.style.gridTemplateColumns = narrow ? "1fr" : "repeat(3, 1fr)";
    bar.style.transition = motion ? "none" : "width 0.6s ease";
    if (list.childElementCount === 0) list.style.display = "none";
  }

  let attendees = [];

  function countForTeam(team) {
    let total = 0;
    for (let i = 0; i < attendees.length; i++) {
      if (attendees[i].team === team) total += 1;
    }
    return total;
  }

  function leaders() {
    let top = 0;
    const ranked = [];
    for (let i = 0; i < teamIds.length; i++) {
      const count = countForTeam(teamIds[i]);
      ranked.push({ team: teamIds[i], count: count });
      if (count > top) top = count;
    }
    const winning = [];
    if (top === 0) return winning;
    for (let i = 0; i < ranked.length; i++) {
      if (ranked[i].count === top) winning.push(ranked[i]);
    }
    return winning;
  }

  function loadAttendees() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      const rows = Array.isArray(parsed) ? parsed : parsed && parsed.attendees;
      if (!Array.isArray(rows)) return [];
      const clean = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || typeof row.name !== "string" || !isTeam(row.team)) continue;
        const name = row.name.trim().replace(/\s+/g, " ");
        if (!name) continue;
        clean.push({
          id: typeof row.id === "string" ? row.id : String(Date.now()) + "-" + i,
          name: name,
          team: row.team,
          at: typeof row.at === "number" ? row.at : Date.now(),
        });
        if (clean.length >= maxAttendees) break;
      }
      return clean;
    } catch (error) {
      return [];
    }
  }

  function saveAttendees() {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        total: attendees.length,
        teams: {
          water: countForTeam("water"),
          zero: countForTeam("zero"),
          power: countForTeam("power"),
        },
        attendees: attendees,
      }),
    );
  }

  function render() {
    const total = attendees.length;
    const percent = Math.round((Math.max(0, Math.min(total, maxAttendees)) / maxAttendees) * 100);
    const full = total >= maxAttendees;
    const winning = leaders();

    countEl.textContent = String(total);
    percentEl.textContent = percent + "%";
    bar.style.width = percent + "%";
    track.setAttribute("aria-valuenow", String(percent));

    for (let i = 0; i < teamIds.length; i++) {
      const team = teamIds[i];
      counts[team].textContent = String(countForTeam(team));
      const solo = winning.length === 1 && winning[0].team === team && winning[0].count > 0;
      cards[team].style.boxShadow = solo ? "inset 0 0 0 2px " + teamColors[team].color : "none";
    }

    celebration.replaceChildren();
    if (full && winning.length > 0) {
      let winTitle = "";
      let detail = "";
      if (winning.length === 1) {
        winTitle = teamLabels[winning[0].team] + " wins";
        detail = winning[0].count + " attendees checked in. The goal of " + maxAttendees + " is complete.";
      } else {
        const names = [];
        for (let i = 0; i < winning.length; i++) names.push(teamLabels[winning[i].team]);
        winTitle = names.join(" and ") + " tie";
        detail = "Each has " + winning[0].count + " attendees. The goal of " + maxAttendees + " is complete.";
      }
      celebration.hidden = false;
      const kicker = element("p", "Goal reached");
      paint(kicker, {
        margin: "0",
        color: "#00aeef",
        fontSize: "0.75rem",
        fontWeight: "700",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      });
      const heading = element("strong", winTitle);
      paint(heading, {
        display: "block",
        marginTop: "0.35rem",
        fontFamily: '"Arial Narrow", Impact, sans-serif',
        fontSize: "2.4rem",
        fontWeight: "700",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      });
      const note = element("p", detail);
      paint(note, { margin: "0.45rem 0 0", color: "rgba(255,255,255,0.82)", fontSize: "0.95rem" });
      celebration.append(kicker, heading, note);
    } else {
      celebration.hidden = true;
    }

    nameInput.disabled = full;
    teamSelect.disabled = full;
    checkInBtn.disabled = full;
    resetBtn.disabled = total === 0;
    nameInput.style.opacity = full ? "0.6" : "1";
    teamSelect.style.opacity = full ? "0.6" : "1";
    checkInBtn.style.opacity = full ? "0.6" : "1";
    checkInBtn.style.cursor = full ? "not-allowed" : "pointer";
    resetBtn.style.cursor = total === 0 ? "not-allowed" : "pointer";
    resetBtn.style.opacity = total === 0 ? "0.4" : "1";

    list.replaceChildren();
    for (let i = attendees.length - 1; i >= 0; i--) {
      const person = attendees[i];
      const item = element("li");
      paint(item, {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.8rem 1rem",
        borderTop: i === attendees.length - 1 ? "0" : "1px solid #e2e8f0",
      });
      const text = element("div");
      paint(text, { minWidth: "0" });
      const when = new Date(person.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const personName = element("strong", person.name);
      paint(personName, { display: "block" });
      const personTeam = element("span", teamLabels[person.team] + " · " + when);
      paint(personTeam, { color: "#5c6e86", fontSize: "0.9rem" });
      text.append(personName, personTeam);
      const remove = element("button", "Remove");
      remove.type = "button";
      paint(remove, {
        border: "0",
        backgroundColor: "transparent",
        color: "#5c6e86",
        fontWeight: "700",
        fontSize: "0.85rem",
        cursor: "pointer",
      });
      remove.addEventListener("mouseenter", function () {
        remove.style.color = "#0071c5";
      });
      remove.addEventListener("mouseleave", function () {
        remove.style.color = "#5c6e86";
      });
      remove.addEventListener("click", function () {
        const next = [];
        for (let n = 0; n < attendees.length; n++) {
          if (attendees[n].id !== person.id) next.push(attendees[n]);
        }
        attendees = next;
        saveAttendees();
        render();
      });
      item.append(text, remove);
      list.appendChild(item);
    }
    const hasPeople = total !== 0;
    empty.hidden = hasPeople;
    list.style.display = hasPeople ? "block" : "none";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (attendees.length >= maxAttendees) return;
    const attendeeName = nameInput.value.trim().replace(/\s+/g, " ");
    const team = teamSelect.value;
    if (!attendeeName || !isTeam(team)) return;
    attendees.push({
      id: String(Date.now()) + "-" + attendees.length,
      name: attendeeName,
      team: team,
      at: Date.now(),
    });
    greeting.hidden = false;
    greeting.textContent = "Welcome, " + attendeeName + "! You're checked in with " + teamLabels[team] + ".";
    form.reset();
    teamSelect.value = "";
    saveAttendees();
    render();
  });

  resetBtn.addEventListener("click", function () {
    if (!window.confirm("Clear every attendee?")) return;
    attendees = [];
    greeting.hidden = true;
    greeting.textContent = "";
    saveAttendees();
    render();
  });

  attendees = loadAttendees();
  applyLayout();
  render();
  window.addEventListener("resize", applyLayout);

  return function cleanup() {
    window.removeEventListener("resize", applyLayout);
    root.replaceChildren();
  };
}

if (typeof document !== "undefined" && document.body && document.body.dataset.summitHost !== "react") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountSummit(document.body);
    });
  } else {
    mountSummit(document.body);
  }
}
