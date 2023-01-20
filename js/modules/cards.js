import { getResource } from "../services/services";

// Cards
const cards = () =>{
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
	
	getResource('http://localhost:3000/menu')
	.then(data => {
		data.forEach(({img, altimg, title, descr, price}) => {
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
		});
	});
};
export default cards;