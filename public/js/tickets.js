document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".exhibition-btn");
    const dateForm = document.getElementById("dateSelection");
    const buttonContainer = document.getElementById("exhibitionSelection");
    const selectedEventInput = document.getElementById("selectedEvent");
    const nextButton = document.getElementById("nextButton");
    const ticketForm = document.getElementById("ticketForm");
    const searchBtn = document.getElementById("searchBtn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            //selectedEventInput.value = type;

            buttonContainer.classList.add("hidden");
            dateForm.classList.remove("hidden");
            dateForm.classList.add("flex-container");
        });
    });

    nextButton.addEventListener("click", () => {
        dateForm.classList.add("hidden");
        dateForm.classList.remove("flex-container");
        ticketForm.classList.remove("hidden");
        ticketForm.classList.add("flex-container");
        const selectedDate = document.querySelector('input[name="date"]:checked');
        searchBtn.classList.remove("hidden");
    });

    // Ticket counters
    document.querySelectorAll(".counter").forEach(counter => {
        const input = counter.querySelector("input");
        const inc = counter.querySelector(".increment");
        const dec = counter.querySelector(".decrement");

        inc.addEventListener("click", () => {
            input.value = parseInt(input.value) + 1;
        });

        dec.addEventListener("click", () => {
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });
});
