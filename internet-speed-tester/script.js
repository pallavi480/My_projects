const historyList = document.getElementById("history");
let history = JSON.parse(localStorage.getItem("speedHistory")) || [];

const speedText = document.getElementById("speed");
const downloadText = document.getElementById("download");
const uploadText = document.getElementById("upload");
const pingText = document.getElementById("ping");
const needle = document.getElementById("needle");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");

let interval;
let speed = 0;

startBtn.addEventListener("click", () => {
  clearInterval(interval);
  speed = 0;

  interval = setInterval(() => {
    speed += Math.floor(Math.random() * 5);

    if (speed >= 100) {
      speed = 100;
      clearInterval(interval);
    }

    saveHistory();


    speedText.textContent = speed;
    downloadText.textContent = speed + " Mbps";
    uploadText.textContent = Math.floor(speed / 2) + " Mbps";
    pingText.textContent = Math.floor(Math.random() * 50) + " ms";

    // rotate needle (-90 to +90 degrees)
    const angle = -90 + (speed * 1.8);
    needle.style.transform = `rotate(${angle}deg)`;
  }, 100);
});

stopBtn.addEventListener("click", () => {
  clearInterval(interval);
});

const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggleBtn.textContent = "☀ Light Mode";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "☀ Light Mode";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌙 Dark Mode";
  }
});

function saveHistory() {
  const record = {
    download: downloadText.textContent,
    upload: uploadText.textContent,
    ping: pingText.textContent,
    time: new Date().toLocaleTimeString()
  };

  history.unshift(record);
  history = history.slice(0, 5); // last 5 tests
  localStorage.setItem("speedHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} | ↓ ${item.download} | ↑ ${item.upload} | ⚡ ${item.ping}`;
    historyList.appendChild(li);
  });
}

renderHistory();

