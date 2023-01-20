// Timer
const timer = (id, deadlineDate) =>{
	const deadline = Date.parse(deadlineDate);

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

	setClock(id, deadline);
};
export default timer;