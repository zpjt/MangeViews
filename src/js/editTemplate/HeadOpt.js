import {api} from "api/editTemplate.js";
/**
 * 头部组件
 */
class HeadOpt {
	constructor(config) {

		this.config = config;
		this.globalBox = $("#globalBox");
		this.init();
		this.handle();
	}

	init() {
		
	}

	async saveAllView(formData){

		const { viewDB:{viewDB} , getTemplate} = this.config ; 

		const methodObj = {
			table:"saveTableInfo",
			chart:"saveGraphInfo",
		};
		
		const arr = [...viewDB.keys()];
		let promises  =arr.map(key=>{

			const val = viewDB.get(key);

			const { viewType,object,viewId} = val ;

			return !viewId ? api[methodObj[viewType]](object).then(res=>{
					const {state ,id } = res ;
					state && $(key).attr("echo-id",id) || alert(object.chartName+"保存失败！");
					 val.viewId = id;
					return state ;
			}) : true;
		}); 
	

		const res = await Promise.all(promises);


		const status = res.every(val=>val);

		if(status){
			
			const formData = new FormData();

			const layout_id = window.parent.menuID;
			const {htmlStr,box} = getTemplate();

			formData.set("layout_id",layout_id);
			formData.set("model",htmlStr);

			await api.saveLayout(formData).then(res=>{

					console.log(res);

					box.html(null);
			});
		
		}else{

			await false ;
		}

	}




	handle() {
		const _self = this ;
		const { modal ,getTemplate} = this.config ;
	
		$("#headOpt").on("click", ".head-btn", function() {
			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
					break;
				case "style":
					modal.show(_self.globalBox, "active");


					break;
				case "pre":
					break;
				case "save-as":
					break;
				case "export":
					break;
				case "save":{
						
					 const result = _self.saveAllView();

					break;
				}
				default :
					break;
			}
		});

		$("#back").click(function(){
			const $slide = $("#slide", window.parent.document);
			const $head = $("#content", window.parent.document);
			const width = $slide.hasClass("collapsed") && 45 || 250;
			$slide.animate({
				"width": width
			}, 500, function() {
				window.history.back();
				$head.removeClass("no-head");
			});
		});

		//全局样式设置
		$("#globalOpt").on("click", ".s-btn", function() {
			const index = $(this).index();

			switch (index) {
				case 0:
					break;

				case 1:
					modal.close(_self.globalBox, "active");
					break;
			}
		});
	}

}


export {HeadOpt} ;
