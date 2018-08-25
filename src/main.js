import "css/main.scss";

'use strict';

const {role_id,baseUrl,base} = window.jsp_config;

/*jq对象*/

const [$menu,$iframe,$slide]=[$("#menu"),$("#router"),$("#slide")];


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
	}

	init(){
		this.getMenu();
	}
	
	mapMenuJson(arr,_lev){

		let lev = _lev;
		lev++;
		return arr.map((val,index)=>{
			
			const {sub,name,id} = val;

			let data = {
				sys_param:val.sys_param,
				url:val.url,
				menu_type_id:val.menu_type_id,
				id,
				lev,
			}

			if(sub.length){
 
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
					<span class="icon-wrap">${name}<span class="slide-icon"><i class="fa fa-caret-down  "></i></span></span>
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

	getMenu(flag=0){
		return api.getLeftMenu(role_id,flag).then(res=>{
			const ElArr = this.mapMenuJson(res.sub,0);
			$menu.html(ElArr.join(""));

			return true ;

		})
	}
}

const renderMenu = new Menu();

/*收缩目录*/
$menu.on("click",".slide-icon",function(e){
	e.stopPropagation();
	const $icon = $(this).children(".fa");
	const $childEl = $(this).parent().parent().siblings(".par-menu");
	const is_down = $icon.hasClass("fa-caret-down");

	if(is_down){
		$icon.removeClass("fa-caret-down").addClass("fa-caret-up");
		$childEl.slideUp();
	}else{

		$icon.removeClass("fa-caret-up").addClass("fa-caret-down");
		$childEl.slideDown();
	}
});

/*切换菜单*/
$menu.on("click",".menuItem",function(events){

	$(".active").removeClass("active");
	$(".active-par").removeClass("active-par");

	const  par_item =  $(this).closest(".par-menu").siblings(".menuItem");
	par_item.addClass("active-par");
	$(this).addClass("active");

	renderMenu.activeId = $(this).attr("echo-id");

	const url=$(this).attr("data-url").split("/")[2];
	$iframe[0].src="./"+url+".html";
	
	
	 /*const url=$(this).attr("data-url");
	 $iframe[0].src=url;*/

});

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
			$(".slide-icon").html('<i class="fa fa-caret-down"></i>');
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


/*系统操作*/
$userOptions.on("click","li",function(){

	const key = $(this).attr("key");

	switch(key){

		case "password"://修改密码

			break;
		case "power": //退出登录
			//window.location.href=baseUrl+"login/logOut";
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
			$iframe[0].src="";
			if(count%2){
				$("#content").removeClass("no-head");
				renderMenu.getMenu(1);
				$(this).addClass("active-view");
			}else{

				$("#content").addClass("no-head") 
				renderMenu.getMenu(0);
				$(this).removeClass("active-view");
			}
		}
		

	})()
)




