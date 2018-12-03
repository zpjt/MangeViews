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

export {Menu} ;