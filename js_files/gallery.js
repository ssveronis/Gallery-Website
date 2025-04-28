document.addEventListener("DOMContentLoaded", function () {
    const galleryItems = [
        { src: "images/gallery/img1.jpg", caption: "Έργο 1 - Πίνακας της μόνιμης συλλογής" },
        { src: "images/gallery/img2.jpg", caption: "Έργο 2 - Εσωτερικός χώρος έκθεσης" },
        { src: "images/gallery/img3.jpg", caption: "Έργο 3 - Κλασικά έργα τέχνης" },
        { src: "images/gallery/img4.jpg", caption: "Έργο 4 - Φωτογραφία της αίθουσας" },
        { src: "images/gallery/img5.jpg", caption: "Έργο 5 - Σύγχρονη τέχνη" }
    ];

    const galleryContainer = document.getElementById('gallery');

    galleryItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption;

        const caption = document.createElement('div');
        caption.classList.add('gallery-caption');
        caption.textContent = item.caption;

        card.appendChild(img);
        card.appendChild(caption);
        galleryContainer.appendChild(card);
    });
});
