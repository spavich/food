// Slider
const slider = ({slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) =>{
	const slidesWrapper = document.querySelector(wrapper),
			slidesField = slidesWrapper.querySelector(field),
			slides = slidesField.querySelectorAll(slide),
			prev = document.querySelector(prevArrow),
			next = document.querySelector(nextArrow),
			current = document.querySelector(currentCounter),
			total = document.querySelector(totalCounter);
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

	const deleteNotDigits = (str) =>{
		return +str.replace(/\D/ig, '');
	}

	prev.addEventListener('click', () =>{
		if(offset === 0){
			offset = deleteNotDigits(slidesWrapperWidth) * (slides.length - 1)
		}else{
			offset -= deleteNotDigits(slidesWrapperWidth);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		(indexSlide === 1) ? indexSlide = slides.length : indexSlide--;
		(indexSlide < 10) ? current.textContent = `0${indexSlide}` : current.textContent = indexSlide;
	});
	next.addEventListener('click', () =>{
		if(offset == deleteNotDigits(slidesWrapperWidth) * (slides.length - 1)){
			offset = 0;
		}else{
			offset += deleteNotDigits(slidesWrapperWidth);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		(indexSlide === slides.length) ? indexSlide = 1 : indexSlide++;
		(indexSlide < 10) ? current.textContent = `0${indexSlide}` : current.textContent = indexSlide;
	});
};
export default slider;