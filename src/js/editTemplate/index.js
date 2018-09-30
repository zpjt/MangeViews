import "css/ManageViews.scss";
import "css/editTemplate.scss";

import {SModal, SInp } from "js/common/Unit.js";
import {View } from "js/ManageViews/view.js";
import {TemplateView} from "./TemplateView.js";
import {HeadOpt} from "./HeadOpt.js";
import {ViewSetModal} from "./ViewSetModal.js";
import {ViewComponet} from "./ViewComponet.js";



/**
 * 保存组件的数据，最后便于统一保存
 */
class DataDB {

	static index = 0 ;

	constructor(){
		this.viewDB = new Map();
	}
	add(object,viewType,node){

		const id = ++ DataDB.index;

		const  $box = $(".view-active");
		const  type = viewType,
				viewTitle = object.chartName,
				index = id;

		const views = new View($box, {
			id,
			type,
			index,
			viewTitle
		}, node, "2");

		const data = {
			id,views,object,viewType
		}
		this.viewDB.set($box[0],data);
	}

}


class Page{
	constructor(g){

		// 模态框
		this.modal = new SModal();
		this.inp = new SInp();
		this.viewDB = new DataDB();

		const modal = this.modal ;
		const viewDB = this.viewDB ;


		this.viewSetModal = new ViewSetModal({
			modal,
		    viewDB,
		});

		this.viewComponet = new ViewComponet();
		

	    new HeadOpt({
	    	modal,
	    }); 
	    new TemplateView($("#templateBox"),{
	   		upModalStatus:(type)=>{
	   			this.viewSetModal.upModalStatus(type);
	   		},	
	    });

	    this.handle();
	}
	handle(){

		const _self = this ;

	}
}


const page = new Page();

