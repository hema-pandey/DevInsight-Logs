/* 🔧 Log Management Core ✅ Add New Log 📋 Display Logs ✏️ Edit Log 🗑️ Delete Log 📤 Copy to Clipboard */

const logForm = document.getElementById("logForm");
const learningInput = document.getElementById("learning");
const bugInput = document.getElementById("bugFix");
const resourcesInput = document.getElementById("resources");
const logContainer = document.getElementById("logContainer");

let logs = JSON.parse(localStorage.getItem("devLogs")) || [];

logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const learning = learningInput.value.trim();
  const bug = bugInput.value.trim();
  const resources = resourcesInput.value.trim();

  if (!learning) return alert("Please describe your learning.");

  const log = {
    id: Date.now(),
    learning,
    bug,
    resources,
    timestamp: new Date().toLocaleString(),
  };

  logs.unshift(log);
  localStorage.setItem("devLogs", JSON.stringify(logs));
  displayLogs();
  logForm.reset();
});


  // <!-- 📋 Logs Display Section -->
function displayLogs() {
  logContainer.innerHTML = "";
  logs.forEach((log) => {
    const card = document.createElement("div");
    card.className = "log-card";
    card.innerHTML = `
      <h3>${formatDate(log.timestamp)}</h3>
      <p><strong>Learning:</strong> ${highlightKeywords(log.learning)}</p>
      ${log.bug ? `<p><strong>Bug:</strong> ${highlightKeywords(log.bug)}</p>` : ""}
      ${log.resources ? `<p><strong>Resources:</strong> ${highlightKeywords(log.resources)}</p>` : ""}
      <div class="log-actions">
        <button onclick="editLog(${log.id})">✏️ Edit</button>
        <button onclick="deleteLog(${log.id})">🗑️ Delete</button>
        <button onclick="copyLog(${log.id})">📋 Copy</button>
      </div>
    `;
    logContainer.appendChild(card);
  });
  updateStats(); // Call Module 2
  drawChart();   // Call Module 2
}

function formatDate(raw) {
  const cleaned = raw.split(",")[0];
  return new Date(cleaned).toDateString();
}

function highlightKeywords(text) {
  const keywords = ["React", "JavaScript", "API", "CSS", "Grid", "Bug", "Node"];
  keywords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    text = text.replace(regex, `<span class="highlight">${word}</span>`);
  });
  return text;
}

function deleteLog(id) {
  logs = logs.filter((l) => l.id !== id);
  localStorage.setItem("devLogs", JSON.stringify(logs));
  displayLogs();
}

function copyLog(id) {
  const log = logs.find((l) => l.id === id);
  if (!log) return;
  const text = `📅 ${formatDate(log.timestamp)}\nLearning: ${log.learning}\nBug: ${log.bug}\nResources: ${log.resources}`;
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
}

function editLog(id) {
  const log = logs.find((l) => l.id === id);
  if (!log) return;
  learningInput.value = log.learning;
  bugInput.value = log.bug;
  resourcesInput.value = log.resources;

  const updateBtn = document.createElement("button");
  updateBtn.textContent = "💾 Update Log";
  updateBtn.type = "button";
  updateBtn.classList.add("update-btn");

  updateBtn.onclick = () => {
    log.learning = learningInput.value.trim();
    log.bug = bugInput.value.trim();
    log.resources = resourcesInput.value.trim();
    log.timestamp = new Date().toLocaleString();

    localStorage.setItem("devLogs", JSON.stringify(logs));
    displayLogs();
    logForm.reset();
    logForm.querySelector("button[type='submit']").style.display = "inline-block";
    updateBtn.remove();
  };

  logForm.querySelector("button[type='submit']").style.display = "none";
  logForm.appendChild(updateBtn);
}


  // <!-- 📊 Stats Dashboard -->
function updateStats() {
  const total = logs.length;
  const bugs = logs.filter(log => log.bug.trim() !== "").length;

  const keywordBank = {};
  logs.forEach(log => {
    const words = log.learning.split(/\s+/);
    words.forEach(word => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      if (clean.length >= 4) {
        keywordBank[clean] = (keywordBank[clean] || 0) + 1;
      }
    });
  });

  const top = Object.entries(keywordBank).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const topKeywords = top.map(k => `#${k[0]}`);

  document.getElementById("totalLogs").textContent = total;
  document.getElementById("bugCount").textContent = bugs;
  document.getElementById("topKeywords").textContent = topKeywords.join(", ") || "None yet";
}


// <!-- 🌈 Mood Tracker -->

const moodForm = document.getElementById("moodForm");
const moodSelect = document.getElementById("moodSelect");
const latestMood = document.getElementById("latestMood");

// 🌈 Mood-based thoughts
const moodThoughts = {
  Focused: "Stay locked in. Progress loves persistence. 🔒",
  Frustrated: "It’s okay to pause. Even bugs have lifecycles. 🐞",
  Inspired: "Let that spark flow into your next creation. ✨",
  Curious: "Every click and console log is a breadcrumb of brilliance. 🧠",
  Calm: "In stillness, solutions rise. Breathe and trust the process. 🌊"
};

// 🧠 Load saved mood
let savedMood = localStorage.getItem("devMood");
if (savedMood) {
  latestMood.textContent = `💬 Last mood: ${savedMood}\n💡 Thought: ${moodThoughts[savedMood]}`;
}

moodForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedMood = moodSelect.value;
  if (!selectedMood) return alert("Please select a mood.");

  localStorage.setItem("devMood", selectedMood);
  latestMood.textContent = `💬 Mood: ${selectedMood}\n💡 Thought: ${moodThoughts[selectedMood]}`;
  moodForm.reset();
});


// <!-- 🎯 Goal Tracker -->

const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalList = document.getElementById("goalList");

let goals = JSON.parse(localStorage.getItem("devGoals")) || [];

function saveGoals() {
  localStorage.setItem("devGoals", JSON.stringify(goals));
}

function renderGoals() {
  goalList.innerHTML = "";
  goals.forEach((goal, index) => {
    const li = document.createElement("li");
    li.className = goal.completed ? "goal-complete" : "";

    li.innerHTML = `
      ${goal.text}
      <div class="goal-actions">
        <button onclick="toggleGoal(${index})">${goal.completed ? "✅ Undo" : "☑️ Complete"}</button>
        <button onclick="deleteGoal(${index})">🗑️</button>
      </div>
    `;

    goalList.appendChild(li);
  });
}

function toggleGoal(index) {
  goals[index].completed = !goals[index].completed;
  saveGoals();
  renderGoals();
}

function deleteGoal(index) {
  goals.splice(index, 1);
  saveGoals();
  renderGoals();
}

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newGoal = goalInput.value.trim();
  if (!newGoal) return;

  goals.push({ text: newGoal, completed: false });
  saveGoals();
  renderGoals();
  goalForm.reset();
});

renderGoals(); // Initial call

// <!-- 💡 Dev Prompt Panel -->

const gratitudeForm = document.getElementById("gratitudeForm");
const gratitudeInput = document.getElementById("gratitudeInput");
const gratitudeOutput = document.getElementById("gratitudeOutput");

const affirmations = [
  "🌿 Beautiful reflection. The universe notices your gratitude.",
  "💡 A grateful mind unlocks creative solutions. Keep shining!",
  "🌼 That’s a gentle reminder of how far you’ve come.",
  "🔮 Gratitude grows into focus, clarity, and joy.",
  "🔥 You just fueled your mindset with peace and power."
];

let storedGratitude = localStorage.getItem("devGratitude");
if (storedGratitude) {
  gratitudeOutput.textContent = `💬 Previous Gratitude: "${storedGratitude}"`;
}

gratitudeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = gratitudeInput.value.trim();
  if (!entry) return alert("Please write a gratitude thought.");

  localStorage.setItem("devGratitude", entry);
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
  gratitudeOutput.textContent = `💬 "${entry}"\n💖 ${affirmation}`;
  gratitudeForm.reset();
});


// <!-- 💡 Dev Prompt Panel -->

const promptDisplay = document.getElementById("dailyPrompt");
const refreshPrompt = document.getElementById("refreshPrompt");

const prompts = [
  "🛠️ If you refactored one thing today, what would it be?",
  "🌱 What coding concept clicked unexpectedly today?",
  "🧩 What bug taught you something new today?",
  "🪞 If your code could talk, what would it say about today’s logic?",
  "🧵 Describe today’s learning as a metaphor.",
  "🌐 Did your project take one step closer to deployment today?",
  "🎯 What's the next micro-goal you'd like to achieve?"
];

// Load from localStorage or randomize
function loadPrompt() {
  const saved = localStorage.getItem("devPrompt");
  if (saved) {
    promptDisplay.textContent = saved;
  } else {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptDisplay.textContent = newPrompt;
    localStorage.setItem("devPrompt", newPrompt);
  }
}

// Refresh prompt manually
refreshPrompt.addEventListener("click", () => {
  const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  promptDisplay.textContent = newPrompt;
  localStorage.setItem("devPrompt", newPrompt);
});

loadPrompt(); // Load initial prompt
