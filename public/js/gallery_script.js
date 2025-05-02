document.addEventListener('DOMContentLoaded', function () {
  const galleryContainer = document.getElementById('galleryContainer');
  const images = [
    { src: 'img/gallery/img1.jpg', caption: 'Αίθουσα Εισόδου' },
    { src: 'img/gallery/img2.jpg', caption: 'Σύγχρονη Πτέρυγα' },
    { src: 'img/gallery/img3.jpg', caption: 'Αίθουσα Ιστορικών Έργων' },
    { src: 'img/gallery/img4.jpg', caption: 'Γλυπτική' },
    { src: 'img/gallery/img5.jpg', caption: 'Φωτογραφική Συλλογή' }
  ];

  images.forEach(image => {
    const container = document.createElement('div');
    container.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.caption;

    const caption = document.createElement('p');
    caption.textContent = image.caption;

    container.appendChild(img);
    container.appendChild(caption);
    galleryContainer.appendChild(container);
  });
});
