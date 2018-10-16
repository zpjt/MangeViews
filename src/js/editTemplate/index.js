import "css/ManageViews.scss";
import "css/editTemplate.scss";

import {SModal, SInp,Unit} from "js/common/Unit.js";
import {View } from "js/ManageViews/view.js";
import {TemplateView} from "./TemplateView.js";
import {HeadOpt} from "./HeadOpt.js";
import {ViewSetModal} from "./ViewSetModal.js";
import {ViewComponet} from "./ViewComponet.js";
import {TemplateMap} from "./templateMap.js";


/**
 * 保存组件的数据，最后便于统一保存
 */
class DataDB {

	static index = 0 ;



	constructor(){
		this.viewDB = new Map();
	}
	add(object,viewType,node,viewObj){

		const {$box,htmlStr,borderType,viewId,status="create"} = viewObj ;

		const id = ++ DataDB.index;

		let _viewID = viewId;

			$box.attr("echo-id",_viewID);


		htmlStr && $box.html(htmlStr);

		const  type = viewType,
			   viewTitle = object.chartName,
			   index = id;

		 new View($box, {
			id,
			type,
			index,
			viewTitle
		}, node, "2");

		const data = {
			id,object,viewType,node,borderType,
			viewId: _viewID ,
		}

		console.log(data);

		this.viewDB.set($box[0],data);
		$box.addClass("view-fill");

	}
	get(dom){
		return  this.viewDB.get(dom);
	}
	remove(dom){
		this.viewDB.delete(dom);
	}

	set(dom,obj){

		new 
		this.viewDB.set(dom,obj);	

		console.log(this.viewDB);
	}

}


class Page{
	constructor(){

		// 模态框
		this.modal = new SModal();
		this.inp = new SInp();
		this.unit = new Unit();
		this.viewDB = new DataDB();
		this.templateMap = new TemplateMap();

		const modal = this.modal ;
		const viewDB = this.viewDB ;
		const unit = this.unit ;
		const templateMap = this.templateMap;

		$("#viewTitle").html(`<span>${window.parent.menuName}</span>`);


		this.viewSetModal = new ViewSetModal({
			modal,
		    viewDB,
		    unit,
		    templateMap,
		});

		this.viewComponet = new ViewComponet();
		


	    this.templateView = new TemplateView($("#templateBox"),{
	   		upModalStatus:(type,size,$view)=>{
	   			this.viewSetModal.upModalStatus(type,size,$view);
	   		},	
	   		getViewData:(dom)=>{
				return this.viewDB.get(dom);
	   		},
	   		delViewData:(dom)=>{
	   			this.viewDB.remove(dom);
	   		},
	   		addViewData:(object,viewType,node,viewObj)=>{
	   			this.viewDB.add(object,viewType,node,viewObj);
	   		},
	   		setModalSel:(type,size,$view,object)=>{
				this.viewSetModal.setModalSel(type,size,$view,object);
	   		},
	   		unit,
	   		templateMap,
	    });
	 		new HeadOpt({
		    	modal,
		    	viewDB,
		    	unit,
		    	getTemplate:()=>{
		    		return this.templateView.getTemplate();
		    	},
		    	getViewData:(dom)=>{
					return this.viewDB.get(dom);
	   			},
		    }); 
	    this.handle();
	}


	handle(){

		const _self = this ;
		const {resiziEl} = _self.templateView ;
		$("#app").on("click",function(){
			resiziEl.hide();
		});

	}
}


const page = new Page();

