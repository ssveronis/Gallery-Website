document.addEventListener("DOMContentLoaded", function () {
    const dropdownButtons = document.querySelectorAll(".dropdown-btn");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const openBtn = document.querySelector(".main_title .btn");
    const form = document.getElementById("newCategoryForm");
    const availabilityPopup = document.getElementById("availabilityPopup");
    const openAvailabilityButtons = document.querySelectorAll(".dropdown-content .btn"); // adjust if needed
    const availabilityForm = document.getElementById("newAvailabilityForm");


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
        popup.classList.add("show");
        overlay.classList.add("show");
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
        availabilityPopup.classList.remove("show");
        overlay.classList.remove("show");
    });

    //popup for new availability
    // Show availability popup
    openAvailabilityButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            availabilityPopup.classList.add("show");
            overlay.classList.add("show");
        });
    });

    // Close availability popup
    closeAvailabilityBtn.addEventListener("click", () => {
        availabilityPopup.classList.remove("show");
        overlay.classList.remove("show");
    });

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

