import {api} from "api/szViews.js";

class IconBox{

	constructor(config){

		const {unit,modal,reloadStyleBox} = config;
		this.unit = unit ;
		this.modal = modal ;
		this.reloadStyleBox = reloadStyleBox;

		this.$iconBox = $("#iconBox");
		this.InitIconBox(this.$iconBox);
		this.handle();
	}

	setIcon(layout_type,layout_icon_name,last_layoutId,layout_id){


			const $iconBox = this.$iconBox;
			const $iconBoxItem = $(".iconBox-item");
			const $parContainer = $iconBox.parent();
			const status = $parContainer.hasClass("icon-active");

			$iconBoxItem.css("display","none");
			$iconBoxItem.eq(2-layout_type).css("display","flex");

			$(".icon-sel").removeClass("icon-sel");
			$iconBox.find("."+layout_icon_name.trim()).addClass("icon-sel");

		  (!status || last_layoutId !== layout_id )? this.modal.show($parContainer,"icon-active") :this.modal.close($parContainer,"icon-active") ;

	}

	InitIconBox($el){
		api.getAllLayout_icon().then(res=>{

			if(res){
				const {par,child}=res;
				const par_strArr = par.map(val=>{
					const {name,id} = val ;
					return `
						    <span class="sicon ${name}" echo-data="${id}"></span> 

							`
				});

				const child_strArr = child.map(val=>{
					const {name,id} = val ;
					return `
						    <span class="sicon ${name}" echo-data="${id}"></span> 
							`
				});

				const str = `
							<div class="iconBox-item">${child_strArr.join("")}</div>	
							<div class="iconBox-item">${par_strArr.join("")}</div>	
							`
				$el.html(str);
			}else{
				this.unit.tipToast("图标获取失败！",0);
		
			}

			
		});
    }

	handle(){

		const _self = this ;

		//选择icon
		const $iconBox = this.$iconBox;
		const $ViewContainer = $("#section");

		$iconBox.on("click",".sicon",function(){
			$(".icon-sel").removeClass("icon-sel");
			$(this).addClass("icon-sel");
		});
		//操作icon
		$("#iconFooter").on("click","p",function(){

			const sign = $(this).attr("sign");
			const $parContainer = $iconBox.parent();

			switch(sign){
				case "sub":
					
					const id = $ViewContainer.attr("curId");
					const icon_id =$(".icon-sel").attr("echo-data");

					api.updataIcon({icon_id,id}).then(res=>{

						if(res){
							_self.modal.close($parContainer,"icon-active") ;
							_self.reloadStyleBox();

							_self.unit.tipToast("图标更新成功！",1);
						}else{
							_self.unit.tipToast("图标更新失败！",0);
						} 
					
						
					});

					break;
				case "close":
					_self.modal.close($parContainer,"icon-active") ;
					break;
			}
		});

		$("#iconContainer").on("click",function(e){
			e.stopPropagation();
		});

	}

}

export {IconBox};