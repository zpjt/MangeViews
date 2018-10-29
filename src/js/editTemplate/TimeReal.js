import "css/common/TimeReal.scss";
import {api} from "api/editTemplate.js";
import { SCombobox ,Calendar, Tree, SComboTree } from "js/common/Unit.js";

class TimeRealMd{
	constructor(config){
		const { modal,unit} = config;
		this.modal = modal;
		this.unit = unit;

		this.box = $("#timeRealMd");
		this.zbBox= $("#realTreeBox");
		this.selBox = $("#realSelZbs");
		this.init();
		this.handle();

	}
	init(){

		// 日历
		this.calendar = new Calendar($("#realCalendar"), $("#realShowTime"), {
			rotate:3,
			style: 2,
		});
	}

	upModalStatus(){
		this.modal.show(this.box);
	}

	renderTreeData(orgTree,kpiTree,dimTree){
		this.dimTree = dimTree ;
		this.orgWd = new SComboTree($("#realOrg"), {
					"prompt": "请选择科室...",
					 treeConfig: {
						"clickAndCheck": true,
						 data: orgTree,
						"childIcon":"sicon sicon-org",
						idField: "dim_value",
						textField: "dim_name",
						childrenField: "sub",
						judgeRelation: function(val) {
							return val.type === "0";
						}
					}
		});


        this.zbTree = new Tree($("#realTree"), {
			"clickAndCheck": false,
			"checkbox": true,
			 data: kpiTree,
			 idField: "kpi_id",
			 textField: "kpi_name",
			 "childIcon":"sicon sicon-kpi",
			 childrenField: "sub",
			judgeRelation: function(val) {
				return val.kpi_type === "0";
			}
		}); 

		
	}

	setZbTree(){
		console.log(332);


	}

	sureBtnHandle(){
		
		const values = this.zbTree.getValue("all"),
			   ids = values.map(val => val.kpi_id);
		
		if (!ids.length) {
			return;
		}

		api.GroupKpiByDim({
			kpi:ids
		}).then(res=>{

				const dataArr = Object.entries(res);

			   const leg = dataArr.length === 1 ;
				
				 const strArr = dataArr.map(dimItem=>{

					const [dim,dimVals] = dimItem;	

					const dimId = dim.split("_")[1];

					const zbNodeArr = leg && values ||  values.filter(node => {
						return dimVals.includes(node.kpi_id);
					});

					const dimWd = dimId !== "2" && this.findDimData(dimId)|| null ;
					const strArr = zbNodeArr.map(val=>this.renderZb(val,dimWd));
													
					const dimClass = dimId !== "2" && "dim-wdItem" || "";
						return `<div class="dim-item ${dimClass}" dim-id="${dimId}" >${strArr.join("")}</div>`;


				});

				this.selBox.html(strArr.join(""))

				this.renderDimBox();

		});

		this.modal.close(this.zbBox, "active");
		
	}

	findDimData(key) {
		let node = null;
		const data = this.dimTree;
		findFn(data);
		function findFn(arr) {
			return arr.find(val => {
				const status = val["dim_id"] == key;
				if (status) {
					node = val;
				}

				const sub = val.sub;

				if (sub.length) {

					return !status && findFn(sub) || status;

				} else {
					return status;
				}

			});
		}
		return node;
	}

	renderDimBox(dimArr,dimVals){

		if(dimVals){

					dimVals.map(val=>{
						const {dimVal,kpiId,dimId} = val ;
						const dimCombobox = $(`#realSelZbs .dimCombobox[kpi_id=${kpiId}]`);
						const data = this.findDimData(dimId).sub;
						new SCombobox(dimCombobox, {
											data: data,
											textField: "dim_name",
											idField: "dim_value",
											defaultVal:dimVal,
											 width:300,
										});
					});	
				
				}else{

					$.map($("#realSelZbs .dim-wdItem"), val => {

										const $val = $(val);
										const dimId = $val.attr("dim-id");
										const dimCombobox = $(val).find(".dimCombobox");
										const data = this.findDimData(dimId);

										new SCombobox(dimCombobox, {
											data: data.sub,
											textField: "dim_name",
											idField: "dim_value",
											 width:300,
										});
					});

				}

	}

	renderZb(node, dimWd) {

		const {kpi_name, kpi_id } = node;
		
		let str = "";

		if (dimWd) {
			const { dim_name ,dim_value }=  dimWd ; 
			str = ` <div class="zb-item-box">
						<div >
							<button class="s-btn zb-name dim-zb" echo-id="${kpi_id}">
								<i class="fa fa-times-circle del-zb"></i>
								<b>${kpi_name}</b>
							</button>
						</div>
						<div class="sel-item zb-dim-combobox" >
							<span >${dim_name}:&nbsp;</span>
							<div class="s-comboBox dimCombobox" kpi_id="${dim_value}">
						  </div>
						</div>
					</div>
					`;
		} else {
			str = `<span class="zb-item-box">
			   			<button class="s-btn zb-name" echo-id="${kpi_id}">
	   						<i class="fa fa-times-circle del-zb"></i>
							<b>${kpi_name}</b>
					    </button>
				    </span>`;
		}

		return str;
	}

	handle(){

		const _self = this ;
		const $zbBox = _self.zbBox;
	    $("#realSelZb").click(function() {
			
			if ($zbBox.hasClass("active")) {
				return;
			}
			_self.modal.show($zbBox, "active");
		 });


		/**
		 * [指标模态框操作]
		 */
		$("#realZbOpt").on("click", "button", function() {

			const index = $(this).index();

			switch (index) {

				case 0: //确定

					_self.sureBtnHandle();

					break;
				case 1: // 取消
					_self.modal.close(_self.zbBox, "active");
					break;
			}

		});

	}
	
	
}

export {TimeRealMd};