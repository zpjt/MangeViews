import "css/login.scss";
import Particles from "js/common/particles.js" ;
import {AnimateView} from "js/login/AnimateView.js" ;
import {Remind} from "js/login/Remind.js" ;

const  anime = require("js/common/anime.min.js");
const {baseUrl} = window.jsp_config;



class Login{

	constructor(config){
    this.remindSet = config.remindSet;
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
                url:baseUrl+"login/logVal",
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

                     _self.remindSet(originPwd,obj.user_name);
                  
                     if(window.jsp_config.resourse){
                         window.location.href= baseUrl+data.url; 
                     }else{
                        window.location.href= data.url; 
                     }
                }
            });
           
            let {particles,buttonVisible} = _self;
            if ( !particles.isAnimating()) {
                particles.disintegrate();
            }
        });
	}
}




class Page{

    constructor(){
        this.login = new Login({
          remindSet:(originPwd,obj)=>{
            this.remindSet(originPwd,obj);
          }
        });
        this.animateView = new AnimateView();
        this.remind = new Remind(this.login.user,this.login.pwd);
    }

    remindSet(originPwd,user_name){

        this.remind.reminCheck.prop("checked") ? this.remind.setRemind({originPwd,user_name}) : this.remind.removeRemind();

    }
}

const page = new Page();


