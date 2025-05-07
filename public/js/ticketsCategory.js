document.addEventListener("DOMContentLoaded", function () {
    const dropdownButtons = document.querySelectorAll(".dropdown-btn");

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
});

