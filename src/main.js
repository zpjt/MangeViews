import "css/main.scss";
import "css/common/button.scss";
import {api} from "api/main.js";
import {RippleBtn,Unit,SModal} from "js/common/Unit.js";
import {Menu} from "js/main/Menu.js";
import {SoketNews} from "js/main/SoketNews.js";
import {RestPassword} from "js/main/RestPassword.js";



const {role_id,baseUrl,base} = window.jsp_config;


class Page{


	constructor(){
		this.iframe = $("#router");
		this.unit = new Unit();
		this.modal = new SModal();
		this.handle();
		this.init();
		
	}

	init(){

		/*水波按钮*/
		new RippleBtn();
	 
		this.menu = new Menu();
		this.renderMenu();
		this.news = new SoketNews();
		this.restPassword = new RestPassword({
			modal:this.modal,
			unit:this.unit,
		});
	}

	findFistMenuID(res){
		
		let flag = res[0];

		let is_par = flag.menu_type_id === 1 ; 

		let id = flag.id;

		while(is_par){

			flag = flag.sub[0];
			is_par = flag.menu_type_id === 1 ; 
			id = flag.id;

		}

		return id ;
	}

	renderMenu(flag=0){
		return api.getLeftMenu(role_id,flag).then(res=>{

			if(res && res.sub){
				const data = res.sub;
				const ElArr = this.menu.mapMenuJson(res.sub,0);
				this.menu.box.html(ElArr.join(""));
					
				const id_first = this.findFistMenuID(res.sub);
				$(`.menuItem[echo-id=${id_first}]`).click();

			}else{
				this.unit.tipToast("菜单为空",2);
				
			}
			
		});
	}

	handle(){

		const _self = this;

		const closeFun = (function (){
			let count  =  0 ;
			const $slide =$("#slide");
			return function(){
				count ++ ;
				if(count%2){
					$slide.animate({"width":45},500,function(){
						$slide.addClass("collapsed");
						$(".par-menu").removeAttr("style");
					});
				}else{
					$(".slide-icon").html('<i class="fa fa-chevron-down"></i>');
					$slide.animate({"width":250},500,function(){
						$slide.removeClass("collapsed");
					});
				}
			}
		})();

		/*收缩菜单*/
		$("#slideFoot").click(function(){
			closeFun();
		});

	
		/*消息框事件*/
		$("#g-news").on("click",".handleSign",function(){

			const type = $(this).prop("id");

			switch(type){
				case "closeMessage":
				case "j-news":{
					_self.news.messageEl.slideToggle();
					break;
				}
				case"j-allMark":{/*标记所有消息*/
							const news = _self.news.messageEl.find(".newItem");

							if(!news.length){
								return ;
							}

							_self.news.messageEl.slideToggle();

						 const obj = $.map(news,function(val){
							return {id:$(val).attr("echo-data")};
						 });
				
						 Promise.resolve(
							$.ajax({
								method:"post",
								url:window.jsp_config.baseUrl+"Alarm/upAlarmSendStatus",
								contentType:"application/json",
								data:JSON.stringify(obj),
							})
						).then(res=>{

							_self.unit.tipToast("标记成功！",1);
							const curMenu = $(".child-item.active").attr("data-url").includes("News");
							if(curMenu){
									$(".child-item.active").click();
							}

						});
					break;
				}
				case "j-allMessage":{	
					$(".menuItem[data-url='index\/lists\/News']").click();
						 _self.news.messageEl.slideToggle();
					break;
				}
			}

		})

		/*系统操作*/
		$("#userOpt").on("click","li",function(){

			const key = $(this).attr("key");

			switch(key){

				case "password":{//修改密码
					_self.modal.show(_self.restPassword.restMd)
					break;
				}
				case "power": //退出登录

					if(window.jsp_config.resourse){
						window.location.href=baseUrl+"login/logOut";
					}else{
						window.location.href="login.html";
					}
				
				break;
			}
		});

		/*切换界面*/
		$("#changBox").click(
			(function(){
				let count = 0;
				
				return function(){

					count ++ ;
					_self.iframe[0].src="";
					if(count%2){
						$("#content").removeClass("no-head");
						_self.renderMenu(1);
						$(this).addClass("active-view");
						Menu.status = "menu";
					}else{

						$("#content").addClass("no-head");
						_self.renderMenu(0);
						$(this).removeClass("active-view");
						Menu.status = "view";
					}
				}
				

			})()
		);

	

	}

}

const page = new Page();
