document.addEventListener("DOMContentLoaded", function () {

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

    //popup for user edit
    document.querySelectorAll(".action-edit").forEach(button => {
        button.addEventListener("click", () => {
            const popup = document.querySelector(".popup");
            const overlay = document.querySelector(".overlay");
            popup.classList.add("show");
            overlay.classList.add("show");
        });
    });
    
    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });

});

