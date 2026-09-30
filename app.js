const state = {
  mode: "explain",
  sessions: Number(localStorage.getItem("edugenie_sessions") || 0)
};

const chat = document.getElementById("chat");
const composer = document.getElementById("composer");
const message = document.getElementById("message");
const send = document.getElementById("send");
const status = document.getElementById("status");
const progressValue = document.getElementById("progressValue");
const progressText = document.getElementById("progressText");

const copy = {
  explain: ["What would you like to learn?", "Ask EduGenie to explain a concept in simple language, with examples."],
  quiz: ["Ready for a quick quiz?", "Enter a subject and EduGenie will create practice questions for you."],
  flashcards: ["Build your flashcards", "Enter a topic and EduGenie will create concise Q&A cards."],
  plan: ["Make a study plan", "Enter a subject, exam, or goal and EduGenie will build a 7-day plan."]
};

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function updateProgress() {
  const percent = Math.min(state.sessions * 10, 100);
  progressValue.textContent = `${percent}%`;
  progressText.textContent = state.sessions
    ? `${state.sessions} learning session${state.sessions === 1 ? "" : "s"} completed.`
    : "Start your first learning session.";
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  document.getElementById("heroTitle").textContent = copy[mode][0];
  document.getElementById("heroText").textContent = copy[mode][1];
}

document.querySelectorAll(".mode").forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

document.querySelectorAll(".suggestion").forEach(btn => {
  btn.addEventListener("click", () => {
    message.value = btn.textContent;
    message.focus();
  });
});

composer.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = message.value.trim();
  if (!text) return;

  addMessage(text, "user");
  message.value = "";
  send.disabled = true;
  send.textContent = "Thinking…";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, mode: state.mode })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    addMessage(data.answer, "ai");

    state.sessions += 1;
    localStorage.setItem("edugenie_sessions", state.sessions);
    updateProgress();
  } catch (error) {
    addMessage(`Error: ${error.message}`, "ai");
  } finally {
    send.disabled = false;
    send.textContent = "Ask EduGenie";
  }
});

document.getElementById("clearProgress").addEventListener("click", () => {
  state.sessions = 0;
  localStorage.removeItem("edugenie_sessions");
  updateProgress();
});

async function checkHealth() {
  try {
    const r = await fetch("/api/health");
    const data = await r.json();
    status.textContent = data.configured ? "● Gemini connected" : "○ API key not configured";
    status.style.color = data.configured ? "#138a4b" : "#a06a00";
  } catch {
    status.textContent = "○ Server unavailable";
  }
}

updateProgress();
checkHealth();
