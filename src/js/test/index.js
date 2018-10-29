 const _CONSTROL = '/HQCReportBD/report/';
 const _CONSTROL_1 = '/HQCReportBD/bd/';
 const _CREATERID = 10 ;

const api = {
   getReportTrees:()=>{
        return Promise.resolve($.get(_CONSTROL+"getReportTrees")).then(res=>{
            return JSON.parse(res);
        });
   },
   addReport:(data)=>{
        return Promise.resolve($.post(_CONSTROL + "addReport",data));
   },
   addParlist:(data)=>{
        return Promise.resolve($.post(_CONSTROL + "addParlist",data));
   },
   getCataDrop:()=>{
        return Promise.resolve($.post(_CONSTROL + "getCataDrop"));
   },
   getOrgTree:()=>{
         return Promise.resolve($.post(_CONSTROL_1 + "getOrgTree")).then(res=>{
            return (new Function("return " + res))();
         });
   },
   getParList:()=>{

        return Promise.resolve($.get(_CONSTROL+"getParList"));
   },
   preview:(report_id)=>{
       
        return Promise.resolve($.get(_CONSTROL+"preview",{report_id}));
   },
   getResourceTree:()=>{

       return Promise.resolve($.get(_CONSTROL_1+"getResourceTree",{"orgName":""})).then(res=>{
            return (new Function("return " + res))();
        });
   }
  
};

const Unit = {

   loadMask:$(".loading"),
   loadCombobox: function ($el,_config) {

            const defaultConfig = {
                _width:200,
                icon:"fa-check-circle-o", 
                default_val:null,
                _arr:[],
                prompt_txt:null,
                callback:function(){

                }
            };

            const config = Object.assign({},defaultConfig,_config);
            const {_arr,icon,_width,default_val,callback,prompt_txt}  = config ;

            $el.combobox({
                valueField: "id",
                textField: "text",
                data: _arr,
                editable: false,
                width: _width,
                height: 30,
                prompt: prompt_txt,
                value: default_val,
                panelWidth: _width,
                panelHeight: 'auto',
                panelMaxHeight: 300,
                onLoadSuccess: function() {

                },
                formatter: function(row) {
                    return "<span class='fa " + icon + "'>&nbsp;</span><span>"+row.text+"</span>"
                },
                onChange: function(newVal) {

                     callback(newVal);
                }
            });
   },  
   getNowFormatDate:()=>{
        const date = new Date();
        const seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        const currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    chunk:function(arr,size){
        
        return Array.from({length:Math.ceil(arr.length / size)},(val,index)=>{
              
              return   arr.slice(index*size,index*size+size);
        });
    }
};



const Report = {
    0:function(){
        return CATALOGUEARR.map(val=>`<p class="catalogue">${val}</p>`);
    },
    1:function(){
        return ;
    },
    2:function(){
        

        return ;
    }
};



class ReportTab{
    static parList = null ;
    constructor(){

        this.$table1 = $("#table1");
        this.loadTab();
        this.handle();
    }

    loadTab(){

       return  api.getReportTrees().then(res=>{
            this.createTab(res);
            return res[res.length-1];
        })
    }

    createTab(data){

        ReportTab.parList = data.map(val=>{
            /**
             * report_id , report_name, target_time:
             */
            const {children,...item} = val;
            return item ;
        });

        let oreder = 0  ; 
        this.$table1.treegrid({
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
                        "formatter": function(a,b,c) {
                            
                            return  ++oreder ;
                        }
                    }, {
                        "field": "report_name",
                        "title": "报告名称",
                        "align": "left",
                        "width":  '19%' ,
                        "formatter": function(val, rowData) {



                            const is_par = rowData.hasOwnProperty("children");


                            const _data = {
                                "report_id": rowData.report_id,
                                "report_name": rowData.report_name,
                                "target_name": rowData.target_name

                            };

                            const data = JSON.stringify(_data);
                            const className = is_par && "fa-folder" || "fa-file-text ";
                         

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
                    },{
                        "field": "opretion",
                        "title": "操作",
                        "width":  '500px' ,
                        "align": 'left',
                        "formatter": function(val, rowData) {

                            const _data = {
                                "report_id": rowData.report_id,
                                "report_name": rowData.report_name,
                                "target_name": rowData.target_name,
                                "target_time": rowData.target_time,
                            };

                            const data = JSON.stringify(_data);

                            let roleBtnStr = "";
                            if (rowData.hasOwnProperty("children")) {


                            } else {
                                
                                roleBtnStr =   `<div echo-data=${data} class='optBtn'><button class="btn node-btn btn-primary" sign="pre">预 览</button></div>`;
                            }

                            return roleBtnStr;

                        }
                    }]
                ],
                onLoadSuccess: function() {
                    Unit.loadMask.hide();
                },
                onCollapse:function(df){
                }
            });
    }

    handle(){
        
        $("#table").on("click",".node-btn",function(){

            const $this= $(this);

           const $par = $this.parent();
           const data =JSON.parse($par.attr("echo-data"));
           const type = $this.attr("sign");

           switch(type){

                case "pre":{

                   api.preview(data.report_id).then(res=>{

                      $("#refereshBox").html(res); 
                      $("#previewRe").modal("toggle");

                    });
                   break;
                }
                default:
                break;
               
           }


        });

    }
}


const CATALOGUEARR=[
    "质控汇总意见",
    "表1 &nbsp;科室医疗质量与安全数据指标", 
    "表2 &nbsp;科室医疗质控季度检查得分表",
    "表3 &nbsp;科室运行病历质控",
    "表4 &nbsp;科室主要疾病与主要手术(全院)",
    "表5 &nbsp;科室主要诊断与主要手术(医保)",
    "表6 &nbsp;科室重点疾病与重点手术",
    "表7 &nbsp;科室不良事件",
    "表8 &nbsp;科室再次手术",
    "表9 &nbsp;全院优秀病历汇总及点评",
    "表10 &nbsp;全院临床路径指标汇总表",
    "表11 &nbsp;全院非计划再次手术汇总表",
    "表12 &nbsp;全院重返类指标汇总表",
    "表13 &nbsp;全院主要运营指标",
    "附件：不良事件报告表", 
];


class RefereshBox{
    static tabTypeArr=[
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

    async batchInsetReport(_arr){

        const arr = _arr.children;

         for(let i = 0 ,leg = arr.length;i<leg;i++){
            const item = arr[i];
            const obj = {
                id:item.id,
                orgId:item.target_id,
            };
            await  api.preReport(obj);
        }
     }

     preReport(obj){

        const {id:report_id,orgId} = obj;

        return api.preview(report_id).then(res=>{
                retthis.$refereshBox.html(res); 
                this.renderReport();
                return true;
        });
     }

    async renderReport(){

        const pageNode = this.$refereshBox.find(".page_node");
        const pageNodeArr = Array.from(pageNode);
        const tabs = this.tabSourse;



    }

  
}




class AddReportModal extends RefereshBox{
  static season = [
            {
                id: '1',
                text: '第一季度'
            }, {
                id: '2',
                text: '第二季度'
            }, {
                id: '3',
                text: '第三季度'
            }, {
                id: '4',
                text: '第四季度'
 }];

 static year = (function(){

     const cur_year = new Date().getFullYear();
        const year_start = cur_year - 5;
        
        return new Array(6).fill("").map((val,index)=>{
            const item = year_start + index;
            return {id:item,text:item+"年"};
        });
 })();

  constructor(config){
        super();
        this.config = config;
        this.sureBtn = $("#is_add");
        this.box= $("#setModal");
        this.$orgCombo= $("#sel_orgCombo");
        this.$catalog_inp= $("#catalog_name");
        this.$report_inp= $("#report_name");
        this.$setCatalog= $("#setCatalog");
        this.$reportYear= $("#report-year");
        this.$reportSeason= $("#report-season");
        this.$refereshBox= $("#refereshBox");
        this.$resourceCombo = $("#resourceCombo");
        this.$previewRe = $("#previewRe");

        this.tabSourse = null ;
        this.orgs = null ;
        this.init();
        this.handle();
  }

  init(){
     this.initModal();
     this.initModalContent();
  }

  initModal(){

    this.box.window({
            title: '设置界面',
            modal: true,
            shadow: true,
            closed: true,
            width: 580,
            height: 340,
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


  }

   initModalContent(){
    
    this.initOrg();
    this.initCataDrop(); 
    this.initReportSearson();
    this.initResourse();
  }

  initOrg(){
    api.getOrgTree().then(res=>{

            const $orgCombo = this.$orgCombo;

            $orgCombo.combotree({
                    data: res.data,
                    valueField: "id",
                    textField: "text",
                    multiple:true,
                    editable: false,
                    width: 280,
                    height: 30,
                    panelWidth: 180,
                    panelHeight: "auto",
                    panelMaxHeight: 300,
                    required: true,
                    missingMessage: "*必须!",
                    prompt: "选择要创建报告的科室",
                    onLoadSuccess: function(data) {},
                    formatter:function(row){
                        
                        const is_par = row.children.length > 0;

                        const className = is_par && "fa-folder" || "fa-h-square" ;

                        return "<span><b class='fa " + className + "'>&nbsp;</b>" + row.text + "</span>";
                    },
                    onSelect: function(node) {
                        const tree = $(this).tree;
                        const isLeaf = tree('isLeaf', node.target);
                        if (!isLeaf) {
                            $orgCombo.combotree('clear');
                            return;
                        }
                    }
                });

    });
  }

  initCataDrop(){
    api.getCataDrop().then(res=>{
        Unit.loadCombobox(this.$setCatalog,{
                _width:230,
                icon:"fa-bookmark", 
                _arr:res,
                default_val:res[1].id,
        });
    });
  }

  initResourse(){

    api.getResourceTree().then(res=>{

              res.data[0].children.forEach(function(val){
                  val.state="closed";
              });

              const typeObj={
                2:"fa-table",
                4:"fa-line-chart",
                0:"fa-folder",
                1:"fa-folder",
              }
                     
             this.$resourceCombo.combotree({
                    data:res.data,
                    valueField: "id",
                    textField: "text",
                    multiple:true,
                    editable: false,
                    width:380,
                    height: 30,
                    panelWidth: 380,
                    panelHeight: "auto",
                    panelMaxHeight: 300,
                    required: true,
                    missingMessage: "*必须!",
                    prompt: "确保所选的表格类型都只有一个！",
                    onLoadSuccess: function(data) {},
                    formatter:function(row){
                       
                        const is_par = row.data[0] < 2;
                        const tab = RefereshBox.tabTypeArr.find(val=>val.tabId==row.tab_name_file);

                        const typeTab= row.data[0] == 2 &&  "<span class='tab-type'>(*表"+tab.id+"）</span>" || "";

                        return "<b class='fa " + typeObj[row.data[0]] + "'>&nbsp;</b>" + row.text + typeTab;
                    }
                });
    });
  }

  initReportSearson(){
    
    const season = AddReportModal.season;
    const year = AddReportModal.year;
    Unit.loadCombobox(this.$reportYear, {
                                _arr:year,
                                 _width:120,
                                 default_val:year[year.length -1].id
                             });

    Unit.loadCombobox(this.$reportSeason, {
                                _arr:season,
                                 _width:120,
                                 default_val:season[0].id
                             });
  }
 


 async batchReport(res){

     Unit.loadMask.show();
     this.box.window("close");

    const orgs = this.orgs;


    const report_modal = this.$report_inp.val().trim();

    const commom_params = {
         report_type : "0",
         report_id : "",
         type_id : this.$setCatalog.combobox("getValue"), //报告目录样式
         creater_id : _CREATERID, 
         smodel_id : "", 
         smodel : "", 
         edate : "", 
         emodel : "", 
         emodel_id : "", 
         ahead : "", 
         sneedmessage : "0", 
         eneedmessage : "0", 
         issimple : "0", 
         role_name : "", 
         issimple : "0", 
         par_list_name : res.name, 
         target_time:res.time,
         sdate:Unit.getNowFormatDate(),
    };

    for(let i = 0 ,leg = orgs.length;i<leg;i++){
        const _chunkItem = orgs[i];
        const object = Object.assign({},commom_params,{
            target_id:_chunkItem.id,
            report_name:report_modal.replace("{{org}}",_chunkItem.text),
        });
         await  api.addReport(object);
    }

    const reportArr = await this.config.relaodTab();
    Unit.loadMask.hide();
    this.batchInsetReport(reportArr);
  
  }

  addCatalogue(){
        const {relaodTab} = this.config;
        const name = this.$catalog_inp.val().trim();
        const time =  this.$reportYear.combobox("getText") +  this.$reportSeason.combobox("getText");

        this.orgs = this.$orgCombo.combotree("tree").tree("getChecked").reduce((total,cur)=>{
            !cur.children.length && total.push({
                id:cur.id,
                text:cur.text,
            });
            return total;
        },[]);

        const is_repeat = new Set();

        this.tabSourse = this.$resourceCombo.combotree("tree").tree("getChecked").reduce((total,cur)=>{
            cur.data[0] > 1 && total.push(cur) && is_repeat.add(cur.tab_name_file);
            return total;
        },[]);

        if(!name || !time || !this.orgs.length ){
            alert("没填完");
            return ;
        };
        if(this.tabSourse.length !== is_repeat.size){

            alert("所选的表格类型有重复！");
            return ;
        };

        return ;
        api.addParlist({name,time}).then(res=>{

            if(res){

                api.getParList().then(list=>{

                    const {list:res} = list;
                    const last = res[res.length-1];
                    last.name === name &&  this.batchReport(last) || alert("报告选的不对！");

                });
            }else{

                alert("新增目录失败");
            
            }


        });

  }

  handle(){

        const _self = this;
        const Modal = this.box;
        this.sureBtn.click(function(){

            _self.addCatalogue();

        });

      $("#addSmark").click(function(){

          Modal.window("open");
          $("#ft").show();


      });

     



    }

}

class CreateReport{

}

class Page{

    constructor(){
       this.HookAjax();
       this.setPageH();
       this.init();
    }
    /**
     * [hookAjax 拦截所有ajax请求，要是session过期，跳回登录页]
     * @return {[type]} [description]
     */
    HookAjax(){
        hookAjax({
           
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
    }

    init(){
        this.tab = new ReportTab();
         new CreateReport();
         this.modal = new AddReportModal({
            relaodTab:()=>{
                return this.tab.loadTab();
            }
         });
    }
    setPageH(){
        const min_h = $('#mainframe', parent.document).height() -15;
        $("#body_main").css("min-height", min_h);
        $("#table").css("min-height", min_h - 120);
    }


}

new Page();