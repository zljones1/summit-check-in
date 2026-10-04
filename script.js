const maxAttendees = 50;
const storageKey = "summit-checkins-v1";

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const percentLabel = document.getElementById("percentLabel");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const celebration = document.getElementById("celebration");
const attendeeList = document.getElementById("attendeeList");
const emptyList = document.getElementById("emptyList");
const checkInBtn = document.getElementById("checkInBtn");
const resetBtn = document.getElementById("resetBtn");
const goalCount = document.getElementById("goalCount");

let attendees = [];

goalCount.textContent = String(maxAttendees);

function isTeam(value) {
  return value === "water" || value === "zero" || value === "power";
}

function countForTeam(team) {
  let total = 0;
  for (let i = 0; i < attendees.length; i++) {
    if (attendees[i].team === team) {
      total += 1;
    }
  }
  return total;
}

function progressPercent(count) {
  const safe = Math.max(0, Math.min(count, maxAttendees));
  return Math.round((safe / maxAttendees) * 100);
}

function leaders() {
  const teams = ["water", "zero", "power"];
  let top = 0;
  const ranked = [];
  for (let i = 0; i < teams.length; i++) {
    const count = countForTeam(teams[i]);
    ranked.push({ team: teams[i], count: count });
    if (count > top) {
      top = count;
    }
  }
  const winning = [];
  if (top === 0) {
    return winning;
  }
  for (let i = 0; i < ranked.length; i++) {
    if (ranked[i].count === top) {
      winning.push(ranked[i]);
    }
  }
  return winning;
}

function loadAttendees() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : parsed && parsed.attendees;
    if (!Array.isArray(rows)) {
      return [];
    }
    const clean = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || typeof row.name !== "string" || !isTeam(row.team)) {
        continue;
      }
      const name = row.name.trim().replace(/\s+/g, " ");
      if (!name) {
        continue;
      }
      clean.push({
        id: typeof row.id === "string" ? row.id : String(Date.now()) + "-" + i,
        name: name,
        team: row.team,
        at: typeof row.at === "number" ? row.at : Date.now(),
      });
      if (clean.length >= maxAttendees) {
        break;
      }
    }
    return clean;
  } catch (error) {
    return [];
  }
}

function saveAttendees() {
  const payload = {
    total: attendees.length,
    teams: {
      water: countForTeam("water"),
      zero: countForTeam("zero"),
      power: countForTeam("power"),
    },
    attendees: attendees,
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function render() {
  const total = attendees.length;
  const percent = progressPercent(total);
  const full = total >= maxAttendees;
  const winning = leaders();

  attendeeCountEl.textContent = String(total);
  percentLabel.textContent = percent + "%";
  progressBar.style.width = percent + "%";
  progressTrack.setAttribute("aria-valuenow", String(percent));

  const teams = ["water", "zero", "power"];
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    document.getElementById(team + "Count").textContent = String(countForTeam(team));
    const card = document.getElementById(team + "Card");
    const isSoloLead = winning.length === 1 && winning[0].team === team && winning[0].count > 0;
    if (isSoloLead) {
      card.classList.add("leading");
    } else {
      card.classList.remove("leading");
    }
  }

  if (full && winning.length > 0) {
    let title = "";
    let detail = "";
    if (winning.length === 1) {
      title = teamLabels[winning[0].team] + " wins";
      detail = winning[0].count + " attendees checked in. The goal of " + maxAttendees + " is complete.";
    } else {
      const names = [];
      for (let i = 0; i < winning.length; i++) {
        names.push(teamLabels[winning[i].team]);
      }
      title = names.join(" and ") + " tie";
      detail = "Each has " + winning[0].count + " attendees. The goal of " + maxAttendees + " is complete.";
    }
    celebration.hidden = false;
    celebration.innerHTML = "";
    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = "Goal reached";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const note = document.createElement("p");
    note.textContent = detail;
    celebration.appendChild(kicker);
    celebration.appendChild(heading);
    celebration.appendChild(note);
  } else {
    celebration.hidden = true;
    celebration.textContent = "";
  }

  nameInput.disabled = full;
  teamSelect.disabled = full;
  checkInBtn.disabled = full;
  resetBtn.disabled = total === 0;

  attendeeList.innerHTML = "";
  for (let i = attendees.length - 1; i >= 0; i--) {
    const person = attendees[i];
    const item = document.createElement("li");
    const text = document.createElement("div");
    text.className = "person";
    const name = document.createElement("strong");
    name.textContent = person.name;
    const team = document.createElement("span");
    const clock = new Date(person.at);
    team.textContent = teamLabels[person.team] + " · " + clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    text.appendChild(name);
    text.appendChild(team);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.textContent = "Remove";
    remove.addEventListener("click", function () {
      removeAttendee(person.id);
    });
    item.appendChild(text);
    item.appendChild(remove);
    attendeeList.appendChild(item);
  }
  emptyList.hidden = total !== 0;
}

function removeAttendee(id) {
  const next = [];
  for (let i = 0; i < attendees.length; i++) {
    if (attendees[i].id !== id) {
      next.push(attendees[i]);
    }
  }
  attendees = next;
  saveAttendees();
  render();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (attendees.length >= maxAttendees) {
    return;
  }

  const attendeeName = nameInput.value.trim().replace(/\s+/g, " ");
  const team = teamSelect.value;
  if (!attendeeName || !isTeam(team)) {
    return;
  }

  attendees.push({
    id: String(Date.now()) + "-" + attendees.length,
    name: attendeeName,
    team: team,
    at: Date.now(),
  });

  const message = `Welcome, ${attendeeName}! You're checked in with ${teamLabels[team]}.`;
  greeting.hidden = false;
  greeting.textContent = message;

  form.reset();
  teamSelect.value = "";
  saveAttendees();
  render();
});

resetBtn.addEventListener("click", function () {
  const sure = window.confirm("Clear every attendee?");
  if (!sure) {
    return;
  }
  attendees = [];
  greeting.hidden = true;
  greeting.textContent = "";
  saveAttendees();
  render();
});

attendees = loadAttendees();
render();
