function generateNoise(ctx, width, height, alpha = 20) { // Lower alpha for more subtlety
    let imageData = ctx.createImageData(width, height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let color = Math.floor(Math.random() * 256); // Grayscale noise
        data[i] = color;    // Red
        data[i + 1] = color;  // Green
        data[i + 2] = color;  // Blue
        data[i + 3] = alpha;  // Lower alpha for subtle effect
    }

    ctx.putImageData(imageData, 0, 0);
}

function draw() {
    let canvas = document.getElementById('noiseCanvas');
    let ctx = canvas.getContext('2d');
    canvas.width = document.body.clientWidth; // full width of the body
    canvas.height = Math.max(
        window.innerHeight,
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );

    generateNoise(ctx, canvas.width, canvas.height);

    // Reduce update frequency to reduce the 'flickering' effect
    setTimeout(draw, 5); // Update every second
}

window.onload = draw;
window.onresize = draw;
window.onscroll = draw;