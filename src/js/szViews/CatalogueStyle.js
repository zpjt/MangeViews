
class CatalogueStyle{

	constructor(config){

		const {getRoleResStr,tabCardInit,toEdit,$tabCard} = config;

		this.catalogueContentmenu = $("#catalogueContentmenu");
		this.$catalogueBox =  $("#catalogueBox");
		this.$styleView = $(".style-view");
		this.roleResStr = getRoleResStr();
		this.contentMenuInit(getRoleResStr);
		this.handle(tabCardInit,toEdit,$tabCard);
	}

	contentMenuInit(getRoleResStr){

		
		const roleResStr = this.roleResStr;
		const cataStr = roleResStr.cataOpt.str.replace(/s-btn s-Naira/g,"");
		const viewStr = roleResStr.viewOpt.str.replace(/s-btn s-Naira/g,"");

		const str = `
						<div class="contentmenu-item">
							${cataStr}
						</div>
						<div class="contentmenu-item">
							${viewStr}
						</div>
					`

		this.catalogueContentmenu.html(str);
	}

	catalogueInit(tabData){
		
		const str = tabData.map((val,index)=>{
			const {layout_icon_name,layout_name,layout_id,layout_type,sub} = val ;
			const type = layout_type ===1 ? "view-catalogue" : (this.roleResStr.viewOpt.pre && "view-file" || "");
			const is_disCheck = sub.length === 0 ;

			return `
					<div class="catalogue-item " >
						<div class="view-show ${type}" echo-data="${index}">
							<p><i class="sicon ${layout_icon_name}"></i></p>
							<p class="catalogue-name"><span>${layout_name}</span></p>
							<span class="s-checkbox catalogue-chec ${!is_disCheck && "dis-check" || ""}">
									${is_disCheck && '<input type="checkbox"    class="catalogue-chec-inp" value="'+layout_id+'">' || ""}
									<label class="fa fa-square-o" title="${(!is_disCheck && "禁止删除,该文件夹里包含内容！" || "")}"></label>
							</span>
						</div>
						
					</div>
				  `
		});
		this.$catalogueBox.html(str);
		this.$catalogueBox.data("getData",tabData);
		this.cataFooterInit();
    }
    cataFooterInit(){
			const str = ` 
					<div class="footer-item">
						<i class="fa fa-bookmark-o">&nbsp;</i>
						<span>点击获取文件信息</span>
						<br>
						<i class="fa fa-bookmark-o">&nbsp;</i>
						<span>双击进入目录</span>
					</div>
					`;
			this.$catalogueBox.siblings(".cata-footer").html(str);
    }
    cataFooterRender(data){

    	const {layout_type,create_user_name,layout_name,updata_time,layout_icon_name,released} =data;
		
			var str = `
						<div class="cata-info footer-item">
							<span class="sicon ${layout_icon_name.trim()}"></span>
							<span>
							   <span><b>文件名：</b>${layout_name}</span><br><span>
							   <b>包含对象：</b> ${layout_type === 1 ? data.sub.length+"个" : "无" } </span>

							  </span>
						</div>
						<div class="footer-item" style="width:25%">
							<b>创建时间：</b>
							<br />
							<span style="padding-left:5em">${updata_time}</span>
						</div>
						<div class="footer-item" style="width:15%">
							<b>发布状态：</b>
							<br />
							<span class="${released === 1 && "tab-type" || ""}" style="padding-left:5em">${layout_type === 2 ? (released === 1 && "已发布" || "未发布") : "无"}</span>
						</div>
						<div class="footer-item" style="width:15%">
							<b>创建人：</b>
							<br />
							<span style="padding-left:4em">${create_user_name}</span>
						</div>
						<div class="footer-item" style="width:15%">
							<b>文件类型：</b>
								<br />
							<span style="padding-left:5em" class="${layout_type === 2 && "tab-type" || ""}">${layout_type===1?"分类文件夹":"视图文件"}</span>
						</div>
						`
			this.$catalogueBox.siblings(".cata-footer").html(str);
    }

    handle(tabCardInit,toEdit,$tabCard){

    	const _self = this ;
    	const contentMenu = this.catalogueContentmenu;
    	const $catalogueBox = this.$catalogueBox;

    	const $catalogueChecAll = $("#catalogueChecAll"); 
    	const $styleView = this.$styleView;

			$catalogueBox.on("dblclick",".view-catalogue",function(){
				window.clearTimeout(timer);
				const $this = $(this);
				const tabData = $catalogueBox.data("getData");
				const index = +$this.attr("echo-data");
				const childArr = tabData[index].sub;
				_self.catalogueInit(childArr);
				const {layout_name,layout_id}=tabData[index];
				const lastData = $tabCard.data("menuArr");
				
				lastData.push({layout_name,index,layout_id});
			 	tabCardInit(lastData);

				$catalogueChecAll.children("input").prop("checked",false);


			});


		$catalogueBox.on("dblclick",".view-file",function(){
			  toEdit($(this),1);
		});

		let timer = null;
		$styleView.eq(1).on("click",".view-show",function(){
			const $this = $(this);
			clearTimeout(timer);
			timer = setTimeout(function(){
				const index =$this.attr("echo-data");
				$this.parent().addClass("catalogue-item-sel").siblings().removeClass("catalogue-item-sel");
				const node = $catalogueBox.data("getData")[index];
				_self.cataFooterRender(node);
			}, 150);
		});

		$styleView.eq(1).on("contextmenu",".view-show",function(e){
			const $this = $(this);
			const index =$this.attr("echo-data");
			const node = $catalogueBox.data("getData")[index];
			const {layout_type} = node ;
			e.stopPropagation();
			contentMenu.show();
			contentMenu.attr("echo-data",index);

			contentMenu.find(".contentmenu-item").eq(layout_type-1).show().siblings().hide();
			contentMenu.css({"top":e.clientY-115,"left":e.clientX-40});

			return false ;
		});

		$styleView.eq(1).on("click",".catalogue-chec",function(e){
			e.stopPropagation();
			const is_allCheck = $styleView.eq(1).find(".catalogue-chec-inp").not(":checked").length === 0 ;

			$catalogueChecAll.children("input").prop("checked",is_allCheck);
		});

		$catalogueChecAll.click(function(){
			const status = $(this).children("input").prop("checked");
			$styleView.eq(1).find(".catalogue-chec-inp").prop("checked",status);
		});
    }
}

export {CatalogueStyle};