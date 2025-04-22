const searchBar = document.querySelector('.search_bar');
const searchIcon = document.querySelector('.search_icon');
const searchInput = document.querySelector('.search_bar input[type="text"]');


document.querySelector('.tickets_btn').addEventListener('click', function () {
  window.location.href = 'tickets.html';
});

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  easing: 'ease-in-out'
});


