import "css/test.scss";
import "./css/index.css";

import Particles from "./particles.js" ;
const  anime = require("./anime.min.js");

const {baseUrl} = window.jsp_config;


class Login{

	constructor(){
		this.init();
		this.handle();
	}

	init(){

        this.subBtn = $("#j-login");
        this.user = $("#user"),
        this.warn = $("#warn"),
        this.pwd = $("#pwd");

        this.initSubBtn();
	}

    backBtn(){

        let {particles,buttonVisible} = this;
         if ( !particles.isAnimating()) {
               
                particles.integrate({
                    duration: 800,
                    easing: 'easeOutSine'
                });
           
            }
             
    }

    async initSubBtn(){
        
        const bttn = this.subBtn[0];
        this.buttonVisible = true;
        const _self = this ;

        const particlesOpts = {
                    color:"#43425D",
                };

        particlesOpts.complete = () => {
         
           if(!_self.buttonVisible){
             _self.backBtn();
             _self.buttonVisible = true;
           } 

        };

        this.particles = new Particles(bttn, particlesOpts);
      
    }

    login(obj){

       return  Promise.resolve(
            $.ajax({
                url:baseUrl+"/login/logVal",
                contentType:"application/json",
                type:"post",
                asyncBoolean:false,
                data:JSON.stringify(obj)
            })
        );
    }

    getvalue(){
        const user_name = this.user.val().trim();
        let password = this.pwd.val().trim();
    
    
        password=hex_md5(hex_md5(password));

        return {
            user_name,
            password
        }
    }

	handle(){

        const _self = this ;

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

        this.subBtn.on("click",function(){

             const obj = _self.getvalue();
            _self.warn.html("")

              _self.buttonVisible = false;

            const animate = new  Promise(function(resolve){
                    setTimeout(function(){
                       resolve("test1");
                    }, 2200);
            });

            const login = _self.login(obj).then(data=>{

               
                
                if(data.url=="null") {

                     _self.particles.pause();
                      _self.warn.html('<span id="warnContent"><i class="fa fa-exclamation-triangle"></i>用户名或密码错误！</span>');
                         
                }else if(data.url == "0"){

                      _self.particles.pause();
                      _self.warn.html('<span class="warnContent" ><i class="fa fa-exclamation-triangle"></i>该账户已被禁用</span></p>');
                }

                 anime({
                              targets: '#warnContent',
                              translateX:"-100%",
                              duration: 1000,
                              easing: [.91,-0.54,.29,1.56]
                            });

                return data ;
            });

            Promise.all([animate,login]).then(res=>{
               
                const data = res[1];
                if(data.url ==="/index") {
                   //  window.location.href=baseUrl+data.url;  
                    window.location.href=data.url;  
                }
            });

           
            let {particles,buttonVisible} = _self;
            if ( !particles.isAnimating()) {
                particles.disintegrate();
               //  _self.login(obj);
            }
        });
	}
}

new Login();

class AnimateView{

    constructor(){
        this.init();
    }

    init(){
        this.Roate($);
        this.initRoate();
    }

    initRoate(){

       $('#roate1').Roate({
            R:193,
            cx:296,
            cy:274,
            step:0.5,
            delay:60
        });

        $('#roate2').Roate({
            R:205,
            R0:81,
            cx:302,
            cy:519,
            direction:false,
            step:0.5,
            delay:60,
            screenEl:$(".screen-bg")
        });

        this.initType('9904');
    }

    initType(typeCode){
         $('.roate-container').addClass('type'+typeCode);
    }

    Roate($){


        $.fn.Roate=function(opts){

            let roateInter=null;
            const $this =this;
            opts = $.extend({
                R:100,
                R0:0,
                cx:0,
                cy:0,
                step:5,
                delay:100,
                direction:true,//逆时针或逆时针
                roateItem:'.roate-item'
            },opts||{});

            const width = $this.width();
            const height = $this.height();
            if(!opts.cx){
                opts.cx=width/2;
            }
            if(!opts.cy){
                opts.cy=height/2;
            }
            const $item = $this.find(opts.roateItem);
            const size = $item.length;
            let roate=0;
          
            opts.R0 = opts.R0==0?opts.R:opts.R0;
            roateInter=setInterval(function(){

           
            for (let i = 0; i < size; i++) {
                const left = opts.cx+opts.R*Math.sin(Math.PI/180*(roate+360*i/size));
                const top = opts.cy+opts.R0*Math.cos(Math.PI/180*(roate+360*i/size));
                const $roate = $item.eq(i);
                const rheight = $roate.height()/2;
                const rwidth = $roate.width()/2;
                $roate.css({
                    left: left-rheight,
                    top: top-rwidth
                });
            };

            const $screen = opts.screenEl;
            if($screen){ 
                const arr = [];
                for(let i =0; i<4; i++){

                    arr[i] = (roate + 90*i)%360;
                }

                const end = arr.findIndex(function(val){
                    return val === 130 ;
                });

                const color = ["screen-bg1","screen-bg2","screen-bg3","screen-bg4"];

                 if(end >-1){

                    $screen.css({
                        "background-image":"url(../img/"+color[end]+".png",
                    });
                    anime({
                              targets: '.screen-bg',
                              translateY:374,
                              scale:1.5,
                              duration: 1000,
                              direction:"reverse",
                          //    easing: "easeOutExpo",
                                 easing: [.91,-0.54,.29,1.56],
                              complete: function(anim) {
                                $screen.css({
                                    "transform": "translateY(0)",
                                });
                              }
                    }); 
                  
                 } 
            }

            if(opts.direction){
                roate -= opts.step;
            }else{
                roate += opts.step;
            }

        }, opts.delay);

       /* this.parent().mousemove(function(event) {
            if(event.offsetX<width/2){
                opts.direction=false;
            }else{
                opts.direction=true;
            }
        });*/

    };

    }
}

new AnimateView();



