
class Unit {

	constructor(){
		this.initInp();
		this.initCombo();
		this.initModal();
		this.initSearch();
	}
	initModal(){
		const self = this ;
		const $close = $(".s-modal .m-close");
		$close.click(function(){
			self.closeModal($(this).closest(".s-modal"));
		});
	}
	closeModal($el){

		new Promise(res=>{
			
			$el.removeClass("m-show");
			$el.hasClass("s-tip") && this.initTipM($el.find("#tipText"),$el.find("#statusBox"),$el.find("#g-out"));
			res();
		}).then(()=>{

			setTimeout(function(){
				$el.hide();
			},100);
		})

	

	}
	showModal($el){

		
		new Promise(function(res){
			$el.show();
			res();
		}).then(()=>{
			$el.addClass("m-show");
		
		})
	}	
	initSearch(){
		// 搜索
		$(".search-btn").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			const state = $wrap.hasClass("active-search");

			if(state){
				return ;
			}

			$wrap.addClass("active-search");
		});

		// 搜索按钮关闭
		$(".search-close").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			$wrap.removeClass("active-search");
		});
	}
	dropMenuHandle($el,callback){

		const $wrap = $el.closest(".dropMenu");
		const state = $wrap.hasClass("active-menu");

		if(state){
			$wrap.removeClass("active-menu");
			setTimeout(function(){
				callback(state);
			 },100);	
	
		}else{
			
			callback(state);
			setTimeout(function(){
				$wrap.addClass("active-menu");
			 },0);
			
		}
	}
	renderDropMenu($el,config){

		const strArr=config.map((val,index)=>{

			const {type,icon,text} = val;
			    
			    return `<li class="menu-item" style="top:${index*30}px" sign="${type}">
			    			<i class="fa ${icon}">&nbsp;&nbsp;</i>
			    			<span>${text}</span>
			    		</li>`;
		});	
		
		$el.html(strArr.join(""));
	}
	initInp(){

		const $inpArr = $(".s-inpBox .s-inp");
		$inpArr.on("blur",function(){
			const value = $(this).val().trim();
			const inpBox = $(this).closest(".s-inpBox");
				 value && inpBox.addClass("inp-fill") || inpBox.removeClass("inp-fill");
		});

		$inpArr.on("focus",function(){
			 $(this).closest(".s-inpBox").addClass("inp-fill");
		});
	
	}
	initCombo(){
		const $inpCombo = $(".s-comboBox .inp-combobox");
        const $comboBox= $(".s-comboBox .combo-box");
      

		$inpCombo.click(function(e){
			e.stopPropagation();
	        const text = $(this).children(".combo-text").text();
			const par = $(this).closest(".s-comboBox");
			!par.hasClass("combo-active") && par.addClass("combo-active") || par.removeClass("combo-active");
		
		});

		$comboBox.on("click",".combo-item",function(e){

			 e.stopPropagation();
			 $(this).addClass("combo-item-active").siblings("li").removeClass("combo-item-active");

			  const InpPar=$(this).parent().siblings(".inp-combobox");
			  const valInp=InpPar.children(".combo-value");
			  const txtInp=InpPar.children(".combo-text");
			  
				valInp.val($(this).attr("echo-id"));
				txtInp.html($(this).children("span").text());
		});
	}
	initCombobox(arr,$el){

		const items = arr.map(function(val,index){
			const {id,text} = val ;
			return `
					<li class="combo-item ${ index===0 ? "combo-item-active" : ""}" echo-id="${id}">
						<i class="fa fa-folder">&nbsp;</i>
						<span >${text}</span>
					</li>
				  `
		});

		$el.html(items);

		const $combobox = $el.siblings(".inp-combobox");

		const {text,id}=arr[0];

		$combobox.children("p").html(text);
		$combobox.children("input").val(id);
	}
	initTipM($tip,$svg,$circle){
		
		setTimeout(function(){
			$tip.html("确定删除吗？");
			$svg.removeClass("g-status");
			$svg.attr("xlink:href","#g-warn");
			$circle.attr("stroke","#F8C186");
		}, 200);
	}

	renderTipM($svg,status){
		const color = {"#g-success":"#A5DC86","#g-load":"grey","#g-error":"red"};
		$svg.attr({"xlink:href":status,"stroke":color[status]});
		$("#g-out").attr("stroke",color[status]);
	}
}

export {Unit};