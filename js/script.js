window.addEventListener('DOMContentLoaded', () =>{
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
});