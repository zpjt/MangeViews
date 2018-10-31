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
import {TimeRealMd} from "./TimeReal.js";
import {api} from "api/editTemplate.js";


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

		this.TimeRealMd = new TimeRealMd({
			modal,
		    unit,
		    templateMap
		});

		//编辑器
		this.editViewMd = new Summernote({
				modal,
		    unit,
		});

		this.viewComponet = new ViewComponet();
		


	    this.templateView = new TemplateView($("#templateBox"),{
	   		upModalStatus:(type,$view)=>{
				
				switch(type){
					case "timeReal":{
						this.TimeRealMd.upModalStatus($view);
						break;
					}
					case "editView":{
						this.editViewMd.upModalStatus($view);
						break;
					}
					default:{
						this.viewSetModal.upModalStatus(type,$view);
						break;
					}
				}
	   		},	
	   		setModalSel:($view)=>{
				
				const  view = templateMap.viewsMap.get($view[0]);
				const  type = view.attributeObj.type ;

	   			switch(type){
					case "timeReal":{
						this.TimeRealMd.setModalSel($view,view);
						break;
					}
					case "editView":{
						this.editViewMd.setModalSel($view,view);
						break;
					}
					default:{
						this.viewSetModal.setModalSel($view);
						break;
					}
				}

				
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
		

		this.getData();
	    this.handle();
	}

	getData(){
		return Promise.all([api.dimtree(), api.kpitree(), api.orgtree()]).then((res) => {
			
			const orgTree = res[2].sub;
			const kpiTree = res[1].sub;
			const dimTree = res[0].sub;

			Promise.resolve().then(res=>{
				this.viewSetModal.renderTreeData(orgTree,kpiTree,dimTree);
			});
			
			Promise.resolve().then(res=>{
				this.TimeRealMd.renderTreeData(orgTree,kpiTree,dimTree);
			});
			


		});
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

