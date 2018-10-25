import "css/ManageViews.scss";
import "css/editTemplate.scss";

import {SModal, SInp,Unit} from "js/common/Unit.js";
import {View } from "js/ManageViews/view.js";
import {TemplateView} from "./TemplateView.js";
import {HeadOpt} from "./HeadOpt.js";
import {ViewSetModal} from "./ViewSetModal.js";
import {ViewComponet} from "./ViewComponet.js";
import {TemplateMap} from "./templateMap.js";
import {Summernote} from "./Summernote.js";


class Page{
	constructor(){

		// 模态框
		this.modal = new SModal();
		this.inp = new SInp();
		this.unit = new Unit();
		this.templateMap = new TemplateMap();

		const modal = this.modal ;
		const unit = this.unit ;
		const templateMap = this.templateMap;

		$("#viewTitle").html(`<span>${window.parent.menuName}</span>`);


		this.viewSetModal = new ViewSetModal({
			modal,
		    unit,
		    templateMap,
		});

		this.viewComponet = new ViewComponet();
		


	    this.templateView = new TemplateView($("#templateBox"),{
	   		upModalStatus:(type,$view)=>{
	   			this.viewSetModal.upModalStatus(type,$view);
	   		},	
	   		setModalSel:($view)=>{
				this.viewSetModal.setModalSel($view);
	   		},
	   		unit,
	   		templateMap,
	    });

 		new HeadOpt({
	    	modal,
	    	templateMap,
	    	unit,
	    	getTemplate:()=>{
	    		return this.templateView.getTemplate();
	    	},
	    }); 
		//编辑器
		new Summernote();
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

