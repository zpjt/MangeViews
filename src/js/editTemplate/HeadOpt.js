import {
	api
} from "api/editTemplate.js";
import {
	Border
} from "js/ManageViews/view.js";
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

	async saveAllView(formData) {

		const {
			getTemplate,
			templateMap: {
				viewsMap
			},
			unit
		} = this.config;

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

				const _type = ["line","bar","scatter","pie","radar"].includes(type) && "chart" || type;
				
				let object = null ;
				if(type !=="editView"){
					object =    viewData[config[_type]];
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

		
		const res = await Promise.all(promises);

		const status = res.every(val => val);
		if (status) {

			const formData = new FormData();
			const layout_id = window.parent.menuID;

			const {
				htmlStr,
				box
			} = getTemplate();
			const data = this.getSaveViewData();

			formData.set("layout_id", layout_id);
			formData.set("model", htmlStr);
			formData.set("modelData", JSON.stringify(data));

			console.log(JSON.stringify(data));

			await api.saveLayout(formData).then(res => {

				res ? unit.tipToast("视图保存成功！", 1) : unit.tipToast("保存失败,请稍后重新再保存！", 0);;

				box.html(null);
			});

		} else {

			await false;
		}
	}
	getViewData($dom) {
		return this.config.templateMap.viewsMap.get($dom[0]);
	}

	handle() {
		const _self = this;
		const {
			modal,
			getTemplate
		} = this.config;

		const getViewData = this.getViewData;
		let count = 0;

		$("#headOpt").on("click", ".head-btn", function() {
			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
					break;
				case "style":


					count % 2 === 0 ? modal.show(_self.globalBox, "active") : modal.close(_self.globalBox, "active");
					count++;

					break;
				case "pre":
					break;
				case "save-as":
					break;
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

		$("#themeSelBox").on("click", ".theme-item", function() {

			const $this = $(this);
			const theme = $this.attr("echo-theme");
			$("#viewTemplate").attr("echo-theme", theme);
			$("#themeSelBox").find(".active").removeClass("active");
			$this.addClass("active");

		});

		$("#borderSelBox").on("click", ".border-item", function() {
			const $this = $(this);
			const borderStyle = $this.attr("echo-border").match(/\d+/g)[0];

			const bgSvgArr = $(".bgSvg");

			$.map(bgSvgArr, function(val) {

				const $border = $(val);

				$border.attr("echo-type", borderStyle);

				const viewDom = $border.parent(".view-item");

				const view = getViewData(viewDom);

				view.borderType = borderStyle;

				const {
					id,
					title,
					object: {
						chartName
					}
				} = view;

				new Border($border, {
					id,
					title: chartName
				});

			});

		});
	}

}


export {
	HeadOpt
};