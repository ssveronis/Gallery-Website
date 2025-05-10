document.addEventListener("DOMContentLoaded", function () {
    const popup = document.querySelector(".popup");
    const overlay = document.querySelector(".overlay");
    const newUserPopup = document.getElementById("newUserPopup");
    
    
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
            popup.classList.add("show");
            overlay.classList.add("show");
        });
    });

    document.querySelector(".new-user").addEventListener("click", () => {
        newUserPopup.classList.add("show");
        overlay.classList.add("show");
    });

    overlay.addEventListener("click", () => {
        popup.classList.remove("show");
        overlay.classList.remove("show");
        newUserPopup.classList.remove("show");
    });

});

