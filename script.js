

// ================= DARK MODE =================
function changeMode() {
    document.body.classList.toggle("dark");
}

// ================= MENU TOGGLE =================
function toggleMenu() {
    document.getElementById("menu").classList.toggle("show");
}

// ================= LIVE CLOCK (FIXED) =================
function showTime() {
    let now = new Date();   // ❌ FIXED (you missed this before)

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString();
}

setInterval(showTime, 1000);
showTime();

// ================= FILTER PROJECTS =================
function filterProjects(category) {
    let projects = document.querySelectorAll(".project");

    projects.forEach(project => {
        if (category === "all" || project.classList.contains(category)) {
            project.style.display = "block";
        } else {
            project.style.display = "none";
        }
    });
}

// ================= SKILL BAR ANIMATION =================
const bars = document.querySelectorAll(".fill");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
        }
    });
});

bars.forEach(bar => observer.observe(bar));

// ================= TOP BUTTON =================
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    });

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ================= TO-DO LIST =================
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span style="${task.completed ? "text-decoration:line-through" : ""}">
                ${task.text}
            </span>
            <button class="deleteBtn">Delete</button>
        `;

        let checkbox = li.querySelector("input");
        let deleteBtn = li.querySelector(".deleteBtn");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    taskCount.innerHTML = "Total Tasks : " + tasks.length;
}

function addTask() {
    let text = taskInput.value.trim();

    if (text === "") {
        alert("Enter a task");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

if (addBtn) addBtn.addEventListener("click", addTask);

if (taskInput) {
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
}

renderTasks();

// ================= MODAL =================
const modal = document.getElementById("projectModal");
const closeModal = document.getElementById("closeModal");
const viewButtons = document.querySelectorAll(".viewProject");

viewButtons.forEach(button => {
    button.addEventListener("click", () => {

        document.getElementById("modalTitle").innerText = button.dataset.title;
        document.getElementById("modalImage").src = button.dataset.image;
        document.getElementById("modalDesc").innerText = button.dataset.desc;
        document.getElementById("modalTech").innerText =
            "Technologies: " + button.dataset.tech;
        document.getElementById("modalLink").href = button.dataset.link;

        modal.style.display = "flex";
    });
});

if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ================= WEATHER APP =================
const weatherBtn = document.getElementById("getWeatherBtn");

if (weatherBtn) {
    weatherBtn.addEventListener("click", async () => {

        const city = document.getElementById("cityInput").value.trim();

        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        document.getElementById("loading").style.display = "block";
        document.getElementById("weatherResult").style.display = "none";

        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            const geoData = await geoResponse.json();

            if (!geoData.results) {
                throw new Error("City not found");
            }

            const latitude = geoData.results[0].latitude;
            const longitude = geoData.results[0].longitude;

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
            );

            const weatherData = await weatherResponse.json();
            const current = weatherData.current;

            let condition = "Unknown";

            if (current.weather_code <= 3) condition = "Clear Sky";
            else if (current.weather_code <= 48) condition = "Cloudy";
            else if (current.weather_code <= 67) condition = "Rainy";
            else if (current.weather_code <= 77) condition = "Snow";
            else condition = "Stormy";

            document.getElementById("cityName").innerText = city;
            document.getElementById("temp").innerText = current.temperature_2m + " °C";
            document.getElementById("description").innerText = "Condition: " + condition;
            document.getElementById("humidity").innerText =
                "Humidity: " + current.relative_humidity_2m + "%";

            document.getElementById("weatherResult").style.display = "block";

        } catch (error) {
            alert("City Not Found");
        }

        document.getElementById("loading").style.display = "none";
    });
}

// ================= EMAILJS (FIXED & SAFE) =================
window.onload = function () {

    emailjs.init("Ul4bruxAKiSnsp2Xv");

    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");

    if (!form) {
        console.log("Form not found");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        btn.disabled = true;
        btn.innerText = "Sending...";

        emailjs.send("service_lge29iu", "template_ie8zjpf", {
            from_name: document.getElementById("name").value,
            from_email: document.getElementById("email").value,
            message: document.getElementById("message").value
        })
        .then(() => {
            alert("Message Sent Successfully ✅");
            form.reset();
        })
        .catch((err) => {
            console.log("ERROR:", err);
            alert("Email Failed ❌ Check Console");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Send Message";
        });
    });
};