import "css/main.scss";
import {RippleBtn} from "js/common/Unit.js";
import "css/common/button.scss";

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
}

const api = new ApI();


/*渲染菜单*/
class Menu{

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
					${indent}<i class="sicon ${sys_param}"></i>
					<span class="icon-wrap">${name}<span class="slide-icon"><i class="fa fa-chevron-down  "></i></span></span>
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
				${indent}<i class="${icon+sys_param} ">&nbsp;</i>${name}
				</div>
			</li>
		`);		
	}

	handle(){

		const _self = this ;

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

			$(".active").removeClass("active");
			$(".active-par").removeClass("active-par");

			const  par_item =  $(this).closest(".par-menu").siblings(".menuItem");
			par_item.addClass("active-par");
			$(this).addClass("active");

			Page.activeId = $(this).attr("echo-id");

			const url=$(this).attr("data-url").split("/")[2];
			page.iframe[0].src="./"+url+".html";
			
			
			/*const url=$(this).attr("data-url");
			 page.iframe[0].src=url;*/

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

        	 console.log("  收到消息 : "+msg.data);

        	 const result = msg.data;

            if(result == "&"){

            }else if(result){

            	const data = JSON.parse(msg.data);

            	const str = data.map(val=>{

            		return `<li echo-data="${val.id}">
            					<p>
            					${val.name}
            					<b>${val.time}</b>
            					</p>
            					<p>${val.text}</p>

            				</li>`
            	});
				_self.messageEl.children(".messages-ul").html(str);
				const count = data.length ;
				if(count){
					_self.messageTip.html(data.length).show();
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


class Page{

	static activeId = null ;

	constructor(){
		this.init();
		this.handle();
	}

	init(){
	   this.iframe = $("#router");
		this.menu = new Menu();
		this.renderMenu();
		this.news = new SoketNews();
	}

	renderMenu(flag=0){
		return api.getLeftMenu(role_id,flag).then(res=>{
			const ElArr = this.menu.mapMenuJson(res.sub,0);
			this.menu.box.html(ElArr.join(""));
			return true ;
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

		/*系统操作下拉返回*/
		const $userOptions = $("#userOpt");
		$("#userOption").click(function(){
			$userOptions.slideToggle();
		});
		
		$("#j-news").click(function(){
			_self.news.messageEl.slideToggle();
		});

		/*系统操作*/
		$userOptions.on("click","li",function(){

			const key = $(this).attr("key");

			switch(key){

				case "password"://修改密码

					break;
				case "power": //退出登录
				
				//	window.location.href=baseUrl+"login/logOut";
					 window.location.href="login.html";
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
					}else{

						$("#content").addClass("no-head");
						_self.renderMenu(0);
						$(this).removeClass("active-view");
					}
				}
				

			})()
		);

		/*标记所有消息*/
		$("#j-allMark").click(function(){
				
			console.log("333333");
		});
	}
}

const page = new Page();
