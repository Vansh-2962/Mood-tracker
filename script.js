// In this project we will be using an external package i.e., Full Calendar. Link is given down below
// https://fullcalendar.io/
// Global calendar instance
let calendar;

// Function to load the calendar, whenever the page loads we want our calendar to load and the past moods also.
document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    droppable: true,
    editable: true,
    height: 500,
  });

  calendar.render();

  // Load moods from LocalStorage and add them to the calendar
  const moodsHistory = JSON.parse(localStorage.getItem("moods")) || [];
  moodsHistory.forEach((mood) => {
    addMood(mood);
    addMoodToCalendar(mood); // called once
  });
});

// Function to add mood to mood tracker and calendar
function addMood(mood) {
  // creating the mood element
  const div = document.createElement("div");
  div.classList.add("mood");
  div.innerHTML = `
         <span class="emoji">${mood?.emoji}</span>
          <div>
            <p>${mood?.reactionText}</p>
            <small>${mood?.date}</small>
          </div>
    `;
  div.setAttribute("draggable", "true");

  // Append to mood tracker
  document.querySelector(".mood-tracker").appendChild(div);

  // Add the mood to the calendar
  addMoodToCalendar(mood);
}

// Function to add mood as an event to the calendar
function addMoodToCalendar(mood) {
  if (calendar) {
    // Check if the mood is already in the calendar to prevent duplicates
    let existingEvents = calendar.getEvents();
    let isDuplicate = existingEvents.some(
      (event) =>
        event.title === `${mood.emoji} ${mood.reactionText}` &&
        event.startStr === mood.date
    );

    if (!isDuplicate) {
      calendar.addEvent({
        title: `${mood.emoji} ${mood.reactionText}`,
        start: mood.date,
        allDay: true,
      });
    }
  }
}

// Add event listener to buttons
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const reaction = btn.innerText.split("\n");
    const myMood = {
      emoji: reaction[0],
      reactionText: reaction[1],
      date: new Date().toISOString().split("T")[0], // Ensure format YYYY-MM-DD
    };

    // Store the mood in localStorage
    const existingMoods = JSON.parse(localStorage.getItem("moods")) || [];
    existingMoods.push(myMood);
    localStorage.setItem("moods", JSON.stringify(existingMoods));

    // Add the mood to the tracker and calendar
    addMood(myMood);
  });
});
