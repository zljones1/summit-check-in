// @ts-nocheck
const maxAttendees = 50;
const storageKey = "summit-checkins-v1";

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const pageCss = `
#summit-app, #summit-app * { box-sizing: border-box; }
#summit-app { min-height: 100vh; margin: 0; font-family: Manrope, "Segoe UI", sans-serif; background: #eef3f8; color: #10243d; line-height: 1.5; }
#summit-app button, #summit-app select, #summit-app input { font: inherit; }
#summit-app button { cursor: pointer; }
#summit-app button:disabled { cursor: not-allowed; }
#summit-app .hero { position: relative; overflow: hidden; color: #fff; text-align: center; }
#summit-app .hero-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
#summit-app .hero-scrim { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,113,197,.9), rgba(0,90,158,.88) 52%, rgba(0,60,116,.92)); }
#summit-app .hero-content { position: relative; max-width: 48rem; margin: 0 auto; padding: 3.5rem 1.25rem 4.5rem; }
#summit-app .intel-logo { height: 2.75rem; margin: 0 auto 1.5rem; filter: brightness(0) invert(1); }
#summit-app h1 { margin: 0; font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-size: clamp(2.4rem, 6vw, 3.4rem); font-weight: 700; letter-spacing: .04em; text-transform: uppercase; text-wrap: balance; }
#summit-app .hero-divider { width: 6rem; height: 2px; margin: 1.25rem auto; background: #00aeef; }
#summit-app .hero p { margin: 0; font-size: 1.15rem; font-weight: 300; }
#summit-app .wrap { width: min(100% - 1.5rem, 44rem); margin: -1.5rem auto 0; padding-bottom: 2.5rem; }
#summit-app .panel { padding: 1.75rem 1.25rem 2rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 18px 50px -28px rgba(0,60,116,.55); }
#summit-app .attendance-header { display: flex; gap: .4rem; align-items: baseline; justify-content: center; margin: 0; color: #5c6e86; }
#summit-app .count, #summit-app .percent { color: #0071c5; font-weight: 800; font-variant-numeric: tabular-nums; }
#summit-app .count { font-size: 1.6rem; }
#summit-app .progress-container { width: min(100%, 32rem); height: 1rem; margin: 1rem auto 0; overflow: hidden; background: #e2e8f0; border-radius: 999px; }
#summit-app .progress-bar { width: 0%; height: 100%; background: linear-gradient(90deg, #0071c5, #00aeef); border-radius: 999px; transition: width .6s ease; }
#summit-app .greeting { margin: 1.5rem 0 0; padding: .85rem 1rem; text-align: center; font-weight: 600; color: #003c71; background: #e8f4fc; border-radius: .6rem; }
#summit-app .celebration { margin: 1.5rem 0 0; padding: 1.25rem 1rem; text-align: center; color: #fff; background: #003c74; border-radius: .8rem; }
#summit-app .celebration .kicker { margin: 0; color: #00aeef; font-size: .75rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
#summit-app .celebration strong { display: block; margin-top: .35rem; font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-size: 2.4rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
#summit-app .celebration .detail { margin: .45rem 0 0; color: rgba(255,255,255,.82); font-size: .95rem; }
#summit-app .check-in { margin-top: 1.5rem; padding: 1.25rem; background: #f7fafc; border-radius: 1rem; }
#summit-app .form-label { display: block; margin-bottom: .75rem; color: #5c6e86; font-size: .9rem; font-weight: 600; }
#summit-app .form-group, #summit-app .input-wrapper { display: flex; gap: .75rem; }
#summit-app .input-wrapper { flex: 1; min-width: 0; }
#summit-app input, #summit-app select { height: 3.5rem; padding: 0 1rem; color: #10243d; background: #fff; border: 2px solid #e2e8f0; border-radius: .75rem; }
#summit-app input { flex: 1; min-width: 0; }
#summit-app select { min-width: 11rem; }
#summit-app input:focus, #summit-app select:focus { outline: none; border-color: #0071c5; }
#summit-app .check-in-btn { height: 3.5rem; padding: 0 1.4rem; color: #fff; font-weight: 700; background: #0071c5; border: 0; border-radius: .75rem; white-space: nowrap; }
#summit-app .check-in-btn:hover:not(:disabled) { background: #005a9e; }
#summit-app .check-in-btn:disabled, #summit-app input:disabled, #summit-app select:disabled { opacity: .6; }
#summit-app .team-stats, #summit-app .attendees { margin-top: 2rem; padding-top: 1.6rem; border-top: 1px solid #e2e8f0; }
#summit-app h2 { margin: 0; color: #5c6e86; font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-align: center; text-transform: uppercase; }
#summit-app .teams-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-top: 1rem; }
#summit-app .team-card { display: flex; flex-direction: column; gap: .35rem; padding: 1rem; border-radius: .75rem; }
#summit-app .team-card.water { color: #0b6e91; background: #e7f6fb; }
#summit-app .team-card.zero { color: #0f7a4b; background: #e8f8ef; }
#summit-app .team-card.power { color: #b45309; background: #fff6e8; }
#summit-app .team-card.leading { box-shadow: inset 0 0 0 2px currentColor; }
#summit-app .team-count { font-size: 1.8rem; font-weight: 800; font-variant-numeric: tabular-nums; }
#summit-app .attendees-head { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
#summit-app .attendees-head h2 { text-align: left; }
#summit-app .reset-btn, #summit-app .remove-btn { border: 0; background: transparent; color: #5c6e86; font-weight: 700; }
#summit-app .reset-btn { font-size: .9rem; }
#summit-app .reset-btn:hover:not(:disabled), #summit-app .remove-btn:hover { color: #0071c5; }
#summit-app .attendee-list { margin: 1rem 0 0; padding: 0; overflow: auto; max-height: 20rem; list-style: none; border: 1px solid #e2e8f0; border-radius: .75rem; }
#summit-app .attendee-list:empty { display: none; }
#summit-app .attendee-list li { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .8rem 1rem; border-top: 1px solid #e2e8f0; }
#summit-app .attendee-list li:first-child { border-top: 0; }
#summit-app .person { min-width: 0; }
#summit-app .person strong { display: block; }
#summit-app .person span { color: #5c6e86; font-size: .9rem; }
#summit-app .remove-btn { font-size: .85rem; }
#summit-app .empty { margin: 1rem 0 0; padding: 2rem 1rem; text-align: center; color: #5c6e86; border: 1px dashed #e2e8f0; border-radius: .75rem; }
#summit-app .footer { padding: 0 1rem 2.5rem; text-align: center; color: #5c6e86; font-size: .9rem; }
#summit-app .footer a { color: inherit; }
#summit-app .footer a:hover { color: #0071c5; }
@media (max-width: 720px) {
  #summit-app .form-group, #summit-app .input-wrapper { flex-direction: column; }
  #summit-app .teams-grid { grid-template-columns: 1fr; }
  #summit-app .check-in-btn, #summit-app select, #summit-app input { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  #summit-app .progress-bar { transition: none; }
}
`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
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

  let style = document.getElementById("summit-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "summit-styles";
    style.textContent = pageCss;
    document.head.appendChild(style);
  }

  if (!document.getElementById("summit-fonts")) {
    const fonts = document.createElement("link");
    fonts.id = "summit-fonts";
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(fonts);
  }

  root.replaceChildren();
  const app = element("div");
  app.id = "summit-app";
  root.appendChild(app);

  const hero = element("header", "hero");
  const photo = document.createElement("img");
  photo.className = "hero-photo";
  photo.alt = "";
  photo.src = assets.bg;
  const scrim = element("div", "hero-scrim");
  const heroContent = element("div", "hero-content");
  const logo = document.createElement("img");
  logo.className = "intel-logo";
  logo.alt = "Intel";
  logo.src = assets.logo;
  const title = element("h1", "", "Team Sustainability Summit");
  const divider = element("div", "hero-divider");
  const subtitle = element("p", "", "Check-in for sustainability event attendees");
  heroContent.append(logo, title, divider, subtitle);
  hero.append(photo, scrim, heroContent);

  const wrap = element("main", "wrap");
  const panel = element("section", "panel");

  const attendance = element("p", "attendance-header", "Attendance ");
  const countEl = element("span", "count", "0");
  countEl.id = "attendeeCount";
  const ofGoal = document.createTextNode(" / " + maxAttendees + " ");
  const percentEl = element("span", "percent", "0%");
  percentEl.id = "percentLabel";
  attendance.append(countEl, ofGoal, percentEl);

  const track = element("div", "progress-container");
  track.id = "progressTrack";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  track.setAttribute("aria-valuenow", "0");
  track.setAttribute("aria-label", "Share of the attendance goal");
  const bar = element("div", "progress-bar");
  bar.id = "progressBar";
  track.appendChild(bar);

  const celebration = element("div", "celebration");
  celebration.id = "celebration";
  celebration.hidden = true;
  const greeting = element("p", "greeting");
  greeting.id = "greeting";
  greeting.hidden = true;

  const form = document.createElement("form");
  form.className = "check-in";
  form.id = "checkInForm";
  const label = element("label", "form-label", "Attendee check-in");
  label.htmlFor = "attendeeName";
  const formGroup = element("div", "form-group");
  const inputs = element("div", "input-wrapper");
  const nameInput = document.createElement("input");
  nameInput.id = "attendeeName";
  nameInput.name = "attendeeName";
  nameInput.type = "text";
  nameInput.placeholder = "Enter name...";
  nameInput.maxLength = 60;
  nameInput.required = true;
  const teamSelect = document.createElement("select");
  teamSelect.id = "teamSelect";
  teamSelect.name = "team";
  teamSelect.required = true;
  const placeholder = element("option", "", "Select team...");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  teamSelect.appendChild(placeholder);
  const teamIds = ["water", "zero", "power"];
  for (let i = 0; i < teamIds.length; i++) {
    const option = element("option", "", teamLabels[teamIds[i]]);
    option.value = teamIds[i];
    teamSelect.appendChild(option);
  }
  const checkInBtn = element("button", "check-in-btn", "Check in");
  checkInBtn.id = "checkInBtn";
  checkInBtn.type = "submit";
  inputs.append(nameInput, teamSelect);
  formGroup.append(inputs, checkInBtn);
  form.append(label, formGroup);

  const teamSection = element("section", "team-stats");
  teamSection.appendChild(element("h2", "", "Team attendance"));
  const grid = element("div", "teams-grid");
  const cards = {};
  const counts = {};
  const shorts = { water: "Water Wise", zero: "Net Zero", power: "Renewables" };
  for (let i = 0; i < teamIds.length; i++) {
    const id = teamIds[i];
    const card = element("article", "team-card " + id);
    card.id = id + "Card";
    const count = element("span", "team-count", "0");
    count.id = id + "Count";
    card.append(element("span", "team-name", shorts[id]), count);
    cards[id] = card;
    counts[id] = count;
    grid.appendChild(card);
  }
  teamSection.appendChild(grid);

  const listSection = element("section", "attendees");
  const listHead = element("div", "attendees-head");
  const resetBtn = element("button", "reset-btn", "Reset roster");
  resetBtn.id = "resetBtn";
  resetBtn.type = "button";
  resetBtn.disabled = true;
  listHead.append(element("h2", "", "Attendees"), resetBtn);
  const list = element("ul", "attendee-list");
  list.id = "attendeeList";
  const empty = element("p", "empty", "No attendees yet. Add a name and a team to start the count.");
  empty.id = "emptyList";
  listSection.append(listHead, list, empty);

  panel.append(attendance, track, celebration, greeting, form, teamSection, listSection);
  wrap.appendChild(panel);

  const footer = element("footer", "footer");
  footer.appendChild(document.createTextNode("Team Sustainability Summit · "));
  const goals = element("a", "", "Sustainability goals");
  goals.href = "https://www.intel.com/content/www/us/en/corporate-responsibility/2030-goals.html";
  footer.appendChild(goals);

  app.append(hero, wrap, footer);

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
      cards[team].classList.toggle("leading", solo);
    }

    celebration.replaceChildren();
    if (full && winning.length > 0) {
      let title = "";
      let detail = "";
      if (winning.length === 1) {
        title = teamLabels[winning[0].team] + " wins";
        detail = winning[0].count + " attendees checked in. The goal of " + maxAttendees + " is complete.";
      } else {
        const names = [];
        for (let i = 0; i < winning.length; i++) names.push(teamLabels[winning[i].team]);
        title = names.join(" and ") + " tie";
        detail = "Each has " + winning[0].count + " attendees. The goal of " + maxAttendees + " is complete.";
      }
      celebration.hidden = false;
      celebration.append(
        element("p", "kicker", "Goal reached"),
        element("strong", "", title),
        element("p", "detail", detail),
      );
    } else {
      celebration.hidden = true;
    }

    nameInput.disabled = full;
    teamSelect.disabled = full;
    checkInBtn.disabled = full;
    resetBtn.disabled = total === 0;

    list.replaceChildren();
    for (let i = attendees.length - 1; i >= 0; i--) {
      const person = attendees[i];
      const item = document.createElement("li");
      const text = element("div", "person");
      const when = new Date(person.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      text.append(element("strong", "", person.name), element("span", "", teamLabels[person.team] + " · " + when));
      const remove = element("button", "remove-btn", "Remove");
      remove.type = "button";
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
    empty.hidden = total !== 0;
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
  render();

  return function cleanup() {
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
