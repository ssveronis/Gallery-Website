const step1 = document.querySelector('.step1');
const step2 = document.querySelector('.step2');

document.getElementById('codeBtn').addEventListener('click', function() {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

document.getElementById('resetBtn').addEventListener('click', function() {
    window.location.href = '/admin';
});