
import {api} from "api/main.js";

class RestPassword{

	constructor(config){

		const {modal,unit} = config;
		this.restMd = $("#confirm-MView");
		this.warn = $("#confirm-MView .warn");
		this.pwdInp = $("#confirm-MView .pwd-inp");
		this.modal = modal;
		this.unit = unit;
		this.init();
		this.handle();
	}

	init(){
		
	}

   changePwd(pwdArr){


   		 const old = hex_md5(hex_md5(pwdArr[0]));
   		 const newPwd = hex_md5(hex_md5(pwdArr[2]));

		api.checkPwd(old).then(res=>{
			if(res){

				api.changePwd(newPwd).then(res=>{

						if(res.StatusCode === 0){
							this.unit.tipToast("密码修改失败！",0);
						}else{
							this.modal.close(this.restMd);
							this.unit.tipToast("密码修改成功,将会重新登录！",1);
							const {baseUrl,resourse} = window.jsp_config;
							if(resourse){
								window.location.href=baseUrl+"login/logOut";
							}else{
								window.location.href="login.html";
							}
						}

				})

			}else{
				this.warn.eq(0).html(`<i class="fa fa-exclamation-triangle">&nbsp;</i>旧密码不对！`)
			}
		});

   }

	handle(){
		const _self = this;
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
		
		$("#confirmBtn").click(function(){

			_self.warn.html("");

			const pwdArr =$.map(_self.pwdInp,function(val,index){

				const value = val.value.trim();
				!value  && _self.warn.eq(index).html(`<i class="fa fa-exclamation-triangle">&nbsp;</i>请填写！`);
				return value ;
			});
			
			const noFill = pwdArr.some(val=>!val);
			if(noFill){
				return ;
			}

			if(pwdArr[1] === pwdArr[0]){
				_self.warn.eq(1).html(`<i class="fa fa-exclamation-triangle">&nbsp;</i>新密码与旧密码相同！`);
				return ;
			}	

			if(pwdArr[1] !== pwdArr[2]){
				_self.warn.eq(2).html(`<i class="fa fa-exclamation-triangle">&nbsp;</i>密码确认不对！`);
				return ;
			}



			_self.changePwd(pwdArr);

		});


	}
}

export {RestPassword};