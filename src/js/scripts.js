import Swiper from 'swiper/swiper-bundle.js'
import WOW from 'wow.js/dist/wow'

function canUseWebp() {
	// Создаем элемент canvas
	let elem = document.createElement('canvas')
	// Приводим элемент к булеву типу
	if ((elem.getContext && elem.getContext('2d'))) {
		// Создаем изображение в формате webp, возвращаем индекс искомого элемента и сразу же проверяем его
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
	}
	// Иначе Webp не используем
	return false
}


window.onload = function () {
	// Получаем все элементы с дата-атрибутом data-bg
	let images = document.querySelectorAll('[data-bg]')
	// Проходимся по каждому
	for (let i = 0; i < images.length; i++) {
		// Получаем значение каждого дата-атрибута
		let image = images[i].getAttribute('data-bg')
		// Каждому найденному элементу задаем свойство background-image с изображение формата jpg
		images[i].style.backgroundImage = 'url(' + image + ')'
	}

	// Проверяем, является ли браузер посетителя сайта Firefox и получаем его версию
	let isitFirefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
	let firefoxVer = isitFirefox ? parseInt(isitFirefox[1]) : 0

	// Если есть поддержка Webp или браузер Firefox версии больше или равно 65
	if (canUseWebp() || firefoxVer >= 65) {
		// Делаем все то же самое что и для jpg, но уже для изображений формата Webp
		let imagesWebp = document.querySelectorAll('[data-bg-webp]')
		for (let i = 0; i < imagesWebp.length; i++) {
			let imageWebp = imagesWebp[i].getAttribute('data-bg-webp')
			imagesWebp[i].style.backgroundImage = 'url(' + imageWebp + ')'
		}
	}
}

function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	}else{
		document.querySelector('body').classList.add('no-webp');
	}
});

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}
// Header Slider
const bulletNum = ['01', '02', '03', '04']
const bulletName = ['North Shore', 'South Shore', 'West Shore', 'East Shore']

const swiperMain = new Swiper('.header__slider', {
	wrapperClass: 'header__slider-wrapper',
	slideClass: 'header__slider-item',
	// Infinite
	loop: true,
	// Change on swiper
	allowTouchMove: false,

	navigation: {
		nextEl: '.header__slider-buttonnext',
		prevEl: '.header__slider-buttonprev',
	},

	pagination: {
		el: '.header__slider-pagination',
		clickable: true,
		renderBullet: function (index, className) {
			return '<div class="' + className + 'header__slider-bullet slider-bullet swiper-pagination-bullet"><span class="slider-bullet__line"></span><div class="slider-bullet__info"><p class="slider-bullet__info-num">' + bulletNum[index] + '</p><p class="slider-bullet__info-caption">' + bulletName[index] + '</p></div></div>'
		},
	},

	// Default Slide
	initialSlide: 2,

	// Fade
	effect: 'fade',
	fadeEffect: {
		crossFade: true,
	},
})

if (window.innerWidth <= 620) {
	swiperMain.pagination.destroy()
}

// Surf Slider
const swiperSurf = new Swiper('.surf-slider', {
	wrapperClass: 'surf-slider__wrapper',
	slideClass: 'surf-box',
	slidesPerView: 4,
	init: false,

	navigation: {
		nextEl: '.surf-slider__button-next',
		prevEl: '.surf-slider__button-prev',
	},

	breakpoints: {
		1210: {
			slidesPerView: 4
		},

		768: {
			slidesPerView: 3
		},

		500: {
			slidesPerView: 2
		},

		300: {
			slidesPerView: 1
		}
	},
	// initialSlide: 1,
	slideToClickedSlide: true
})

swiperSurf.init();
swiperSurf.snapGrid = swiperSurf.slidesGrid.slice(0);

// Swiper Map
const swiperMap = new Swiper('.map-slider', {
	wrapperClass: 'map-slider__wrapper',
	slideClass: 'map-slider__item',
	slidesPerView: 3,
	init: false,
	slideToClickedSlide: true,

	breakpoints: {
		768: {
			slidesPerView: 3,
			spaceBetween: 30
		},

		500: {
			slidesPerView: 2,
			spaceBetween: 15
		},

		300: {
			slidesPerView: 1,
			spaceBetween: 15
		}
	}
})

swiperMap.init();
swiperMap.snapGrid = swiperMap.slidesGrid.slice(0);
//

// 2 slides control
swiperSurf.controller.control	= swiperMap
swiperMap.controller.control	= swiperSurf
//

const swiperHolder = new Swiper('.holder-slider', {
	wrapperClass: 'holder-slider__wrapper',
	slideClass: 'holder-slider__item',

	slidesPerView: 1,

	navigation: {
		nextEl: '.holder-slider__button-next',
		prevEl: '.holder-slider__button-prev',
	},
	// Infinite
	loop: true,

	// Fade
	effect: 'fade',
	fadeEffect: {
		crossFade: true,
	},

	allowTouchMove: false,
})

const bullets = document.querySelectorAll('.surf-map__bullet')
const surfBoxes = document.querySelectorAll('.surf-box')

bullets.forEach((bullet, index = 0) => {
	bullet.onclick = function () {
		bullets.forEach((e) => {
			e.classList.remove('surf-map__bullet--active')
		})
		this.classList.add('surf-map__bullet--active')
		swiperSurf.slideTo(index)
	}
})

surfBoxes.forEach((box, i = 0) => {
	swiperSurf.on('transitionEnd', function () {
		if (box.classList.contains('swiper-slide-active')) {
			bullets.forEach((e) => {
				e.classList.remove('surf-map__bullet--active')
			})
			bullets[i].classList.add('surf-map__bullet--active')
		}
	})
})

const input = document.querySelectorAll('.input')
const inputButtonUp = document.querySelectorAll('.input-button--up')
const inputButtonDown = document.querySelectorAll('.input-button--down')

input.forEach((e, n) => {
	let inputMin = parseFloat(e.getAttribute('min'))
	let inputMax = parseFloat(e.getAttribute('max'))
	let inputStep = parseFloat(e.getAttribute('step'))

	inputButtonUp[n].onclick = function () {
		let oldValue = parseFloat(e.value)
		let newValue

		if (oldValue >= inputMax) {
			newValue = oldValue
		} else {
			newValue = oldValue + inputStep
		}

		e.value = newValue
	}

	inputButtonDown[n].onclick = function () {
		let oldValue = parseFloat(e.value)
		let newValue

		if (oldValue <= inputMin) {
			newValue = oldValue
		} else {
			newValue = oldValue - inputStep
		}

		e.value = newValue
	}
})

const swiperShop = new Swiper('.shop-slider', {
	wrapperClass: 'shop-slider__wrapper',
	slideClass: 'shop-item',

	navigation: {
		nextEl: '.shop-slider__button-next',
		prevEl: '.shop-slider__button-prev',
	},

	spaceBetween: 30,

	allowTouchMove: false,
})

const shopCircle = document.querySelectorAll('.surfboard__box-circle')

shopCircle.forEach(function (e) {
	e.onclick = function () {
		const classActive = document.querySelector('.surfboard__box-circle.surfboard__box-circle--active')
		if (classActive) {
			classActive.classList.remove('surfboard__box-circle--active')
		}
		if (this !== classActive) {
			this.classList.toggle('surfboard__box-circle--active')
		}
	}
})

// Menu Burger
const burger = document.querySelector('.menu-burger')
const menu = document.querySelector('.header__menu.menu')

burger.addEventListener('click', function () {
	menu.classList.toggle('menu--active')
})

const anchor = document.querySelector('.header__arrows-link')

anchor.addEventListener('click', function (e) {
	e.preventDefault()

	document.querySelector(this.getAttribute('href')).scrollIntoView({
		behavior: 'smooth'
	})
})

new WOW().init()
