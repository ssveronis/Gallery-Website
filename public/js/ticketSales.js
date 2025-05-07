document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const popupContent = document.getElementById("popupContent");

    document.querySelectorAll("table button").forEach(button => {
        button.addEventListener("click", () => {
            const row = button.closest("tr");
            const cells = row.querySelectorAll("td");

            const ticketId = cells[0].textContent;
            const name = cells[1].textContent;
            const email = cells[2].textContent;
            const ticketCount = cells[3].textContent;

            popupContent.innerHTML = `
                <h2>Λεπτομέρειες Εισιτηρίου</h2>
                <p><strong>ID:</strong> ${ticketId}</p>
                <p><strong>Όνομα:</strong> ${name}</p>
                <p><strong>Ημερομηνία:</strong> 2023-10-15</p>
                <p><strong>Ώρα:</strong> 10:30</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Αριθμός Εισιτηρίων:</strong> ${ticketCount}</p>
                <p><strong>Tύπος Εισιτηρίου:</strong> Κανονικό (2)</p>
                <p><strong>Tύπος Εισιτηρίου:</strong> Φοιτητικό (1)</p>
                <p><strong>Τιμή:</strong> 25€</p>
            `;

            popup.classList.add("show");
            overlay.classList.add("show");

            document.getElementById("closePopup").addEventListener("click", () => {
                popup.classList.remove("show");
                overlay.classList.remove("show");
            });
        });
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });
});
