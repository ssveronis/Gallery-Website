document.addEventListener("DOMContentLoaded", function () {
    const popup = document.querySelector(".popup");
    const overlay = document.querySelector(".overlay");
    const newUserPopup = document.getElementById("newUserPopup");

    const userId = document.getElementById("userId");
    const editDisplayName = document.getElementById("editDisplayName");
    const editEmail = document.getElementById("editEmail");
    
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
        button.addEventListener("click",async (ev) => {
            const id = ev.target.dataset.id

            const res = await fetch(`/api/getUser/${id}`)
            const data = await res.json()

            userId.value = id;
            editDisplayName.value = data.displayName;
            editEmail.value = data.email;

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

