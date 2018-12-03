import {Calendar,SComboTree,Tree} from "js/common/Unit.js";
import {api} from "api/szViews.js";



class AddModal{

	static par_id = "" ;

	constructor(config){

		const {unit,modal,reloadStyleBox,getPageStyle} = config;
		this.unit = unit ;
		this.modal = modal ;
		this.reloadStyleBox = reloadStyleBox;
		this.getPageStyle = getPageStyle;

		this.parCatalogCombox = $("#parName") ;
		this.modalTit = $("#addTit");
 		this.$addMBtn=$("#addMBtn");
 		this.$inpName = $("#name");
	  this.$parName = $("#parName");
	  this.$addMView = $("#add-MView");
  	this.$tabCard = $("#tabCard");

		this.handle();
		this.init();
	}

	init(){

		

	}
	setMd(type,layout_name,par_id){

			const txt = type === "renameCata" ? "重命名目录":"重命名视图";
					
			 this.modalTit.html(txt);
			 this.modal.show(this.$addMView);
			 this.$parName.parent().hide();
			 this.$addMBtn.attr({"method":"modify"});
			 this.$inpName.removeClass("no-fill").val(layout_name);
			 AddModal.par_id = par_id ;
	}

	initMD(type,method="create"){

		this.$addMBtn.attr({"type":type,method});
		this.$inpName.addClass("no-fill").val(null);

		const style = this.getPageStyle();

		if(style !== 2){
		
			const menuArr = this.$tabCard.data("menuArr");
			const curId = menuArr[menuArr.length-1].layout_id;
			type === "view" && curId === -2  ? this.parCatalogSel.clearValue() : this.parCatalogSel.setValue(curId);
		
		}else{
			this.parCatalogSel.clearValue();
		}

		type==="view" && this.rootCataDom.hide() || this.rootCataDom.show();
		this.$parName.parent().show();

		const tit =method ==="create" ? type === "view" ?  "创建视图" : "创建分类" :"复制视图";

		this.modalTit.html(tit);
		this.modal.show(this.$addMView);

	}
		
	reloadParCatalogCombox(data){

		this.parCatalogSel = new SComboTree(this.parCatalogCombox,{
				width:300,
				treeConfig:{
					 data:data,
					"textField":"layout_name",
					"idField":"layout_id",
					"childIcon":"fa fa-folder-open-o",
					"parClick":true,
				}
		});

		this.rootCataDom = this.parCatalogSel.box.find(".menuItem[echo-id=-2]");

		const  curId = data[0].layout_id ;

		this.parCatalogSel.setValue(curId);

	}
	
	
	addCatalogue(type,obj,style){

		const user_id = window.jsp_config.user_id;
		api.checkName(obj)
		.then(res=>{
			return res ? api.addView(type,{user_id,...obj}) : "重名" ;
		})
		.then(res=>{

			if(res === "重名"){
				this.unit.tipToast("重名，换一个名称！",2);
				return ;
			}

			if(res){ //true
				this.reloadStyleBox();
			 this.modal.close(this.$addMView);
				this.unit.tipToast("新增成功！",1);
			}else{
				this.unit.tipToast("新增失败！",0);
			}

		}).catch(error=>{

		})
    }
    
	handle(){

		const _self = this ;

		const $ViewContainer = $("#section");
	  const $tabCard= $("#tabCard");

		//模态框确定按钮
		this.$addMBtn.click(function(){

			const type = $(this).attr("type");
			const method = $(this).attr("method");
			const name = _self.$inpName.val().trim();

			const par_id = method === "modify" ? AddModal.par_id : _self.parCatalogSel.box.find(".combo-value").val();


			 if(!name || !par_id){
				_self.unit.tipToast("请填写完整！",2);
				return ;
			 }

			const cur_id =  $ViewContainer.attr("curid");

			const style = _self.getPageStyle();

			switch(method){
				case "create":{
					_self.addCatalogue(type,{name,par_id},style);
				}
					break;
				case "copy":{

				
					api.checkName({par_id,name})
					.then(res=>{

						if(res){
							api.copyLayout(par_id,cur_id,name).then(res=>{
								
									if(res){	
										_self.reloadStyleBox();
								 		_self.modal.close(_self.$addMView);
										_self.unit.tipToast("视图复制成功！",1);

									}else{
										_self.unit.tipToast("视图复制失败！",0);
									}

							})
						}else{

							_self.unit.tipToast("该视图名称已经存在！",2);
						}
						
					});
					}
					break;
				case "modify":{

				  api.checkName({par_id,name}).then(res=>{

				  		if(res){
									 api.updataName({name,id:cur_id}).then(res=>{
											if(res){
														_self.reloadStyleBox();
													 _self.unit.tipToast("重命名成功！",1);
													 _self.modal.close(_self.$addMView);
											}else{
													 _self.unit.tipToast("重命名失败！",2);
											}
									});

				  		}else{
									_self.unit.tipToast("重名，换个名称！",2);
				  		}

				  });

					 
					}
					break;	
				default:
					break;
			}
			
		
		});
	
	}

}

class IssueMView{


	constructor(config){
		const {unit,modal,reloadStyleBox} = config;
		this.unit = unit ;
		this.modal = modal ;
		this.reloadStyleBox = reloadStyleBox;

    this.$issueMView=$("#issue-MView"),
		this.handle();
		this.init();
	
	}

	init(){

		// 日历
		this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
			rotate:4,
			style:2
		});
	  this.orgBoxInit();
	}

	setMd(res){

			const $issueMView = this.$issueMView;

			this.modal.show($issueMView);
			const {user,starttime,endtime,release} = res;
								
	  	[].slice.call($issueMView.find(".s-switch input")).map((val,index)=>{

						switch(index){
							case 0 : //时间
								const status =  starttime == "-1" ;
								val.checked= status ;

								if(status){
									$(val).parent().siblings(".time-inpbox").removeClass("active");
								}else{
									$(val).parent().siblings(".time-inpbox").addClass("active");
									this.calendar.setTime([starttime,endtime]);
								}

								break;
							case 1 ://用户
								const status_2 =  user[0] == "-1" ;
								val.checked= status_2 ;

								if(status_2){
									$(val).closest(".item-status").siblings(".org-box").removeClass("active");
								}else{
									$(val).closest(".item-status").siblings(".org-box").addClass("active");

									this.orgTree.setValue(user);
								}
						
								break;
							case 2 :
								const status_3 =  release === 1 ;
								val.checked= status_3 ;
								break;
						}
			});
	}

	
  orgBoxInit(){
  	api.getLayoutUserTree().then(res=>{

			if(res){
				this.orgTree = new Tree($("#orgTree"),{
					"data":res.sub,
					"textField":"name",
					"idField":"id",
					"checkbox":true,
					 "checkCallback":function(node,$this,selArr){

					 	setTimeout(function(){
							
							const strArr = selArr.map(val=>{
									const {id,name} = val ;
									return 	`<li echo-id="${id}" class="org-sel-item ">
												<i class="fa fa-user-circle-o">&nbsp;</i>
												<b>${name}</b>
											 </li>`;

							});
							$("#orgSel").html(strArr.join(""));
					 	}, 60);

					 },
					 "clickAndCheck":true,
					 "childrenField":"sub",
					 "judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
							return val.type == 0 ;
					 }
				});
			}else{
				this.unit.tipToast("获取用户失败！",0);
			}

  	});
  }

    
	handle(){

		const _self = this ;

		const $ViewContainer = $("#section");
	  const $tabCard=$("#tabCard");

	  const $issueMView = this.$issueMView ;
		//发布
		$("#issueBtn").click(function(){

			const id= +$ViewContainer.attr("curid");

			let user = ["-1"],
				starttime ="-1",
			    endtime = "-1",
			    release = 1 ;

			const switchs = [].slice.call($issueMView.find(".s-switch input"));

			switchs.map((val,index)=>{
				const status = val.checked;
				if(!status){
					switch(index){
						case 0:
							const timeValue =_self.calendar.value;
							starttime = timeValue[0].join("");
							endtime = timeValue[1].join("");
							break;
						case 1:
							const selArr =$.map($issueMView.find(".child-checkinp:checked"),val=>{
								return val.value;
							});
							user = !selArr.length && null || selArr ;

							break;
						case 2:
							 release = 0 ;
							break;
			
					}

				}		
			});


			if(!user){
				_self.unit.tipToast("请选择可见用户！",2);
				return ;
			}
			
			api.ReleaseLayout({id,user,starttime,endtime,release}).then(res=>{
				if(res){
					_self.unit.tipToast("设置成功！",1);
					_self.reloadStyleBox();			
					_self.modal.close($issueMView);
				}else{
					_self.unit.tipToast("设置失败！",0);
				}
			});
		});
		//开关
		$issueMView.on("click",".s-switch",function(){

			const type = $(this).attr("sign");

			switch(type){

				case "time":
					$(this).siblings(".time-inpbox").toggleClass("active");
					break;
				case "org":
					$(this).parent().siblings(".org-box").toggleClass("active");
					break;

			}
		});
	}

}

export {AddModal,IssueMView};