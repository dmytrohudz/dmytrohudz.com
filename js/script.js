// Lottie animation for avatar
var avatarContainer = document.getElementById('user-avatar');
if (avatarContainer && window.lottie) {
    var animation = lottie.loadAnimation({
        container: avatarContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/dmytrohudz.json'
    });
}

// Page load animation
document.addEventListener('DOMContentLoaded', function() {
    // Apply fade-in animation to main content sections
    var header = document.querySelector('header');
    var main = document.querySelector('main');
    var footer = document.querySelector('footer');
    
    if (header) header.classList.add('fade-in-content');
    if (main) main.classList.add('fade-in-content');
    if (footer) footer.classList.add('fade-in-content');
});