import { openModal, closeModal } from "./modalWindow";
import { postData } from "../services/services";

// Sumbit Data Forms
const sumbitForms = (formSelector, modalTimerId) =>{
	const forms = document.querySelectorAll(formSelector);

	forms.forEach(item => {
		sumbitData(item);
	});

	const messageUser = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так'
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
		openModal('.modal', modalTimerId);

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
			closeModal('.modal');
		}, 3000);
	}
};
export default sumbitForms;