import "css/test.scss";
import Particles from "./particles.js" ;

console.log(Particles);


class Inp{

	constructor(){
		this.init();
		this.handle();
	}

	init(){

	}

	handle(){

		$(".inp-field").blur(function(){
			const $this = $(this);
			const val = $this.val().trim();
			const $par = $this.parent();

			if(val){
				$par.addClass("s-filled");
			}else{
				$par.removeClass('s-filled');
			}
		});

	}
}

new Inp();

setTimeout(function(){

const bttn = $("#j-login")[0];

const particlesOpts = {
			 direction: 'right',

        };

const particles = new Particles(bttn, particlesOpts);
        
let buttonVisible = true;
bttn.addEventListener('click', () => {
    if ( !particles.isAnimating() && buttonVisible ) {
        particles.disintegrate();
        buttonVisible = !buttonVisible;
    }
});

}, 2000);


