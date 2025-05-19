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

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            id = btn.dataset.id;
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

