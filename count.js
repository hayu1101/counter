 const countdownForm = document.getElementById("countdownForm");
    const titleInput = document.getElementById("titleInput");
    const dateInput = document.getElementById("dateInput");
    const countdownList = document.getElementById("countdownList");
    const mainTitle = document.getElementById("mainTitle");
    const display = {
      days: document.getElementById("days").querySelector("span"),
      hours: document.getElementById("hours").querySelector("span"),
      minutes: document.getElementById("minutes").querySelector("span"),
      seconds: document.getElementById("seconds").querySelector("span")
    };

    let countdowns = JSON.parse(localStorage.getItem("countdowns")) || [];
    let activeIndex = 0;
    let interval = null;

    if (countdowns.length === 0) {
      countdowns.push({ title: "My Birthday", date: "2025-12-31" });
      saveCountdowns();
    }

    function saveCountdowns() {
      localStorage.setItem("countdowns", JSON.stringify(countdowns));
    }

    function renderCountdownList() {
      countdownList.innerHTML = "";
      [...countdowns].reverse().forEach((cd, i) => {
        const index = countdowns.length - 1 - i;
        const li = document.createElement("li");
        if (index === activeIndex) li.classList.add("active");

        const contentDiv = document.createElement("div");
        contentDiv.style.flex = "1";
        const isEditing = cd.editing;

        if (isEditing) {
          const titleField = document.createElement("input");
          titleField.type = "text";
          titleField.value = cd.title;
          titleField.style.marginRight = "5px";
          const dateField = document.createElement("input");
          dateField.type = "date";
          dateField.value = cd.date;
          contentDiv.appendChild(titleField);
          contentDiv.appendChild(dateField);

          const saveBtn = document.createElement("button");
          saveBtn.textContent = "✅";
          saveBtn.onclick = () => {
            cd.title = titleField.value.trim();
            cd.date = dateField.value;
            delete cd.editing;
            saveCountdowns();
            renderCountdownList();
            startCountdown();
          };

          const cancelBtn = document.createElement("button");
          cancelBtn.textContent = "❌";
          cancelBtn.onclick = () => {
            delete cd.editing;
            renderCountdownList();
          };

          li.appendChild(contentDiv);
          li.appendChild(saveBtn);
          li.appendChild(cancelBtn);
        } else {
          const titleSpan = document.createElement("span");
          titleSpan.textContent = cd.title;
          contentDiv.appendChild(titleSpan);
          li.appendChild(contentDiv);

          const editBtn = document.createElement("button");
          editBtn.textContent = "✏️";
          editBtn.onclick = (e) => {
            e.stopPropagation();
            cd.editing = true;
            renderCountdownList();
          };

          const delBtn = document.createElement("button");
          delBtn.textContent = "✖️";
          delBtn.onclick = (e) => {
            e.stopPropagation();
            if (document.querySelector(".modal-overlay")) return;

            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";

            const modalBox = document.createElement("div");
            modalBox.className = "modal-box";

            const msg = document.createElement("span");
            msg.textContent = "Are you sure you want to delete?";

            const yesBtn = document.createElement("button");
            yesBtn.textContent = "Yes";
            yesBtn.onclick = (ev) => {
              ev.stopPropagation();
              countdowns.splice(index, 1);
              if (activeIndex >= countdowns.length) activeIndex = 0;
              saveCountdowns();
              renderCountdownList();
              startCountdown();
              overlay.remove();
            };


const noBtn = document.createElement("button");
            noBtn.textContent = "No";
            noBtn.onclick = () => overlay.remove();

            modalBox.appendChild(msg);
            modalBox.appendChild(yesBtn);
            modalBox.appendChild(noBtn);
            overlay.appendChild(modalBox);
            document.body.appendChild(overlay);
          };

          li.appendChild(editBtn);
          li.appendChild(delBtn);
          li.onclick = () => {
            activeIndex = index;
            saveCountdowns();
            renderCountdownList();
            startCountdown();
          };
        }

        countdownList.appendChild(li);
      });
    }

    function startCountdown() {
      if (interval) clearInterval(interval);
      if (!countdowns[activeIndex]) {
        mainTitle.textContent = "";
        display.days.textContent = "00";
        display.hours.textContent = "00";
        display.minutes.textContent = "00";
        display.seconds.textContent = "00";
        return;
      }

      const targetDate = new Date(countdowns[activeIndex].date);
      mainTitle.textContent = countdowns[activeIndex].title;

      function update() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
          clearInterval(interval);
          display.days.textContent = "";
          display.hours.textContent = "";
          display.minutes.textContent = "";
          display.seconds.textContent = "";
          mainTitle.textContent = countdowns[activeIndex].title + " - EXPIRED!";
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        display.days.textContent = String(d).padStart(2, "0");
        display.hours.textContent = String(h).padStart(2, "0");
        display.minutes.textContent = String(m).padStart(2, "0");
        display.seconds.textContent = String(s).padStart(2, "0");
      }

      update();
      interval = setInterval(update, 1000);
    }

    countdownForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const date = dateInput.value;
      if (!title || !date) return;
      countdowns.push({ title, date });
      activeIndex = countdowns.length - 1;
      saveCountdowns();
      renderCountdownList();
      startCountdown();
      countdownForm.reset();
    });

    renderCountdownList();
    startCountdown();
