import tabs from './modules/tabs';
import timer from './modules/timer';
import slider from './modules/slider';
import modalWindow from './modules/modalWindow';
import cards from './modules/cards';
import submitForm from './modules/submitForm';
import calorieCalc from './modules/calorieCalculator';
import { openModal } from './modules/modalWindow';

window.addEventListener('DOMContentLoaded', () =>{
	const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	timer('.timer', '2023.04.01');
	slider({
		slide: '.offer__slide',
		nextArrow: '.offer__slider-next',
		prevArrow: '.offer__slider-prev',
		totalCounter: '#total',
		currentCounter: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner',
	});
	modalWindow('[data-openModal]', '.modal', modalTimerId);
	cards();
	submitForm('form', modalTimerId);
	calorieCalc();
});