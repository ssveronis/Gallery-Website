const MOBILE_THRESHOLD = 1024;
const isMobilePage = window.location.pathname.endsWith('MobileHomepage.html');

function handleScreenSize() {
  const isMobileView = window.innerWidth <= MOBILE_THRESHOLD;

  if (isMobileView && !isMobilePage) {
    window.location.href = 'MobileHomepage.html'; // Redirect to mobile
    console.log('Redirecting to mobile version...');
  } 
  else if (!isMobileView && isMobilePage) {
    window.location.href = 'HomePage.html'; // Redirect back to desktop
    console.log('Redirecting to desktop version...');
  }
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleScreenSize, 100);
});

handleScreenSize();