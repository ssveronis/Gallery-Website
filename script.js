
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

document.querySelectorAll('.ticket-counter-group').forEach(group => {
  const input = group.querySelector('input');
  const increment = group.querySelector('.increment');
  const decrement = group.querySelector('.decrement');

  increment.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
  });

  decrement.addEventListener('click', () => {
      if (parseInt(input.value) > 0) {
          input.value = parseInt(input.value) - 1;
      }
  });
});


