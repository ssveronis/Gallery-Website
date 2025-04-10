
const searchBar = document.querySelector('.search_bar');
const searchIcon = document.querySelector('.search_icon');
const searchInput = document.querySelector('.search_bar input[type="text"]');

// searchIcon.addEventListener('click', () => {
//   searchBar.classList.toggle('active');
//   if (searchBar.classList.contains('active')) {
//     searchInput.focus();
//   }
// });

// searchInput.addEventListener('blur', () => {
//   if (!searchInput.value && searchBar.classList.contains('active')) {
//     searchBar.classList.remove('active');
//   }
// });

document.querySelector('.tickets_btn').addEventListener('click', function () {
  window.location.href = 'tickets.html';
});

