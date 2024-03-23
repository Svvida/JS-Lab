document.addEventListener("DOMContentLoaded", () => {
	const slides = document.querySelectorAll(".slide");
	const totalSlides = slides.length;
	const sliderIndicators = document.querySelector(".slider-indicators");
	let currentSlide = 0;
	let isPaused = false;

	function updateSlider() {
		const offset = -currentSlide * 100;
		document.querySelector(
			".slides"
		).style.transform = `translateX(${offset}%)`;
	}

	document.querySelector(".prev").addEventListener("click", () => {
		currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
		updateSlider();
	});

	document.querySelector(".next").addEventListener("click", () => {
		currentSlide = (currentSlide + 1) % totalSlides;
		updateSlider();
	});

	for (let i = 0; i < totalSlides; i++) {
		let button = document.createElement("button");
		button.innerText = i + 1;
		button.addEventListener("click", () => {
			currentSlide = i;
			updateSlider();
		});
		sliderIndicators.appendChild(button);
	}

	const pausePlayBtn = document.querySelector(".pause-play");
	pausePlayBtn.addEventListener("click", () => {
		isPaused = !isPaused;
		pausePlayBtn.textContent = isPaused ? "Play" : "Pause";
	});

	setInterval(() => {
		if (!isPaused) {
			currentSlide = (currentSlide + 1) % totalSlides;
			updateSlider();
		}
	}, 3500);

	const lightbox = document.getElementById("lightbox");
	const lightboxImg = document.querySelector(".lightbox-content");
	slides.forEach((slide) => {
		slide.addEventListener("click", () => {
			const imgSrc = slide.querySelector("img").src;
			lightbox.style.display = "flex";
			lightboxImg.src = imgSrc;
			isPaused = true;
		});
	});

	lightbox.addEventListener("click", (e) => {
		if (e.target !== lightboxImg) {
			lightbox.style.display = "none";
			isPaused = false;
		}
	});

	document.querySelector(".close").addEventListener("click", () => {
		lightbox.style.display = "none";
		isPaused = false;
	});
});
