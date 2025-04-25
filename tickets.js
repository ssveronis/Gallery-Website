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