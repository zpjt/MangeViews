import "css/main.scss";
import {RippleBtn,Unit,SModal} from "js/common/Unit.js";
import "css/common/button.scss";
require("api/index.js");
const {role_id,baseUrl,base,user_id} = window.jsp_config;

/*jq对象*/
new RippleBtn();



const [$slide]=[$("#slide")];


class ApI {
	getLeftMenu(roleId,flag=0){
		//  flag:0 前端页面 1：后端页面；
		return new Promise((resolve,reject)=>{
			$.get(baseUrl+"main/getLeftMenu.do",{role_id:roleId,flag:flag},function(res) {
				resolve(res);
			}, "json");
		});
	}
   checkPwd(pwd){
   		return Promise.resolve($.post(baseUrl+"login/checkPwd",{pwd,user_id}));
   }
   changePwd(pwd){


   		return Promise.resolve($.ajax(
   			{
   				method:"post",
   				url:baseUrl+"login/changePwd",
		   		data:{user_id,pwd},
   			}
   		));
   }
}

const api = new ApI();


/*渲染菜单*/
class Menu{
	static status = "view";

	constructor(){
		this.init();
		this.handle();
	}

	init(){
		this.box = $("#menu");
	
	}
	
	mapMenuJson(arr,_lev){

		let lev = _lev;
		lev++;
		return arr.map((val,index)=>{
			
			const {sub,name,id,menu_type_id} = val;

			let data = {
				sys_param:val.sys_param,
				url:val.url,
				menu_type_id:val.menu_type_id,
				id,
				lev,
			}

			if(menu_type_id === 1){
 
				let  childrenEl = this.mapMenuJson(sub,lev);

				return this.parentComponent(childrenEl,name,data);

			}else{

				const item = this.childComponent(name,data);
			
				return 	item;					
			
			}
		})

	}

	parentComponent(child,name,data){

		let {sys_param,url,lev,menu_type_id,id}= data;
		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");
		return (`
			<li class="par_li_${lev} par_li" >
				<div class="menuItem par-item " data-url=${url} lev="${lev}" echo-id="${id}">
					${indent}<i class="sicon ${sys_param}"></i><span class="icon-wrap"><span class="menu-name">&nbsp;${name}</span><span class="slide-icon"><i class="fa fa-chevron-down  "></i></span></span>
				</div>
				<ul class="par-menu">${child.join("")}</ul>
		</li>
		`);

	}

	childComponent(name,data){
		const  indent =new Array(+data.lev).fill(`<span class="indent"></span>`).join("");
		let {sys_param,url,id}= data;


		const icon = url.includes("ManageViews") && "sicon " ||  "fa ";
		return (`
			<li>
				<div class="menuItem child-item " data-url=${url} echo-id="${id}">
				${indent}<i class="${icon+sys_param} ">&nbsp;</i><span class="menu-name">${name}</span>
				</div>
			</li>
		`);		
	}

	getIframeUrl(){
		
		if(!window.jsp_config.resourse){
			
			return function(url){
					return url.split("/")[2];
			}
		
		}else{
			return function(url){
				return url ;
			};
		}
	}

	handle(){

		const _self = this ;

		const getUrlMethod = this.getIframeUrl();

		/*收缩目录*/
		this.box.on("click",".slide-icon",function(e){
			e.stopPropagation();
			const $this = $(this);
			const $icon = $this.children(".fa");
			const $childEl = $this.parent().parent().siblings(".par-menu");
			const is_down = $icon.hasClass("fa-chevron-down");

			if(is_down){
				$icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$childEl.slideUp();
			}else{

				$icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$childEl.slideDown();
			}
		});

		/*切换菜单*/
		this.box.on("click",".menuItem",function(events){

			const $this = $(this);

			if($this.hasClass("par-item")){
				return;
			}

			$(".active").removeClass("active");
			$(".active-par").removeClass("active-par");

			const  par_item =  $this.closest(".par-menu").siblings(".menuItem");
			par_item.addClass("active-par");
			$this.addClass("active");

			const layout_id = $this.attr("echo-id"),
				  layout_name = $this.find(".menu-name").html();

			const url=$this.attr("data-url");

			const iframeUrl = getUrlMethod(url);

			

			if(Menu.status === "menu"){
				const src = iframeUrl+".html";
				$("#routerConter").html(`<iframe frameborder="0" id="router" name="myFrameName" src="${src}"></iframe>`);
				// page.iframe[0].src=src
			
			}else{

				const src = iframeUrl+".html?layout_id="+layout_id+"&layout_name="+layout_name;
				$("#routerConter").html(`<iframe frameborder="0" id="router" name="myFrameName" src="${src}"></iframe>`);

				// page.iframe[0].src=iframeUrl+".html?layout_id="+layout_id+"&layout_name="+layout_name;
			}

		});
	}
}

class SoketNews{

	static heartflag = false ;
	static tryTime = 0 ;
	
	constructor(config){

		const url = "ws://" + window.location.host+baseUrl;
		this.messageEl = $("#news");
		this.messageTip = $("#messageTip");

		this.config = {
						url:url+"connect",
						userId:user_id,
					};



		if (!window.WebSocket) {
           alert("您的浏览器不支持ws<br/>");
            return;
        }
		

		this.initSocket();
		this.handle();


	}

	initSocket(){

		const {url,userId} = this.config ;
		
		this.webSocket = new WebSocket(url+"/"+userId);

	}

	heart() {

        if (SoketNews.heartflag){
           this.webSocket.send("&");
           console.log("  心跳 <br/>");
        }

        setTimeout("this.heart()", 10*60*1000);

    }

  	send(message){
        this.webSocket.send(message);
    }


	handle(){

		const webSocket = this.webSocket ;
		const _self = this ;
		// 收到服务端消息
        webSocket.onmessage = function (msg) {


        	 const result = msg.data;

            if(result == "&"){

            }else if(result){

            	const data = JSON.parse(msg.data);

            	const str = data.map(val=>{

            		return `<li class="newItem" echo-data="${val.id}">
            					<p class="warn-item">
            						<span class="zb-warn">${val.name}</span>
            						<b class="warn-time">${val.time}</b>
            					</p>
            					<p class="warn-item">${val.text}</p>

            				</li>`
            	});
							_self.messageEl.children(".messages-ul").html(str);
							const count = data.length ;
							if(count){
								_self.messageTip.show();
							}else{
								_self.messageTip.hide();
							}
            }
        };

        // 异常
        webSocket.onerror = function (event) {
            SoketNews.heartflag = false;
           console.log(" 异常 ");
        };

        // 建立连接
        webSocket.onopen = function (event) {
            SoketNews.heartflag = true;
            _self.heart();
           console.log("建立连接成功");
            SoketNews.tryTime = 0;
        };

        // 断线重连
        webSocket.onclose = function () {
            SoketNews.heartflag = false;
            // 重试10次，每次之间间隔10秒
            if (SoketNews.tryTime < 10) {
                setTimeout(function () {
                    _self.webSocket = null;
                    SoketNews.tryTime++;
                    _self.initSocket();
                    console.log("  第"+SoketNews.tryTime+"次重连");
                }, 3*1000);
            } else {
                //alert("重连失败.");
            }
        };

	}
}


class RestPassword{

	constructor(modal,unit){
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
							this.unit.tipToast("密码修改成功！",1);
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


class Page{


	constructor(){
		this.iframe = $("#router");
		this.unit = new Unit();
		this.modal = new SModal();
		this.handle();
		this.init();
		
	}

	init(){


	 
		this.menu = new Menu();
		this.renderMenu();
		this.news = new SoketNews();
		this.restPassword = new RestPassword(this.modal,this.unit);
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
