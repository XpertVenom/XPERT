const carouselSection = document.querySelector('.carousel-section');
const slider = document.querySelector('#animeSlider');
const items = slider ? Array.from(slider.querySelectorAll('.item')) : [];

let activeIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let lastTouchNavigationTime = 0;

function updateCarousel() {
    if (!items.length) {
        return;
    }

    items.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        const offset = (index - activeIndex + items.length) % items.length;

        if (offset === 0) {
            item.classList.add('active');
        } else if (offset === 1) {
            item.classList.add('next');
        } else if (offset === items.length - 1) {
            item.classList.add('prev');
        } else if (offset === 2) {
            item.classList.add('far-next');
        } else if (offset === items.length - 2) {
            item.classList.add('far-prev');
        }
    });
}

function moveCarousel(direction) {
    activeIndex = (activeIndex + direction + items.length) % items.length;
    updateCarousel();
}

function navigateFromPoint(clientX) {
    if (!carouselSection) {
        return;
    }

    const sectionBounds = carouselSection.getBoundingClientRect();
    const midpoint = sectionBounds.left + (sectionBounds.width / 2);

    if (clientX < midpoint) {
        moveCarousel(-1);
    } else {
        moveCarousel(1);
    }
}

if (items.length && carouselSection) {
    updateCarousel();

    carouselSection.addEventListener('click', (event) => {
        if (Date.now() - lastTouchNavigationTime < 400) {
            return;
        }

        navigateFromPoint(event.clientX);
    });

    carouselSection.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    carouselSection.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        if (deltaX < 20 && deltaY < 20) {
            lastTouchNavigationTime = Date.now();
            navigateFromPoint(touch.clientX);
        }
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            moveCarousel(-1);
        }

        if (event.key === 'ArrowRight') {
            moveCarousel(1);
        }
    });
}