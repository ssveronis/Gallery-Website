document.addEventListener("DOMContentLoaded", function () {
    const dropdownButtons = document.querySelectorAll(".dropdown-btn");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const openBtn = document.querySelector(".main_title .btn");
    const form = document.getElementById("newCategoryForm");
    const availabilityPopup = document.getElementById("availabilityPopup");
    const openAvailabilityButtons = document.querySelectorAll(".dropdown-content .btn");
    const availabilityForm = document.getElementById("newAvailabilityForm");
    const editAvailabilityPopup = document.getElementById("editAvailabilityPopup");
    const editAvailabilityForm = document.getElementById("editAvailabilityForm");

    const availabilityName = document.getElementById("availabilityName");
    const newCategoryId = document.getElementsByName("newCategoryId")[0]
    const categoryName = document.getElementsByName("categoryName")[0]
    const regularPrice = document.getElementsByName("normalPrice")[0]
    const studentPrice = document.getElementsByName("studentPrice")[0]
    const childrenPrice = document.getElementsByName("childrenPrice")[0]
    const audioguidePrice = document.getElementsByName("audioguidePrice")[0]
    const accessAmea = document.getElementsByName("accessAmea")[0]
    const newCategorySubmit = document.getElementById("newCategorySubmit");

    const newTicketAvailId = document.getElementsByName("newTicketAvailId")[0]

    document.getElementById("availabilityDate").min = new Date().toISOString().split('T')[0];

    dropdownButtons.forEach(button => {
        button.addEventListener("click", () => {
            const content = button.closest("div").parentElement.nextElementSibling;

            if (content && content.classList.contains("dropdown-content")) {
                const isVisible = content.style.display === "block";
                content.style.display = isVisible ? "none" : "block";

                const icon = button.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-chevron-up", !isVisible);
                    icon.classList.toggle("fa-chevron-down", isVisible);
                }
            }
        });
    });

    document.querySelectorAll(".edit-action-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            document.querySelectorAll(".action-menu").forEach(m => m.classList.add("hidden"));
            menu.classList.toggle("hidden");
        });
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".action-menu").forEach(m => m.classList.add("hidden"));
    });

    //popup for new category
    openBtn.addEventListener("click", () => {
        availabilityName.innerText = "Νέα Κατηγορία"
        newCategoryId.value = null;
        categoryName.value = null;
        regularPrice.value = null;
        studentPrice.value = null;
        childrenPrice.value = null;
        audioguidePrice.value = null;
        accessAmea.checked = false;
        newCategorySubmit.innerText = "Προσθήκη";

        popup.classList.add("show");
        overlay.classList.add("show");
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        availabilityPopup.classList.remove("show");
        editAvailabilityPopup.classList.remove("show");
        overlay.classList.remove("show");
    });

    document.querySelectorAll(".edit-category-btn").forEach((button) => {
        button.addEventListener("click", async (ev) => {
            const id = ev.target.dataset.categoryId;

            const res = await fetch('/api/ticketCategory/' + id)
            const data = await res.json()

            availabilityName.innerText = "Επεξεργασία Κατηγορίας"
            newCategoryId.value = data.id;
            categoryName.value = data.name;
            regularPrice.value = data.regularPrice;
            studentPrice.value = data.studentPrice;
            childrenPrice.value = data.childrenPrice;
            audioguidePrice.value = data.audioguidePrice;
            accessAmea.checked = data.canAccAMEA;
            newCategorySubmit.innerText = "Αποθήκευση";

            popup.classList.add("show");
            overlay.classList.add("show");
        });
    });


    //popup for new availability
    // Show availability popup
    openAvailabilityButtons.forEach(btn => {
        btn.addEventListener("click", (ev) => {
            newTicketAvailId.value = ev.target.dataset.categoryId;
            availabilityPopup.classList.add("show");
            overlay.classList.add("show");
        });
    });

    // Close availability popup
    // closeAvailabilityBtn.addEventListener("click", () => {
    //     availabilityPopup.classList.remove("show");
    //     overlay.classList.remove("show");
    // });

    availabilityForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("availabilityDate").value;
        const startTime = document.getElementById("availabilityStartTime").value;
        const endTime = document.getElementById("availabilityEndTime").value;
        const total = document.getElementById("availabilityTotal").value;

        if (date && startTime && endTime && total) {
            console.log("New availability:", { date, startTime, endTime, total });

            availabilityPopup.classList.remove("show");
            overlay.classList.remove("show");
            availabilityForm.reset();
        }
    });



});


const editTicketAvailId = document.getElementsByName("editTicketAvailId")[0]
const editAvailabilityTotal = document.getElementById("editAvailabilityTotal")

document.addEventListener("click", function (e) {
    if (e.target.closest(".action-edit")) {
        e.stopPropagation();

        const button = e.target.closest(".action-edit");
        const row = button.closest("tr");

        editTicketAvailId.value = e.target.dataset.availableId;
        editAvailabilityTotal.value = row.childNodes[5].innerText;

        editAvailabilityPopup.classList.add("show");
        overlay.classList.add("show");
    }
});

