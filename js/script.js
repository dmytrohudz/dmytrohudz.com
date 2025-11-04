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