document.querySelector(".checkout-form").addEventListener("submit", function(e) {
    if (this.checkValidity()) {
        e.preventDefault();
        window.location.href = "/buy";
    }
});