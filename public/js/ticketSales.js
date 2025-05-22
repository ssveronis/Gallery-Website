import TicketSale from '/js/ticketSaleClass.js'

document.addEventListener("DOMContentLoaded", async () => {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const popupContent = document.getElementById("popupContent");
    const table = document.querySelector("tbody");

    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const date = document.getElementById("date");
    const time = document.getElementById("time");
    const categorySelect = document.getElementById("categorySelect");
    const filterButton = document.getElementById("filterButton");

    const res = await fetch(`/api/sales/`);
    const data = await res.json();

    let tickets = []

    data.forEach((item) => {
        const sale = new TicketSale(item)
        tickets.push(sale);
        table.innerHTML += `
        <tr>
                <td>${sale.id}</td>
                <td>${sale.date}</td>
                <td>${sale.start_time} - ${sale.end_time}</td>
                <td>${sale.category}</td>
                <td>${sale.name}</td>
                <td>${sale.email}</td>
                <td>${sale.total_tickets}</td>
                <td>
                    <button><span class="material-symbols-outlined">visibility</span></button>
                </td>
            </tr>
        `
    })

    document.querySelectorAll("table button").forEach(button => {
        button.addEventListener("click", async () => {
            const row = button.closest("tr");
            const cells = row.querySelectorAll("td");

            const ticketId = cells[0].textContent;
            const res = await fetch(`/api/sale/${ticketId}`);
            const data = await res.json();

            popupContent.innerHTML = `
                <div>
                    <h2>Λεπτομέρειες Εισιτηρίου</h2>
                    <p><strong>ID:</strong> ${ticketId}</p>
                    <p><strong>Όνομα:</strong> ${data.name}</p>
                    <p><strong>Ημερομηνία αγοράς:</strong> ${data.buy_date}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Αριθμός Εισιτηρίων:</strong> ${data.toatl_tickets}</p>
                    <p><strong>Tύπος Εισιτηρίου:</strong> Κανονικό (${data.regular_tickets})</p>
                    <p><strong>Tύπος Εισιτηρίου:</strong> Παιδικό (${data.children_tickets})</p>
                    <p><strong>Tύπος Εισιτηρίου:</strong> Φοιτητικό (${data.student_tickets})</p>
                    <p><strong>Audioguides:</strong>${data.audioguides}</p>
                    <p><strong>Τιμή:</strong> ${data.total}€</p>
                    <p><strong>AMEA:</strong> ${data.accessibility?"Ναι":"Όχι"}</p>
                </div>
                <div>
                    <h2>Λεπτομέρειες κατηγορίας</h2>
                    <p><strong>Κατηγορία:</strong> ${data.category}</p>
                    <p><strong>Ημερομηνία εισιτηρίου:</strong> ${data.date}</p>
                    <p><strong>Ώρα εισόδου:</strong> ${data.time}</p>
                    <p><strong>Συνολικός Αριθμός Εισιτηρίων:</strong> ${data.max_tickets}</p>
                    <p><strong>Διαθέσιμα Εισιτήρια:</strong> ${data.available_tickets}</p>
                    <p><strong>Συνολικά Αγορασμένα Εισιτήρια:</strong> ${data.sold_tickets}</p>
                </div>
            `;

            popup.classList.add("show");
            overlay.classList.add("show");

        });
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });

    const onFilterApply = function (event) {
        const rows = document.querySelectorAll("tbody tr");
        tickets.forEach((ticket, index) => {
            if (ticket.shouldDisplay(searchInput.value, date.value, time.value, categorySelect.value)) {
                rows[index].classList.remove("hidden");
            } else {
                rows[index].classList.add("hidden");
            }
        })
    }

    searchButton.addEventListener("click", onFilterApply);
    searchInput.addEventListener('keypress', (e)=>{if (e.key === 'Enter') onFilterApply(e)})
    filterButton.addEventListener("click", onFilterApply);
});
