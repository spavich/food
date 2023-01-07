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
	const deadline = Date.parse('2023.09.23');

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
	const slides = document.querySelectorAll('.offer__slide'),
				prev = document.querySelector('.offer__slider-prev'),
				next = document.querySelector('.offer__slider-next'),
				current = document.querySelector('#current'),
				total = document.querySelector('#total');
	let indexSlide = 1;

	showSlides(indexSlide);

	if(slides.length < 10){ 
		total.textContent = `0${slides.length}`
	}else{
		total.textContent = slides.length;
	}

	function showSlides(i){
		if(slides.length < i){
			indexSlide = 1;
		}
		if(i < 1){
			indexSlide = slides.length;
		}

		slides.forEach(item => item.style.display = 'none');
		slides[indexSlide - 1].style.display = 'block';

		if(indexSlide < 10){
			current.textContent = `0${indexSlide}`
		}else{
			current.textContent = indexSlide;
		}
	}

	function plusSlides(n){
		showSlides(indexSlide += n)
	}

	prev.addEventListener('click', () =>{
		plusSlides(-1);
	});
	next.addEventListener('click', () =>{
		plusSlides(1);
	});
});
