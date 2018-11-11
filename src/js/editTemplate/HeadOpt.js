import {
	api
} from "api/editTemplate.js";
import {
	Border
} from "js/ManageViews/view.js";

import {SCombobox,Calendar,SComboTree} from "js/common/Unit.js";
import {View } from "js/ManageViews/view.js";

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

		this.globalCalendar = new Calendar($("#globalCalendar"),null,{
			hasInp:false,
			style:2,
		});

	}

	

	getSaveViewData() {

		const data = [...this.config.templateMap.viewsMap.values()].map(val => {

			const {
				attributeObj: {
					size,
					point,
					viewID,
					borderType,
					type,
					par
				}
			} = val

			return {
				size,
				point,
				viewID,
				borderType,
				type,
				par
			}
		});



		return data;
	}

	saveViews(viewsMap,unit){

		const methodObj = {
			table: "saveTableInfo",
			chart: "saveGraphInfo",
			timeReal: "saveTableInfo",
			editView: "addAssembly",
		};

		const arr = [...viewsMap.keys()];

		const promises = arr.reduce((total, key) => {

			const val = viewsMap.get(key);

			const {
				attributeObj: {
					type,
					viewID,
					createId
				},
				viewData
			} = val;

			if (!viewID && createId) {

				const config = {
					chart:"graphInfo",
					table:"tabInfo",
					timeReal:"tabInfo"
				}

				const _type = ["line","bar","scatter","pie","rader"].includes(type) && "chart" || type;
				
				let object = null ;
				if(type !=="editView"){
					object = viewData[config[_type]];
				}else{
					object = new FormData();	
					object.set("assembly_data",viewData);
				}
				
				const req = api[methodObj[_type]](object).then(res => {
					const {
						state,
						id
					} = res;
					if (state) {
						val.attributeObj.viewID = id;
					} else {
						unit.tipToast(object.chartName + "保存失败,请稍后重新再保存！", 0);
					}
					return state;
				});

				total.push(req);
			}
			return total;
		}, []);

		return promises;

	}

	async saveAllView() {

		const {
			imgToUrl,
			getTemplate,
			templateMap: {
				viewsMap
			},
			unit
		} = this.config;

		const imgStatus = await imgToUrl(viewsMap);

		const promises = this.saveViews(viewsMap,unit);
		const res = await Promise.all(promises);

		const status = res.every(val => val);

		if (status) {

			this.delAllOld();

			const formData = new FormData();
			const layout_id = window.parent.menuID;
			const {htmlStr, box } = getTemplate();
			const data = this.getSaveViewData();

			formData.set("layout_id", this.config.viewDetail.layout_id);
			formData.set("model", htmlStr);
			formData.set("modelData", JSON.stringify(data));

			return await api.saveLayout(formData).then(res => {

				res ? unit.tipToast("视图保存成功！", 1) : unit.tipToast("保存失败,请稍后重新再保存！", 0);;
				box.html(null);

				return res ;
			});

		} else {

			return await false;
		}
	}
	getViewData($dom) {
		return this.config.templateMap.viewsMap.get($dom[0]);
	}
	delAllOld(){

		const templateMap = this.config.templateMap;

		let delArr = templateMap.getDelArr();

		const promiseAll = delArr.map(val=>{

			return  templateMap.delChart(val);
		});

		Promise.all(promiseAll).then(res=>{
				delArr = [] ;
		});
	}

	handle() {
		const _self = this;
		const {
			modal,
			viewDetail,
			unit,
		} = this.config;

		const getViewData = this.getViewData;

		const globalFilter = $("#globalFilter");
		const globalSave = $("#globalSave");


		$("#glo-styleClose").click(function(){

			 modal.close(_self.globalBox, "active");

		});

		$("#headOpt").on("click", ".head-btn", function() {
			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
				!globalFilter.hasClass("active") ? modal.show(globalFilter, "active") : modal.close(globalFilter, "active");
					break;
				case "style":


					!_self.globalBox.hasClass("active") ? modal.show(_self.globalBox, "active") : modal.close(_self.globalBox, "active");

					break;
				case "pre":
					break;
				case "save-as":{

					!globalSave.hasClass("active") ? modal.show(globalSave, "active") : modal.close(globalSave, "active");
					break;
				}
				case "export":
					break;
				case "save":
					{

						const result = _self.saveAllView();

						break;
					}
				default:
					break;
			}
		});

		$("#back").click(function() {
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


		const viewName = $("#viewName");
		//另存为
		globalSave.on("click", ".s-btn", function() {
			const index = $(this).index();
	
			switch (index) {
				case 0:{

					const name = viewName.val().trim();
					const {par_id,layout_id} = viewDetail;

					const result = _self.saveAllView().then(res=>{

						if(res){
							
							api.checkName({name,par_id}).then(res=>{
								if(res){
									api.copyLayout({layoutId:layout_id,layoutName:name}).then(res=>{

										if(res){
											unit.tipToast("另存成功！",1);
											modal.close(globalSave, "active");
										}else{
											unit.tipToast("另存失败！",0);
										}
									})
								}else{
									unit.tipToast("该名称已经存在！",2);
								}
							})

						}
					});

					console.log(result,"fsdfsfasfsa");
					break;
				}
				case 1:{
					modal.close(globalSave, "active");
					break;
				}
			}
		});

		$("#themeSelBox").on("click", ".theme-item", function() {

			const $this = $(this);
			const theme = $this.attr("echo-theme");
			$("#viewTemplate").attr("echo-theme", theme);
			$("#themeSelBox").find(".active").removeClass("active");
			$this.addClass("active");

		});

		$("#filterFoot").on("click",".s-btn",function(){

			const $this= $(this);

			if($this.index() === 0){
				
				const time = _self.globalCalendar.value; 
				_self.config.templateMap.viewsMap.forEach((view,key)=>{
				
					const {attributeObj:{type,borderType,viewID,createId,size},viewData} = view ;

					const viewType = ["line","bar","scatter","pie","rader"].includes(type) && "chart" || type;
					const refreshArr=["chart","table"];
					
					if(!refreshArr.includes(viewType)){
						return ;
					}

					if(view.timer){
						clearInterval(view.timer);
						view.timer = null;
					}
					
					const method = viewType === "chart" && "getGraphInfo" || "getTableInfo"　;
					const params = viewType === "chart" && viewData.graphInfo || viewData.tabInfo　;
					const viewTitle = viewType === "chart" ? viewData.graphInfo.chartName : viewData.tabInfo.chartName　;
					
					/*params.startTime = time[0].join("");
					params.endTime = time[1].join("");*/

					params.time_id = time[0].join("");
					params.time_start = time[1].join("");

					api[method](params).then(res=>{

						view.viewData = res;

						 new View($(key), {
							id:createId,
							type:viewType,
							index:createId,
							viewTitle,
							borderType,
							size,
						}, res, "2");


					});
				});

			}

			modal.close($("#globalFilter"), "active");
		})


		$("#borderSelBox").on("click", ".border-item", function() {
			const $this = $(this);
			const borderType = $this.attr("echo-border").match(/\d+/g)[0];

			const bgSvgArr = $(".bgSvg");

			$.map(bgSvgArr, function(val) {

				const $border = $(val);
				const viewDom = $border.parent(".view-item");

				const view = _self.config.templateMap.viewsMap.get(viewDom[0]);

				view.attributeObj.borderType = borderType;

				const size = view.attributeObj.size;
				const type = view.attributeObj.type;
				const id = view.attributeObj.viewID;
				const title = type === "table" &&　view.viewData.tabInfo.chartName || view.viewData.graphInfo.chartName;


				new Border($border, {
					id,
					title,
					borderType,
					size
				});

			});

		});
	}

}


export {
	HeadOpt
};