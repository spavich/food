window.addEventListener('DOMContentLoaded', () =>{
	// Tabs
	const tabContent = document.querySelectorAll('.tabcontent'),
			tabsParent = document.querySelector('.tabheader__items'),
			tabs = tabsParent.querySelectorAll('.tabheader__item');

	const hideTabContent = () =>{
		tabContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
		tabs.forEach(item =>{
			item.classList.remove('tabheader__item_active');
		});
	};

	const showTabContent = (i=1) =>{
		tabContent[i].classList.add('show', 'fade');
		tabContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	};

	hideTabContent();
	showTabContent();



	tabsParent.addEventListener('click', (e) =>{
		if(e.target && e.target.classList.contains('tabheader__item')){
			tabs.forEach((item, i) =>{
				if(e.target === item){
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// Timer
	const deadline = Date.parse('2023.04.01');

	const getTimeRemaining = (endTime) =>{
		const total = endTime - Date.parse(new Date());

		const days = Math.floor(total / (1000 * 60 * 60 * 24));
		const hours = Math.floor(total / (1000 * 60 * 60) %24);
		const minutes = Math.floor(total / (1000 * 60) %60);
		const seconds = Math.floor(total / (1000) %60);

		return{
			total,
			days,
			hours,
			minutes,
			seconds
		};
	};

	const getZero = (num) =>{
		return (0 <= num && num < 10) ? `0${num}` : num;
	};
	const setClock = (selector, endTime) =>{
		const timer = document.querySelector(selector),
					days = timer.querySelector('#days'),
					minutes = timer.querySelector('#minutes'),
					seconds = timer.querySelector('#seconds');
		const timeInterval = setInterval(updateClock, 1000);

		updateClock();
		function updateClock (){
			const t = getTimeRemaining(endTime);

			days.textContent = getZero(t.days);
			minutes.textContent = getZero(t.minutes);
			seconds.textContent = getZero(t.seconds);

			if(t.total <= 0){
				clearInterval(timeInterval);
			}
		}
	};

	setClock('.timer', deadline);

	// Modal window
	const modal = document.querySelector('.modal'),
				openModalBtns = document.querySelectorAll('[data-openModal]');

	const openModal = () =>{
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearTimeout(modalTimerId);
		window.removeEventListener('scroll', showModalByScroll);
	};
	const closeModal = () =>{
		modal.classList.remove('show');
		modal.classList.add('hide');
		document.body.style.overflow = '';
	};

	openModalBtns.forEach(item =>{
		item.addEventListener('click', openModal);
	});

	const modalTimerId = setTimeout(openModal, 3000000);

	const showModalByScroll = () =>{
		if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
			openModal();
		}
	};
	window.addEventListener('scroll', showModalByScroll);

	modal.addEventListener('click', (e) =>{
		if(e.target === modal || e.target.getAttribute('data-closeModal') === ''){
			closeModal();
		}
	});
	document.addEventListener('keydown', (e) =>{
		if(e.code === 'Escape' && modal.classList.contains('show')){
			closeModal();
		}
	});

	// Cards
	class MenuCard{
		constructor(src, alt, title, descr, price, parentSelector, ...props){
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.props = props;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 45;
			this.changeToUAH();
		}
		changeToUAH(){
			this.price = this.price *  this.transfer;
		}
		render(){
			const element = document.createElement('div');
			(this.props.length === 0) ? element.classList.add('menu__item') : this.props.forEach(item => element.classList.add(item));

			element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
							<div class="menu__item-cost">Цена:</div>
							<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>
				`;
			this.parent.append(element);
		}
	}

	const getResource = async (url) =>{
		const res = await fetch(url);
		if(!res.ok){
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};

	getResource('http://localhost:3000/menu')
	.then(data => {
		data.forEach(({img, altimg, title, descr, price}) => {
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
		});
	});

	// Sumbit Data Forms
	const forms = document.querySelectorAll('form');

	forms.forEach(item => {
		sumbitData(item);
	});

	const messageUser = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так'
	};

	const postData = async (url, data) =>{
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await res.json();
	};

	function sumbitData(form){
		form.addEventListener('submit', (e) =>{
			e.preventDefault();

			const messageStatus = document.createElement('img');
			messageStatus.src = messageUser.loading;
			messageStatus.style.cssText = 'display: block; margin: 10px auto 0';
			form.insertAdjacentElement('afterend', messageStatus);

			const formData = new FormData(form);
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
			.then(data => {
				console.log(data);
				showThanksModal(messageUser.success);
			})
      .catch(() => {
				showThanksModal(messageUser.failure);
			})
			.finally(() => {
				form.reset();
				messageStatus.remove();
			});
		});
	}

	function showThanksModal(message){
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div data-closeModal="" class="modal__close">×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() =>{
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 3000);
	}

	// Slider
	const slidesWrapper = document.querySelector('.offer__slider-wrapper'),
				slidesField = slidesWrapper.querySelector('.offer__slider-inner'),
				slides = slidesField.querySelectorAll('.offer__slide'),
				prev = document.querySelector('.offer__slider-prev'),
				next = document.querySelector('.offer__slider-next'),
				current = document.querySelector('#current'),
				total = document.querySelector('#total');
	const slidesWrapperWidth = window.getComputedStyle(slidesWrapper).width;
	let indexSlide = 1;
	let offset = 0;

	(slides.length < 10) ? total.textContent = `0${slides.length}` : total.textContent = slides.length;
	(indexSlide < 10) ? current.textContent = `0${indexSlide}` : current.textContent = indexSlide;

	slidesWrapper.style.overflow = 'hidden';
	slidesField.style.cssText = `display: flex; transition: 0.5s all; width: ${100 * slides.length}%`;
	slides.forEach(item =>{
		item.style.width = slidesWrapperWidth;
	});

	prev.addEventListener('click', () =>{
		if(offset === 0){
			offset = +slidesWrapperWidth.slice(0, slidesWrapperWidth.length - 2) * (slides.length - 1)
		}else{
			offset -= +slidesWrapperWidth.slice(0, slidesWrapperWidth.length - 2);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		(indexSlide === 1) ? indexSlide = slides.length : indexSlide--;
		(indexSlide < 10) ? current.textContent = `0${indexSlide}` : current.textContent = indexSlide;
	});
	next.addEventListener('click', () =>{
		if(offset == +slidesWrapperWidth.slice(0, slidesWrapperWidth.length - 2) * (slides.length - 1)){
			offset = 0;
		}else{
			offset += +slidesWrapperWidth.slice(0, slidesWrapperWidth.length - 2);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		(indexSlide === slides.length) ? indexSlide = 1 : indexSlide++;
		(indexSlide < 10) ? current.textContent = `0${indexSlide}` : current.textContent = indexSlide;
	});

	// Daily calorie calculator
	const result = document.querySelector('.calculating__result span');
	let sex, height, weight, age, ratio;

	if(localStorage.getItem('sex')){
		sex = localStorage.getItem('sex'); 
	}else{
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}

	if(localStorage.getItem('ratio')){
		ratio = localStorage.getItem('ratio')
	}else{
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}

	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
				elem.classList.remove(activeClass);
				if (elem.getAttribute('id') === localStorage.getItem('sex')) {
						elem.classList.add(activeClass);
				}
				if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
						elem.classList.add(activeClass);
				}
		});
	}

	initLocalSettings('#gender div', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

	function calcTotal(){
		if(!sex || !height || !weight || !age || !ratio){
			result.textContent = '____';
			return;
		}
		if(sex === 'female'){
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		}else{
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}
	calcTotal();

	function getStaticInformation(selector, activeClass){
		const elements = document.querySelectorAll(selector);

		elements.forEach(item =>{
			item.addEventListener('click', (e) =>{
				if(e.target.hasAttribute('data-ratio')){
					ratio = +e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				}else{
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex', e.target.getAttribute('id'));
				}
	
				elements.forEach(item => item.classList.remove(activeClass));
				e.target.classList.add(activeClass);
	
				calcTotal();
			});
		});
	}
	getStaticInformation('#gender div', 'calculating__choose-item_active')
	getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')

	function getDynamicInformation(selector){
		const input = document.querySelector(selector);

		input.addEventListener('input', () =>{
			if(input.value.match(/\D/g)){
				input.style.border = '3px solid red';
			}else{
				input.style.border = 'none';
			}

			switch(input.getAttribute('id')){
				case 'height': 
					height = +input.value;
					break;
				case 'weight': 
					weight = +input.value;
					break;
				case 'age': 
					age = +input.value;
					break;
			}

			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
});