// Tabs
const tabs = (tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) =>{
	const tabContent = document.querySelectorAll(tabsContentSelector),
	tabsParent = document.querySelector(tabsParentSelector),
	tabs = tabsParent.querySelectorAll(tabsSelector);

	const hideTabContent = () =>{
		tabContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
		tabs.forEach(item =>{
			item.classList.remove(activeClass);
		});
	};

	const showTabContent = (i=1) =>{
		tabContent[i].classList.add('show', 'fade');
		tabContent[i].classList.remove('hide');
		tabs[i].classList.add(activeClass);
	};

	hideTabContent();
	showTabContent();



	tabsParent.addEventListener('click', (e) =>{
		if(e.target && e.target.classList.contains(tabsSelector.slice(1))){
			tabs.forEach((item, i) =>{
				if(e.target === item){
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
};
export default tabs;