import "css/common/input.scss";
import "css/common/modal.scss";
import "css/common/common.scss";
import "css/common/button.scss";
import { Calendar } from "js/common/calendar.js";
class Unit {

	constructor(){
	//	this.initModal();
		this.initSearch();
	}


	/*initModal(){
		const self = this ;
		const $close = $(".s-modal .m-close");
		$close.click(function(){
			self.closeModal($(this).closest(".s-modal"));
		});
	}
	closeModal($el){

		new Promise(res=>{
			
			$el.removeClass("m-show");
			$el.hasClass("s-tip") && this.initTipM($el.find("#tipText"),$el.find("#statusBox"),$el.find("#g-out"));
			res();
		}).then(()=>{

			setTimeout(function(){
				$el.hide();
			},100);
		})

	}
	showModal($el){
		
		new Promise(function(res){
			$el.show();
			res();
		}).then(()=>{
			$el.addClass("m-show");
		
		})
	}
*/


	initSearch(){
		// 搜索
		$(".search-btn").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			const state = $wrap.hasClass("active-search");

			if(state){
				return ;
			}

			$wrap.addClass("active-search");
		});

		// 搜索按钮关闭
		$(".search-close").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			$wrap.removeClass("active-search");
		});
	}
	dropMenuHandle($el,callback){

		const $wrap = $el.closest(".dropMenu");
		const state = $wrap.hasClass("active-menu");

		if(state){
			$wrap.removeClass("active-menu");
			setTimeout(function(){
				callback(state);
			 },100);	
	
		}else{
			
			callback(state);
			setTimeout(function(){
				$wrap.addClass("active-menu");
			 },0);
			
		}
	}
	renderDropMenu($el,config){

		const strArr=config.map((val,index)=>{

			const {type,icon,text} = val;
			    
			    return `<li class="menu-item" style="top:${index*30}px" sign="${type}">
			    			<i class="fa ${icon}">&nbsp;&nbsp;</i>
			    			<span>${text}</span>
			    		</li>`;
		});	
		
		$el.html(strArr.join(""));
	}
	
	
	initCombobox(arr,$el){

		const items = arr.map(function(val,index){
			const {id,text} = val ;
			return `
					<li class="combo-item ${ index===0 ? "combo-item-active" : ""}" echo-id="${id}">
						<i class="fa fa-folder">&nbsp;</i>
						<span >${text}</span>
					</li>
				  `
		});

		$el.html(items);

		const $combobox = $el.siblings(".inp-combobox");

		const {text,id}=arr[0];

		$combobox.children("p").html(text);
		$combobox.children("input").val(id);
	}
	initTipM($tip,$svg,$circle){
		
		setTimeout(function(){
			$tip.html("确定删除吗？");
			$svg.removeClass("g-status");
			$svg.attr("xlink:href","#g-warn");
			$circle.attr("stroke","#F8C186");
		}, 200);
	}

	renderTipM($svg,status){
		const color = {"#g-success":"#A5DC86","#g-load":"grey","#g-error":"red"};
		$svg.attr({"xlink:href":status,"stroke":color[status]});
		$("#g-out").attr("stroke",color[status]);
	}
}

/*
 下拉框类
 data:数组
 multiply:true 多选,
 dropFormatter:自定义返回的内容，但是主要显示的文字一定要用 item-txt包住
*/
class SCombobox {

	constructor($el,config){

		const defaultConfig = {
			"prompt":"请选择...",
			"slideIcon":"fa fa-chevron-down",
			"data":[],
			"dropIcon":"fa fa-circle",
			"textField":"text",
			"idField":"id",
			"dropFormatter":null,
			"multiply":false,
			"defaultVal":"",
			 clickCallback:null,
			 width:260,
		}

		this.config = Object.assign({},defaultConfig,config);
		this.box = $el ;
		this.selValue = this.config.defaultVal;
		this.init();

	}

	init(){
		const {width} = this.config;
		this.box.css({"width":width});
		this.box.html(this.initRender());
	    this.handle();
	}

	loadData(data,$el=this.box){
		this.config.data = data;
		const str = this.renderDrop().join("");
		$el.children(".combo-drop").html(`<ul>${str}</ul>`);
	}

	initRender(){

		const {prompt,slideIcon,data} = this.config;

		return `
				<div class="combo-inp">
					<input type="text" class="s-inp combo-text" placeholder="${prompt}" readOnly="readOnly"/>
					<input type="hidden" class="s-inp combo-value"  value="${this.selValue}"/>
					<span class="slide-icon ${slideIcon}">
					</span>
				</div>
				<div class="combo-drop ">
					<ul>
						${this.renderDrop().join("")}
					</ul>
				</div>
				`
	}

	setValue(values,$el=this.box){

	   const $drop = $el.children(".combo-drop").children("ul");

	   if(this.config.multiply){
	   	 	$drop.html(this.renderDrop(values));
	   }else{
			$drop.children(`li[echo-id=${values}]`).addClass("active").siblings().removeClass("active");
	   }

	  this.updateInpBox($drop);
	}

	getValue($el=this.box){
		return $el.find(".combo-value").val();
	}

	updateInpBox($drop){
		
		const inpBox = $drop.parent().siblings();
        const comboText = inpBox.children(".combo-text"),
        	  comboValue=inpBox.children(".combo-value");

		const txts = [];
		const ids = $.map($drop.children(".active"),(val,index)=>{
				
				const $val = $(val);
				txts[index] = $val.children(".item-txt").text();

				return $val.attr("echo-id") ;
		});
		comboText.val(txts.join(","));
		comboValue.val(ids.join(","));
	}

	renderDrop(values=[]){

		const {data,dropIcon,textField,idField} = this.config;
		return data.map((val,index)=>{

			const id = val[idField];
			const active = values.includes(id) && "active" || "" ;

			return `<li class="drop-item ${active}" echo-id="${id}">
						<span class="${dropIcon}"></span>
						<b class="item-txt">${ this.config.dropFormatter && this.config.dropFormatter(val) || val[textField] }</b>
					</li>`

		});
	}

	handle(){

		const self = this ;
		
		//选择item
		this.box.on("click",".drop-item",function(){

			const $this= $(this);
			if(self.config.multiply){
			
				$this.hasClass("active") &&  $this.removeClass("active")|| $this.addClass("active");
		
			}else{
				$this.addClass("active").siblings().removeClass("active");
			}
			

			const par = $this.parent();

			self.updateInpBox(par);

			self.config.clickCallback && self.config.clickCallback();

		});

		this.box.on("click",".combo-inp",function(){

			const $this= $(this);
			const par = $this.parent();

			const is_active = par.hasClass("active");

			!is_active ? self.showDown(par) : self.hideUp(par);

		});



	}

	showDown(par){
		par.children(".combo-drop").show();
		requestAnimationFrame(function(){
           par.addClass("active");
        });

        this.hideUp($(".s-comboBox"));
	}

	hideUp(par){
		 par.removeClass("active");
		 requestAnimationFrame(function(){
           par.children(".combo-drop").show();
        });
	}
}





/*
  模态框类
*/
class SModal{

	constructor(){
		this.handle();
	}

	init(){

	}

	close($el,className="m-show"){
		$el.removeClass(className);
		requestAnimationFrame(function(){
			$el.hide();
		});
	}

	show($el,className="m-show"){
		$el.show();
		requestAnimationFrame(function(){
			$el.addClass(className);
		});
	}

	handle(){
		const self = this;
		$(".m-close").click(function(){
			const Modal = $(this).closest(".s-modal");
			self.close(Modal);
		});
	}
}

/*
  tree结构类
  judgeRelation:true：目录 ,false:文件
*/

class Tree{

	constructor($el,config){

		console.log(config,"tree");

		const defaultConfig = {
			"data":[],
			"textField":"text",
			"idField":"id",
			"childIcon":"fa fa-user-circle-o",
			"parIcon":"fa fa-folder-open-o",
			"checkbox":false,
			"formatter":null,
			 "clickCallback":function(){
			 },
			 "checkCallback":function(){
			 },
			 "clickAndCheck":true,
			 "childrenField":"children",
			 "judgeRelation":(val)=>{//自定义判断是目录还是文件的函数

					return val[defaultConfig.childrenField].length > 0 ;

			 }
		}

		this.config = Object.assign({},defaultConfig,config);
		this.box = $el ;
		this.init();

	}

	init(){

		const test = {
			data: [{
				id: 10,
				text: '全院',
				par_id: -2,
				children: []
			}, {
				id: 200,
				text: 'xx医院',
				par_id: -2,
				children: [{
					id: 201,
					text: '手术科室',
					par_id: 200,
					children: [{
						id: 206,
						text: '耳鼻喉科',
						par_id: 201,
						children: []
					}, {
						id: 207,
						text: '妇科一病区',
						par_id: 201,
						children: []
					}, {
						id: 208,
						text: '肝胆外科',
						par_id: 201,
						children: []
					}, {
						id: 209,
						text: '肛肠外科',
						par_id: 201,
						children: []
					}, {
						id: 210,
						text: '骨科一病区(骨关节科)',
						par_id: 201,
						children: []
					}, {
						id: 211,
						text: '骨科二病区(脊柱外科科)',
						par_id: 201,
						children: []
					}, {
						id: 212,
						text: '泌尿外科',
						par_id: 201,
						children: []
					}, {
						id: 213,
						text: '甲乳外科',
						par_id: 201,
						children: []
					}, {
						id: 214,
						text: '胃肠外科',
						par_id: 201,
						children: []
					}, {
						id: 215,
						text: '神经外科',
						par_id: 201,
						children: []
					}, {
						id: 216,
						text: '手显微血管外科',
						par_id: 201,
						children: []
					}, {
						id: 217,
						text: '胸外科',
						par_id: 201,
						children: []
					}, {
						id: 218,
						text: '疼痛科',
						par_id: 201,
						children: []
					}, {
						id: 219,
						text: '眼科',
						par_id: 201,
						children: []
					}, {
						id: 220,
						text: '口腔科',
						par_id: 201,
						children: []
					}, {
						id: 221,
						text: '烧伤整形外科',
						par_id: 201,
						children: []
					}, {
						id: 222,
						text: '心脏大血管外科',
						par_id: 201,
						children: []
					}, {
						id: 224,
						text: '麻醉科',
						par_id: 201,
						children: []
					}, {
						id: 225,
						text: '介入科',
						par_id: 201,
						children: []
					}, {
						id: 259,
						text: '产科',
						par_id: 201,
						children: []
					}, {
						id: 279,
						text: '全科医学科',
						par_id: 201,
						children: []
					}, {
						id: 280,
						text: '心胸外科',
						par_id: 201,
						children: []
					}, {
						id: 283,
						text: '妇科二病区',
						par_id: 201,
						children: []
					}, {
						id: 286,
						text: '五官科',
						par_id: 201,
						children: []
					}, {
						id: 287,
						text: '日间手术管理中心',
						par_id: 201,
						children: []
					}, {
						id: 288,
						text: '便民门诊',
						par_id: 201,
						children: []
					}, {
						id: 289,
						text: '社康',
						par_id: 201,
						children: []
					}, {
						id: 1173,
						text: '产科+爱婴区',
						par_id: 201,
						children: []
					}, ]
				}, {
					id: 202,
					text: '非手术科室',
					par_id: 200,
					children: [{
						id: 226,
						text: '老年病房VIP',
						par_id: 202,
						children: []
					}, {
						id: 227,
						text: '儿科',
						par_id: 202,
						children: []
					}, {
						id: 228,
						text: '感染科',
						par_id: 202,
						children: []
					}, {
						id: 229,
						text: '呼吸内科',
						par_id: 202,
						children: []
					}, {
						id: 230,
						text: '康复医学科',
						par_id: 202,
						children: []
					}, {
						id: 231,
						text: '内分泌科',
						par_id: 202,
						children: []
					}, {
						id: 232,
						text: '神经内科',
						par_id: 202,
						children: []
					}, {
						id: 233,
						text: '肾内科',
						par_id: 202,
						children: []
					}, {
						id: 234,
						text: '消化内科',
						par_id: 202,
						children: []
					}, {
						id: 235,
						text: '心血管内科',
						par_id: 202,
						children: []
					}, {
						id: 236,
						text: '新生儿科',
						par_id: 202,
						children: []
					}, {
						id: 237,
						text: '血液科',
						par_id: 202,
						children: []
					}, {
						id: 238,
						text: '肿瘤科',
						par_id: 202,
						children: []
					}, {
						id: 239,
						text: '中医科',
						par_id: 202,
						children: []
					}, {
						id: 240,
						text: 'ICU(含急诊ICU)',
						par_id: 202,
						children: []
					}, {
						id: 281,
						text: '老年医学科',
						par_id: 202,
						children: []
					}, {
						id: 282,
						text: '重症医学科',
						par_id: 202,
						children: []
					}, {
						id: 291,
						text: 'VIP病房(老年病房)',
						par_id: 202,
						children: []
					}, {
						id: 294,
						text: '急诊儿科',
						par_id: 202,
						children: []
					}, {
						id: 297,
						text: '特诊科',
						par_id: 202,
						children: []
					}, {
						id: 364,
						text: '急诊病房（EICU）',
						par_id: 202,
						children: []
					}, {
						id: 1001,
						text: '药库',
						par_id: 202,
						children: []
					}, {
						id: 1002,
						text: '抽血处',
						par_id: 202,
						children: []
					}, {
						id: 1004,
						text: '中药房',
						par_id: 202,
						children: []
					}, {
						id: 1005,
						text: '采购办',
						par_id: 202,
						children: []
					}, {
						id: 1006,
						text: '超声科（腹部）',
						par_id: 202,
						children: []
					}, {
						id: 1007,
						text: '临床药学室',
						par_id: 202,
						children: []
					}, {
						id: 1008,
						text: '南山医院机关社康站护',
						par_id: 202,
						children: []
					}, {
						id: 1010,
						text: '红花园社康',
						par_id: 202,
						children: []
					}, {
						id: 1011,
						text: '药剂科办公室',
						par_id: 202,
						children: []
					}, {
						id: 1013,
						text: '南园社康',
						par_id: 202,
						children: []
					}, {
						id: 1014,
						text: '大汪社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1015,
						text: '社康管理中心',
						par_id: 202,
						children: []
					}, {
						id: 1018,
						text: '高新社康',
						par_id: 202,
						children: []
					}, {
						id: 1021,
						text: '精神科',
						par_id: 202,
						children: []
					}, {
						id: 1024,
						text: '妇产科内分泌病区',
						par_id: 202,
						children: []
					}, {
						id: 1027,
						text: '泌外科病房',
						par_id: 202,
						children: []
					}, {
						id: 1028,
						text: '产房',
						par_id: 202,
						children: []
					}, {
						id: 1030,
						text: '院前科车队',
						par_id: 202,
						children: []
					}, {
						id: 1032,
						text: '麻岭社康',
						par_id: 202,
						children: []
					}, {
						id: 1033,
						text: '北头社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1037,
						text: '基建工程科',
						par_id: 202,
						children: []
					}, {
						id: 1038,
						text: '图书馆',
						par_id: 202,
						children: []
					}, {
						id: 1039,
						text: '妇产科',
						par_id: 202,
						children: []
					}, {
						id: 1040,
						text: '南头城社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1042,
						text: '同乐社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1044,
						text: '科技园社康',
						par_id: 202,
						children: []
					}, {
						id: 1045,
						text: '莲城社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1046,
						text: '向南社康',
						par_id: 202,
						children: []
					}, {
						id: 1048,
						text: '妇科',
						par_id: 202,
						children: []
					}, {
						id: 1049,
						text: '侨城社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1050,
						text: '宣传科',
						par_id: 202,
						children: []
					}, {
						id: 1052,
						text: '消毒供应室',
						par_id: 202,
						children: []
					}, {
						id: 1053,
						text: '麻岭社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1054,
						text: '妇联计生',
						par_id: 202,
						children: []
					}, {
						id: 1055,
						text: '粤桂社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1056,
						text: '荔湾社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1058,
						text: '临床营养科',
						par_id: 202,
						children: []
					}, {
						id: 1059,
						text: '南园社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1060,
						text: '田厦社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1061,
						text: '中医（风湿）',
						par_id: 202,
						children: []
					}, {
						id: 1062,
						text: '滨海社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1063,
						text: '固定资产办公室',
						par_id: 202,
						children: []
					}, {
						id: 1066,
						text: '健康管理科兼保健科秘',
						par_id: 202,
						children: []
					}, {
						id: 1067,
						text: '星海社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1068,
						text: '大新社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1070,
						text: '红花园社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1072,
						text: '设备科行政',
						par_id: 202,
						children: []
					}, {
						id: 1073,
						text: '田厦社康',
						par_id: 202,
						children: []
					}, {
						id: 1077,
						text: '产二科',
						par_id: 202,
						children: []
					}, {
						id: 1078,
						text: '肾内科血透室',
						par_id: 202,
						children: []
					}, {
						id: 1082,
						text: '同乐北社康',
						par_id: 202,
						children: []
					}, {
						id: 1086,
						text: '莲城社康',
						par_id: 202,
						children: []
					}, {
						id: 1087,
						text: '同乐社康',
						par_id: 202,
						children: []
					}, {
						id: 1088,
						text: '导诊',
						par_id: 202,
						children: []
					}, {
						id: 1089,
						text: '心功能科',
						par_id: 202,
						children: []
					}, {
						id: 1090,
						text: '向南社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1091,
						text: '设备科工勤人员',
						par_id: 202,
						children: []
					}, {
						id: 1092,
						text: '体检科文员',
						par_id: 202,
						children: []
					}, {
						id: 1093,
						text: '健康管理科兼保健',
						par_id: 202,
						children: []
					}, {
						id: 1095,
						text: '铜鼓社康',
						par_id: 202,
						children: []
					}, {
						id: 1096,
						text: '中医（风湿）科',
						par_id: 202,
						children: []
					}, {
						id: 1097,
						text: '北头社康',
						par_id: 202,
						children: []
					}, {
						id: 1099,
						text: '大汪社康',
						par_id: 202,
						children: []
					}, {
						id: 1100,
						text: '区信息中心',
						par_id: 202,
						children: []
					}, {
						id: 1102,
						text: '医院网络技术科',
						par_id: 202,
						children: []
					}, {
						id: 1103,
						text: '西药房',
						par_id: 202,
						children: []
					}, {
						id: 1104,
						text: '阳光棕榈社康',
						par_id: 202,
						children: []
					}, {
						id: 1106,
						text: '南益公司',
						par_id: 202,
						children: []
					}, {
						id: 1107,
						text: '输液室',
						par_id: 202,
						children: []
					}, {
						id: 1108,
						text: '滨海社康',
						par_id: 202,
						children: []
					}, {
						id: 1109,
						text: '高新社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1112,
						text: '粤桂社康',
						par_id: 202,
						children: []
					}, {
						id: 1113,
						text: '孕产超声科',
						par_id: 202,
						children: []
					}, {
						id: 1114,
						text: '阳光棕榈社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1115,
						text: '换药室',
						par_id: 202,
						children: []
					}, {
						id: 1119,
						text: '同乐北社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1120,
						text: '内审科',
						par_id: 202,
						children: []
					}, {
						id: 1121,
						text: '荔湾社康',
						par_id: 202,
						children: []
					}, {
						id: 1128,
						text: 'DSA',
						par_id: 202,
						children: []
					}, {
						id: 1129,
						text: '院前科',
						par_id: 202,
						children: []
					}, {
						id: 1130,
						text: '科教科办公室',
						par_id: 202,
						children: []
					}, {
						id: 1131,
						text: '财务科办公室',
						par_id: 202,
						children: []
					}, {
						id: 1132,
						text: '南山社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1136,
						text: '高压氧治疗科',
						par_id: 202,
						children: []
					}, {
						id: 1138,
						text: '院感科',
						par_id: 202,
						children: []
					}, {
						id: 1139,
						text: '大铲岛社康',
						par_id: 202,
						children: []
					}, {
						id: 1143,
						text: '科教住院规培',
						par_id: 202,
						children: []
					}, {
						id: 1144,
						text: '中心药房',
						par_id: 202,
						children: []
					}, {
						id: 1145,
						text: '南山社康',
						par_id: 202,
						children: []
					}, {
						id: 1147,
						text: '医学影像科',
						par_id: 202,
						children: []
					}, {
						id: 1156,
						text: '铜鼓社康科秘',
						par_id: 202,
						children: []
					}, {
						id: 1157,
						text: '病理科技术人员',
						par_id: 202,
						children: []
					}, {
						id: 1158,
						text: '侨城社康',
						par_id: 202,
						children: []
					}, {
						id: 1159,
						text: '全科医学教研室',
						par_id: 202,
						children: []
					}, {
						id: 1164,
						text: '中医创建办公室',
						par_id: 202,
						children: []
					}, {
						id: 1166,
						text: '南头城社康',
						par_id: 202,
						children: []
					}, {
						id: 1168,
						text: '马家龙社康',
						par_id: 202,
						children: []
					}, {
						id: 1169,
						text: '大新社康',
						par_id: 202,
						children: []
					}, {
						id: 1170,
						text: '楼层收费室',
						par_id: 202,
						children: []
					}, {
						id: 1172,
						text: '星海社康',
						par_id: 202,
						children: []
					}, ]
				}, {
					id: 203,
					text: '医技科室',
					par_id: 200,
					children: [{
						id: 241,
						text: '病理科',
						par_id: 203,
						children: []
					}, {
						id: 242,
						text: '电子胃镜室',
						par_id: 203,
						children: []
					}, {
						id: 243,
						text: '放射科',
						par_id: 203,
						children: []
					}, {
						id: 244,
						text: '超声科',
						par_id: 203,
						children: []
					}, {
						id: 246,
						text: '门诊心电图室',
						par_id: 203,
						children: []
					}, {
						id: 247,
						text: '中心实验室',
						par_id: 203,
						children: []
					}, {
						id: 245,
						text: '检验科',
						par_id: 203,
						children: []
					}, {
						id: 248,
						text: '体检科',
						par_id: 203,
						children: []
					}, {
						id: 249,
						text: '输血科',
						par_id: 203,
						children: []
					}, {
						id: 250,
						text: '物理治疗室',
						par_id: 203,
						children: []
					}, ]
				}, {
					id: 204,
					text: '独立门诊',
					par_id: 200,
					children: [{
						id: 251,
						text: '皮肤科',
						par_id: 204,
						children: []
					}, {
						id: 252,
						text: '临床心理科',
						par_id: 204,
						children: []
					}, {
						id: 253,
						text: '美容科',
						par_id: 204,
						children: []
					}, {
						id: 254,
						text: '急诊科',
						par_id: 204,
						children: []
					}, {
						id: 255,
						text: '营养科',
						par_id: 204,
						children: []
					}, {
						id: 256,
						text: '核医学科',
						par_id: 204,
						children: []
					}, {
						id: 257,
						text: '健康管理科',
						par_id: 204,
						children: []
					}, {
						id: 258,
						text: '高压氧',
						par_id: 204,
						children: []
					}, {
						id: 275,
						text: '儿保科',
						par_id: 204,
						children: []
					}, {
						id: 1174,
						text: '护理部',
						par_id: 204,
						children: []
					}, ]
				}, {
					id: 205,
					text: '职能科室',
					par_id: 200,
					children: [{
						id: 260,
						text: '医务科',
						par_id: 205,
						children: []
					}, {
						id: 261,
						text: '质控科',
						par_id: 205,
						children: []
					}, {
						id: 262,
						text: '科教科',
						par_id: 205,
						children: []
					}, {
						id: 263,
						text: '防保科',
						par_id: 205,
						children: []
					}, {
						id: 264,
						text: '财务科',
						par_id: 205,
						children: []
					}, {
						id: 265,
						text: '药学部',
						par_id: 205,
						children: []
					}, {
						id: 266,
						text: '病案管理科',
						par_id: 205,
						children: []
					}, {
						id: 267,
						text: '医保管理科',
						par_id: 205,
						children: []
					}, {
						id: 268,
						text: '法制科及医患关系办',
						par_id: 205,
						children: []
					}, {
						id: 269,
						text: '门诊办公室',
						par_id: 205,
						children: []
					}, {
						id: 270,
						text: '医院感染管理科',
						par_id: 205,
						children: []
					}, {
						id: 271,
						text: '党委办公室',
						par_id: 205,
						children: []
					}, {
						id: 272,
						text: '医院办公室',
						par_id: 205,
						children: []
					}, {
						id: 276,
						text: '总务科',
						par_id: 205,
						children: []
					}, {
						id: 277,
						text: '人事科办公室',
						par_id: 205,
						children: []
					}, {
						id: 278,
						text: '网络技术科',
						par_id: 205,
						children: []
					}, {
						id: 273,
						text: '安全保卫科',
						par_id: 205,
						children: []
					}, {
						id: 274,
						text: '党办',
						par_id: 205,
						children: []
					}, ]
				}, {
					id: 284,
					text: '外科',
					par_id: 200,
					children: []
				}, {
					id: 285,
					text: '内科',
					par_id: 200,
					children: []
				}, ]
			}, ]
		};

		const {data} = this.config;
		this.config.data = test.data;
		const str = this.renderOrgJson(test.data,0);
		this.box.html(`<ul class="s-tree">${str.join("")}</ul>`);
		this.handle();
	}


    renderOrgJson(arr,_lev){

    	let lev = _lev ;
    		lev ++ ;

    		const {idField,textField,childrenField,judgeRelation,childIcon,parIcon,formatter} = this.config ;

		return arr.map((val,index)=>{
			

			const id = val[idField],
				  name =!formatter && val[textField] || formatter(val),
				  children = val[childrenField],
				  par_id = val["par_id"];


		    const type = judgeRelation(val);


			let data = {id,name,lev,par_id} ;

			if(type){


 				data.parIcon=parIcon;
				let  childrenEl = this.renderOrgJson(children,lev);

				return this.parentComponent(childrenEl,data);

			}else{
				data.childIcon=childIcon;
				const item = this.childComponent(data);
			
				return 	item;					
			
			}
		})
	}
	
	parentComponent(child,data){

		let {name,id,lev,par_id}= data;
		const {parIcon,checkbox} = this.config;

		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");

		const checkboxStr =checkbox &&  `<span class="s-checkbox">
						<input type="checkbox" class="par-checkinp tree-inp" value="${id}"  /><label class="fa fa-square-o" ></label>
				</span>` || "";

		return (`
			<li  lev="${lev}" class="tree-li">
				<div class="menuItem par-item" echo-id="${id}">
					${indent + checkboxStr}
					<i class="${parIcon}"></i>
					<span class="item-txt">${name}</span><span class="tree-slide-icon"><i class="fa fa-caret-down  "></i></span>
				</div>
				<ul class="par-menu">${child.join("")}</ul>
			</li>
		`);

	}

	childComponent(data){

		let {name,id,lev}= data;
		const {childIcon,checkbox} = this.config;

		const checkboxStr =checkbox &&  `<span class="s-checkbox">
						<input type="checkbox" class="child-checkinp tree-inp" value="${id}"  /><label class="fa fa-square-o" ></label>
				</span>` || "";


		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");
	
		return (`
			<li lev="${lev}" class="tree-li">
				<div class="menuItem child-item" echo-id="${id}">
				${indent + checkboxStr }
				<i class="${childIcon}">&nbsp;</i>
				<span class="item-txt">${name}</span>
				</div>
			</li>
		`);		
	}

	handle(){

		const {clickCallback,clickAndCheck,checkbox,checkCallback} = this.config;

		const self = this;

		this.box.on("click",".tree-slide-icon",function(e){
			
			e.stopPropagation();
			const parLi = $(this).closest(".tree-li");
			const $parDiv = $(this).parent();

			$parDiv.hasClass("tree-active") && $parDiv.removeClass("tree-active") || $parDiv.addClass("tree-active");

			const parMenu =parLi.children(".par-menu"); 
    		parMenu.slideToggle();

    	});

    	this.box.on("click",".child-item",function(){
			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();
			
			if(checkbox){
				
			}else{
				
				$this.closest(".s-tree").find(".active").removeClass("active");
				$this.addClass("active");
			}

			clickCallback(node,$this);

    	});

    	this.box.on("click",".par-item",function(){
			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();

			checkbox && clickCallback(node,$this);

    	});

    	this.box.on("click",".tree-inp",function(e){

    		 e.stopPropagation();
			const $this= $(this);
    		const status = $this.prop("checked");
    		const type =  $this.hasClass("par-checkinp");
			const par_li =  $this.closest(".tree-li");

			if(type){
				par_li.find(".has-chec").removeClass("has-chec");
				par_li.find(".tree-inp").prop("checked",status);
			}

			let lev = par_li.attr("lev");
			if(lev!=="1"){
				
				let up_par_li =  $this.closest(".tree-li");

				while (lev > 1 ){
					  up_par_li = up_par_li.parent().parent();
					  lev = +up_par_li.attr("lev");
 					  const checkEl = up_par_li.children(".menuItem").find(".tree-inp");
 					  const ul_par =  up_par_li.children(".par-menu") ;
					  const ul_par_leg = ul_par.children().length;
					  const check_leg = ul_par.children().children(".menuItem").find(".tree-inp:checked").length;

					 if(check_leg === 0 ){ //一个没选
					 	checkEl.siblings("label").removeClass("has-chec");
					 	checkEl.prop("checked",false);
						
					 }else if( check_leg < ul_par_leg ){
						checkEl.prop("checked",false);
						checkEl.siblings("label").addClass("has-chec");
					 }else{// 全选 

					 	checkEl.siblings("label").removeClass("has-chec");
					 	checkEl.prop("checked",false);

					 	checkEl.prop("checked",true);
						checkEl.siblings("label").removeClass("has-chec");
					 }

					  const is_has_chec = up_par_li.find(".has-chec").length;

					 if(check_leg == 0 &&  is_has_chec){
					 	checkEl.prop("checked",false);
						checkEl.siblings("label").addClass("has-chec");
					 }

				}
				
			}
			
			const node = self.findNode( +$this.val());

			console.log(node);
			checkCallback(node, $this);
    	});

	}
	setValue($el,ids){
		ids.map(val=>{
			$el.find(`.child-checkinp[value=${val}]`).click();
		});
	}

	findNode(id){

		let node = null ;
		
		const {childrenField,idField,data}  = this.config ;

		findFn(data);

		function findFn(arr){
			return arr.find(val=>{
				const status = val[idField] === id ;
				if(status){
					node = val ;
				}

				if(val[childrenField].length){
				
					return !status && findFn(val[childrenField]) || status;
				
				}else{
					return status;
				}

			});
		}
		
		return node;
	}
}


/*new Tree($("#templateBox"),{
	"clickAndCheck":true,
	"checkbox":false,
	clickCallback:function(node){
		console.log(node,"44");
	}
});*/



/*
 下拉框类
 data:数组
 multiply:true 多选,
 dropFormatter:自定义返回的内容，但是主要显示的文字一定要用 item-txt包住
*/
class SComboTree {

	constructor($el,config){

		const defaultConfig = {
			"prompt":"请选择...",
			"slideIcon":"fa fa-chevron-down",
			"defaultVal":"",
			 width:300,
		}

		this.config = Object.assign({},defaultConfig,config);


		this.box = $el ;
		this.init();

	}

	init(){
		const {width} = this.config;
		this.box.css({"width":width});
		this.box.html(this.initRender());
		this.renderDrop();
	    this.handle();
	}

	initRender(){

		const {prompt,slideIcon} = this.config;

		const checkbox = this.config.treeConfig.checkbox || false ;

		const inpStr = !checkbox && `<input type="text" class="s-inp combo-text" placeholder="${prompt}" readOnly="readOnly"/>` || `<textarea type="text" class="s-textarea combo-text" placeholder="${prompt}" readOnly="readOnly"/></textarea>` ;

		return `
				<div class="combo-inp">
					${inpStr}
					<input type="hidden" class="s-inp combo-value"  value=""/>
					<span class="slide-icon ${slideIcon}">
					</span>
				</div>
				<div class="combo-drop ">
					<ul class="s-tree"></ul>
				</div>
				`
	}

	setValue($el,values){

	  this.tree.setValue($el,values);
	  this.updateInpBox($el,values);
	}

	updateInpBox($drop,node){
		
		const {checkbox} = this.tree.config;
		const inpBox = $drop.siblings();
        const comboText = inpBox.children(".combo-text"),
        	  comboValue=inpBox.children(".combo-value");

		let txts = [],
		    ids = [];

		if(checkbox){
			txts = $.map($drop.find(".child-checkinp:checked"),function(val,index){
					const $this = $(val);
					ids[index]=$this.val();
					return $this.parent().siblings(".item-txt").text();
			});

		}else{
			const {id,txt} = node ;
			txts[0] = txt;
			ids[0] = id;
		}

		comboText.val(txts.join(","));
		comboValue.val(ids.join(","));
	}

	renderDrop(){

		const treeBox = this.box.children(".combo-drop");

		const {clickCallback:clickHandle,checkCallback:checkHandle} = this.config.treeConfig;

		const clickCallback = (node,$dom)=>{

			    const id = node[this.tree.config.idField];
			    const txt = node[this.tree.config.textField];
			    const curTreeBox = $dom.closest(".combo-drop");
				this.updateInpBox(curTreeBox,{id,txt});
				clickHandle && clickHandle(node);
		}

		const checkCallback = (node,$dom)=>{

			    const curTreeBox = $dom.closest(".combo-drop");
				this.updateInpBox(curTreeBox);
				checkHandle && checkHandle(node);
		}

			
		const treeConfig =Object.assign({},this.config.treeConfig,{clickCallback,checkCallback});
		
		this.tree = new Tree(treeBox,treeConfig);
	}

	handle(){

		const self = this ;
		
		this.box.on("click",".combo-inp",function(){

			const $this= $(this);
			const par = $this.parent();

			const is_active = par.hasClass("active");

			!is_active ? self.showDown(par) : self.hideUp(par);

		});
	}

	showDown(par){
		par.children(".combo-drop").show();
		requestAnimationFrame(function(){
           par.addClass("active");
        });

        this.hideUp($(".s-comboBox"));
	}

	hideUp(par){
		 par.removeClass("active");
		 requestAnimationFrame(function(){
           par.children(".combo-drop").show();
        });
	}
}



const a = new SComboTree($(".same"),{
	treeConfig:{
		checkbox:false,
		clickCallback:function(node){
			console.log("fasdfasd");
		}
	}
});


export {Unit,SCombobox,SModal,Calendar,Tree};