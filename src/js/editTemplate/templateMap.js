import {View } from "js/ManageViews/view.js";
import {api } from "api/editTemplate.js";

class TemplateMap{

	static MapID = 0 ;
	static delArr = [];

	constructor(){

		this.viewsMap = new Map();

		window.viewsMap = this.viewsMap ;


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
							
			const attributeObj = { createId:"",...templateDatas[item]};
			const viewData = null;
			const data = {
				attributeObj,
				viewData,
				timer:null,
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

	ceateView($dom,viewTitle,viewMap){

			const {attributeObj:{borderType,createId,size,type},viewData:node} = viewMap ;

			const border_str = borderType  === "0" ? "" : `<div class="bgSvg"></div>`;

			const htmlStr = border_str + `<div class="view-content"></div>`;
			$dom.html(htmlStr);

			const _type = ["line","pie","scatter","bar","rader"].includes(type) ? "chart" : type ;

			
			const view = new View($dom, {
				id:createId,
				type:_type,
				index:createId,
				viewTitle,
				borderType,
				size,
			}, node, "2");

		this.IntervalreFresh(type,view,viewMap);
	}

	clearRefresh(view){

		if(view.timer){
			console.log("清除定时器");
			clearInterval(view.timer);
			view.timer = null ;
		}
	}

	IntervalreFresh(type,view,viewMap){

		switch(type){
			case "timeReal":{
				const {tabInfo:{ref_time , ref_frequency}} = viewMap.viewData ;
						
				if( ref_frequency !== "0"){
					
					viewMap.timer = setInterval(function(){

						api.getTableInfo(viewMap.viewData.tabInfo).then(res=>{
							view.timeReal.size=viewMap.attributeObj.size;
							view.timeReal.init(res);
						});
			
					},3000);
				}
				break;
			}
			default:
			break;
		}

	}

	getDelArr(){

		return TemplateMap.delArr;
	}
	
	initAdd($dom,viewTitle,node){

		const mapId  = ++TemplateMap.MapID;

		const view = this.viewsMap.get($dom[0]);
		  	  view.viewData = node;
			  view.attributeObj.createId = mapId;

		this.ceateView($dom,viewTitle,view);


	}
	add(node,$dom,attr,status){

		const {borderType,type,viewTitle} = attr ;
		const view = this.viewsMap.get($dom[0]);
		const {attributeObj:{size,createId,viewID}} = view;

		this.clearRefresh(view);

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
			view.attributeObj.viewID = "";
			type !== "editView" &&　TemplateMap.delArr.push(viewID);
		}

		

		$dom.addClass("view-fill");
		this.ceateView($dom,viewTitle,view);
	}

	delChart(viewID){
		return api.deleteChart(viewID);
	};

	remove($dom){

		$dom.removeClass("view-fill")
		.html(null);

		const viewMap = this.viewsMap.get($dom[0]);


		this.clearRefresh(viewMap);

		const {attributeObj:{size,point,viewID,type}} = viewMap;

		viewID && type !== "editView" &&  TemplateMap.delArr.push(viewID) ;

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


	}

	getMap(){
		return this.viewsMap;
	}

}

export {TemplateMap};