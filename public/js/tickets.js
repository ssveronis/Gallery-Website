document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".exhibition-btn");
    const exhibitionSelection = document.getElementById("exhibitionSelection");
    const dateSelection = document.getElementById("dateSelection");
    const ticketForm = document.getElementById("ticketForm");
    const searchBtn = document.getElementById("searchBtn");
    const backButton = document.getElementById("backButton");
    const nextButton = document.getElementById("nextButton");
    const ticketFormButtons = document.getElementById("ticketFormButtons");
    const backButtonSearch = document.getElementById("backButtonSearch");
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    const ticketList = document.querySelector(".ticket-list");
    const checkBox = document.querySelector(".checkbox");
    const ticketCards = document.querySelectorAll('.ticket-card');

    dateInput.min = today;


    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            exhibitionSelection.classList.add("hidden");
            dateSelection.classList.remove("hidden");
            dateSelection.classList.add("flex-container");
        });
    });

    nextButton.addEventListener("click", () => {
        if (!dateInput.value) {
            alert("Παρακαλώ επιλέξτε ημερομηνία.");
            return;
        }

        dateSelection.classList.add("hidden");
        dateSelection.classList.remove("flex-container");

        ticketForm.classList.remove("hidden");
        ticketForm.classList.add("flex-container");

        ticketFormButtons.classList.remove("hidden");
    });


    backButton.addEventListener("click", () => {
        dateSelection.classList.add("hidden");
        dateSelection.classList.remove("flex-container");

        exhibitionSelection.classList.remove("hidden");
    });

    backButtonSearch.addEventListener("click", () => {
        ticketForm.classList.add("hidden");
        ticketForm.classList.remove("flex-container");

        dateSelection.classList.remove("hidden");
        dateSelection.classList.add("flex-container");
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

    searchBtn.addEventListener("click", async () => {

        ticketList.classList.remove("hidden");
        ticketList.classList.add("flex-container");
        ticketForm.classList.add("hidden");
    });

    //ticket selection
    ticketCards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('selected');
            void this.offsetWidth;
        });
    });
    
});
