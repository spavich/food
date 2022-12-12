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
});