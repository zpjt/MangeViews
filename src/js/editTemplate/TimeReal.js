import {api} from "api/editTemplate.js";
import { SCombobox ,Calendar, Tree, SComboTree } from "js/common/Unit.js";


class TimeRealMd{
	static status = "";
	constructor(config){
		const { modal,unit,templateMap} = config;
		this.modal = modal;
		this.unit = unit;
		this.templateMap = templateMap;
		this.box = $("#timeRealMd");
		this.zbBox= $("#realTreeBox");
		this.selBox = $("#realSelZbs");
		this.timeRotate = $("#timeRotate");
		this.timeVal = $("#timeVal");
		this.refreshVal = $("#refreshVal");
		this.refreshRotate = $("#refreshRotate");
		this.refreshTime = $("#refreshTime");

		this.selZbArr = null ; // 所选择的指标； 
		this.init();
		this.handle();

	}
	init(){

	}
	upModalStatus($view){
	
		this.activeBox = $view;
		this.modal.show(this.box);
		TimeRealMd.status = "create";
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

	setModalSel($view,viewMap){
	
		const {viewData} = viewMap;
		this.activeBox = $view;
		this.modal.show(this.box);
		//	ref_time ref_frequency
		const {tabInfo:{kpis=[],kpi_infos=[],orgs,time_id,time_start,ref_time ,ref_frequency,tab_style}} = viewData ;

		const id_1 = kpis.map(val=>val.id);
		const id_2 = kpi_infos.map(val=>val.kpi_id);
		const dimVals = kpi_infos.map(val=>({kpiId:val.kpi_id,dimId:val.dim_id,dimVal:val.dim_val}))
		const zbArr = id_1.concat(id_2);
		this.setZbTree(zbArr,dimVals);
		this.refreshTime.prop("checked",ref_frequency!=="0");
		this.orgWd.setValue(orgs[0].id);
		this.timeVal.val(time_start);
		this.timeRotate.val(time_id.split("_")[1]);
		this.refreshVal.val(ref_time);
		this.refreshRotate.val(ref_frequency);
		$(".real-style").eq(tab_style - 1 ).prop("checked",true);

		TimeRealMd.status = "edit";
	}

	setZbTree(zbArr,dimVals){
		this.zbTree.setValue(zbArr);

		this.sureBtnHandle(dimVals);
	}

	sureBtnHandle(dimVals=false){
		
		const values = this.zbTree.getValue("all"),
			   ids = values.map(val => val.kpi_id);
		
		if (!ids.length) {
			return;
		}

		api.GroupKpiByDim({
			kpi:ids
		}).then(res=>{

				const dataArr = Object.entries(res);
				this.selZbArr = values.map(val=>{

					return {
						id:val.kpi_id,
						text:val.kpi_name,
						isRef:"0",
					}
				});

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

				this.renderDimBox(dimVals);

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

	renderDimBox(dimVals){

		const _me = this ;

		if(dimVals){
					dimVals.map(val=>{
						const {dimVal,kpiId,dimId} = val ;
						const dimCombobox = $(`#realSelZbs .dimCombobox[kpi_id=${kpiId}]`);
						const data = this.findDimData(dimId);
						const dim_name = data.dim_name;

						new SCombobox(dimCombobox, {
											data: data.sub,
											textField: "dim_name",
											idField: "dim_value",
											defaultVal:dimVal,
											width:300,
											clickCallback:function(node){

												let dimZbIndex = null ;
												const dimZb =_me.selZbArr.find((val,oIndex)=>{
												const findKpi = val.id === kpiId || val.kpi_id === kpiId;
												dimZbIndex = findKpi ? oIndex : null ;
													return findKpi ; 

												});
												const {dim_id,dim_name:dim_val_name,dim_value:dim_val} = node ;

												const obj = {
													dim_id,
													dim_name,
													dim_val,
													dim_val_name,
													isRef: "0",
													kpi_id: kpiId,
													kpi_name: dimZb.text,
												};

												_me.selZbArr[dimZbIndex] = obj ;
											}
										});
				});	
				
		}else{

					$.map($("#realSelZbs .dimCombobox"), val => {

										
										
										const dimCombobox = $(val);
										const dimBox = dimCombobox.closest(".dim-wdItem");
										const dimId = dimBox.attr("dim-id");
										const data = this.findDimData(dimId);
										const dim_name = data.dim_name;
										const kpiId = dimCombobox.attr("kpi_id");

										new SCombobox(dimCombobox, {
											data: data.sub,
											textField: "dim_name",
											idField: "dim_value",
											 width:300,
											 clickCallback:function(node){
												
												let dimZbIndex = null ;
												const dimZb =_me.selZbArr.find((val,oIndex)=>{
													const findKpi = val.id === kpiId || val.kpi_id === kpiId;
													dimZbIndex = findKpi ? oIndex : null ;
													return findKpi ; 

												});
												const {dim_id,dim_name:dim_val_name,dim_value:dim_val} = node ;

												const obj = {
													dim_id,
													dim_name,
													dim_val,
													dim_val_name,
													isRef: "0",
													kpi_id: kpiId,
													kpi_name: dimZb.text,
												};

												_me.selZbArr[dimZbIndex] = obj ;
											}
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
							<div class="s-comboBox dimCombobox" kpi_id="${kpi_id}">
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

	
	preReal(){
	
		const values = this.selZbArr ;

		const kpis = [] ;
		const kpi_infos = [] ;

		values.forEach(val=>{


			if(val.hasOwnProperty("id")){
				kpis.push(val);
			}else{
				kpi_infos.push(val);
			}
		});

		const orgs = this.orgWd.getValue("all").map(val=>({
			id:val.dim_value,
			text:val.dim_name,
		}));

		let timeRotate = this.timeRotate.val(); 
		let timeVal = this.timeVal.val();
	
		const is_refersh = this.refreshTime.prop("checked");
		let refreshVal =is_refersh && this.refreshVal.val() || "0" ;
		let refreshRotate = is_refersh && this.refreshRotate.val() || "0";
	 
	    let time_id  =(timeVal=== "0" ? "@" : "_" ) + timeRotate ;


	     const parmas = {
				     time_id,
				     orgs,
				     time_start:timeVal,
				     kpis,
				     "userColumnId":-1, //-1实时组件,0表格
				     "startTime": null,
				     "endTime": null,
				     "chartName": "",
				     kpi_infos,
				     "row_wd": ["1"],
				     "col_wd": ["3"],
				     "isAdded": "0",
				     "tab_style": $(".real-style:checked").val(),
				     "total":  "0",
				     ref_time:refreshVal,//刷新时间
				     ref_frequency:refreshRotate,//刷新频率
				     "isMerge": "1", 
				     "isDsType":"1" ,
				     "dim_x": false
				 }

		 api.getTableInfo(parmas).then(res=>{
					
				const attr = {
					type:"timeReal",
					borderType:"0",
					viewTitle:"",
				}

				const status = TimeRealMd.status ;
				this.templateMap.add(res,this.activeBox,attr,status);
		 });
	}

	handle(){

		const _self = this ;
		const $zbBox = _self.zbBox;
		const $refreshTimeSel = $("#refreshTimeSel")
	    $("#realSelZb").click(function() {
			
			if ($zbBox.hasClass("active")) {
				return;
			}
			_self.modal.show($zbBox, "active");
		 });

	    this.refreshTime.click(function(){
			

			!$(this).prop("checked") && $refreshTimeSel.show() || $refreshTimeSel.hide();
				


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
		$("#realPre").click(function(){

			if(_self.box.find(".no-fill").length){
				
				_self.unit.tipToast("请填完数据！",2);
				return ;
			}
			_self.preReal();
		})
	}
	
	
}

export {TimeRealMd};