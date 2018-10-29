		hookAjax({
		    //拦截回调
		    onreadystatechange:function(xhr){
		    	if(xhr.responseXML){
		    		window.location.reload();
		    		return true ;
		    	}
		    },
		    onload:function(xhr){
		    	if(xhr.responseXML){
		    		return true ;
		    		window.location.reload();	
		    	}
		    },
		});	

		/* 设置主体内容最小高度 */
		var main_h = $('#mainframe', parent.document).height();
		var min_H = main_h - 15;
		$("#body_main").css("min-height", min_H);
		$("#table").css("min-height", min_H - 160);

		var tabMethod = 0;//加载垃圾站还是报告清单

		var $name = $("#set_name"),
		$table1 = $("#table1"),
		$alertAdd = $("#modal_add"),
		$alertModal = $("#modal_delete"),
		$addBtn = $("#addModel"),
		$catalogs_inp = $("#catalogs"), //目录样式选择input
		$startTime = $("#startTime"),
		$modal_refresh=$("#modal_refresh"),
		$refreshList=$("#refreshList"),
		$refereshBox=$("#refereshBox"),
		$loading=$(".loading"),
		$endTime = $("#endTime");

		// 重设时间组件的jq对象
		var $rotates = $(".rotates"),
			$comboboxItem = $(".rotates-item"),
			$resetItem = $(".reset-item"),
			$resetDayBox = $("#resetTimeBox"),
			$resetDay = $(".resetDay");

		// 目标科室，只有北大有
		var targetOrg = parent.targetOrg;

		// 角色
		var roleName = '${user.role_name[user.role_index]}';

		roleName == "系统管理员" ? $(".role_1").show() : $(".role_1").hide();

		var is_speical = parent.version; //false : 南上医院 ; true:北大医院

		
		/*
		 加载质控报告清单
		@reNameArr: 清单名称; @role:权限人员 
		*/
		var reNameArr = [];
		var all_data;
		var dropCatalogArr=[];
		function getParList(){
			dropCatalogArr=[];
			$.get("${ctx}/report/getParList",function(res){
					dropCatalogArr=res.list;
					loadCombo($(".par-list-combo"),res.list,180,"选择目录!","fa-folder",null,null,"name");
			},"json");
		};

		loadList("getReportTrees");// 加载清单


		function laodTab(data,is_reportList,is_ajax) {

			data.forEach(function(val){
				val.state="closed";
			});

			var order = 0;
			$table1.treegrid({
				animate: true,
				data: data,
				checkbox: true,
				fitColumns: true,
				scrollbarSize: 0,
				rownumbers: false,
				idField: 'report_id',
				treeField: 'report_name',
				columns: [
					[{
						"field": "order",
						"title": "行号",
						"align": "center",
						"width": "40px",
						"styler": function() {
							return "background:#0081C2;padding:5px 0;color:white ";
						},
						"formatter": function() {
							order++;
							return order;
						}
					}, {
						"field": "report_name",
						"title": "报告名称",
						"align": "left",
						"width": (is_reportList && '19%' || '37%'),
						"formatter": function(val, rowData) {



							var is_par = rowData.hasOwnProperty("children");

						is_reportList && is_ajax && !is_par ? reNameArr.push(val) : null;

							var data = {
								"report_id": rowData.report_id,
								"report_name": rowData.report_name,
								"target_name": rowData.target_name

							};

							var data = JSON.stringify(data);

							var className = is_par && "fa-folder" || "fa-file-text ";
							
							const picture = !is_par && rowData.haspicture  && '&nbsp;&nbsp;<i class="fa fa-picture-o"></i>' || "";

							return "<span echo-data='" + data + "' class='" + (is_par ? "reportCatalog" : "reportNode") + "'><b class='fa " + className + "'>&nbsp;</b>" + val  + "</span>";
						}

					}, {
						"field": "catalog_name",
						"title": "目录样式",
						"width": "110px",
						"align": "center",
					}, {
						"field": "create_time",
						"title": "创建时间",
						"width": "110px",
						"align": "center",
					}, {
						"field": "target_name",
						"title": "目标科室",
						"width": "90px",
						"align": "center",
					}, {
						"field": "target_time",
						"title": "目标时间",
						"width": "130px",
						"align": "center",
					}, {
						"field": "creater_name",
						"title": "创建人",
						"width": "72px",
						"align": "center",
					}, {
						"field": "opretion",
						"title": "&nbsp;&nbsp;操作",
						"width": (is_reportList && '500px' || '100px'),
						"align": (is_reportList && 'left' || 'center'),
						"formatter": function(val, rowData) {

							var data = {
								"report_id": rowData.report_id,
								"report_name": rowData.report_name,
								"target_name": rowData.target_name,
								"target_time": rowData.target_time,
							};

							var data = JSON.stringify(data);

							var roleBtnStr = "";

							if (rowData.hasOwnProperty("children")) {

								roleBtnStr = is_reportList && '<button class="btn btn-primary" sign="catalogs_set">目录设置</button><button class="btn btn-red " sign="catalogs_del">删 除</button><button class="btn btn-primary" sign="catalogs_save">另存所有</button><button class="btn btn-green" sign="catalogs_restTime">重设时间</button><button class="btn btn-green" sign="catalogs_tabSet">表格通用设置</button><button class="btn btn-green" sign="dao_all">导出总册</button>' || "";

								roleBtnStr = is_reportList && ("<div echo-data='" + data + "' class='optBtn'>&nbsp;&nbsp;" + roleBtnStr + "</div>") || ("<div echo-data='" + data + "' class='optBtn'><button class='btn btn-info' sign='catalogs_rest' >还原所有</button>" + roleBtnStr + "</div>");


							} else {
								var roleBtnStr = is_reportList && '<button class="btn btn-primary " sign="node_set">报告设置</button><button class="btn btn-red " sign="node_del">删 除</button><button class="btn btn-primary" sign="node_edit">编 辑</button><button class="btn btn-primary" sign="node_save">另 存</button><button class="btn btn-info" sign="node_dao"><i class="fa fa-file-word-o">&nbsp;&nbsp;</i>导 出word</button><button class="btn btn-info" sign="node_pdf" ><i class="fa fa-file-pdf-o">&nbsp;&nbsp;</i>导 出pdf</button>' || '';

								roleBtnStr = is_reportList && ("<div echo-data='" + data + "' class='optBtn'>&nbsp;&nbsp;" + roleBtnStr + "</div>") || ("<div echo-data='" + data + "' class='optBtn'><button class='btn btn-primary' sign='node_rest'>还 原</button>" + roleBtnStr + "</div>");
							}

							return roleBtnStr;

						}
					}]
				],
				onLoadSuccess: function() {
					$loading.hide();
					is_reportList && is_ajax? getParList() : null;

				},
				onCollapse:function(df){
				}
			});
		}

		function loadList(methodUrl){
			$.ajax({
					url: "${ctx}/report/" + methodUrl,
					dataType:"json",
					success: function(data) {
						reNameArr=[];
					
						var is_reportList=methodUrl=="getReportTrees";
						var tabData=is_reportList && data || data.list;
							all_data =tabData;
						laodTab(tabData,is_reportList,true);
					}
			});
		}

		var $itemContainner = $(".item-containner"),
			$itemBox = $(".item-box");

	
		
		$.ajax({
			url: "${ctx}/report/getCataDrop",
			success: function(data) {
				loadCombo($(".catalog-combo"), data, "180", "选择目录样式", "fa-bookmark");
			}
		});
		

		// 新建报告按钮
		$("#addBox").on("click","li",function(){
			
				$resetDayBox.hide();
				$name.val(null);
				$(".disable-combo").combobox("enable");
				$name.addClass("textbox-invalid");
				
				$("#setModal").window("open");
				$("#ft").show();
				$("#is_add").attr("report_id", "");
				switch(this.id){
					case "addCatalog":
						$(".panel-title").html("新建目录");
						$("#is_add").attr("status", "addParlist");
						$("#reportNodeSet").hide();
						$("#target_time").show();
						break;
					default:
						$(".panel-title").html("新建报告");
						$("#reportNodeSet").show();
						$("#targetOrgBox").show();
						$("#target_time").hide();
						$("#is_add").attr("status", "addReport");
						break;
				}
		});

		//报告确定按钮
		$("#is_add").click(function() {
			
			if ($("#setModal .textbox-invalid:visible").length) {
				alertModal(2, "请填写完整！");
			} else {
					var methodUrl = $(this).attr("status");

					var report_name = $name.val().trim(), //报告名称
						target_time;

						if(methodUrl == "addReport"){
							var parcatalogId=$("#report_catalogCombo").combobox("getValue");
							var sel_parObj=dropCatalogArr.filter(function(val){
									return val.id == parcatalogId 
							});
							target_time=sel_parObj[0].time;
						}else{
							target_time =($("#report-year").combobox("getText") + $("#report-season").combobox("getText"));
						};
					var formData = new FormData();
					if(methodUrl == "addParlist" || methodUrl == "adaptParList"){
						
							formData.set("name", report_name);
							formData.set("time", target_time);

							if(methodUrl == "adaptParList"){
								var report_id =$(this).attr("report_id");
								formData.set("id", report_id);
								formData.set("oldname", $name.attr("oldname"));
							}
					}else{
						var creater_id = ${user.id}; //角色id
						var report_type = "0",
							report_id =$(this).attr("report_id") || "", //报告类型
							type_id = $("#setCatalog").combobox("getValue"), //报告目录样式
					  	  	sdate =getNowFormatDate(),
							target_id =$org.combotree("getValue");
						
							formData.set("report_name", report_name);
							formData.set("report_type", report_type);
							formData.set("report_id", report_id);
							formData.set("type_id", type_id);
							formData.set("creater_id", creater_id);
							formData.set("sdate", sdate);
							formData.set("sneedmessage", "0");
							formData.set("smodel", "");
							formData.set("smodel_id", "");
							formData.set("edate", "");
							formData.set("eneedmessage", "0");
							formData.set("emodel", "");
							formData.set("emodel_id", "");
							formData.set("ahead", "");
							formData.set("target_id", target_id);
							formData.set("target_time", target_time);
							formData.set("issimple", 0);
							formData.set("role_name","");
							formData.set("par_list_name",$("#report_catalogCombo").combobox("getText"));
					}

					$.ajax({
						url: '${ctx}/report/' + methodUrl,
						type: 'post',
						cache: false,
						data: formData,
						processData: false,
						contentType: false,
						success: function(result) {
							methodUrl=="addParlist" && !result ? alertModal(2, "目录不能重名！") : window.location.reload(true);
						}
					});
			}
		});

	

		var HAS_REFRESH_COUNT=0;
		var ALL_REFRESH_COUNT=0;
		var ALL_SAVE_COUNT=0;
		var $report_progress=$("#report_progress");
		var refreshListArr=[];
				
		function renderReport(arr){
			if(arr.length){
				var report_id= arr[0].report_id;
					parent.targetOrg=arr[0].target_name;
				$.get("${ctx}/report/preview",{"report_id":report_id},function(res){
						$refereshBox.html(res);	

						var lastNodeArr = $refereshBox.find(".catalogue");
						var lastNode = lastNodeArr.eq(lastNodeArr.length-1);

						if(lastNode.html() == "附件：季度优秀病历评选方案 "){

							   lastNode.remove();
							   var  mulu_Node = $(".page_node").eq(0);

								var formData= new FormData();
					        		formData.append("paragraph_id",mulu_Node.attr("echo"));
					           	 	formData.append("html",mulu_Node.html());
					            	// 保存到数据库
							        $.ajax({
							            url: '${ctx}/report/saveHtml',
							            type: 'post',
							            cache: false,
							            data: formData,
							            processData: false,
							            contentType: false,
							            success: function(result) {
							            },
							            error:function(){
							                alert("错误信息：001");
							            }
							        });
						}

						$report_progress.css({"transition":"none","width":0});
						$report_progress.css({"transition":"width .6s ease"});
						HAS_REFRESH_COUNT=0;
						
						var tabBox = $(".insert");
						ALL_SAVE_COUNT=$(".page_node").length-1;
						ALL_REFRESH_COUNT=tabBox.length +1+ALL_SAVE_COUNT;
						refreshSummarizing(report_id,function(){

								if(!tabBox.length){
									var paragraphIdArr=[].slice.call($(".page_node"),1);
									batchSave(paragraphIdArr);
								}else{
									refreshReport([].slice.call(tabBox,0));
								}
								
						});
				});
			}else{ // 全部刷新完毕
				$("#refreshBtn").removeAttr("disabled");
				$refereshBox.hide();
				$refereshBox.html(null);
				return ;
			}
		}
		
		var ajaxCount=0;
		function refreshReport(tabElArr){
				if (tabElArr.length) {
					var newArr = tabElArr.splice(0, 3);
					ajaxCount=0;
					newArr.forEach(function(val) {
						(function(item) {
							refreshTab(item,newArr.length,function(){
								refreshReport(tabElArr);
							});
						})(val);
					})
				} else {
					return
				}
		}

		function refreshTab(item,newArr,callback){

			var nodeResouce=JSON.parse(item.getAttribute("echo-data"));
			var	nodeId=nodeResouce[1];
			var	type=nodeResouce[0];

			if(type == "2"){ //表格
				
				T.getJson("${ctx}/bd/getTable_bd?node_id="+nodeId, function(res){ 

    		  		if(!res.data.tab_name_file){ //表格已经被删掉
						
							HAS_REFRESH_COUNT++;
                			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
                			ajaxCount++;
							ajaxCount == newArr ? callback() :null ;

							if((HAS_REFRESH_COUNT+ALL_SAVE_COUNT)==ALL_REFRESH_COUNT){
								var paragraphIdArr=[].slice.call($(".page_node"),1);
								batchSave(paragraphIdArr);
							}

							return ;
    		  		}

    		  		var _data=res.data;
					var obj = {
						"col_wd": _data.col_wd || _data.contrastDim,
						"data": nodeResouce.slice(),
						"isDsType": _data.isDsType ,
						"isMerge": _data.isMerge || "",
						"row_wd": _data.row_wd || _data.rowDim,
						"tab_name_file": _data.tab_name_file,
						"isAdded": _data.isAdded || "0"
					};

    		  		chart_create[obj.isDsType](obj,function(str){
							
							$(item).html(str);
							HAS_REFRESH_COUNT++;
                			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
                			ajaxCount++;
							ajaxCount == newArr ? callback() :null ;
							if((HAS_REFRESH_COUNT+ALL_SAVE_COUNT)==ALL_REFRESH_COUNT){
								var paragraphIdArr=[].slice.call($(".page_node"),1);
								batchSave(paragraphIdArr);
							}
    		  		});
				});

			}else{ // 图形

				T.getJson("${ctx}/bd/getGraphData?node_id="+nodeId, function(res){ 
	               
	                if(!res.data || !res.data.length){ //已经被删掉
							
						HAS_REFRESH_COUNT++;
            			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
            			ajaxCount++;
						ajaxCount == newArr ? callback() :null ;

						if((HAS_REFRESH_COUNT+ALL_SAVE_COUNT)==ALL_REFRESH_COUNT){
							var paragraphIdArr=[].slice.call($(".page_node"),1);
							batchSave(paragraphIdArr);
						}
						

		            	 const $par = $(item).parent(".containner");
		                 const style = $par[0].getAttribute("style");
		                 $par[0].removeAttribute("style");
		                 $par.attr("sign","chart");
		                 $par[0].setAttribute("style",style);
						

						return ;
    		  		}

    		  		var _data=res.data;
    		  		graphOptions.creatChart(res.data,$(item));

					HAS_REFRESH_COUNT++;
        			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
        			ajaxCount++;
					ajaxCount == newArr ? callback() :null ;
					if((HAS_REFRESH_COUNT+ALL_SAVE_COUNT)==ALL_REFRESH_COUNT){
						var paragraphIdArr=[].slice.call($(".page_node"),1);
						batchSave(paragraphIdArr);
					}

           		 });
				
			}
			
			
		};

		function refreshSummarizing(report_id,callback){
	          $.get("${ctx}/report/getEvaluateByReport",{"report_id":report_id},function(data){

	          	/*	if(!data.length){
						HAS_REFRESH_COUNT++;
            			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
            			callback();
						return ;
	          		}*/
	            
	                T.getJson('${ctx}/report/getEvaluateJson', function(res) {



							if (!data.length) {
								
								res[0].children=[];
								res[1].children=[];
							
							}else{

								res[0].children = data.filter(function(val) {
									return val.type == 0;
								});
								res[1].children = data.filter(function(val) {
									return val.type == 1;
								});

							}


	                  		var str= baidu.template("summarize", {"list":res.slice(0,2),"three":res[2],"des":res[3],"time":res[4]});


	                     	$(".summarize-tab").html(str);
							HAS_REFRESH_COUNT++;
                			$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
                			callback();

	                });
	          });
   		};

   		function batchSave(paragraphIdArr){

			if (paragraphIdArr.length) {
					var newArr = paragraphIdArr.splice(0, 4);
					ajaxCount=0;
					newArr.forEach(function(val) {
						(function(item) {
							saveHtml($(item),newArr.length,function(){
								batchSave(paragraphIdArr);
							});
						})(val);
					})
				} else { //开始下一个报告
					var hasRefresh = refreshListArr.splice(0,1);
					$("#icon_"+hasRefresh[0].report_id).removeClass("refresh-icon").addClass("fa-check");
					renderReport(refreshListArr);
				}
   		};
				
		function saveHtml(paragraphEl,newArr,callback){
			
			console.log(paragraphEl);
			
			 const org = paragraphEl.find(".org-logo");
             const orgName = org.text();
          	 const orgContainer = org.closest("table");
          	 const imgSrc = orgContainer.find("img").prop("src");
          	 const htmlStr =  '<tbody> <tr class="firstRow"> <td class="logo-bd" valign="middle"></td> <td class="logo-bd2" valign="middle" style="padding: 0;word-break: keep-all;"><img src="'+ imgSrc +'"><span class="org-logo">'+  orgName +'</span></td> </tr> </tbody> ';
          	 orgContainer.html(htmlStr);
			
			
			var formData= new FormData();
        		formData.append("paragraph_id",paragraphEl.attr("echo"));
           	 	formData.append("html",paragraphEl.html());
            	// 保存到数据库
		        $.ajax({
		            url: '${ctx}/report/saveHtml',
		            type: 'post',
		            cache: false,
		            data: formData,
		            processData: false,
		            contentType: false,
		            success: function(result) {
		            	HAS_REFRESH_COUNT++;
		            	$report_progress.css("width",(HAS_REFRESH_COUNT/ALL_REFRESH_COUNT)*100+"%");
		              	ajaxCount++;
		               	ajaxCount == newArr ? callback() :null ; 
		            },
		            error:function(){
		            	ajaxCount++;
		                ajaxCount == newArr ? callback() :null ;
		                alert("错误信息：001");
		            }
		        });
		};

		
		//去掉 字符串前后的空格（包括中间）
		function Trim(str, is_global) {
			var result;
			result = str.replace(/(^\s+)|(\s+$)/g, "");
			if (is_global.toLowerCase() == "g") {
				result = result.replace(/\s/g, "");
			}
			return result;
		}


	   
       function getNodeContent(id,tabType,callback){

	       	$.get("${ctx}/report/getCatalog",{"report_id":id},function(res){

	       		var node = res[0].children[tabType];


				if(!node){
					callback("noNode");
					return ;
				}

	       		var catalog_id = node.id;
	       		var paragraph_id = node.paragraph_id;
	       		//获取节点内容
				$.ajax({
							url: "${ctx}/report/getParagraph",
							data:{"catalog_id":catalog_id },
							dataType:"json",
							success: function(res) {
								var _str = res.content.replace(/(<p><br><\/p>|<p><\/p>){1,}$/,"");
								callback(_str,catalog_id);
							},
							error: function() {
								callback("",catalog_id);
							}
		        });
			},"json");
       }

		/* 设置模态框 */
		$("#setModal").window({
			title: '设置界面',
			modal: true,
			shadow: true,
			closed: true,
			width: 580,
			height: 310,
			padding: 10,
			resizable: true,
			minimizable: false,
			maximizable: false,
			collapsible: true,
			top: ($(window).height() - 500) * 0.5,
			left: ($(window).width() - 550) * 0.5,
			onOpen: function() {
					}
		});

		function loadCombo($el, _data, _width, prompt_txt, icon, callback, default_val, field) {

			var vaule = default_val ? default_val : (_data[0] ? _data[0].id : null);
			var textField = field ? field : "text";
			$el.combobox({
				valueField: "id",
				textField: textField,
				data: _data,
				missingMessage: "*必填",
				prompt: prompt_txt,
				required: true,
				editable: false,
				width: _width,
				height: 30,
				lineHeight: 24,
				value: vaule,
				panelWidth: _width,
				panelHeight: "auto",
				panelMaxHeight: 280,
				onLoadSuccess: function(res) {
					/*if(res[0]){
	        		 $(this).combobox("setValue",res[0].id);
	        		 callback ? callback(res[0],this) : null; 
	        		}*/
	        	},
	        	formatter: function(row) {
	        		return "<span class='fa " + icon + "' >&nbsp;</span><span>" + row[textField] + "</span>";
	        	},
	        	onClick: function(row) {
	        		callback ? callback(row, this) : null;
	        	}
	        });
		}


		/* 新建模态框的取消按钮 */
		function closeModal() {
			$("#setModal").window("close");
		}



		

		var $org = $("#sel_orgCombo"), // 科室选择下拉框
			$filterOrg = $("#filterOrg") //科室筛选下拉框
			$orgCombo = $(".org-combo");

			T.getJson("${ctx}/bd/getOrgTree", function(res) {
				$orgCombo.combotree({
					data: res.data,
					valueField: "id",
					textField: "text",
					editable: false,
					width: 180,
					height: 30,
					panelWidth: 180,
					panelHeight: "auto",
					panelMaxHeight: 300,
					required: true,
					missingMessage: "*必须!",
					prompt: "单选",
					onLoadSuccess: function(data) {},
					formatter:function(row){
						
						var is_par = row.children.length > 0;

						var className = is_par && "fa-folder" || "fa-h-square" ;

						return "<span><b class='fa " + className + "'>&nbsp;</b>" + row.text + "</span>";
					},
					onSelect: function(node) {
						var tree = $(this).tree;
						var isLeaf = tree('isLeaf', node.target);
						if (!isLeaf) {
							$orgCombo.combotree('clear');
							return;
						}
					}
				});
			});

		//报告季度选择
		comboLoad($("#report-year"), yearArr, 80, "fa-check-circle-o", year_last);
		comboLoad($("#report-season"), season, 80, "fa-check-circle-o", "1");
		//目标时间选择下拉框
		comboLoad($(".targtYear-combobox").eq(0), yearArr, 80, "fa-check-circle-o", year_last,function(newOld){

			var secondYear=$(".targtYear-combobox").eq(1).combobox("getValue");
			var secondSeason=$(".targtSeason-combobox").eq(1).combobox("getValue");
			var firstSeason=$(".targtSeason-combobox").eq(0).combobox("getValue");

			var secondYearArr = yearArr.slice(0, (year_f - newOld+1)); // 第二个年要加载的
			if(newOld>=secondYear){
				newOld!=secondYear ? $(".targtYear-combobox").eq(1).combobox("setValue",newOld) :null;
				var secondSeasonArr =season.slice(firstSeason - 1);
				secondSeason < firstSeason ? $(".targtSeason-combobox").eq(1).combobox("setValue",firstSeason) :null ;
				$(".targtSeason-combobox").eq(1).combobox("loadData",secondSeasonArr);	 
			}else {
				$(".targtSeason-combobox").eq(1).combobox("loadData",season);	
			}

			$(".targtYear-combobox").eq(1).combobox("loadData",secondYearArr);
		});
		comboLoad($(".targtSeason-combobox").eq(0), season, 80, "fa-check-circle-o", "1",function(newOld){
			var secondYear=$(".targtYear-combobox").eq(1).combobox("getValue");
			var secondSeason=$(".targtSeason-combobox").eq(1).combobox("getValue");
			var firstYear=$(".targtYear-combobox").eq(0).combobox("getValue");
			if(firstYear==secondYear){
				var secondSeasonArr =season.slice(newOld - 1);
				secondSeason < newOld ? $(".targtSeason-combobox").eq(1).combobox("setValue",newOld) :null ;
				$(".targtSeason-combobox").eq(1).combobox("loadData",secondSeasonArr);	 
			}
		});

		comboLoad($(".targtYear-combobox").eq(1), yearArr.slice(0, (year_f - year_last+1)), 80, "fa-check-circle-o", year_last,function(newOld){

			var firstYear=$(".targtYear-combobox").eq(0).combobox("getValue");
			var secondSeason=$(".targtSeason-combobox").eq(1).combobox("getValue");
			var firstSeason=$(".targtSeason-combobox").eq(0).combobox("getValue");

			if(newOld==firstYear){
				var secondSeasonArr =season.slice(firstSeason - 1);
				secondSeason < firstSeason ? $(".targtSeason-combobox").eq(1).combobox("setValue",firstSeason) :null ;
				$(".targtSeason-combobox").eq(1).combobox("loadData",secondSeasonArr);	 
			}else {
				$(".targtSeason-combobox").eq(1).combobox("loadData",season);	
			}
		});
		comboLoad($(".targtSeason-combobox").eq(1), season, 80, "fa-check-circle-o", "2");

		/*  资源管理树筛选  */

		 /* var upTabTypeArr=[
				{"id":"1","text":"科室医疗质量与安全数据指标  (表1)","tabId":"1"},
				{"id":"2","text":"科室医疗质控季度检查得分表  (表2)","tabId":"2"},
				{"id":"3","text":"科室运行病历质控数据表  (表3)","tabId":"3"},
				{"id":"4","text":"科室主要诊断与主要手术  (表4)","tabId":"4"},
				{"id":"5","text":"科室重点疾病与重点手术  (表5)","tabId":"5"},
				{"id":"6","text":"科室不良事件  (表6)","tabId":"8"},
				{"id":"7","text":"科室再次手术  (表7)","tabId":"7"},
				{"id":"8","text":"全院优秀病历汇总及点评  (表8)","tabId":"10"},
				{"id":"9","text":"全院临床路径汇总表  (表9)","tabId":"6"}, 
				{"id":"10","text":"全院非计划再次手术汇总表  (表10)","tabId":"12"},
				{"id":"11","text":"全院重返类指标汇总表  (表11)","tabId":"11"},
				{"id":"12","text":"全院主要运营指标  (表12)","tabId":"9"},
		  ];*/

		 //  var tabOrderArr = ["无",1,2,3,4,5,9,7,6,12,8,11,10];

		  /*
				id: 是是对应报告的目录的顺序
				tabId:是是对应数据库的表的类型
		  */
		   var upTabTypeArr=[
				{"id":"1","text":"科室医疗质量与安全数据指标  (表1)","tabId":"1"},
				{"id":"2","text":"科室医疗质控季度检查得分表  (表2)","tabId":"2"},
				{"id":"3","text":"科室运行病历质控数据表  (表3)","tabId":"3"},
				{"id":"4","text":"科室主要诊断与主要手术(全院)  (表4)","tabId":"4"},
				{"id":"5","text":"科室主要诊断与主要手术(医保)  (表5)","tabId":"13"},
				{"id":"6","text":"科室重点疾病与重点手术  (表6)","tabId":"5"},
				{"id":"7","text":"科室不良事件  (表7)","tabId":"8"},
				{"id":"8","text":"科室再次手术  (表8)","tabId":"7"},
				{"id":"9","text":"全院优秀病历汇总及点评  (表9)","tabId":"10"},
				{"id":"10","text":"全院临床路径汇总表  (表10)","tabId":"6"}, 
				{"id":"11","text":"全院非计划再次手术汇总表  (表11)","tabId":"12"},
				{"id":"12","text":"全院重返类指标汇总表  (表12)","tabId":"11"},
				{"id":"13","text":"全院主要运营指标  (表13)","tabId":"9"},
		  ];


		
		 
		  var tabOrderArr = ["无",1,2,3,4,6,10,8,7,13,9,12,11,5];

		  //获取资源管理树json
		  $.get("${ctx}/bd/getResourceTree",{"orgName":""},function(res){
					var data =( new Function("return " +res))();
					  data.data[0].children.forEach(function(val){
	 					  val.state="closed";
						 	});
					  $("#tabTypeSel").data("resources",data.data);
						var arr = JSON.stringify(data.data);
					    	arr = JSON.parse(arr);
					  		filterJson(arr,"1");
							loadResource(arr);
		  });


		function filterJson(arr,type){
			arr.forEach(function(val,index){
				
				if(val.data[0]<2){
					if(val.children.length){
						filterJson(val.children,type);
					}else{
						arr.splice(index,1,null);
					}
				}else{
					if(type!=val.tab_name_file){
						arr.splice(index,1,null);
					}
				}
			});

			for (var i = 0; i < arr.length;) {
				var obj = arr[i];
				if (obj) {
					if (obj.data[0] < 2 && !obj.children.length) {
						arr.splice(i, 1);
					} else {
						i++;
					}
				} else {
					arr.splice(i, 1);
				}
			}

		}

		 loadCombo($("#upTabType"), upTabTypeArr, 380,"选择表格类型！", "fa-table", function(val){

				   var data = $("#tabTypeSel").data("resources");
		 	 		if(val.id==0){
						loadResource(data);
		 	 		}else{
		 	 			var arr = JSON.stringify(data);
					    arr = JSON.parse(arr);
						filterJson(arr,val.tabId);
						loadResource(arr);
		 	 		}
					
		 },"1");

		var $resourceCombo=$("#resourceCombo");
		 function loadResource(data){
				$resourceCombo.combotree({
					data:data,
					valueField: "id",
					textField: "text",
					editable: false,
					width:380,
					height: 30,
					panelWidth: 380,
					panelHeight: "auto",
					panelMaxHeight: 300,
					required: true,
					missingMessage: "*必须!",
					prompt: "单选",
					onLoadSuccess: function(data) {},
					onSelect: function(row) {

							if(row.data[0] < 2 ){
								$resourceCombo.combotree("clear");
								return ;
							}

							$("#tab_true").data("node",row);
							
					},
					formatter:function(row){

						var is_par = row.data[0] < 2;

						var className = is_par && "fa-folder" || "fa-table" ;

						var typeTab=!is_par &&  "<span class='tab-type'>(*表"+tabOrderArr[+row.tab_name_file]+"）</span>" || "";

						return "<b class='fa " + className + "'>&nbsp;</b>"+row.text+typeTab;
					}
				});
		 }
	</script>
	
	<!-- 刷新的js -->
	
	<script type="text/template" id="summarize">
	    <tbody>
	        <tr class="firstRow">
	            <td valign="top" class="summarize-comment">
	                <div class="summarize-box">
	                    <div id="secontent">
	                        [%list.forEach(function(val){%]
	                            <p><br></p>
	                            <p class="summarize-title">[%=val.text%]</p>
	                            [%val.children.forEach(function(item,index){%]
	                                <p>[%=(index+1)+"、"+item.text%]</p>
	                        [%});});%]
	                    </div>
	                     <p><br></p>
	                     <p class="summarize-title">[%=three.text%]</p>
	                     [%three.children.forEach(function(val,index){%]
	                          <p>[%=(index+1)+"、"+val.text%]</p>    
	                    [%});%]
	                </div>
	            </td>
	        </tr>
	        <tr>
	            <td class="summarize-bottom">
	                 <p><br></p>
	                <p>[%=time.text%]</p>
	                <p> [%=time.children[0].text%]</p>
	            </td>
	        </tr>
	    </tbody>
	</script>
	
	<script>

	    /*数组去重 */
	    Array.prototype.unique = function(oindex, coCount) {
	        var res = [];
	        for (var i = oindex, leg = this.length; i < leg; i += coCount) {
	            res.push(this[i]);
	        }
	        return res;
	    }
	    Array.prototype.repeatCount = function(item) {
	        var res = 0;
	        for (var i = 0, leg = this.length; i < leg; i++) {
	            if (item == this[i]) {
	                res++;
	            }
	        }
	        return res;
	    }
	    Array.prototype.col_spanNum = function(oindex) {
	        var first = this[oindex];
	        if (this[this.length - 1] != first) {
	            for (var i = oindex, leg = this.length; i < leg; i++) {
	                if (this[i] != first) {
	                    return i - oindex;
	                    break;
	                }
	            }
	        } else {
	            return this.length - oindex;
	        }
	    }	

		var wd_arr=[
	        {"id":"1","text":"时间"},
	        {"id":"2","text":"科室"},
	        {"id":"3","text":"指标"},
	        {"id":"4","text":"维度值"}
      	];

      	var tabColorArr=["tab-color1","tab-color2"];

      	function getTab3Department(index){

       	 return index < 4 && "病案统计科" || (index < 10 || index == 15) && "质控科" || index < 12 && "护理部" || index < 15 && "药学部" || "现场检查" ; 

    	}

    	function getImgUrl(base64,imgEl,chatEl){
        
	         T.ajax({
	            url: '${ctx}/report/uploadImg',
	            type: 'post',
	            data:base64,
	            async:false,
	            contentType: 'application/text',
	            success:function(rest){
	                imgEl.attr("src",rest);
	                imgEl.show();
	                chatEl.remove();
	            },
	            error:function(){
	                alert("操作失败！");
	                }
	            });   
	    }
				
		var chart_create={
			"1": function(node, callback) {

				var node_id = node.data[1];
				var tabTypeId = node.tab_name_file;
				var isAdded = node.isAdded;

				T.getJson("${ctx}/bd/getChartData_bd?type=2&node_id=" + node_id, function(res) {


					var table = "",
						tabHStr = "",
						captionStr = "",
						col_wd = (isAdded == 1 && tabTypeId == 5) ? ["1"] : node.col_wd,
						row_wd = node.row_wd;

					// 合并
					var colArr = [];
					for (var i = 0, _leg = col_wd.length; i < _leg; i++) {
						var first = res.data[row_wd.length][i];
						if (res.data[res.data.length - 1][i] != first) {
							for (var j = row_wd.length, leg = res.data.length; j < leg; j++) {
								if (res.data[j][i] != first) {
									colArr.push(j - row_wd.length);
									break;
								}
							}
						} else {
							colArr.push(res.data.length - row_wd.length);
						}
					}

					// 表头搭建  
					var is_tab5 = tabTypeId == 5 ? true : false;
					if (tabTypeId == 1 || (is_tab5 && isAdded == 1)) {
						var col_wd_txt = [];
					} else {
						var col_wd_txt = [];
						col_wd.forEach(function(val, index) {
							col_wd_txt[index] = wd_arr[parseInt(val) - 1].text;
						});
					}

					var wd_index = col_wd_txt.indexOf("维度值");
					if (wd_index != -1) {
						col_wd_txt[wd_index] = "名称";
					}

					var tabHCol = col_wd.length;
					var is_order = 0;

					if (tabTypeId != 1) {
						if (res.data[0].indexOf('序号') != -1) {
							tabHCol += 1;
							is_tab5 && isAdded == 1 ? null : col_wd_txt.unshift("序号");
							is_order = colArr.length > 1 ? 1 : 0;
						}
					} else {
						var tabHCol = 0;
					}

					var tab11_tdBg = {};

					if (tabTypeId == 11) {
						var tab11_obj = {
							"非计划再次手术发生例数": "非计划再次手术量占比(%)",
							"非计划再次手术量占比(%)": "非计划再次手术发生例数",
							"出院当天再住院患者人次": "出院当天再住院占比(%)",
							"出院当天再住院占比(%)": "出院当天再住院患者人次",
							"出院2-31天内再住院患者人次": "出院2-31天内再住院占比(%)",
							"出院2-31天内再住院占比(%)": "出院2-31天内再住院患者人次",
						};

						var MergeNameArr = ["非计划再次手术发生例数和占比", "出院当天再住院患者人次和占比", "出院2-31天内再住院患者人次和占比"];

						var breakTd = -1;
						var tabHeadmerge_Arr = col_wd_txt.concat(res.data[0].splice(tabHCol));
						var Head_mergeIndex = [];
						var tabHeadStr = tabHeadmerge_Arr.map(function(val, index) {
							if (breakTd == index) {
								return "";
							};
							var nextVal = tabHeadmerge_Arr[index + 1] || "无";
							if (tab11_obj[val] == nextVal) {
								breakTd = index + 1;
								Head_mergeIndex.push(index);
								var MergeName = MergeNameArr.filter(function(name) {
									return name.indexOf(val.substr(0, 4)) != -1;
								});
								return '<th colspan="2" width="20%">' + MergeName[0] + '</th>';
							} else {
								return '<th ' + (val == "科室" && 'width="16%"' || '') + '>' + val + '</th>';
							};
						});
						tabHStr = tabHeadStr.join("");
						//   var tab11_tdBgarr = ['#A8CDF1', "#C0C0C0"];
						Head_mergeIndex.map(function(val, oIndex) {
							tab11_tdBg[val] = 'style="width:9%;"';
							tab11_tdBg[val + 1] = 'style="width:9%;font-weight:bolder"';
						});

					} else {
						tabHCol = is_tab5 && isAdded == 1 ? 0 : tabHCol;
						var is_seasonX = row_wd.indexOf("1") !== -1 ? true : false;
						for (var i = 0, leg = row_wd.length; i < leg; i++) {
							var tr = "";
							var colSpan_num = res.data[i].col_spanNum(tabHCol);
							var tabHArr = res.data[i].unique(tabHCol, colSpan_num);

							if (i == 0) {
								tabHArr = col_wd_txt.concat(tabHArr);
							}

							for (var j = 0, leg1 = tabHArr.length; j < leg1; j++) {
								var tdVal = tabHArr[j];

								var oWidth = !is_tab5 ? (tdVal == "科室" && "width='19%'" || tdVal == "指标类别" && "width='12%'" || "") : tdVal == "指标" ? "width='150'" : tdVal == "名称" ? "width='17%'" : "";

								if (j < tabHCol && i == 0) {
									tr += "<th  " + oWidth + " rowspan='" + row_wd.length + "'>" + tdVal + "</th>";
								} else {
									tdVal = is_seasonX ? tdVal.replace(/年第/, "年<br/>第") : tdVal;
									tr += "<th colspan='" + colSpan_num + "' " + oWidth + ">" + tdVal + "</th>"
								}
							}
							tabHStr += "<tr>" + tr + "</tr>";
						}
					};

					tabHStr = "<thead>" + tabHStr + "</thead>";

					var captionStr = "";
					 var tabFoot="";
					// 表格身体
					if (tabTypeId == 1) {
						var data = res.data;

						var tabData = [];
						for (var i = 1; i < data.length; i++) {
							var same = data[i][0];
							var t = data.reduce(function(total, cur, index, arr) {
								if (cur[0] && cur[0] == same) {
									total.push(cur);
									if (i != index) {
										arr.splice(index, 1, "");
									}
								}
								return total;
							}, []);
							if (t.length) {
								tabData.push(t);
							}
						}

						var tdStrOrder = 0;

						var tabStr = tabData.map(function(val, index) {

							var tdStr1 = val.map(function(item, oIndex) {

								var tdStr;
								tdStrOrder++;
								item[1] = tdStrOrder;

								if (oIndex == 0) {
									tdStr = item.map(function(oitem, _index) {

										oitem = oitem == "--" ? "/" : oitem;
										if (_index == 0) {
											return "<td rowspan='" + val.length + "' >" + oitem + "</td>";
										} else {
											return "<td >" + oitem + "</td>";
										}

									})
								} else {
									tdStr = item.map(function(oitem, _index) {
										if (_index != 0) {
											return "<td >" + (oitem == "--" ? "/" : oitem) + "</td>";
										}
									})
								}

								return "<tr class='" + tabColorArr[(index) % 2] + "'>" + tdStr.join("") + "</tr>";

							});

							return tdStr1.join("");

						});

						table += tabStr.join("");
						 tabFoot='<p><br /></p> <table class="tab1-foot" > <tr> <td style="text-align:center" width="12%">备注:</td><td>1&nbsp;凡死亡例数，均计入患者入院时所在科室；</td> </tr> <tr> <td></td><td>2&nbsp;住院超30天患者仅统计出院患者，不含期末在院患者；</td> </tr> <tr> <td></td><td>3&nbsp;出院2-31天内再住院患者仅统计出院患者，不含期末在院患者；</td> </tr> <tr> <td></td><td>4&nbsp;不良事件上报例数来自探索一号系统，暂不包含ADR系统和护理系统；</td></tr><tr><td></td><td>5&nbsp;手术科室出院病人手术比例=手术例数/出院人数。</td></tr> </table> ';
				
					} else if (tabTypeId == 6 || tabTypeId == 11) {
						var targetOrg = parent.targetOrg;
						var sameTrIndex = 0;
						// 表格身体
						for (var i = row_wd.length, leg = res.data.length; i < leg; i++) { //行 
							var tr = "";
							var tab6TargetOrg = (res.data[i].indexOf(targetOrg) != -1) ? "class='targetOrg'" : "";
							for (var j = 0, leg1 = res.data[i].length; j < leg1; j++) { //列 
								var startIndex = i + 1 - row_wd.length; // 保证是重复行的第一个

								if (j < (colArr.length)) {
									for (var k = 0, leg2 = colArr.length; k < leg2; k++) { // 列 的前面要合并的个数 
										var tdVal = res.data[i][k] == "--" ? "/" : res.data[i][k];
										if (colArr[k] == (res.data.length - row_wd.length) && (startIndex) == 1) { //合并全部  
											tr += "<td rowspan='" + (res.data.length - row_wd.length) + "' " + tab6TargetOrg + " >" + tdVal + "</td>";
										} else if (startIndex % colArr[k] == 1) {
											tr += "<td rowspan='" + colArr[k] + "' " + tab6TargetOrg + ">" + tdVal + "</td>";
										} else if (colArr[k] == 1) { //合并 1个
											tr += "<td " + tab6TargetOrg + ">" + tdVal + "</td>";
										}
									}
									j = colArr.length - 1;
								} else {
									tr += "<td " + tab6TargetOrg + (tab11_tdBg[j] || "") + ">" + (res.data[i][j] == "--" ? "/" : res.data[i][j]) + "</td>";
								}
							}

							if (colArr[is_order] != 1) {
								sameTrIndex = ((i - row_wd.length + 1) % colArr[is_order]) == 1 ? (sameTrIndex + 1) : sameTrIndex;
							} else {
								sameTrIndex++;
							}
							table += "<tr class='" + tabColorArr[(sameTrIndex) % 2] + "'>" + tr + "</tr>";
						}

						captionStr = tabTypeId == 6 && '<p style="text-align:left;font-size:10pt;line-height:12pt"><span>备注1：护理工作执行率指路径表单中的护理工作在实际工作中执行的比率</span><br/><span >备注2：重点医嘱执行率指路径表单中的重点医嘱在实际工作中勾选的比率</span></p>' || "";
					} else {

						var sameTrIndex = 0;
						for (var i = row_wd.length, leg = res.data.length; i < leg; i++) { // 行
							var tr = "";
							for (var j = 0, leg1 = res.data[i].length; j < leg1; j++) { // 列
								var startIndex = i + 1 - row_wd.length; // 保证是重复行的第一个
								if (j < (colArr.length)) {
									for (var k = 0, leg2 = colArr.length; k < leg2; k++) { //列 的前面要合并的个数 

										var tdVal = res.data[i][k];
										if (colArr[k] == (res.data.length - row_wd.length) && (startIndex) == 1) { //合并全部  
											tr += "<td rowspan='" + (res.data.length - row_wd.length) + "'>" + tdVal + "</td>";
										} else if (startIndex % colArr[k] == 1) {
											tr += "<td rowspan='" + colArr[k] + "'>" + tdVal + "</td>";
										} else if (colArr[k] == 1) { //合并 1个
											tr += "<td>" + tdVal + "</td>";
										}
									}
									j = colArr.length - 1;
								} else {
									tr += "<td>" + (res.data[i][j] == "--" ? "/" : res.data[i][j]) + "</td>";
								}
							}

							if (colArr[is_order] != 1) {
								sameTrIndex = ((i - row_wd.length + 1) % colArr[is_order]) == 1 ? (sameTrIndex + 1) : sameTrIndex;
							} else {
								sameTrIndex++;
							}

							table += "<tr class='" + tabColorArr[(sameTrIndex) % 2] + "'>" + tr + "</tr>";
						}
					}

					table = "<tbody>" + table + "</tbody>";

					var htmlStr = captionStr + "<table class='bdTab" + tabTypeId + "' name='bd_tab' border='1'>" + tabHStr + table + "</table>"+tabFoot;
					callback(htmlStr);
				});
			},
	        "0": function(node,callback) { 
	            
	            var node_id = node.data[1];
	            var tabTypeId = node.tab_name_file;   
	               
	            T.getJson("${ctx}/bd/getUploadChartData_bd?node_id=" + node_id, function(res) {

	                var tabHStr = "",
	                    table = "";

	                if (tabTypeId == "4" || tabTypeId == "13") {
	                     var legArr = ["width='13%'","width='30%'", "width='70'","width='80'", "width='120'","width='80'","width='80'","width='80'","width='80'","width='80'"];
	                    var tabHStr ="<th width='45'>序号</th>";
	                      var tabHStr_2 ="<th width='45'>序号</th>";
	                    for(var i=0,leg1=(res.ctm.length);i<leg1;i++){
	                        var th_arr=res.ctm[i].logColName.split(",");
	                         tabHStr_2 += "<th "+legArr[i]+">"+th_arr[0]+"</th>";
	                     tabHStr += "<th "+legArr[i]+">"+th_arr[1]+"</th>";
	                    } 
	                    tabHStr_2 ='<thead><tr>'+tabHStr_2+'</tr></thead>';
	                    tabHStr='<thead><tr>'+tabHStr+'</tr></thead>';

	                     //表身体
	                    var data=res.data;
	                    var dataLeg=data.length;
	                    var table_2="",tabCap="";
	                     var tabCapData=res.other;


	                     var no_icd =data[0] && data[0][0] &&  true || false ;
				          var secondTabIndex = data.findIndex(function(el) {
				                
				                if(no_icd){
				                    return !el[0];
				                }else{
				                    return el[0];
				                }
				          });

				          if(no_icd){
				            var data1 = data.splice(0, secondTabIndex);
				            var data2 =data;
				          }else{
				             var data2 = data.splice(0, secondTabIndex);
				             var data1 =data;
				          };
				          
	                   
	                    tabCap = '<p style="text-align:left;font-size:11pt;">'  + (tabCapData[1] ? (tabCapData[1][0] +'：'+tabCapData[1][1]) : '出院人次：0') + '</span><span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (tabCapData[0] ?(tabCapData[0][0] +'：'+tabCapData[0][1]) : '手术（操作）总数：0') + '</span></p>';
	                


	                    for(var i=0;i<data1.length;i++){
	                        var flag="";
	                         var data1_leg = data1[i].length;
				            for (var j = 0; j < data1_leg; j++) {

				              if( j < 3 || 5<j){
				                 flag += "<td>" + data1[i][j] + "</td>";
				              }
				            }

	                        table +="<tr class='"+tabColorArr[(i+1)%2]+"'><td>"+(i+1)+"</td>"+flag+"</tr>";
	                    } 
	                    
	                    //加空格
	                    if(data1.length<15){
	                        for(var j=1;j<=15-i;j++){
	                             var tr="";
	                             tr+="<td>"+(j+i)+"</td>";//序号
	                             tr+=(Array(res.ctm.length).fill("<td></td>").join("")); 
	                             tr ="<tr class='"+tabColorArr[j%2]+"'>"+tr+"</tr>";
	                             table += tr;
	                        } 
	                    }
	                       

	                    for(var i=0;i<data2.length;i++){
	                         var flag="";
	                        var data2_leg = data2[i].length;
				            for (var j = 3; j < data2_leg; j++) {
				              flag += "<td>" + data2[i][j] + "</td>";
				            }
	                        table_2 +="<tr class='"+tabColorArr[(i+1)%2]+"'><td>"+(i+1)+"</td>"+flag+"</tr>";
	                    } 

	                    //加空格
	                    if(data2.length<15){
	                        for(var j=1;j<=15-i;j++){
	                             var tr="";
	                             tr+="<td>"+(j+i)+"</td>";//序号
	                             tr+=(Array(res.ctm.length).fill("<td></td>").join("")); 
	                             tr ="<tr class='"+tabColorArr[j%2]+"'>"+tr+"</tr>";
	                             table_2 += tr;
	                        } 
	                    }


	                    table="<table   class='bdTab"+tabTypeId+"' name='bd_tab' border='1' >"+tabHStr+"<tbody>"+table+"</tbody></table>";
	                    table_2=tabCap+"<table class='bdTab"+tabTypeId+"' name='bd_tab' border='1' >"+tabHStr_2+"<tbody>"+table_2+"</tbody></table><p style='font-size:9pt'><br/></p>";



	                    table=table_2+table;
	                }else if(tabTypeId=="7"){

	                    var tabData=res.time;

	                    var   tabCap = '<p style="text-align:left;"><span>说明：1. 二次手术数据从手麻系统和病案系统抓取。 </span></p><p style="text-align:left;"><span >&nbsp;&nbsp;&nbsp;2. 所有二次手术数据从'+(tabData?tabData:" ")+'已出院病人中提取</span></p>';
	                        
	                   /* for(var i=0,leg1=res.ctm.length-1;i<leg1;i++){
	                         tabHStr += "<th>"+res.ctm[i].logColName+"</th>";
	                    }   
	                    //表头
	                    tabHStr='<thead><tr>'+tabHStr+'<th width="20%">'+res.ctm[leg1].logColName+'</th></tr></thead>';*/

	                     //表头
	                   tabHStr = '<thead><tr><th width="28">序<br />号</th><th width="60">病案号</th><th width="18%">入出院<br />时间</th><th width="10%">手术<br />名称 </th><th width="12%">手术开始<br />时间</th><th width="6%">手术<br />次序</th><th width="10%">主要<br />诊断</th><th width="5%">主刀</th><th width="10%">手术<br />性质</th><th width="16%">手术<br />原因</th></tr></thead>';



	                    
	                    var data=res.data;

	                    data.push(["最后一个","最后一个","最后一个","最后一个","最后一个","最后一个","最后一个","最后一个"]);

	                    var tabArr=[];

	                    var tabOrder=0;
	                    
	                    for(var i=0,leg=data.length-1;i<leg;i++){
	                          var rowSpan=0;
	                        for(var j=i+1;j<=leg;j++){
	                            var tr="";
	                            if(data[i][0]==data[j][0]){ //相同的行
	                                 rowSpan++;
	                                for(var k=2,leg2=data[j].length;k<leg2;k++){
	                                   var value= data[j][k]=="null" || !data[j][k]? "" :data[j][k];
	                                   value=k==6?(value.substring(0,1)+"*"):value;
	                                  tr+="<td>"+value+"</td>";
	                                }
	                                tr ="<tr class='"+tabColorArr[tabOrder%2]+"'>"+tr+"</tr>";
	                                tabArr[j]=tr;
	                            }else{
	                                tabOrder++;
	                                tr+=("<td rowspan='"+(rowSpan+1)+"'><b>"+tabOrder+"</b></td>");
	                                for(var k=0,leg2=data[i].length;k<leg2;k++){
	                                  var value= data[i][k]=="null" || !data[i][k]? "" :data[i][k];
	                                        if(k<2){
	                                             value = k == 1 ? (value.replace(/,/, ",<br />")) :  value;
	                                             tr+="<td rowspan='"+(rowSpan+1)+"'>"+value+"</td>";
	                                        }else{
	                                              value=k==6?(value.substring(0,1)+"*"):value;
	                                            tr+="<td>"+value+"</td>";
	                                        }
	                                }

	                                tr ="<tr class='"+tabColorArr[(tabOrder-1)%2]+"'>"+tr+"</tr>";
	                                tabArr[i]=tr;
	                                i=i+rowSpan;
	                                break;
	                            }
	                        }
	                    } 

	                   //加空格
	                   var tableStr=tabArr.join("");
	                    if(leg<5){
	                         for(var j=1;j<=15-tabOrder;j++){
	                             var tr="";
	                             tr+="<td>"+(j+tabOrder)+"</td>";//序号
	                             tr+=(Array(res.ctm.length).fill("<td></td>").join("")); 
	                             tr ="<tr class='"+tabColorArr[j%2]+"'>"+tr+"</tr>";
	                             tableStr += tr;
	                          } 
	                    }
	                
	                   var TabFoot='<p style="text-align:left">总结：'+(res.time?res.time:" ")+(res.department?res.department:" ")+'手术'+(res.num1?res.num1:" ")+'例，有'+(res.num2?res.num2:" ")+'名患者发生了多次手术，共涉及'+(res.num3?res.num3:" ")+'台手术，其中非计划再次手术'+(res.num4?res.num4:" ")+' 例</p>';

	                     table=tabCap+"<table  class='bdTab"+tabTypeId+"' name='bd_tab' border='1' >"+tabHStr+"<tbody>"+tableStr+"</tbody></table>"+TabFoot;
	                } else if(tabTypeId=="10"){

                        var data=res;

                      var capStr="<p style='text-align:left;font-size:9pt;line-height:12pt'>说明："+(data.remarks[0] ? data.remarks[0]:"")+"</p>";

                        //表头
							var tabHeadArr = data.ctm.map(function(val) {
								return '<th>' + val.logColName + '</th>';
							});
							tabHStr += '<tr class="tab-color1"><th width="8%">序号</th>' + tabHeadArr.join("") + '</tr>';

                        //表身体
                        var tabBodyArr=JSON.stringify(data.data);
                            tabBodyArr=JSON.parse(tabBodyArr);
                        table=tabBodyArr.map(function(item,index){

                            var markDes = "<br>&nbsp;&nbsp;"+ item.pop();
                              
                            var itemTd=item.map(function(val,oindex){
                  				 return oindex >0 && ('<td>'+val+'</td>') || "";
             				 });
                            var trColor=tabColorArr[index % 2];
								
								return '<tr class="' + trColor + '" node-id="' + item[0] + '"><td rowspan="2" >' + (index + 1) + '</td>' + itemTd.join("") + '</tr><tr class="' + trColor + '"><td colspan="' + (item.length - 1) + '" style="text-align:left;height:' + (index < 6 && 72 || 78) + 'pt;vertical-align: top;font-size:8pt;">亮点：' + markDes + '</td></tr>';

                        
                        });

                        table=table.join("");

                        //数据不够20条加空格
                        for (var i = 0,leg=20-data.data.length; i < leg ; i++) {
                            var  whiteTdLeg= data.ctm.length;
                             var whiteTd=Array(whiteTdLeg).fill("<td></td>");
							
							var oIndex = i + data.data.length + 1;

								
								table += '<tr><td rowspan="2" >' + (i + data.data.length + 1) + '</td>' + whiteTd.join("") + '</tr><tr><td colspan="' + whiteTdLeg + '" style="text-align:left;height:' + (oIndex-1 < 6 && 72 || 78) + 'pt;vertical-align: top;font-size:8pt;">亮点：</td></tr>';
                        }

                        table='<table class="bdTab'+tabTypeId+'" name="bd_tab" border="1" >'+tabHStr+table+'</table>';
                        
                       var  tableGoodCaseArr= data.data.slice(0,6);  
						var indexArr= ["一","二","三","四","五","六"];
                       if(tableGoodCaseArr.length==0 ){

                        var tableGoodCase = indexArr.map(function(val,index) {

                        	  var brStr=index!=5 && '<p><br /></p>' || '';

                            return '<p style="text-align:left;font-weight:bolder">图' + val + '：</p><table class="bdAdd'+tabTypeId+'" name="bd_tab" border="1"> <tr> <td  style="text-align:left;height:330pt"></td> </tr> </table>'+brStr;


                          });
                    
                       }else{

							 var tableGoodCase=tableGoodCaseArr.map(function(val,index){

                         var imgItem=data.picture[index];

                         var imgStr=imgItem[1] && '<div class="imgContent"> <img width="635" height="400" src="'+imgItem[1]+'" alt=""/> </div>' || "";

                         	  var brStr=index!=5 && '<p><br /></p>' || '';

                          return '<p style="text-align:left;font-weight:bolder">图'+indexArr[index]+'：</p><table class="bdAdd'+tabTypeId+'" name="bd_tab" border="1"> <tr> <td  style="text-align:left;height:330pt">'+imgStr+'</td> </tr> </table>'+brStr;
                      });

                       };

						tableGoodCase.unshift('<p style="text-align:center;font-weight:bolder">表9  季度优秀病历选登</p>');
                       tableGoodCase='<span lang="EN-US" style="font-size:10.5pt;mso-bidi-font-size:11.0pt;font-family: Calibri,sans-serif;mso-ascii-theme-font:minor-latin;mso-fareast-font-family: 宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-theme-font:minor-latin; mso-bidi-font-family:Times New Roman;mso-bidi-theme-font:minor-bidi; mso-ansi-language:EN-US;mso-fareast-language:ZH-CN;mso-bidi-language:AR-SA"><br clear="all" style="mso-special-character:line-break;page-break-before:always"></span>'+tableGoodCase.join("");

                      //  table=capStr + table+tableGoodCase;//显示图片暂时不用了
                        table=capStr + table;
	             
	                }else if(tabTypeId == "12"){
            
						var data = res;
						var targetOrg = parent.targetOrg;
						//表头
						var tabHeadArr = data.kpi.map(function(val) {
							return '<th width="75">' + val[0] + '</th>';
						});
						tabHStr = '<tr><th width="45">序号</th><th width="16%">科室</th>' + tabHeadArr.join("") + '</tr>';
						//表身体
						table = data.data.reduce(function(total, cur, index) {

							var tdOrg = data.dim[index][0];
                            var TargetOrgClass =targetOrg == tdOrg && 'class="targetOrg"' || '';

							var trArr = cur.reduce(function(tr, td) {

								 tr.push('<td '+TargetOrgClass+'>'+td+'</td>');
								return tr;
							}, []);
							var trColor = tabColorArr[index % 2];
							var trStr ='<tr class="'+trColor+'" ><td '+TargetOrgClass+'>'+(index+1)+'</td><td '+TargetOrgClass+'>'+tdOrg+'</td>'+trArr.join("")+'</tr>';
							total.push(trStr);
							return total;

						}, []);

						table = '<table class="bdTab' + tabTypeId + '" name="bd_tab" border="1">' + tabHStr + table.join("") + '</table><p style="text-align:left;">' + (data.remakes.length && data.remakes[0][0] || "") + '</p>';

        			}else {
		                            
        				var tabMaxCount = 15;
		                        if (tabTypeId == "2") {
		                            tabHStr = "<th width='45px'>序号</th>";
		                            for (var i = 0, leg1 = res.ctm.length; i < leg1; i++) {
		                                tabHStr += "<th >" + res.ctm[i].logColName + "</th>";
		                            }

		                        } else if (tabTypeId == "3") {

		                            for (var i = 0, leg1 = res.ctm.length - 1; i < leg1; i++) {
		                                tabHStr += "<th >" + res.ctm[i].logColName + "</th>";
		                            }

		                            tabHStr = "<th width='60'>序号</th>" + tabHStr + "<th width='85'>" + res.ctm[leg1].logColName + "</th>";

		                        } else {
		                        	tabMaxCount = 12;
		                             tabHStr += '<th width="28">序<br/>号</th><th width="45">患者<br />姓名</th><th >住院号</th><th width="13%">报告时间</th><th >大类</th><th width="22%">小类</th><th>等级</th><th width="9%">上报<br />科室</th><th width="9%">责任<br />科室</th>'; 
		                        }

		                        //表头
		                        tabHStr = '<thead><tr>' + tabHStr + '</tr></thead>';

		                        //表身体
		                        var data = res.data;
		                        var tab_order=1;
		                         var tab3=tabTypeId=="3"?"class='bd_tab3'":"";
		                        for (var i = 0, leg = data.length; i < leg; i++) {
		                            var tr = "";
		                            var firstTd = (data[i][0] == "null" || !data[i][0].trim()) ? "" : data[i][0];

		                             tr+=("<td>"+tab_order+"</td><td "+tab3+">"+((tabTypeId == "8" &&  firstTd)?(firstTd.substring(0,1)+"*"):firstTd)+"</td>");//序号

		                           if(tabTypeId != "2"){
			                               for (var j = 1, leg1 = data[i].length; j < leg1; j++) {
			                                  var value = data[i][j] == "null" ? "无" : data[i][j];
			                                  tr += ("<td >" + value + "</td>");
			                              }

			                          }else{
			                            
			                              for (var j = 1, leg1 = data[i].length; j < leg1; j++) {
			                 
			                                  var value = j == 1 ? getTab3Department(tab_order) : data[i][j] == "null" ? "无" : data[i][j];

			                                  tr += ("<td >" + value + "</td>");
			                          }
			                      }

		                            tr = "<tr class='"+tabColorArr[(i+1)%2]+"'>" + tr + "</tr>";
		                            table += tr;
		                            tab_order++;
		                        }

		                         //加空格
		                        if(leg<tabMaxCount){
		                          for(var j=0;j<=(tabMaxCount-tab_order);j++){
		                             var tr="";
		                             tr+="<td>"+(j+tab_order)+"</td>";//序号
		                             tr+=(Array(res.ctm.length).fill("<td></td>").join("")); 
		                             tr ="<tr class='"+tabColorArr[j%2]+"'>"+tr+"</tr>";
		                             table += tr;
		                          } 
		                        }

		                        var tabFoot = "";
		                        tabCap = "";
		                        switch (tabTypeId) {
		                            case "2":

		                                if (!res.ts.ts) {
		                                    break;
		                                }

		                                var footArr = [
		                                    ['<td colspan="2" >总分</td><td></td>', '<td>' + (!res.ts.ts.totalValue ? '无' : res.ts.ts.totalValue) + '</td>', '<td>' + (!res.ts.ts.totalScore ? '无' : res.ts.ts.totalScore) + '</td>'],
		                                    ['<td colspan="2">标准分</td><td></td>', '<td>' + (!res.ts.ts.standardValue ? '无' : res.ts.ts.standardValue) + '</td>', '<td>' + (!res.ts.ts.sum ? '无' : res.ts.ts.sum) + '</td>'],
		                                    ['<td colspan="2">排名</td><td></td>', "<td></td>", '<td>' + (!res.ts.ts.ranking ? '无' : res.ts.ts.ranking) + '</td>'],
		                                ];

		                                tabFoot = footArr.map(function(item) {
		                                    return '<tr>' + item.join("") + '</tr>';
		                                })

		                                table += tabFoot.join("");
		                                break;

		                            case "3":
		                                var tab3Arr = res.other.map(function(val) {
		                                    return val[1];
		                                })

		                                if (!tab3Arr[0]) {
		                                    tab3Arr = Array(4).fill("0");
		                                }


		                                 tabCap = '<table class="tab3-cap"><tr><td style="width:220px">出院人次：' + tab3Arr[0] + '</td><td>质控病历数：' + tab3Arr[2]  +'</td></tr><tr><td>平 均 分：' + tab3Arr[1]  + '</td> <td>缺陷病历数：' + tab3Arr[3]  + '</td></tr></table>';

		                                tabFoot = '<tr><th > 备注：</th> <th colspan="2" style="text-align:left;">《运行病历缺陷整改通知书》实时发送到医生工作站，内有扣分明细，请科室关注（*标记为单项否决项）。</th></tr>';

		                                table += tabFoot;
		                                break;

		                             case "8":

		                                tabCap = '<p style="text-align:left;"><span >床位数：' + (res.BedNum.length ?res.BedNum[0]:0)+ '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不良事件上报总数：' +( res.AdverseTotal.length?res.AdverseTotal[0]:0)+ '（不良事件报告表请见附件）</span></p>';
		                                break;
		                        }

		                        table =tabCap+"<table  class='bdTab"+tabTypeId+"' name='bd_tab' border='1' >"+tabHStr + "<tbody>" + table + "</tbody></table>";
	                }
	                callback(table);
	            });
	        }
    	};

    	var graphOptions={
          "setXData":function(XData,time){

                let  timeFreq =  time.match(/\d+/)[0];
                const arr = ["一","二","三","四"];
                switch (timeFreq) {
                      case "1":// 年
                        return XData ;
                      case "2":// 季度
                    	  return XData ;
                      case "3":// 月 
                        return XData ;
                        break;
                      case "4":// 天
                        return XData ;
                    } 
           },
           "chartArr":function(data){
                  const self = this ;
                  const XData = this.setXData(data[0].rowDimName,data[0].timeFreq);
                  return data.map(function(val){
                	  const lineType =val.lineType;
                      var dataArr = val.rowData.map(function(_data){
                                return _data == "--" || _data == "" ? null : _data.replace(/%/g,"");
                          });
                      
                     let unit = val.rowDataUnit.find(function(val){
                          return val != "--";
                     }) || "";
                      
                     unit = "(单位："+unit+ ")";
                      
					const text = val.contrastDimName;                                          
                      var series =  {
            	              name:val.contrastDimName  ,
            	              type:lineType=="1"?"line":"bar", 
            	              symbol:"circle",
            	              symbolSize:'8',
            	              label:{
            	                  normal:{
            	                    show:true,
            	                    position:"top",
            	                    color:"black" ,
            	                    distance:10,
            	                    fontSize:14,
            	                  },
            	              },
            	              lineStyle: {
            	            	  normal:{
            		               	  width:"4",
            	            	  }
            	           	   },
            	              itemStyle:{
            	            	  normal:{
            	            		  color: '#A5A5A5',
            		                   borderWidth: 0,
            	            	  }
            	               },
            	              barWidth:20, //柱图宽度
            	              data:dataArr,
                      };
                      var obj = {max:+val.maxVals,min:+val.minVals};
                      return self.getOption(XData,series,unit,text,obj);
                 });
          },
          getInteger:function(num ,type,single){
        		
        		 const str_interval = (num+"").split("");
        		 const  lev = str_interval.length;
        		    
        		 const leg = type ? (lev-2 > 0 && lev-2 || 1)  : 1;
        		    	
        	   	 const last = str_interval[lev-leg];
        	   	
        	   	 const val = last - 5 ;
        	   	 
        	   	 if(lev != 1 && !single){
        			if(val < -2){
        				num = 0 ;
        	    	}else if(val > 2){
        	    		num = 10 ;
        	    	}else{
        	    		num = 5 ;
        	    	}
        	 		for(let i = 0;i<leg;i++){
        				 str_interval[lev-1-i]=0;
        			 }
        		    const newNum = str_interval.join("");
        		   return  +newNum + num*Math.pow(10,leg-1) ;
        	   	 }else{
        	   		 return num ;
        	   	 }
        	},
        	getVal:function(max,min){
        		
        		const init_val_max =Math.ceil(max),
        		      init_val_min =Math.floor(min),
        		      init_interval = Math.ceil((init_val_max-init_val_min)/4) || 1;
        		
        		const y = ((init_interval+"").length -2) > 0 ;
        	   	const single = init_interval < 3 
        	   	const is_min = init_val_min - init_interval >=0;
        	   	const _min = !is_min ? init_val_min * 0.8 : (init_val_min - init_interval);
        	    	
        	    let  val_max = Math.ceil(init_val_max + init_interval),
        	         val_min =  Math.floor(_min);

        	 	     val_max = this.getInteger(val_max,y,single),
        	         val_min = this.getInteger(val_min,y,single);
        	 	  
        	 	  interval = this.getInteger(Math.ceil((val_max-val_min)/4),true,false) || 1;
        	 	  
        	 	  
        	 	  return [val_max,val_min,interval];
        		
        	},
          "getOption":function(XData,seriesData,unit,text,obj) {
        	  const dataArr = seriesData.data.slice().filter(function(val){
        	    	return val !== null ;
        	    });
        	  
        	  if(!dataArr.length){
        	    	dataArr[0] = 0 ;
        	    }
        	  
        	  const init_val_max =Math.ceil(Math.max.apply(null,dataArr)),
        	  init_val_min =Math.floor(Math.min.apply(null,dataArr));
        	
        	  const value = this.getVal(init_val_max,init_val_min);
      	      let   val_max = value[0],
      	    		val_min = value[1],
      	    		interval = value[2];
      	      
      	      
      	    if( val_min + 4*interval > init_val_max ){
    		   	 val_max = val_min + 4*interval  ;
    	     }
      	      
      	    if( val_max - val_min <  4){
      	    	 interval = 1 ;
      		   	 val_min = val_min !== 0 ? val_min -1 : 0 ,
      		   	 val_max = val_min + 4 ;
      	     }
      	        let _text = text.length>14 && (text.substr(0,14) + "\n" + text.substr(14)) || text;

              var option = {
                   animation:false,
                   title:{
              			text:_text +unit,
              			top:15,
              			left:"center",
              			textStyle:{
            			  fontSize:15,
            			  fontWeight:"lighter",
              			},
              		 },
                   color:["#A5A5A"],
                    grid: {
                  	  zlevel: 2,
                        containLabel: false,
                        bottom:50,
                        left:60,
                        right:15,
                        top:70,
                        width:"70%",
                    },
                    legend: {
                    	show:false,
                    },
                    xAxis: {    
                            type:'category',
                            data:XData,
                            axisLabel:{
                              show: true,
                              interval:XData.length>7 ? "auto" : "0",
                              fontSize:12,
                              rotate:XData.length > 3 ? 25 : 0,
                            } 
                    },
                    yAxis: {
                            type:'value',
                            min:val_min,    
                            max:val_max,   
                            interval:interval, 
                           
                            axisLabel:{
                                  show: true,
                                  showMinLabel: true,
                                  showMaxLabel: true,
                                  formatter:function(val){
                                    	const _val = Math.floor(val);
                                    	return _val ;
                                    	
                                    },
                            }       
                    },
                    series: seriesData,
              };



                return option ;
            },
          "creatChart":function(data,$box){

              var imgStr="<img class='chart-img'  width='310' height='290'>";

              const chartArr = this.chartArr(data);
              const lineStr =  ' <div class="chart-line" style="width:100%;height:290px"></div>';
              
              let leg = chartArr.length ;
              
              const chartStrArr = new Array(leg).fill("1").map(function(val,index){

                if(index % 2 == 0){
                    return '<tr ><td style="width:50%;" >'+lineStr+imgStr+'</td>';
                }else{
                    return '<td style="width:50%;">'+lineStr+imgStr+'</td></tr>'
                }

              });

              leg % 2 != 0 && chartStrArr.push('<td style="width:50%;vertical-align:top;"></td></tr>');
              

              const chartStr ='<table class="chart-merge" style="width:100%;margin:5px auto;text-align:center" >'+chartStrArr.join("")+'</table>';

              $box.html(chartStr);
              
              const $par =  $box.parent(".containner");
              const style = $par[0].getAttribute("style");
              $par[0].removeAttribute("style");
              $par.attr("sign","chart");
              $par[0].setAttribute("style",style);
              

                $.map($box.find(".chart-line"),function(dom,index){
                        var myChart = echarts.init(dom);
                            myChart.setOption(chartArr[index]);

                         var imgDatabase= myChart.getConnectedDataURL({type:"png",pixelRatio:3}).split(",")[1];

                            !function(_index){

                                  const $chart = $(dom);
                                  const $imgEl = $chart.siblings(".chart-img");
                                  getImgUrl(imgDatabase,$imgEl,$chart);   

                            }(index);
                });


              
          }
		}
