document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const popupContent = document.getElementById("popupContent");

    document.querySelectorAll("table button").forEach(button => {
        button.addEventListener("click", async () => {
            const row = button.closest("tr");
            const cells = row.querySelectorAll("td");

            const ticketId = cells[0].textContent;
            const res = await fetch(`/api/sale/${ticketId}`);
            const data = await res.json();

            popupContent.innerHTML = `
                <h2>Λεπτομέρειες Εισιτηρίου</h2>
                <p><strong>ID:</strong> ${ticketId}</p>
                <p><strong>Όνομα:</strong> ${data.name}</p>
                <p><strong>Ημερομηνία:</strong> ${data.date}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Αριθμός Εισιτηρίων:</strong> ${data.toatl_tickets}</p>
                <p><strong>Tύπος Εισιτηρίου:</strong> Κανονικό (${data.regular_tickets})</p>
                <p><strong>Tύπος Εισιτηρίου:</strong> Παιδικό (${data.children_tickets})</p>
                <p><strong>Tύπος Εισιτηρίου:</strong> Φοιτητικό (${data.student_tickets})</p>
                <p><strong>Τιμή:</strong> ${data.total}€</p>
                <p><strong>AMEA:</strong> ${data.accessibility?"Ναι":"Όχι"}</p>
            `;

            popup.classList.add("show");
            overlay.classList.add("show");

        });
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });
});
