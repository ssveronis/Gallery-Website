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
    const ticketTable = document.querySelector(".tickets-table");
    const ticketCards = document.querySelectorAll('.ticket-card');
    const ticketDetails = document.querySelector('.tickets-details');

    let id = null;

    dateInput.min = today;

    const steps = document.querySelectorAll('.ticket-steps-bar .step');
    function setStepActive(stepIdx) {
        steps.forEach((step, idx) => {
            step.classList.remove('step-active', 'step-completed');
            if (idx < stepIdx) {
                step.classList.add('step-completed');
            } else if (idx === stepIdx) {
                step.classList.add('step-active');
            }
        });
    }

    steps.forEach((step, idx) => {
        step.style.cursor = 'pointer';
        step.addEventListener('click', () => {
            // Only allow going back to completed steps or next to the immediate next step
            const currentStep = Array.from(steps).findIndex(s => s.classList.contains('step-active'));
            if (idx < currentStep) {
                // Go back to previous step
                if (idx === 0) {
                    // Back to exhibition selection
                    exhibitionSelection.classList.remove("hidden");
                    dateSelection.classList.add("hidden");
                    dateSelection.classList.remove("flex-container");
                    ticketForm.classList.add("hidden");
                    ticketForm.classList.remove("flex-container");
                    ticketList.classList.add("hidden");
                    setStepActive(0);
                } else if (idx === 1) {
                    // Back to date selection
                    exhibitionSelection.classList.add("hidden");
                    dateSelection.classList.remove("hidden");
                    dateSelection.classList.add("flex-container");
                    ticketForm.classList.add("hidden");
                    ticketForm.classList.remove("flex-container");
                    ticketList.classList.add("hidden");
                    setStepActive(1);
                } else if (idx === 2) {
                    // Back to ticket form
                    exhibitionSelection.classList.add("hidden");
                    dateSelection.classList.add("hidden");
                    dateSelection.classList.remove("flex-container");
                    ticketForm.classList.remove("hidden");
                    ticketForm.classList.add("flex-container");
                    ticketList.classList.add("hidden");
                    setStepActive(2);
                }
            } else if (idx === currentStep + 1) {
                // Allow going to the next step if the current step is valid
                if (currentStep === 0) {
                    // Go to date selection if a category is selected
                    if (id) {
                        exhibitionSelection.classList.add("hidden");
                        dateSelection.classList.remove("hidden");
                        dateSelection.classList.add("flex-container");
                        setStepActive(1);
                    } else {
                        alert("Παρακαλώ επιλέξτε κατηγορία.");
                    }
                } else if (currentStep === 1) {
                    // Go to ticket form if date is selected
                    if (dateInput.value) {
                        dateSelection.classList.add("hidden");
                        dateSelection.classList.remove("flex-container");
                        ticketForm.classList.remove("hidden");
                        ticketForm.classList.add("flex-container");
                        ticketFormButtons.classList.remove("hidden");
                        setStepActive(2);
                    } else {
                        alert("Παρακαλώ επιλέξτε ημερομηνία.");
                    }
                } else if (currentStep === 2) {
                    // Go to availability if at least one ticket is selected
                    if (document.getElementById("adults").value == 0 && document.getElementById("children").value == 0 && document.getElementById("students").value == 0 && document.getElementById("audioguides").value == 0) {
                        alert("Παρακαλώ επιλέξτε τουλάχιστον ένα εισιτήριο.");
                        return;
                    }
                    searchBtn.click();
                }
            }
        });
    });

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            id = btn.dataset.id;
            exhibitionSelection.classList.add("hidden");
            dateSelection.classList.remove("hidden");
            dateSelection.classList.add("flex-container");
            setStepActive(1);
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
        setStepActive(2);
    });


    backButton.addEventListener("click", () => {
        dateSelection.classList.add("hidden");
        dateSelection.classList.remove("flex-container");

        exhibitionSelection.classList.remove("hidden");
        setStepActive(0);
    });

    backButtonSearch.addEventListener("click", () => {
        ticketForm.classList.add("hidden");
        ticketForm.classList.remove("flex-container");

        dateSelection.classList.remove("hidden");
        dateSelection.classList.add("flex-container");
        setStepActive(1);
    });

    // Ticket counters
    document.querySelectorAll(".counter").forEach(counter => {
        const input = counter.querySelector("input");
        const inc = counter.querySelector(".increment");
        const dec = counter.querySelector(".decrement");

        inc.addEventListener("click", () => {
            // Special logic for audioguides
            if (input.id === "audioguides") {
                const totalTickets =
                    parseInt(document.getElementById("adults").value) +
                    parseInt(document.getElementById("children").value) +
                    parseInt(document.getElementById("students").value);
                if (parseInt(input.value) < totalTickets) {
                    input.value = parseInt(input.value) + 1;
                }
            } else {
                input.value = parseInt(input.value) + 1;
            }
        });

        dec.addEventListener("click", () => {
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
            }
        });

        // Prevent manual input over max for audioguides
        if (input.id === "audioguides") {
            input.addEventListener('input', () => {
                const totalTickets =
                    parseInt(document.getElementById("adults").value) +
                    parseInt(document.getElementById("children").value) +
                    parseInt(document.getElementById("students").value);
                if (parseInt(input.value) > totalTickets) {
                    input.value = totalTickets;
                }
                if (parseInt(input.value) < 0 || isNaN(parseInt(input.value))) {
                    input.value = 0;
                }
            });
        }
    });

    searchBtn.addEventListener("click", async () => {
        if (document.getElementById("adults").value == 0 && document.getElementById("children").value == 0 && document.getElementById("students").value == 0 && document.getElementById("audioguides").value == 0) {
            alert("Παρακαλώ επιλέξτε τουλάχιστον ένα εισιτήριο.");
            return;
        }
        fetch('/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: id,
                date: dateInput.value,
                regular: document.getElementById("adults").value,
                children: document.getElementById("children").value,
                student: document.getElementById("students").value,
                audioguide: document.getElementById("audioguides").value
            })
        }).then(async res => {
            const data = await res.json();
            ticketDetails.innerHTML += `
                    <tr>
                        <td>👤 ${data[0].total_tickets}</td>
                        <td><strong>${data[0].total_price} €</strong></td>
                    </tr>
                `;
            data.forEach(ticket => {
                ticketTable.innerHTML += `
                    <tr class="ticket-card" data-id="${ticket.id}">
                        <td>${ticket.name}</td>
                        <td>${ticket.start_time} - ${ticket.end_time}</td>
                        <td>⏱️ ${formatTimeDifference(ticket.start_time, ticket.end_time)}</td>
                        <td>
                            <form method="post" action="/checkout">
                                <input type="hidden" name="ticket" value="${ticket.id}">
                                <input type="hidden" name="categoryId" value="${id}">
                                <input type="hidden" name="date" value="${dateInput.value}">
                                <input type="hidden" name="regular" value="${document.getElementById("adults").value}">
                                <input type="hidden" name="children" value="${document.getElementById("children").value}">
                                <input type="hidden" name="student" value="${document.getElementById("students").value}">
                                <input type="hidden" name="audioguide" value="${document.getElementById("audioguides").value}">
                                <div class="buy-btn"><button type="submit" id="buyBtn"><strong>Αγορά</strong></button></div>
                            </form>
                        </td>
                    </tr>
                `;
            })
        })
        ticketList.classList.remove("hidden");
        ticketList.classList.add("flex-container");
        ticketForm.classList.add("hidden");
        setStepActive(3);
    });

    //ticket selection
    ticketCards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('selected');
            void this.offsetWidth;
        });
    });

});

function formatTimeDifference(startTime, endTime) {
    // Parse the time strings into Date objects
    const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

    // Create Date objects (same arbitrary date)
    const start = new Date(0, 0, 0, startHours, startMinutes, startSeconds);
    const end = new Date(0, 0, 0, endHours, endMinutes, endSeconds);

    // Handle cases where end time is the next day
    if (end < start) {
        end.setDate(end.getDate() + 1);
    }

    // Calculate difference in milliseconds
    const diff = end - start;

    // Convert milliseconds to hours and minutes
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format with leading zero for minutes if needed
    const formatted = `${hours} ώ ${minutes.toString().padStart(2, '0')} λ`;
    return formatted;
}

