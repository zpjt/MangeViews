import "css/login.scss";
import Particles from "js/common/particles.js" ;

const  anime = require("js/common/anime.min.js");

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
        const originPwd = password;
    
    
        password=hex_md5(hex_md5(password));

        return {
            user_name,
            password,
            originPwd,
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

         
             const {originPwd ,...obj} = _self.getvalue();
              _self.warn.html("")
              _self.buttonVisible = false;

            const animate = new  Promise(function(resolve){
                    setTimeout(function(){
                       resolve("test1");
                    }, 1000);
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


                     page.remind.reminCheck.prop("checked") ? page.remind.setRemind({originPwd,user_name:obj.user_name}) : page.remind.removeRemind();
                  
                  //  window.location.href=baseUrl+data.url;  
                     
                     window.location.href = data.url;  
                }
            });
           
            let {particles,buttonVisible} = _self;
            if ( !particles.isAnimating()) {
                particles.disintegrate();
            }
        });
	}
}

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

        this.initType('9902');
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

                   /* $screen.css({
                        "background-image":`url(${baseUrl}/resources/webpack/dist/img/${color[end]}.png`,
                    });*/

                    anime({
                              targets: '.screen-bg',
                              translateY:374,
                              scale:1.5,
                              duration: 1000,
                              direction:"reverse",
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

class Remind{

    constructor($user,$pwd){

        this.reminCheck = $("#remind");

        this.RemindFill($user,$pwd);
    }

  getRemind(){

    const remindUser = window.localStorage.getItem("$remind_u");
    const remindPwd = window.localStorage.getItem("$remind_p");

    return {remindUser,remindPwd};

  }  

  setRemind(obj){
    const user = obj.user_name;
    const pwd = obj.originPwd;

    window.localStorage.setItem("$remind_u",user);
    window.localStorage.setItem("$remind_p",pwd);
  }  

  removeRemind(){

    window.localStorage.removeItem("$remind_u");
    window.localStorage.removeItem("$remind_p");

  }  

  RemindFill($user,$pwd){
    
    const {remindUser,remindPwd} = this.getRemind();

    const status = remindUser && remindPwd && true || false ;

    this.reminCheck.prop("checked",status);

    if(status){

       $user.val(remindUser);
       $user.parent().addClass("s-filled");
       $pwd.val(remindPwd);
       $pwd.parent().addClass("s-filled");
    }

  }

}

class Page{

    constructor(){
        this.login = new Login();
        this.animateView = new AnimateView();
        this.remind = new Remind(this.login.user,this.login.pwd);
    }
}

const page = new Page();


