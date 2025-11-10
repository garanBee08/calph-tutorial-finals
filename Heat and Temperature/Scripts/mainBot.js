const leaderboardBtn = document.querySelector(".leaderB a");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboard = document.getElementById("closeLeaderboard");
const confettiSound = document.getElementById("confettiSound");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let confettiPieces = [];

function resizeCanvas() {
  confettiCanvas.width = leaderboardModal.offsetWidth;
  confettiCanvas.height = leaderboardModal.offsetHeight;
}

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height,
            r: Math.random() * 6 + 2,
            dx: (Math.random() - 0.5) * 2,
            dy: Math.random() * 2 + 1
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiPieces.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y > confettiCanvas.height) p.y = 0;
    });
    requestAnimationFrame(drawConfetti);
}

leaderboardBtn.addEventListener("click", () => {
    leaderboardModal.style.display = "flex";
    resizeCanvas();
    createConfetti();
    drawConfetti();
    confettiSound.play();
});

closeLeaderboard.addEventListener("click", () => {
    leaderboardModal.style.display = "none";
});
