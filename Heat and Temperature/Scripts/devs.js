const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const itemCount = items.length;
const theta = 360 / itemCount;
const radius = 450;
let currAngle = 0;

// Arrange items in a circle
items.forEach((item, i) => {
    let angle = theta * i;
    item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
});

// Navigation
document.querySelector('.next').addEventListener('click', () => {
    currAngle -= theta;
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currAngle}deg)`;
});
document.querySelector('.prev').addEventListener('click', () => {
    currAngle += theta;
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currAngle}deg)`;
});

// Auto-rotate
setInterval(() => {
    currAngle -= theta / 2;
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currAngle}deg)`;
}, 4000);

