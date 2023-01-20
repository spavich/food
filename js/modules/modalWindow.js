const openModal = (modalSelector, modalTimerId) =>{
	const modal = document.querySelector(modalSelector);

	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	if(modalTimerId){
		clearTimeout(modalTimerId);
	}
};
const closeModal = (modalSelector) =>{
	const modal = document.querySelector(modalSelector);

	modal.classList.remove('show');
	modal.classList.add('hide');
	document.body.style.overflow = '';
};

// Modal window
const modalWindow = (triggerSelector, modalSelector, modalTimerId) =>{
	const modal = document.querySelector(modalSelector),
			openModalBtns = document.querySelectorAll(triggerSelector);

	openModalBtns.forEach(item =>{
		item.addEventListener('click', () => openModal(modalSelector, modalTimerId));
	});

	const showModalByScroll = () =>{
		if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
			openModal(modalSelector, modalTimerId);
			window.removeEventListener('scroll', showModalByScroll);
		}
	};
	window.addEventListener('scroll', showModalByScroll);

	modal.addEventListener('click', (e) =>{
		if(e.target === modal || e.target.getAttribute('data-closeModal') === ''){
			closeModal(modalSelector);
		}
	});
	document.addEventListener('keydown', (e) =>{
		if(e.code === 'Escape' && modal.classList.contains('show')){
			closeModal(modalSelector);
		}
	});
};
export default modalWindow;
export {openModal, closeModal};