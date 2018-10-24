import {View } from "js/ManageViews/view.js";
import {api } from "api/editTemplate.js";
class TemplateMap{

	static MapID = 0 ;

	constructor(){

		this.viewsMap = new Map();

		window.viewsMap = this.viewsMap ;

		console.log(window.viewsMap);

	}

	/**
	 * [init 初始化模板数据]
	 * @param  {[String]}  size   [大小]
	 * @param  {[String]}  point [位置]
	 * @param  {[String]}  viewID [视图id]
	 * @param  {[String]}  type [类型]
	 * @param  {[String]}  borderType [边框类型]
	 * @param  {[String]}  par [被合并的对象]
	 * @return {[type]}    [description]
	 */
	init(viewsDomArr,templateDatas){


		viewsDomArr.forEach((val,item)=>{

			const attributeObj = templateDatas[item];

			const {
					size,
					point,
					viewID,
					borderType,
					type,
					par,
			} = attributeObj;

			const viewData = null;

			const data = {
				attributeObj,
				viewData,
			};

			this.viewsMap.set(val,data);

			
		});	
	}
	findViewByPoint(name){

		let value = null ;

		const dom =  [...this.viewsMap.keys()].find(key=>{

				const val =	this.viewsMap.get(key);

				const status = val.attributeObj.point[2] === name;

					  value =  status && val || null ;

				return status;
		});

		return {
			value,dom
		}


	}

	add(node,$dom,attr,status){

		const {borderType,type,viewTitle} = attr ;
		const view = this.viewsMap.get($dom[0]);
		const {attributeObj:{size,createId,viewID}} = view;

		let mapId = createId;

		view.viewData = node ;
		view.attributeObj.borderType = borderType;
		view.attributeObj.type = type;

		if(status === "replace"){

			const {createId,viewID} = attr;
			view.attributeObj.createId = createId;
			view.attributeObj.viewID = viewID;

		}

		if(status === "create"){
		  	mapId  = ++TemplateMap.MapID;
			view.attributeObj.createId = mapId;

		}else if(status === "edit" && viewID){
			
			api.deleteChart(viewID).then(res=>{

				console.log(res,"删去");
			});
	
		}

	    console.log(view);

	 	const border_str = borderType  === "0" ? "" : `<div class="bgSvg" echo-w="${size[0]}" echo-y="${size[1]}" echo-type="${borderType}"></div>`;

		const htmlStr = border_str + `<div class="view-content"></div>`;
		$dom.html(htmlStr);

		$dom.addClass("view-fill");

		const _type = ["line","pie","scatter","bar","rader"].includes(type) ? "chart" : type ;

		
		new View($dom, {
			id:mapId,
			type:_type,
			index:mapId,
			viewTitle
		}, node, "2");

	}

	remove($dom){

		$dom.removeClass("view-fill")
		.html(null);

		const viewMap = this.viewsMap.get($dom[0]);

		const {attributeObj:{size,point,viewID}} = viewMap;

		viewID && api.deleteChart(viewID).then(res=>{

				console.log(res,"删去");
		});

		viewMap.attributeObj = null ;
		viewMap.attributeObj = {
							size:size,
							point:point,
							viewID:"",
							createId:"",
							borderType:"0",
							type:"",
							par:""};


		viewMap.viewData = null ;
		console.log(viewMap);

	}

	getMap(){


		return this.viewsMap;
	}





}

export {TemplateMap};