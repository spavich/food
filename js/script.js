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
		}
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
			const t = getTimeRemaining(endTime)

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
				openModalBtns = document.querySelectorAll('[data-openModal]'),
				closeModalBtns = document.querySelectorAll('[data-closeModal]');

	const openModal = () =>{
		modal.classList.toggle('show');
		document.body.style.overflow = 'hidden';
		clearTimeout(modalTimerId);
		window.removeEventListener('scroll', showModalByScroll);
	};
	const closeModal = () =>{
		modal.classList.toggle('show');
		document.body.style.overflow = '';
	};

	openModalBtns.forEach(item =>{
		item.addEventListener('click', openModal);
	});
	closeModalBtns.forEach(item => {
		item.addEventListener('click', closeModal);
	});

	const modalTimerId = setTimeout(openModal, 3000000);

	const showModalByScroll = () =>{
		if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
			openModal();
		}
	};
	window.addEventListener('scroll', showModalByScroll);

	modal.addEventListener('click', (e) =>{
		if(e.target === modal){
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
				`
			this.parent.append(element);
		}
	}

	new MenuCard(
		'img/tabs/vegy.jpg', 
		'vegy', 
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		'12',
		'.menu .container',
	).render();
	new MenuCard(
		'img/tabs/elite.jpg', 
		'elite', 
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		'23',
		'.menu .container',
	).render();
	new MenuCard(
		'img/tabs/post.jpg', 
		'post', 
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		'15',
		'.menu .container',
	).render();

	// Sumbit Data Forms
	const forms = document.querySelectorAll('form');

	forms.forEach(item => {
		sumbitData(item);
	});

	const messageUser = {
		loading: 'Загрузка',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так'
	};

	function sumbitData(form){
		form.addEventListener('submit', (e) =>{
			e.preventDefault();

			const messageStatus = document.createElement('div');
			messageStatus.classList.add('status');
			messageStatus.textContent = messageUser.loading;
			form.append(messageStatus);

			const request = new XMLHttpRequest();
			request.open('POST', 'server.php');
			request.setRequestHeader('Content-type', 'application/json');

			const formData = new FormData(form);
			const object = {};
			formData.forEach((item, i) =>{
				object[i] = item;
			});
			const json = JSON.stringify(object);
			request.send(json);

			request.addEventListener('load', () =>{
				if(request.status === 200){
					console.log(request.response);
					messageStatus.textContent = messageUser.success;
					form.reset();
					setTimeout(() =>{
						messageStatus.remove();
					}, 1000);
				}else{
					messageStatus.textContent = messageUser.failure;
				}
			});
		});
	}
});