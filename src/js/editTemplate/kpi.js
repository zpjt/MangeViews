
//初始化页面类
class InitPage extends EasyUITab{
    dropMenuConfig=[
        {"icon":"fa-file-text",text:"创建视图",type:"view"},
        {"icon":"fa-folder",text:"创建分类",type:"catalogue"},
    ]

    constructor(){
        super();
        this.init();
    }
    
    init(){
        
        this.setPageHeight($ViewContainer,160);
        this.tabInit();
        this.tabCardInit([{layout_name:"我的创建",index:0,layout_id:-2}]);
        this.InitIconBox($iconBox);
        this.orgBoxInit();
        this.initUnit();
        
    }

    initUnit(){
        // 日历
        this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
            rotate:4,
            style:2
        });
        // 目录选择下拉框
        this.parCatalogSel = new SCombobox($("#parName"),{
            "textField":"layout_name",
            "idField":"layout_id",
            "prompt":"请选择所属分类...",
            "width":300,
        });

        this.modal = new SModal();


    }

    InitIconBox($el){
        API_szViews.getAllLayout_icon().then(res=>{

            const {par,child}=res;
            const par_strArr = par.map(val=>{
                const {name,id} = val ;
                return `
                        <span class="sicon ${name}" echo-data="${id}"></span> 

                        `
            });

            const child_strArr = child.map(val=>{
                const {name,id} = val ;
                return `
                        <span class="sicon ${name}" echo-data="${id}"></span> 
                        `
            });

            const str = `
                        <div class="iconBox-item">${child_strArr.join("")}</div>    
                        <div class="iconBox-item">${par_strArr.join("")}</div>  
                        `
            $el.html(str);
        });
    }

    tabConfig(idField){

        return {
            idField:idField,
            tabId:"#tabBox",
            frozenColumns: this.frozenColumns(idField),
            columns: [
                [{
                    field: 'layout_name',
                    title: '视图名称',
                    width: "24%",
                    formatter: function(val,rowData,index) {

                        const {layout_icon_name,layout_type} = rowData;
                        const arr = ["","node-catalogue","node-file"];
                        return `<div class="tab-node ${arr[+rowData.layout_type]}" echo-data="${index}"><i class="sicon ${layout_icon_name}">&nbsp;</i><span>${val}</span></div>` ;
                    }
                }, 
                {
                    field: 'layout_type',
                    title: '类型',
                    width: "10%",
                    formatter: function(val,rowData,index) {

                        return `<span class="${val===2 ? "tab-type" : null }">${val===1 ? "分类" :"视图"}</span>`;
                    }
                }, 
                {
                    field: 'create_user_name',
                    title: '创建人',
                    width: "14%",
                },
                
                 {
                    field: 'updata_time',
                    title: '更新时间',
                    width: "18%",
                },{
                    field: 'optBtn',
                    title: '操作',
                    align:"center",
                    width: "30%",
                    formatter: function(val, rowData,index) {
                        
                        let str="" ;
                        switch (rowData.layout_type){

                            case 1 ://目录
                                  str =`
                                        <div class="tab-opt s-btn s-Naira" node-sign="icon">
                                                <i class="sicon sicon-btn-3"></i>
                                                <span>图标</span> 
                                        </div>
                                        <div class="tab-opt s-btn s-Naira" node-sign="rename">
                                                <i class="sicon sicon-btn-4"></i>   
                                                <span>重命名</span>    
                                        </div>  
                                    `;

                                break;
                            case 2 ://文件
                                 str =`
                                        <div class="tab-opt s-btn s-Naira" node-sign="icon">
                                                <i class="sicon sicon-btn-3"></i>   
                                                <span>图标</span>
                                        </div>
                                        <div class="tab-opt s-btn s-Naira" node-sign="rename">
                                                <i class="sicon sicon-btn-4"></i>   
                                                <span>重命名</span>
                                        </div>
                                        <div class="tab-opt s-btn s-Naira" node-sign="pre">
                                                <i class="fa fa-eye"></i>
                                                <span>预览</span>     
                                        </div>
                                        <div class="tab-opt s-btn s-Naira" node-sign="issue">
                                                <i class="fa fa-paper-plane-o"></i> 
                                                <span>发布</span>
                                        </div>
                                        <div class="tab-opt s-btn s-Naira" node-sign="copy">
                                                <i class="sicon sicon-btn-1"></i>   
                                                <span>复制</span>
                                        </div>
                                        
                                        
                                    `;
                                break;
                        }

                        return `
                                <div class="tabBtnBox" echo-data='${index}' >
                                        ${str}
                                </div>
                            `;
                    }
                }]
            ],
        };
    }

    tabInit(menuIndexArr=[0],type="tab"){
        API_szViews.getAllLayout().then(res=>{
                
            const  allData = [res] ;

            $ViewContainer.data("tabData",allData);
            
            let tabData=JSON.stringify(allData);
                tabData=JSON.parse(tabData);

            menuIndexArr.map(function(val){
                tabData = tabData[val].sub
            });

            type==="tab"?this.loadTab(tabData):this.catalogueInit(tabData);

        })
    }

    catalogueInit(tabData){
        
        const str = tabData.map((val,index)=>{
            const {layout_icon_name,layout_name,layout_id,layout_type} = val ;
            const type = layout_type ===1 && "view-catalogue" || "view-file";

            let str = `
                    <div class="tab-opt rotate-btn rotate-icon" node-sign="icon" echo-text="图标"><span class="sicon sicon-btn-3"></span></div>
                    <div class="tab-opt rotate-btn rotate-rename" node-sign="rename" echo-text="重命名"><span class="sicon sicon-btn-4"></span></div>
                    `;
            const fileopt = `
                    <div class="tab-opt rotate-btn rotate-pre" node-sign="pre" echo-text="预览"><span class="fa fa-eye"></span></div>
                    <div class="tab-opt rotate-btn rotate-issue" node-sign="issue" echo-text="发布"><span class="fa fa-paper-plane-o "></span></div>
                    <div class="tab-op rotate-btn rotate-copy" node-sign="copy" echo-text="复制"><span class="sicon sicon-btn-1"></span></div>
                    `;

                str = layout_type !==1 &&  str + fileopt || str ;

            return `
                    <div class="catalogue-item " >
                        <div class="view-show ${type}" echo-data="${index}">
                            <p><i class="sicon ${layout_icon_name}"></i></p>
                            <p class="catalogue-name"><span>${layout_name}</span></p>
                        </div>
                        <div class="view-opt" echo-data="${index}">
                            ${str}
                        </div>
                    </div>
                  `
        });
        $catalogueBox.html(str);
        $catalogueBox.data("getData",tabData);
        this.cataFooterInit();
    }
    cataFooterInit(){
        const str = `
                <div class="footer-item">
                    <i class="fa fa-bookmark-o">&nbsp;</i>
                    <span>点击获取文件信息</span>
                    <br>
                    <i class="fa fa-bookmark-o">&nbsp;</i>
                    <span>双击进入目录</span>
                </div>
                `;
        $catalogueBox.siblings(".cata-footer").html(str);
    }
    cataFooterRender(data){

        const {layout_type,create_user_name,layout_name,updata_time,layout_icon_name} =data;
        
        var str = `
                    <div class="cata-info footer-item">
                        <span class="sicon ${layout_icon_name.trim()}"></span>
                        <span>
                           <span><b>文件名：</b>${layout_name}</span><br><span><b>包含对象：</b>${data.sub.length}个</span>
                          </span>
                    </div>
                    <div class="footer-item" style="width:25%">
                        <b>创建时间：</b>
                        <br />
                        <span style="padding-left:5em">${updata_time}</span>
                    </div>
                    <div class="footer-item" style="width:15%">
                        <b>创建人：</b>
                        <br />
                        <span style="padding-left:4em">${create_user_name}</span>
                    </div>
                    <div class="footer-item" style="width:15%">
                        <b>文件类型：</b>
                            <br />
                        <span style="padding-left:5em">${layout_type===1?"分类文件夹":"视图文件"}</span>
                    </div>
                    `
        $catalogueBox.siblings(".cata-footer").html(str);
    }

    loadTab(data){
        this.creatTab(data,$tab,this.tabConfig("layout_id"));
    }
    tabCardInit(menuArr){
        $tabCard.data("menuArr",menuArr);
        const leg = menuArr.length;
        const str = menuArr.map((val,ind)=>{
            const {layout_name,index}=val;
            const is_last = ind === leg-1;

            const icon_str = !is_last && `&nbsp;&nbsp;<i class="fa fa-angle-right fa-lg">&nbsp;&nbsp;</i>` || "";
            
            return `<div class="card" echo-data="${index}"><span>${layout_name}</span>${icon_str}</div>` ;
        })
        

        $tabCard.html(str.join(""));
    }

    changeTabcard($this){ // 进入目录

        const tabData = $tab.datagrid("getData").rows;


        const index = +$this.attr("echo-data");
        const childArr = tabData[index].sub;

        this.loadTab(childArr);
        const {layout_name,layout_id}=tabData[index];
        const lastData = $tabCard.data("menuArr");

        lastData.push({layout_name,index,layout_id});
        this.tabCardInit(lastData);

    }

    getCurTabData(menuArr,curIndex){
        
        let tabData = $ViewContainer.data("tabData");
        let i = 0;
        while(i<=curIndex){
            tabData=tabData[menuArr[i].index].sub;
            i++;
        }
        return tabData;
    }

    handleCard($this){//分类选项卡
        const menuArr = $tabCard.data("menuArr");
        const leg =menuArr.length;
        const index = $this.index();

        if(index=== leg-1){
            return ;
        }

        const tabData =this.getCurTabData(menuArr,index);
        

        const styleIndex = $(".style-sel").index();
        styleIndex ? this.catalogueInit(tabData) :this.loadTab(tabData);
        const newmenuArr=menuArr.slice(0,index+1);
        this.tabCardInit(newmenuArr);

    }
    changeStyle($this){
        if($this.hasClass("style-sel")){
            return ;
        }

        const  index = $this.index();

        page.modal.close($styleView.eq(1-index),"style-active");
        page.modal.show($styleView.eq(index),"style-active");

        $this.addClass("style-sel").siblings(".style-item").removeClass("style-sel");

        if(index){
            const tabData = $tab.datagrid("getData").rows;
            this.catalogueInit(tabData);
        }else{
            const tabData = $catalogueBox.data("getData");
            this.loadTab(tabData);
        }

    }

    addCatalogue(type,obj,style){
    
        API_szViews.checkName(obj)
        .then(res=>{
            return res ? API_szViews.addView(type,{user_id,...obj}) : "重名" ;
        })
        .then(res=>{

            if(res === "重名"){
                alert(res);
                return ;
            }

            if(res){ //true
                const menuIndexArr = $tabCard.data("menuArr").map(val=>{
                      return  val.index ;
                }) ;
                 this.tabInit(menuIndexArr,style);
                 page.modal.close($addMView);
            }else{
            }

        }).catch(error=>{

            console.log(error);
        })
    }

    dropMenuCallback=(state)=>{

            const lev = $tabCard.data("menuArr").length;
        
            let dropMenuConfig = this.dropMenuConfig.slice();
            if(lev===1){
                dropMenuConfig.splice(0,1);
            }else if(lev>3){
                dropMenuConfig.splice(1,1);
            }

            UnitOption.renderDropMenu($menuBox,!state?dropMenuConfig:[]);
    }

    orgBoxInit(){

        
        API_szViews.getLayoutUserTree().then(res=>{

            if(res){
                const str = this.renderOrgJson(res.sub,0);
                
                $org.html(str.join(""));
            }

        });

        $org.on("click",".slide-icon",function(){
            
            

            const parLi = $(this).closest(".org-li");
            const $parDiv = $(this).parent();

            $parDiv.hasClass("org-active") && $parDiv.removeClass("org-active") || $parDiv.addClass("org-active");

            const parMenu =parLi.children(".par-menu"); 
            parMenu.slideToggle();

        });

        $org.on("click",".org-inp",function(){

            const status =$(this).prop("checked");
            const type = $(this).hasClass("par-checkinp");
            const par_li = $(this).closest(".org-li");

            if(type){
                par_li.find(".has-chec").removeClass("has-chec");
                par_li.find(".org-inp").prop("checked",status);
            }

            let lev = par_li.attr("lev");
            if(lev!=="1"){
                
                let up_par_li = $(this).closest(".org-li");

                while (lev > 1 ){
                      up_par_li = up_par_li.parent().parent();
                      lev = +up_par_li.attr("lev");
                      const checkEl = up_par_li.children(".menuItem").find(".org-inp");
                      const ul_par =  up_par_li.children(".par-menu") ;
                      const ul_par_leg = ul_par.children().length;
                      const check_leg = ul_par.children().children(".menuItem").find(".org-inp:checked").length;

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
            
            

            const selArr = [].slice.call($(".child-checkinp:checked"));
            const strArr = selArr.map(val=>{
                    const name = val.getAttribute("echo-name");
                    const id = val.value ;

                    return  `<li echo-id="${id}" class="sel-item menuItem">
                                <i class="fa fa-user-circle-o">&nbsp;</i>
                                <b>${name}</b>
                             </li>`

            });
            $("#orgSel").html(strArr.join(""));

        });

    }

    renderOrgJson(arr,_lev){

        let lev = _lev ;
            lev ++ ;
        return arr.map((val,index)=>{
            
            const {type,id,name,sub,par_id} = val;

            let data = {id , name ,lev,par_id} ;

            if(type===0){
 
                let  childrenEl = this.renderOrgJson(sub,lev);

                return this.parentComponent(childrenEl,data);

            }else{

                const item = this.childComponent(data);
            
                return  item;                   
            
            }
        })
    }
    
    parentComponent(child,data){

        let {name,id,lev,par_id}= data;

        const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");

        return (`
            <li  lev="${lev}" class="org-li">
                <div class="menuItem par-item" echo-id="${id}">
                    ${indent}
                    <span class="s-checkbox">
                        <input type="checkbox" class="par-checkinp org-inp"  par="${par_id}" value="${id}" /><label class="fa fa-square-o" ></label>
                    </span>
                    <i class="fa fa-folder-open-o"></i>
                    <span>${name}</span><span class="slide-icon"><i class="fa fa-caret-down  "></i></span>
                </div>
                <ul class="par-menu">${child.join("")}</ul>
            </li>
        `);

    }

    childComponent(data){

        let {name,id,lev}= data;
        const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");
    
        return (`
            <li lev="${lev}" class="org-li">
                <div class="menuItem child-item" echo-id="${id}">
                ${indent}
                <span class="s-checkbox">
                        <input type="checkbox" class="child-checkinp org-inp" value="${id}" echo-name="${name}" /><label class="fa fa-square-o" ></label>
                </span>
                <i class="fa fa-user-circle-o">&nbsp;</i>
                ${name}
                </div>
            </li>
        `);     
    }
   
}


const page = new  InitPage();

$(window).on("click",function(){
          $(".active-menu").removeClass("active-menu");
          $(".icon-active").removeClass("icon-active");
          $(".dataTime").hide();
});

//切换选项卡
$tabCard.on("click",".card",function(){
    const $this = $(this);
    page.handleCard($this);

});

//  进入目录
$tabContainer.on("click",".node-catalogue",function(){
    const $this = $(this);
    page.changeTabcard($this);

});

// 进入模板编辑器
$tabContainer.on("click",".node-file",function(){
    const $this = $(this);

    const index = +$this.attr("echo-data");

    const style = $(".style-sel").index();
    const data = style ? $catalogueBox.data("getData")[index] :$tab.datagrid("getData").rows[index];


    $("#content",window.parent.document).addClass("no-head");
    $("#slide",window.parent.document).animate({"width":0},500,function(){
    //  window.location.href="editTemplate";
        window.location.href="./editTemplate.html";
                
    });
});



$catalogueBox.on("dblclick",".view-catalogue",function(){

    clearTimeout(timer);
    const $this = $(this);
    const tabData = $catalogueBox.data("getData");
    const index = +$this.attr("echo-data");
    const childArr = tabData[index].sub;
    page.catalogueInit(childArr);
    const {layout_name,layout_id}=tabData[index];
    const lastData = $tabCard.data("menuArr");

    lastData.push({layout_name,index,layout_id});
    page.tabCardInit(lastData);


});

let timer = null;
const rotateMenu = new RotateMenu();

$catalogueBox.on("click",".view-show",function(){
    const $this = $(this);
    clearTimeout(timer);
    timer = setTimeout(function(){

        const index =$this.attr("echo-data");
        $this.parent().addClass("catalogue-item-sel").siblings().removeClass("catalogue-item-sel");
        const node = $catalogueBox.data("getData")[index];
        page.cataFooterRender(node);
        const rangeAngle = node.layout_type===1 ? 60: 180 ;
        rotateMenu.setPath($this,rangeAngle);

    }, 200);

});

//切换显示风格
$("#styleBox").on("click",".style-item",function(){
    const $this = $(this);
    page.changeStyle($this);
});


// 下拉框显示
$("#menuBtn").click(function(e){
    const $this = $(this);
     e.stopPropagation();
    UnitOption.dropMenuHandle($this,page.dropMenuCallback);
});


// 创建类型选择
$menuBox.on("click",".menu-item",function(e){

    e.stopPropagation();
    const $this = $(this);

    const type =$this.attr("sign");
    $addMBtn.attr({"type":type,"method":"create"});
    $inpName.val(null);
        
    const curCatalogueArr = $tab.datagrid("getData").rows.reduce(function(total,curVal){
            // layout_type : 1 目录 ，0：文件
            const {layout_name,layout_id,layout_type} = curVal;
            layout_type === 1 && total.push({layout_name,layout_id});
             return total;
    },[]);
    
    const menuArr = $tabCard.data("menuArr");
    const curId = menuArr[menuArr.length-1].layout_id;
    curCatalogueArr.unshift({"layout_name":"当前分类","layout_id":curId});  
    
    page.parCatalogSel.loadData(curCatalogueArr);
    page.parCatalogSel.setValue(curId);
    page.modal.show($addMView);

});

//模态框确定按钮
$addMBtn.click(function(){

    const type = $(this).attr("type");
    const method = $(this).attr("method");
    const name = $inpName.val().trim();
    const par_id = method==="create" ? page.parCatalogSel.getValue() : $ViewContainer.attr("curid");
    const style = $(".style-sel").index() ? "catalogue":"tab";


    if(name){
        method==="create" ? page.addCatalogue(type,{name,par_id},style) : API_szViews.updataName({name,id:par_id}).then(res=>{

                if(res){
                        const menuIndexArr = $tabCard.data("menuArr").map(val=>{
                              return  val.index ;
                        }) ;
                         page.tabInit(menuIndexArr,style);
                         page.modal.close($addMView);
                }else{
                    alert("重名");
                }

            }).catch(res=>{

                console.log(res);
            })
    }

});

//删除
$("#delBtn").click(function(){
    
    const selArr = $.map($(".checkSingle:checked"),function(val){
        return val.value;
    });
    
    if(!selArr.length){
        return ;
    }
    const id = selArr.join(",");
    page.modal.show($confirmMView);
    $confirmBtn.attr("delArr",id);
    
});
// 删除模态框确认按钮
$confirmBtn.click(function(){

    UnitOption.renderTipM($svg_statusBox,"#g-load");
    const id = $(this).attr("delArr");
    $tipText.html("");
    API_szViews.updataRecycle({user_id,id}).then(res=>{
        $svg_statusBox.addClass("g-status");
        if(res){
            const menuIndexArr = $tabCard.data("menuArr").map(val=>{
                      return  val.index ;
            }) ;
            page.tabInit(menuIndexArr);
            UnitOption.renderTipM($svg_statusBox,"#g-success");
        }else{
            UnitOption.renderTipM($svg_statusBox,"#g-error");
        }

    });

})

//复选框事件
$tabContainer.on("click",".checkSingle",function(){
    page.checkSingleHandle($tabContainer);
});


//操作按钮
$ViewContainer.on("click",".tab-opt",function(e){
    const type = $(this).attr("node-sign");
    const index = $(this).parent().attr("echo-data");

    const style = $(".style-sel").index();
    const data = style ? $catalogueBox.data("getData")[index] :$tab.datagrid("getData").rows[index];

    const {layout_type,layout_id,layout_icon,layout_icon_name,layout_name} = data ;    
    const last_layoutId = +$ViewContainer.attr("curId");

    switch(type){

        case "pre":
            break;
        case "issue":
            
             

                API_szViews.showReleaseLayout(layout_id).then(res=>{
                                if(res){
                                    
                                    page.modal.show($issueMView);
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
                                                        page.calendar.setTime([starttime,endtime]);
                                                    }

                                                    break;
                                                case 1 ://用户
                                                    const status_2 =  user[0] == "-1" ;
                                                    val.checked= status_2 ;

                                                    if(status_2){
                                                        $(val).closest(".item-status").siblings(".org-box").removeClass("active");
                                                    }else{
                                                        $(val).closest(".item-status").siblings(".org-box").addClass("active");

                                                        $org.find(".org-inp").prop("checked",false).removeClass("has-chec");
                                                        user.map(val=>{

                                                            $org.find(`.child-checkinp[value=${val}]`).click();
                                                        })

                                                        
                                                    }
                                            
                                                    break;
                                                case 2 :
                                                    const status_3 =  release === 1 ;
                                                    val.checked= status_3 ;
                                                    break;
                                            }
                                      });
                                }
                });
            break;
        case "copy":
            break;
        case "rename":
            page.modal.show($addMView);
            $parName.parent().hide();
            $addMBtn.attr({"method":"modify"});
             $inpName.val(layout_name);
             $inpName.parent().addClass("inp-fill");
            break;
        case "icon":
            e.stopPropagation();
            const $parContainer = $iconBox.parent();
            const status = $parContainer.hasClass("icon-active");
            const $iconBoxItem = $(".iconBox-item");

            $iconBoxItem.css("display","none");
            $iconBoxItem.eq(2-layout_type).css("display","flex");
            $(".icon-sel").removeClass("icon-sel");
            $iconBox.find("."+layout_icon_name.trim()).addClass("icon-sel");

          !status || last_layoutId !== layout_id ? page.modal.show($parContainer,"icon-active") :page.modal.close($parContainer,"icon-active") ;
            break;
    }


    $ViewContainer.attr("curId",layout_id);

});


//选择icon
$iconBox.on("click",".sicon",function(){
    $(".icon-sel").removeClass("icon-sel");
    $(this).addClass("icon-sel");
});
//操作icon
$("#iconFooter").on("click","p",function(){

    const sign = $(this).attr("sign");
    const $parContainer = $iconBox.parent();

    switch(sign){
        case "sub":
            
            const id = $ViewContainer.attr("curId");
            const icon_id =$(".icon-sel").attr("echo-data");

            API_szViews.updataIcon({icon_id,id}).then(res=>{

                if(res){
                    page.modal.close($parContainer,"icon-active") ;
                    const menuIndexArr = $tabCard.data("menuArr").map(val=>{
                      return  val.index ;
                    }) ;

                    const style =$(".style-sel").index() ? "catalogue" :"tab";

                    page.tabInit(menuIndexArr,style);
                } 
            
                
            });

            break;
        case "close":
            page.modal.close($parContainer,"icon-active") ;
            break;
    }
});

$("#iconContainer").on("click",function(e){
    e.stopPropagation();
});

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
                    const timeValue =page.calendar.value;
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
        alert("请选择可见用户！");
        return ;
    }
    
    API_szViews.ReleaseLayout({id,user,starttime,endtime,release}).then(res=>{
        if(res){
            alert("成功！");
            const menuIndexArr = $tabCard.data("menuArr").map(val=>{
                      return  val.index ;
            }) ;
            page.tabInit(menuIndexArr);
            page.modal.close($issueMView);
        }else{
            alert("发布失败！");
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



 





















const kpiTree = {
    "data": [
        {
            "id": 100000000, 
            "text": "医院日常统计分析", 
            "par_id": -2, 
            "data": [
                0
            ], 
            "children": [
                {
                    "id": 101000000, 
                    "text": "医院运行基本监测指标", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 101010000, 
                            "text": "资源配置", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101010100, 
                                    "text": "床位配置", 
                                    "par_id": 101010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101010101, 
                                            "text": "实际开放床位", 
                                            "par_id": 101010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010102, 
                                            "text": "重症医学科床位数", 
                                            "par_id": 101010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010103, 
                                            "text": "急诊留观床位数", 
                                            "par_id": 101010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010105, 
                                            "text": "重症医学床位所占的比例(%)", 
                                            "par_id": 101010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101010200, 
                                    "text": "人员配置", 
                                    "par_id": 101010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101010201, 
                                            "text": "全院职工总数", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010202, 
                                            "text": "卫生技术人员数", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010203, 
                                            "text": "医师数", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010204, 
                                            "text": "护理人员数", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010205, 
                                            "text": "医技人员数", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010206, 
                                            "text": "护士占卫计人员比例(%)", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101010207, 
                                            "text": "卫生技术人员数所占比例(%)", 
                                            "par_id": 101010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101010300, 
                                    "text": "医院医用建筑面积", 
                                    "par_id": 101010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 101020000, 
                            "text": "工作负荷", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101020100, 
                                    "text": "门急诊工作量", 
                                    "par_id": 101020000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101020101, 
                                            "text": "院本部门诊人次", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020102, 
                                            "text": "急诊人次", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020103, 
                                            "text": "社康中心诊疗人次", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020104, 
                                            "text": "总诊疗人次", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020105, 
                                            "text": "体检人次", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020106, 
                                            "text": "社康占总诊疗人次比例(%)", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020107, 
                                            "text": "急诊占院本部门急诊比例(%)", 
                                            "par_id": 101020100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101020200, 
                                    "text": "出入院情况", 
                                    "par_id": 101020000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101020201, 
                                            "text": "入院人次", 
                                            "par_id": 101020200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020202, 
                                            "text": "出院人次", 
                                            "par_id": 101020200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020203, 
                                            "text": "患者自动出院例数", 
                                            "par_id": 101020200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020204, 
                                            "text": "出院患者实际占用总床日数", 
                                            "par_id": 101020200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101020300, 
                                    "text": "手术工作量", 
                                    "par_id": 101020000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101020301, 
                                            "text": "住院手术例数", 
                                            "par_id": 101020300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020302, 
                                            "text": "中央手术室", 
                                            "par_id": 101020300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020303, 
                                            "text": "介入室", 
                                            "par_id": 101020300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020304, 
                                            "text": "住院操作例数", 
                                            "par_id": 101020300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101020305, 
                                            "text": "门诊手术例数", 
                                            "par_id": 101020300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101030000, 
                            "text": "治疗质量", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101030100, 
                                    "text": "病理诊断符合情况", 
                                    "par_id": 101030000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101030101, 
                                            "text": "手术冰冻与石蜡诊断符合例数", 
                                            "par_id": 101030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030102, 
                                            "text": "手术冰冻与石蜡诊断符合率（%）", 
                                            "par_id": 101030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030103, 
                                            "text": "恶性肿瘤患者手术前诊断与术后病理诊断符合例数", 
                                            "par_id": 101030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030104, 
                                            "text": "恶性肿瘤患者手术前诊断与术后病理诊断符合率（%）", 
                                            "par_id": 101030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101030200, 
                                    "text": "患者死亡情况", 
                                    "par_id": 101030000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101030204, 
                                            "text": "急诊科死亡例数", 
                                            "par_id": 101030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030205, 
                                            "text": "新生儿患者住院死亡率（%）", 
                                            "par_id": 101030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030206, 
                                            "text": "新生儿患者住院例数", 
                                            "par_id": 101030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030207, 
                                            "text": "新生儿患者住院死亡例数", 
                                            "par_id": 101030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030208, 
                                            "text": "住院患者非手术死亡例数", 
                                            "par_id": 101030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101030300, 
                                    "text": "死亡原因", 
                                    "par_id": 101030000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101030301, 
                                            "text": "心源性猝死", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030302, 
                                            "text": "呼吸心跳骤停", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030303, 
                                            "text": "多发伤", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030304, 
                                            "text": "颅脑损伤", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030305, 
                                            "text": "脑出血", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030306, 
                                            "text": "呼吸衰竭", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030307, 
                                            "text": "肿瘤晚期", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030308, 
                                            "text": "中毒", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030309, 
                                            "text": "溺水", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030310, 
                                            "text": "咳血", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030311, 
                                            "text": "严重创伤", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030312, 
                                            "text": "电击伤", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030313, 
                                            "text": "主动脉夹层", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030314, 
                                            "text": "其他", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030315, 
                                            "text": "死亡合计", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030316, 
                                            "text": "感染性休克", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030317, 
                                            "text": "上消化道出血", 
                                            "par_id": 101030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101030400, 
                                    "text": "危重患者抢救情况", 
                                    "par_id": 101030000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101030401, 
                                            "text": "住院危重抢救人次", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030402, 
                                            "text": "住院危重抢救死亡例数", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030403, 
                                            "text": "住院危重抢救成功人次", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030404, 
                                            "text": "住院危重抢救成功率（%）", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030405, 
                                            "text": "急诊抢救人次", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030406, 
                                            "text": "急诊抢救死亡例数", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030407, 
                                            "text": "急诊抢救成功率（%）", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101030408, 
                                            "text": "急诊抢救成功例数", 
                                            "par_id": 101030400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101040000, 
                            "text": "工作效率", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101040100, 
                                    "text": "出院患者住院日和床位周转", 
                                    "par_id": 101040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101040101, 
                                            "text": "出院患者平均住院日", 
                                            "par_id": 101040100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101040102, 
                                            "text": "择期术前平均住院日", 
                                            "par_id": 101040100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101040103, 
                                            "text": "每床工作日", 
                                            "par_id": 101040100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101040104, 
                                            "text": "病床使用率（%）", 
                                            "par_id": 101040100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101040105, 
                                            "text": "床位周转次数", 
                                            "par_id": 101040100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101040200, 
                                    "text": "出院患者住院超30天情况", 
                                    "par_id": 101040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101040202, 
                                            "text": "住院超30天人次", 
                                            "par_id": 101040200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101040203, 
                                            "text": "住院超30天患者所占比例（%）", 
                                            "par_id": 101040200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101050000, 
                            "text": "医疗收入", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101050100, 
                                    "text": "医疗收入(万元)", 
                                    "par_id": 101050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 101050101, 
                                            "text": "门诊业务收入（总）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050102, 
                                            "text": "门诊业务检验费收入（总）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050103, 
                                            "text": "门诊业务耗材费收入（总）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050104, 
                                            "text": "门诊业务药品费收入（总）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050105, 
                                            "text": "门诊业务其他项收入（总）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050106, 
                                            "text": "住院业务收入", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050107, 
                                            "text": "住院业务检验收入", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050108, 
                                            "text": "住院业务耗材收入", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050109, 
                                            "text": "住院业务药品收入", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050110, 
                                            "text": "住院业务其他项收入", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050111, 
                                            "text": "门诊业务收入（院本部含体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050112, 
                                            "text": "门诊业务收入（社康）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050113, 
                                            "text": "门诊业务收入（体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050114, 
                                            "text": "门诊业务检验费收入（院本部含体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050115, 
                                            "text": "门诊业务检验费收入（社康）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050116, 
                                            "text": "门诊业务检验费收入（体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050117, 
                                            "text": "门诊业务耗材费收入（院本部含体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050118, 
                                            "text": "门诊业务耗材费收入（社康）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050119, 
                                            "text": "门诊业务耗材费收入（体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050120, 
                                            "text": "门诊业务药品费收入（院本部含体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050121, 
                                            "text": "门诊业务药品费收入（社康）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050122, 
                                            "text": "门诊业务药品费收入（体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050123, 
                                            "text": "门诊业务其他收入（院本部含体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050124, 
                                            "text": "门诊业务其他收入（社康）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101050125, 
                                            "text": "门诊业务其他收入（体检）", 
                                            "par_id": 101050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101060000, 
                            "text": "患者负担", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101060100, 
                                    "text": "患者负担统计", 
                                    "par_id": 101060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101060101, 
                                            "text": "住院平均费用—总收入（元）", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060102, 
                                            "text": "住院平均费用—其中药费（元）", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060103, 
                                            "text": "药品比例(住院：%)", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060104, 
                                            "text": "门诊平均费用(全院门诊)-总收入", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060105, 
                                            "text": "门诊平均费用(全院门诊)-其中药费", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060106, 
                                            "text": "药品比例(全院门诊：%)", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060107, 
                                            "text": "门诊平均费用(院本部门诊)-总收入", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060108, 
                                            "text": "门诊平均药费(院本部门诊)-其中药费", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060109, 
                                            "text": "药品比例(院本部门诊：%)", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060110, 
                                            "text": "门诊平均费用(社康)-总收入", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060111, 
                                            "text": "门诊平均药费(社康)-其中药费", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060112, 
                                            "text": "药品比例(社康：%)", 
                                            "par_id": 101060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 101060200, 
                                    "text": "医保数据分析", 
                                    "par_id": 101060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101060201, 
                                            "text": "医保收入(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060202, 
                                            "text": "门诊医保收入(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060203, 
                                            "text": "住院医保收入(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060204, 
                                            "text": "医保人次", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060205, 
                                            "text": "门诊医保人均费用(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060206, 
                                            "text": "住院医保人均费用(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060207, 
                                            "text": "门诊医保人均药费(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060208, 
                                            "text": "住院医保人均药费(元)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060209, 
                                            "text": "其他总收入(不含医保)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060210, 
                                            "text": "医保人次占全院总诊疗人次比例", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060213, 
                                            "text": "全院药占比（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060214, 
                                            "text": "医保药占比（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060215, 
                                            "text": "医保患者CT阳性率（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060216, 
                                            "text": "医保患者MRI检查阳性率（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060217, 
                                            "text": "医保门诊人次占全院门诊诊疗人次比例（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060218, 
                                            "text": "医保住院人次占全院住院人次比例（%）", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060219, 
                                            "text": "其他门诊收入(不含医保)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060220, 
                                            "text": "其他住院收入(不含医保)", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060221, 
                                            "text": "医保药费收入", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060222, 
                                            "text": "医保门诊药费收入", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101060223, 
                                            "text": "医保住院药费收入", 
                                            "par_id": 101060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101070000, 
                            "text": "资产运营", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101070100, 
                                    "text": "资产运营指标比较表", 
                                    "par_id": 101070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101070101, 
                                            "text": "流动比率（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070102, 
                                            "text": "速动比率（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070103, 
                                            "text": "医疗收入/百元固定资产（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070104, 
                                            "text": "业务支出/百元业务收入（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070105, 
                                            "text": "资产负债率（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070106, 
                                            "text": "固定资产总值", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070107, 
                                            "text": "药品收入/医疗收入比率（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070108, 
                                            "text": "医用材料收入/医疗收入比率（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101070109, 
                                            "text": "人员费用支出/百元业务收入（%）", 
                                            "par_id": 101070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101080000, 
                            "text": "科研成果", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101080100, 
                                    "text": "科研情况", 
                                    "par_id": 101080000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 101080101, 
                                            "text": "国内论文数ISSN", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080102, 
                                            "text": "国内论文数ISSN/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080103, 
                                            "text": "国内论文数及被引用数次（以中国科技核心期刊发布信息为准）/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080105, 
                                            "text": "SCI收录论文数/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080106, 
                                            "text": "主持国家重点科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080107, 
                                            "text": "主持国家一般科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080108, 
                                            "text": "承担与完成国家级科研课题数/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080109, 
                                            "text": "主持省级重点科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080110, 
                                            "text": "主持省级一般科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080111, 
                                            "text": "主持省卫生厅局级科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080112, 
                                            "text": "承担与完成省级科研课题数/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080113, 
                                            "text": "主持市级重点科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080114, 
                                            "text": "主持市级一般科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080115, 
                                            "text": "承担与完成市级科研课题数/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080116, 
                                            "text": "主持市级卫计委科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080117, 
                                            "text": "主持区级重点科研项目(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080118, 
                                            "text": "主持区级一般科研项目", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080119, 
                                            "text": "承担与完成区级科研课题数/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080120, 
                                            "text": "国家级科研基金额度", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080121, 
                                            "text": "省级科研基金额度", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080122, 
                                            "text": "厅局级科研基金额度", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080123, 
                                            "text": "市级科研基金额度", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080124, 
                                            "text": "区级科研基金额度", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080125, 
                                            "text": "获得国家级科研基金额度/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080126, 
                                            "text": "获得省级科研基金额度/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080127, 
                                            "text": "获得厅局级科研基金额度/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080128, 
                                            "text": "获得区级科研基金额度/每百张开放床位", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080129, 
                                            "text": "国家级奖项(项)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080130, 
                                            "text": "省级奖项(总计)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080131, 
                                            "text": "省级一等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080132, 
                                            "text": "省级二等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080133, 
                                            "text": "省级三等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080134, 
                                            "text": "市级奖项(总计)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080135, 
                                            "text": "市级一等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080136, 
                                            "text": "市级二等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080137, 
                                            "text": "市级三等奖", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080138, 
                                            "text": "住院医师规范化培训一级科目", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080139, 
                                            "text": "住院医师规范化培训人员人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080140, 
                                            "text": "外送住院医师规范化培训人员人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080141, 
                                            "text": "本院外出进修人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080142, 
                                            "text": "本院外出进修人数(国内)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080143, 
                                            "text": "本院外出进修人数(国外)", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080144, 
                                            "text": "本院外出参加学术会议人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080145, 
                                            "text": "在院学生(大四)人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080146, 
                                            "text": "实习生(本科)人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080147, 
                                            "text": "当年度在院研究生总人数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080148, 
                                            "text": "国家级临床重点专科数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080149, 
                                            "text": "省医学临床重点学(专)科数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080150, 
                                            "text": "市医学临床重点学(专)科数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080151, 
                                            "text": "市医学临床重点实验室数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080152, 
                                            "text": "区医学临床重点学(专)科数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080153, 
                                            "text": "区医学临床扶持学(专)科数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080154, 
                                            "text": "继续医学教育项目总数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080155, 
                                            "text": "国家级继续医学教育项目数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080156, 
                                            "text": "省级继续医学教育项目数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 101080157, 
                                            "text": "市级继续医学教育项目数", 
                                            "par_id": 101080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 101090100, 
                            "text": "15位疾病情况", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101090116, 
                                    "text": "15位疾病总例数", 
                                    "par_id": 101090100, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 101090216, 
                                    "text": "15位疾病平均住院天数", 
                                    "par_id": 101090100, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 101090316, 
                                    "text": "15位疾病平均住院费用", 
                                    "par_id": 101090100, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 101090200, 
                            "text": "15位手术谱情况", 
                            "par_id": 101000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 101090416, 
                                    "text": "15位手术总例数", 
                                    "par_id": 101090200, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 101090516, 
                                    "text": "15位手术平均住院天数", 
                                    "par_id": 101090200, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 101090616, 
                                    "text": "15位手术平均住院费用", 
                                    "par_id": 101090200, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 102000000, 
                    "text": "住院患者医疗质量与安全、合理用药等监测指标Ⅰ", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 102010000, 
                            "text": "出院情况", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102010100, 
                                    "text": "住院患者和手术死亡率（%）", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010101, 
                                            "text": "住院患者死亡率（%）", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010102, 
                                            "text": "住院患者死亡人数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010103, 
                                            "text": "住院手术患者死亡率（%）", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010104, 
                                            "text": "住院手术例数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010105, 
                                            "text": "住院手术死亡例数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010107, 
                                            "text": "中央手术室手术台次", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010108, 
                                            "text": "中央手术室手术术后死亡例数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010109, 
                                            "text": "中央手术室手术患者死亡率（%）", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010110, 
                                            "text": "介入室手术台次", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010111, 
                                            "text": "介入室手术术后死亡例数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010112, 
                                            "text": "介入室手术患者死亡率（%）", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010113, 
                                            "text": "恶性肿瘤择期手术出院人次", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010114, 
                                            "text": "恶性肿瘤择期手术死亡人数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010115, 
                                            "text": "恶性肿瘤择期手术死亡率（%）", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010116, 
                                            "text": "手术患者恶性肿瘤分类例数", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010117, 
                                            "text": "手术患者恶性肿瘤分类占比", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010118, 
                                            "text": "手术死亡疾病构成情况", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010119, 
                                            "text": "介入手术科室分布情况", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010120, 
                                            "text": "死亡占比前六位科室", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010121, 
                                            "text": "择期手术患者恶性肿瘤系统分类情况", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010122, 
                                            "text": "各系统恶性肿瘤择期手术出院患者情况", 
                                            "par_id": 102010100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010200, 
                                    "text": "介入手术分类情况", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010201, 
                                            "text": "综合介入手术", 
                                            "par_id": 102010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010202, 
                                            "text": "外周血管介入手术", 
                                            "par_id": 102010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010203, 
                                            "text": "神经血管介入手术", 
                                            "par_id": 102010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010204, 
                                            "text": "心血管介入手术", 
                                            "par_id": 102010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010205, 
                                            "text": "其他介入手术", 
                                            "par_id": 102010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010300, 
                                    "text": "围手术期死亡率（%）", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010301, 
                                            "text": "住院手术例数", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010302, 
                                            "text": "围手术期死亡人数", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010303, 
                                            "text": "围手术期死亡率（%）", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010304, 
                                            "text": "围手术期当天死亡人数(中央手术室)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010305, 
                                            "text": "围手术期术后1天死亡人数(中央手术室)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010306, 
                                            "text": "围手术期术后2天死亡人数(中央手术室)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010307, 
                                            "text": "围手术期术后死亡人数(中央手术室)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010308, 
                                            "text": "三四级手术比例(中央手术室)（%）", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010309, 
                                            "text": "围手术期当天死亡人数(DSA)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010310, 
                                            "text": "围手术期术后1天死亡人数(DSA)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010311, 
                                            "text": "围手术期术后2天死亡人数(DSA)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010312, 
                                            "text": "围手术期术后死亡人数(DSA)", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010313, 
                                            "text": "三四级手术比例(DSA)（%）", 
                                            "par_id": 102010300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010400, 
                                    "text": "择期手术患者恶性肿瘤系统分类情况", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010401, 
                                            "text": "胸部肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010402, 
                                            "text": "腹腔肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010403, 
                                            "text": "头颈部肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010404, 
                                            "text": "淋巴造血系统肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010405, 
                                            "text": "妇科肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010406, 
                                            "text": "其他肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010407, 
                                            "text": "泌尿生殖系统肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010408, 
                                            "text": "皮肤、软组织及骨肿瘤", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010409, 
                                            "text": "肿瘤伴随症状", 
                                            "par_id": 102010400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010500, 
                                    "text": "术后死亡手术级别", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010501, 
                                            "text": "术后死亡手术1级例数", 
                                            "par_id": 102010500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010502, 
                                            "text": "术后死亡手术2级例数", 
                                            "par_id": 102010500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010503, 
                                            "text": "术后死亡手术3级例数", 
                                            "par_id": 102010500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010504, 
                                            "text": "术后死亡手术4级例数", 
                                            "par_id": 102010500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010600, 
                                    "text": "恶性肿瘤择期手术患者死亡构成比", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010601, 
                                            "text": "妇科肿瘤", 
                                            "par_id": 102010600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010602, 
                                            "text": "消化道肿瘤", 
                                            "par_id": 102010600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010603, 
                                            "text": "胸部肿瘤", 
                                            "par_id": 102010600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102010700, 
                                    "text": "重返率（%）", 
                                    "par_id": 102010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102010701, 
                                            "text": "当日重返率（%）", 
                                            "par_id": 102010700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102010702, 
                                            "text": "2-31日重返率（%）", 
                                            "par_id": 102010700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 102020000, 
                            "text": "住院重点疾病", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102020100, 
                                    "text": "住院重点疾病总例数", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020200, 
                                    "text": "住院重点疾病死亡例数", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020300, 
                                    "text": "住院重点疾病死亡率（%）", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020400, 
                                    "text": "住院重点疾病当天再住院人次", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020500, 
                                    "text": "住院重点疾病2-31天再住院人次", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020600, 
                                    "text": "住院重点疾病当天再住院率（%）", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102020700, 
                                    "text": "住院重点疾病2-31天再住院率（%）", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102021000, 
                                    "text": "住院重点疾病平均住院日", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102021100, 
                                    "text": "住院重点疾病平均住院费用", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102021200, 
                                    "text": "住院重点疾病平均住院药费", 
                                    "par_id": 102020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 102030000, 
                            "text": "住院重点手术", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102030100, 
                                    "text": "住院重点手术总例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030200, 
                                    "text": "住院重点手术死亡例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030300, 
                                    "text": "住院重点手术死亡率（%）", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030400, 
                                    "text": "住院重点手术当日再住院例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030500, 
                                    "text": "住院重点手术当日住院重返率（%）", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030600, 
                                    "text": "住院重点手术2-31日内再住院例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030700, 
                                    "text": "住院重点手术2-31日内住院重返率（%）", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030800, 
                                    "text": "住院重点手术15日内非预期再手术例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102030900, 
                                    "text": "住院重点手术15日内术后非预期重返率（%）", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102031000, 
                                    "text": "住院重点手术31日内术后非预期再手术例数", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102031100, 
                                    "text": "住院重点手术31日内术后非预期重返率（%）", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 200000000, 
                                    "text": "平均住院日", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 200000001, 
                                    "text": "平均住院费用(元/人次)", 
                                    "par_id": 102030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 102040000, 
                            "text": "住院手术非预期重返", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102040100, 
                                    "text": "非计划重返手术例数", 
                                    "par_id": 102040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102040200, 
                                    "text": "非计划重返手术例数重返率（%）", 
                                    "par_id": 102040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102040300, 
                                    "text": "同一期住院期间发生非计划再次手术量", 
                                    "par_id": 102040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102040400, 
                                    "text": "同一期住院非计划再次手术发生率（5）", 
                                    "par_id": 102040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 200000200, 
                                    "text": "非计划再次手术直接原因", 
                                    "par_id": 102040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 200000201, 
                                            "text": "复发", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000202, 
                                            "text": "术后出血", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000203, 
                                            "text": "植入物问题", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000204, 
                                            "text": "切口愈合不良", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000205, 
                                            "text": "再损伤", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000206, 
                                            "text": "术后感染", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000207, 
                                            "text": "手术效果差", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000208, 
                                            "text": "临近器官损伤", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000209, 
                                            "text": "术后漏", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000210, 
                                            "text": "术后水肿", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000211, 
                                            "text": "术后梗阻", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000212, 
                                            "text": "其他原因", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000300, 
                                            "text": "止血技术缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000301, 
                                            "text": "缝合技术缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000302, 
                                            "text": "清创不彻底", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000303, 
                                            "text": "手术定位错误", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000304, 
                                            "text": "解剖层次辨识缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000305, 
                                            "text": "吻合技术缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000306, 
                                            "text": "病灶处理缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000307, 
                                            "text": "粗暴操作损伤过大", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000308, 
                                            "text": "手术时间超标准过长", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000309, 
                                            "text": "内植物放置缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000310, 
                                            "text": "遗漏病变", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000311, 
                                            "text": "术前的异物残留", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000312, 
                                            "text": "器械材料遗留体内", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000313, 
                                            "text": "管路固定不牢靠", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000314, 
                                            "text": "引流管位置不当", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000315, 
                                            "text": "手术结束前冲洗切口不彻底", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000316, 
                                            "text": "介入技术缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000317, 
                                            "text": "内镜操作技术缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000318, 
                                            "text": "术前准备缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000319, 
                                            "text": "术前病情估计不足", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000320, 
                                            "text": "术前安全核查不到位", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000321, 
                                            "text": "术前、中、后无菌操作不严格", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000322, 
                                            "text": "术后操作不当导致管路脱出", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000323, 
                                            "text": "医护告知不到位", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000324, 
                                            "text": "预防性抗菌素使用缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000325, 
                                            "text": "治疗性抗菌素使用缺陷", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000326, 
                                            "text": "术前术后脱水或止血药物使用不当", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000327, 
                                            "text": "围手术期抗凝药物不当", 
                                            "par_id": 200000200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 200000213, 
                                    "text": "非计划再次手术原因性质构成", 
                                    "par_id": 102040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 200000214, 
                                            "text": "医源性因素为主", 
                                            "par_id": 200000213, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000215, 
                                            "text": "非医源性因素为主", 
                                            "par_id": 200000213, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 200000216, 
                                            "text": "医源性与非医源性因素共同存在", 
                                            "par_id": 200000213, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 102050000, 
                            "text": "麻醉质量检测指标", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102050100, 
                                    "text": "麻醉总例数", 
                                    "par_id": 102050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050101, 
                                            "text": "全身麻醉例数", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050102, 
                                            "text": "椎管内麻醉", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050103, 
                                            "text": "体外循环例数", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050104, 
                                            "text": "脊髓麻醉例数", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050105, 
                                            "text": "其他类麻醉例数", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050106, 
                                            "text": "无痛人流", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050107, 
                                            "text": "无痛胃肠镜", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050108, 
                                            "text": "DSA室", 
                                            "par_id": 102050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102050200, 
                                    "text": "由麻醉医师实施镇痛治疗例数", 
                                    "par_id": 102050000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050201, 
                                            "text": "门诊患者例数", 
                                            "par_id": 102050200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050202, 
                                            "text": "住院患者例数", 
                                            "par_id": 102050200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050203, 
                                            "text": "手术后镇痛例数", 
                                            "par_id": 102050200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102050300, 
                                    "text": "由麻醉医师实施心肺复苏治疗例数", 
                                    "par_id": 102050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050301, 
                                            "text": "复苏成功例数", 
                                            "par_id": 102050300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102050400, 
                                    "text": "麻醉复苏（Steward 苏醒评分）管理", 
                                    "par_id": 102050000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050401, 
                                            "text": "进入麻醉复苏室例数", 
                                            "par_id": 102050400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050402, 
                                            "text": "离室时 Steward 评分≥4 分例数", 
                                            "par_id": 102050400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050403, 
                                            "text": "离室时 Steward 评分≥4 分比率", 
                                            "par_id": 102050400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102050500, 
                                    "text": "麻醉非预期的相关事件例数", 
                                    "par_id": 102050000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050501, 
                                            "text": "麻醉中发生未预期的意识障碍例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050502, 
                                            "text": "麻醉中出现氧饱和度重度降低例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050503, 
                                            "text": "全身麻醉结束时使用催醒药物例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050504, 
                                            "text": "麻醉中因误咽误吸引发呼吸道梗阻例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050505, 
                                            "text": "麻醉意外死亡例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050506, 
                                            "text": "其他非预期的相关事件例数", 
                                            "par_id": 102050500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102050600, 
                                    "text": "麻醉分级（ＡＳＡ病情分级）管理例数", 
                                    "par_id": 102050000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102050601, 
                                            "text": "ASA-Ⅰ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050602, 
                                            "text": "ASA-Ⅰ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050603, 
                                            "text": "ASA-Ⅰ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050604, 
                                            "text": "ASA-Ⅱ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050605, 
                                            "text": "ASA-Ⅱ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050606, 
                                            "text": "ASA-Ⅱ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050607, 
                                            "text": "ASA-Ⅲ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050608, 
                                            "text": "ASA-Ⅲ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050609, 
                                            "text": "ASA-Ⅲ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050610, 
                                            "text": "ASA-Ⅳ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050611, 
                                            "text": "ASA-Ⅳ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050612, 
                                            "text": "ASA-Ⅳ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050613, 
                                            "text": "ASA-Ⅴ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050614, 
                                            "text": "ASA-Ⅴ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050615, 
                                            "text": "ASA-Ⅴ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050616, 
                                            "text": "ASA-Ⅵ级例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050617, 
                                            "text": "ASA-Ⅵ级术后死亡例数", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102050618, 
                                            "text": "ASA-Ⅵ级术后死亡率（%）", 
                                            "par_id": 102050600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 102060000, 
                            "text": "手术并发症与患者安全指标", 
                            "par_id": 102000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102060100, 
                                    "text": "患者院内压疮情况", 
                                    "par_id": 102060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102060101, 
                                            "text": "发生一级压疮人次", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060102, 
                                            "text": "一级压疮发生率（%）", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060103, 
                                            "text": "发生二级压疮人次", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060104, 
                                            "text": "二级压疮发生率（%）", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060105, 
                                            "text": "发生三级压疮人次", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060106, 
                                            "text": "三级压疮发生率（%）", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060107, 
                                            "text": "发生四级压疮人次", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060108, 
                                            "text": "四级压疮发生率（%）", 
                                            "par_id": 102060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102060200, 
                                    "text": "患者安全2、跌倒/坠床发生率及伤害严重程度", 
                                    "par_id": 102060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102060201, 
                                            "text": "跌倒造成伤害事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060202, 
                                            "text": "跌倒伤害严重度1级比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060203, 
                                            "text": "有记录的跌倒伤害严重度1级事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060204, 
                                            "text": "跌倒伤害严重度2级比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060205, 
                                            "text": "有记录的跌倒伤害严重度2级事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060206, 
                                            "text": "跌倒伤害严重度3级比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060207, 
                                            "text": "有记录的跌倒伤害严重度3级事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060208, 
                                            "text": "跌倒总数合计", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060209, 
                                            "text": "因患者健康状况而造成跌倒比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060210, 
                                            "text": "因患者健康状况而造成跌倒事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060211, 
                                            "text": "因治疗、药物和（或）麻醉反应而造成跌倒比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060212, 
                                            "text": "因治疗、药物和（或）麻醉反应而造成跌倒事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060213, 
                                            "text": "因环境中危险因子而造成跌倒比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060214, 
                                            "text": "因环境中危险因子而造成跌倒事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060215, 
                                            "text": "因其他因素而造成跌倒比率（%）", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060216, 
                                            "text": "因其他因素而造成跌倒事件数", 
                                            "par_id": 102060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102060300, 
                                    "text": "择期手术并发症", 
                                    "par_id": 102060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102060301, 
                                            "text": "择期手术患者出院人次", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060302, 
                                            "text": "择期手术术后并发症人次", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060303, 
                                            "text": "并发症发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060305, 
                                            "text": "发生肺部感染人次", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060306, 
                                            "text": "择期手术术后肺部感染发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060308, 
                                            "text": "发生肺栓塞人次", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060309, 
                                            "text": "择期手术术后肺栓塞发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060310, 
                                            "text": "择期手术术后伤口裂开发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060311, 
                                            "text": "择期手术术后血肿发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060312, 
                                            "text": "择期手术术后肺栓塞发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060313, 
                                            "text": "择期手术深静脉血栓发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060314, 
                                            "text": "择期手术术后败血症发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102060315, 
                                            "text": "择期手术术后肺部感染发生率（%）", 
                                            "par_id": 102060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 102000001, 
                    "text": "住院患者安全Ⅱ", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 102070000, 
                            "text": "特定单病种质量指标", 
                            "par_id": 102000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102070100, 
                                    "text": "（一）急性心肌梗死", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070101, 
                                            "text": "ＡＭＩ-1 到达医院即刻内使用阿司匹林和氯吡格雷", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070102, 
                                            "text": "ＡＭＩ-2 实施左心室功能评价", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070103, 
                                            "text": "ＡＭＩ-3 .1到院30分钟内实施溶栓治疗(发病≤12h符合适应症)", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070104, 
                                            "text": "ＡＭＩ-3．2 到院90分钟内实施ＰＣＩ治疗(发病≤24h符合适应症)", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070105, 
                                            "text": "ＡＭＩ-4 到达医院后即刻使用β受体阻滞剂", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070106, 
                                            "text": "ＡＭＩ-5 住院用药情况", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070107, 
                                            "text": "ＡＭＩ-6 出院后继续用药", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070108, 
                                            "text": "ＡＭＩ-7 出院时继续使用他汀药物", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070109, 
                                            "text": "ＡＭＩ-8 住院期间为患者提供健康教育", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070110, 
                                            "text": "ＡＭＩ-10 存活出院", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070111, 
                                            "text": "10项合计达标率（%）", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070112, 
                                            "text": "AMI平均住院日", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070113, 
                                            "text": "AMI平均住院费用", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070114, 
                                            "text": "AMI平均住院药费", 
                                            "par_id": 102070100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070200, 
                                    "text": "（二）心力衰竭", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070201, 
                                            "text": "ＨＦ-1 实施左心室功能评价", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070202, 
                                            "text": "ＨＦ-2 到达医院后使用利尿剂及甲剂", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070203, 
                                            "text": "ＨＦ-3 到达医院后使用ACEI/ARB", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070204, 
                                            "text": "ＨＦ-4 到达医院后使用β受体阻滞戒烟、戒酒、限盐、适量饮食、控制液体等宣教指导有记录", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070205, 
                                            "text": "ＨＦ-5 到达医院后使用醛固酮拮抗剂使用", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070206, 
                                            "text": "ＨＦ-6 住院期间用药", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070207, 
                                            "text": "ＨＦ-7 出院时继续用药", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070208, 
                                            "text": "ＨＦ-9 存活出院", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070209, 
                                            "text": "ＨＦ-10 住院期间为患者提供健康教育", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070210, 
                                            "text": "9项合计达标率（%）", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070211, 
                                            "text": "HF平均住院日", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070212, 
                                            "text": "HF平均住院费用", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070213, 
                                            "text": "HF平均住院药费", 
                                            "par_id": 102070200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070300, 
                                    "text": "（三）社区获得性肺炎ＣＡＰ--住院、成人", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070301, 
                                            "text": "ＣＡＰ-1 符合重症肺炎住院治疗标准，实施病情严重程度评估", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070302, 
                                            "text": "ＣＡＰ-2 氧气评估(重症)", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070303, 
                                            "text": "ＣＡＰ-3 病原学诊断(重症)", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070304, 
                                            "text": "ＣＡＰ-4 入院4小时内接受抗菌药物治疗", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070305, 
                                            "text": "ＣＡＰ-5 .1重症患者起始抗菌药物选择(重症肺炎)", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070306, 
                                            "text": "ＣＡＰ-5.2非重症患者起始抗菌药物选择", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070307, 
                                            "text": "ＣＡＰ-6 初始治疗72小时评价无效重复病原学检查", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070308, 
                                            "text": "ＣＡＰ-8 住院期间为患者提供健康教育", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070309, 
                                            "text": "ＣＡＰ-9 符合出院标准及时出院", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070310, 
                                            "text": "ＣＡＰ-10 存活出院", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070311, 
                                            "text": "10项合计达标率（%）", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070312, 
                                            "text": "CAP平均住院日", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070313, 
                                            "text": "CAP平均住院费用", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070314, 
                                            "text": "CAP平均住院药费", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070315, 
                                            "text": "CAP抗菌药物使用天数", 
                                            "par_id": 102070300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070400, 
                                    "text": "（四）髋关节置换术", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070501, 
                                            "text": "Ｈip-1 实施手术前功能评估", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070502, 
                                            "text": "Ｈip-2.1 预防性抗菌药物选择符合规范", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070503, 
                                            "text": "Ｈip-2.2 手术时间超过0.5-2小时使用预防性抗菌药物", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070504, 
                                            "text": "Ｈip-2.3 手术时间超过3小时追加抗菌药物", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070505, 
                                            "text": "Ｈip-2.4 预防性抗菌药物72小时内停用", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070506, 
                                            "text": "Ｈip-3.1 有预防深静脉血栓医嘱", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070507, 
                                            "text": "Ｈip-3.2 术前于术后实施预防深静脉血栓", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070508, 
                                            "text": "Ｈip-4 手术输血单侧≤400ml+双侧≤800ml", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070509, 
                                            "text": "Ｈip-5手术后康复治疗", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070510, 
                                            "text": "Ｈip-7手术后未出现并发症", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070511, 
                                            "text": "Ｈip-8为患者提供：髋与膝关节置换术的健康教育", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070512, 
                                            "text": "Ｈip-9手术切口Ⅰ甲", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070513, 
                                            "text": "Ｈip-11 住院30天内出院", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070514, 
                                            "text": "Ｈip-12 无死亡试用", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070515, 
                                            "text": "14项合计达标率（%）", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070516, 
                                            "text": "HIP平均住院日", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070517, 
                                            "text": "HIP平均住院费用", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070518, 
                                            "text": "HIP平均住院药费", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070519, 
                                            "text": "HIP平均人工关节费用", 
                                            "par_id": 102070400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070500, 
                                    "text": "（五）膝关节置换术", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070401, 
                                            "text": "Knee-1 实施手术前功能评估", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070402, 
                                            "text": "Knee-2.1 预防性抗菌药物选择符合规范", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070403, 
                                            "text": "Knee-2.2 手术时间超过0.5-2小时使用预防性抗菌药物", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070404, 
                                            "text": "Knee-2.3 手术时间超过3小时追加抗菌药物", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070405, 
                                            "text": "Knee-2.4 预防性抗菌药物72小时内停用", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070406, 
                                            "text": "Knee-3.1 有预防深静脉血栓医嘱", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070407, 
                                            "text": "Knee-3.2 术前于术后实施预防深静脉血栓", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070408, 
                                            "text": "Knee-4 手术输血单侧≤400ml+双侧≤800ml", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070409, 
                                            "text": "Knee-5手术后康复治疗", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070410, 
                                            "text": "Knee-7手术后未出现并发症", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070411, 
                                            "text": "Knee-8为患者提供：髋与膝关节置换术的健康教育", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070412, 
                                            "text": "Knee-9手术切口Ⅰ甲", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070413, 
                                            "text": "Knee-11 住院30天内出院", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070414, 
                                            "text": "Knee-12 无死亡试用", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070415, 
                                            "text": "14项合计达标率（%）", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070416, 
                                            "text": "KNEE平均住院日", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070417, 
                                            "text": "KNEE平均住院费用", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070418, 
                                            "text": "KNEE平均住院药费", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070419, 
                                            "text": "KNEE平均人工关节费用", 
                                            "par_id": 102070500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070600, 
                                    "text": "（六）脑梗死ＳＴＫ", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070601, 
                                            "text": "ＳＴＫ-1 急诊评估", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070602, 
                                            "text": "ＳＴＫ-2 组织纤溶酶激活剂(t-PA)评估应用(出现症状到ED时间≤4.5小时)", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070603, 
                                            "text": "ＳＴＫ-3 房颤患者的抗凝治疗", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070604, 
                                            "text": "ＳＴＫ-4 入院48小时内阿司匹林或氯吡格雷治疗", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070605, 
                                            "text": "ＳＴＫ-5.1 血脂水平评估", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070606, 
                                            "text": "ＳＴＫ-6 吞咽困难评价", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070607, 
                                            "text": "ＳＴＫ-7 预防深静脉血栓(DVT)", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070608, 
                                            "text": "ＳＴＫ-8a 出院时使用阿司匹林或氯吡格雷", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070609, 
                                            "text": "ＳＴＫ-9 卒中健康教育和早期康复评价、重点护理评估", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070610, 
                                            "text": "ＳＴＫ-10 住院Ⅰ周内接受血管功能评价(Ⅱ级)", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070611, 
                                            "text": "ＳＴＫ-11 存活出院", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070612, 
                                            "text": "11项合计达标率（%）", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070613, 
                                            "text": "STK平均住院日", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070614, 
                                            "text": "STK平均住院费用", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070615, 
                                            "text": "STK平均住院药费", 
                                            "par_id": 102070600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070700, 
                                    "text": "（七）社区获得性肺炎--住院、儿童", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070701, 
                                            "text": "Cap2-1住院时病情严重程度评估", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070702, 
                                            "text": "Cap2-2入院首次氧合评估(重症+ICU)", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070703, 
                                            "text": "Cap2-3重症肺炎住院后采集首剂抗菌药物治疗前标本", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070704, 
                                            "text": "Cap2-4抗菌药物使用时机", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070705, 
                                            "text": "Cap2-5.1重症起始抗菌药物选择符合规范", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070706, 
                                            "text": "Cap2-5.2非重症起始抗菌药物选择符合规范", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070707, 
                                            "text": "Cap2-6住院72小时病情严重程度再评估", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070708, 
                                            "text": "Cap2-8符合出院标准及时出院", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070709, 
                                            "text": "Cap2-9存活出院(不含死亡与自动出院）", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070710, 
                                            "text": "9项合计（达标率%)", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070711, 
                                            "text": "CAP2平均住院日", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070712, 
                                            "text": "CAP2平均住院费用", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070713, 
                                            "text": "CAP2平均住院药费", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070714, 
                                            "text": "CAP2抗菌药物（注射）疗程", 
                                            "par_id": 102070700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070800, 
                                    "text": "（八）围术期预防感染（ＰＩＰ）", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070801, 
                                            "text": "ＰＩＰ-1 手术前预防性抗菌药物选用符合规范要求", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070802, 
                                            "text": "ＰＩＰ-2 预防性抗菌药物在手术前0.5-2小时内开始使用", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070803, 
                                            "text": "ＰＩＰ-3 手术时间超过3小时或失血量大于1500ml，术中给予第二剂", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070804, 
                                            "text": "ＰＩＰ-4 择期手术在结束后72小时内停止预防性抗生素使用", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070805, 
                                            "text": "ＰＩＰ-5.1手术野皮肤准备符合规范要求", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070806, 
                                            "text": "ＰＩＰ-5.2手术切口甲级愈合", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070807, 
                                            "text": "ＰＩＰ-6无死亡出院", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070808, 
                                            "text": "7项合计达标率（%）", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070809, 
                                            "text": "PIP平均住院日", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070810, 
                                            "text": "PIP平均住院费用", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070811, 
                                            "text": "PIP平均住院药费", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070812, 
                                            "text": "PIP平均手术费用", 
                                            "par_id": 102070800, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102070900, 
                                    "text": "（九）剖宫产术（CS）", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102070901, 
                                            "text": "CS-1剖宫产术前风险评估", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070902, 
                                            "text": "CS-2剖宫产符合医学指征", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070903, 
                                            "text": "CS-3.1预防性抗菌药物选择符合规范", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070904, 
                                            "text": "CS-3.2胎儿娩出后用药", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070905, 
                                            "text": "CS-3.3手术时间超过3小时追加用药", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070906, 
                                            "text": "CS-3.4术后24小时内停用药物", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070907, 
                                            "text": "CS-4新生儿Apgar评分", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070908, 
                                            "text": "CS-5出血量评估", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070909, 
                                            "text": "CS-6剖宫产无并发症与再次手术", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070910, 
                                            "text": "CS-7剖宫产无并发症的新生儿并发症", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070911, 
                                            "text": "CS-8提供母乳喂养教育", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070912, 
                                            "text": "CS-9提供产后康复健康教育", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070913, 
                                            "text": "CS-10切口Ⅱ甲愈合", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070914, 
                                            "text": "CS-12医嘱离院", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070915, 
                                            "text": "14项合计达标率（%）", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070916, 
                                            "text": "CS平均住院日", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070917, 
                                            "text": "CS平均住院费用", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070918, 
                                            "text": "CS平均住院药费", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102070919, 
                                            "text": "CS平均手术费用", 
                                            "par_id": 102070900, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102071000, 
                                    "text": "（十）慢性阻塞性肺疾病（急性加重期住院）", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102071001, 
                                            "text": "COPD-1病情严重程度评估与分级", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071002, 
                                            "text": "COPD-2收住院/或ICU符合指征", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071003, 
                                            "text": "COPD-3氧疗方法应用适当", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071004, 
                                            "text": "COPD-4抗菌药物选择与应用适当", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071005, 
                                            "text": "COPD-5使用支气管舒张剂糖皮质激素全身适当", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071006, 
                                            "text": "COPD-6合并症处理适当", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071007, 
                                            "text": "COPD-7危重患者选择使用无创或有机械通气治疗符合指征", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071008, 
                                            "text": "COPD-8提供戒烟、减少危险因素疾病自我管理健康教育服务", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071009, 
                                            "text": "COPD-9医嘱离院", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071010, 
                                            "text": "9项合计达标率（%）", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071011, 
                                            "text": "COPD平均住院日", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071012, 
                                            "text": "COPD平均住院费用", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071013, 
                                            "text": "COPD平均住院药费", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071014, 
                                            "text": "COPD平均机械通气治疗费", 
                                            "par_id": 102071000, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102071100, 
                                    "text": "（十一）围手术期预防深静脉血栓栓塞（DVT）", 
                                    "par_id": 102070000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102071101, 
                                            "text": "DVT-1有冠心病史患者术前使用β-阻滞剂", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071102, 
                                            "text": "DVT-2有糖尿病史患者术前、术后控制血糖", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071103, 
                                            "text": "DVT-3.1术前有预防深静脉栓塞与肺栓塞风险评分", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071104, 
                                            "text": "DVT-3.2在手术前24小时或手术后施行预防深静脉栓塞", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071105, 
                                            "text": "DVT-4术后24小时内拔留置导尿管（无留置指征）", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071106, 
                                            "text": "DVT-5 手术切口甲级愈合", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071107, 
                                            "text": "DVT-6 医嘱离院", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071108, 
                                            "text": "7项合计达标率", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071109, 
                                            "text": "DVT平均住院日", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071110, 
                                            "text": "DVT平均住院费用", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071111, 
                                            "text": "DVT平均住院药费", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102071112, 
                                            "text": "DVT平均住院手术费", 
                                            "par_id": 102071100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 102080000, 
                            "text": "重症医学（ICU）质量检测指标", 
                            "par_id": 102000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102080100, 
                                    "text": "非预期的24/48小时重返ICU率（%）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080101, 
                                            "text": "24/48小时重返ICU例数", 
                                            "par_id": 102080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080102, 
                                            "text": "单位时间内ICU转出患者总数", 
                                            "par_id": 102080100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080200, 
                                    "text": "呼吸机相关肺炎（VAP）的预防率（‰）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080201, 
                                            "text": "ICU患者使用呼吸机情况下太高床头部≥30度的日数（每天2次）", 
                                            "par_id": 102080200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080202, 
                                            "text": "ICU患者使用呼吸机的总日数", 
                                            "par_id": 102080200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080300, 
                                    "text": "呼吸机相关肺炎（VAP）发生率（‰）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080301, 
                                            "text": "单位时间内ICU所有发生呼吸机感染的总例数", 
                                            "par_id": 102080300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080302, 
                                            "text": "单位时间内ICU所有患者使用呼吸机的总日数", 
                                            "par_id": 102080300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080400, 
                                    "text": "中心静脉置管相关血流感染发生率（‰）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080401, 
                                            "text": "单位时间内ICU中心静脉置管相关血流感染的例数", 
                                            "par_id": 102080400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080402, 
                                            "text": "单位时间内ICU中所有患者使用中心静脉置管的总日数", 
                                            "par_id": 102080400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080500, 
                                    "text": "留置导尿管相关泌尿系感染发病率（‰）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080501, 
                                            "text": "单位时间内ICU中泌尿系统感染人数", 
                                            "par_id": 102080500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080502, 
                                            "text": "单位时间内ICU所有患者使用导尿管总日数", 
                                            "par_id": 102080500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080600, 
                                    "text": "重症患者死亡率（%）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080601, 
                                            "text": "单位时间内收治的同一危重程度患者的死亡人数", 
                                            "par_id": 102080600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080602, 
                                            "text": "单位时间内收治的同一危重程度患者的总人数", 
                                            "par_id": 102080600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080700, 
                                    "text": "重症患者压疮发生率（%）", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102080701, 
                                            "text": "单位时间内收治的同一危重程度患者的发生压疮患者数量", 
                                            "par_id": 102080700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102080702, 
                                            "text": "单位时间内收治的同一危重程度患者的总人数", 
                                            "par_id": 102080700, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102080800, 
                                    "text": "人工气道脱出例数", 
                                    "par_id": 102080000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 102090000, 
                            "text": "合理用药监测指标", 
                            "par_id": 102000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102090100, 
                                    "text": "抗生素物处方数/每百张门诊处方（%）", 
                                    "par_id": 102090000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102090101, 
                                            "text": "抗生素处方数", 
                                            "par_id": 102090100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090102, 
                                            "text": "门诊处方数", 
                                            "par_id": 102090100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090103, 
                                            "text": "抗生素物处方数/每百张门诊处方（%）", 
                                            "par_id": 102090100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102090200, 
                                    "text": "注射剂处方数/每百张门诊处方（%）", 
                                    "par_id": 102090000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102090201, 
                                            "text": "注射剂处方数", 
                                            "par_id": 102090200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090202, 
                                            "text": "注射剂处方数/每百张门诊处方（%）", 
                                            "par_id": 102090200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102090300, 
                                    "text": "药费收入占医疗总收入比重（%）", 
                                    "par_id": 102090000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102090301, 
                                            "text": "药费收入", 
                                            "par_id": 102090300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090302, 
                                            "text": "医疗总收入", 
                                            "par_id": 102090300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102090400, 
                                    "text": "抗菌药物占西药出库总金额比重（%）", 
                                    "par_id": 102090000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102090401, 
                                            "text": "抗菌药物出库金额", 
                                            "par_id": 102090400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090402, 
                                            "text": "西药出库总金额", 
                                            "par_id": 102090400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090403, 
                                            "text": "抗菌药物占西药出库总金额比重（%）", 
                                            "par_id": 102090400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102090500, 
                                    "text": "常用抗菌药物种类与可提供药敏试验种类比例（%）", 
                                    "par_id": 102090000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102090501, 
                                            "text": "可提供药敏试验种类", 
                                            "par_id": 102090500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090502, 
                                            "text": "常用抗菌药物种类", 
                                            "par_id": 102090500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102090503, 
                                            "text": "常用抗菌药物种类与可提供药敏试验种类比例（%）", 
                                            "par_id": 102090500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 102100000, 
                            "text": "临床路径数据", 
                            "par_id": 102000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102100100, 
                                    "text": "全院开展情况", 
                                    "par_id": 102100000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102100101, 
                                            "text": "临床路径入径开展人数", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102100102, 
                                            "text": "临床路径入径开展率（%）", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102100103, 
                                            "text": "临床路径出径开展人数", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102100104, 
                                            "text": "临床路径出径径开展率（%）", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102100105, 
                                            "text": "临床路径病种数", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102100106, 
                                            "text": "临床路径变异率（%）", 
                                            "par_id": 102100100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102100200, 
                                    "text": "完成工作", 
                                    "par_id": 102100000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102100300, 
                                    "text": "2017年工作计划", 
                                    "par_id": 102100000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 102110000, 
                            "text": "医疗安全(不良)事件", 
                            "par_id": 102000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 102110100, 
                                    "text": "医疗安全(不良)事件例数", 
                                    "par_id": 102110000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 102110200, 
                                    "text": "医疗安全(不良)事件报告管理职责分类", 
                                    "par_id": 102110000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102110201, 
                                            "text": "医疗安全不良事件外科系统占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110202, 
                                            "text": "医疗安全不良事件内科系统占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110203, 
                                            "text": "医疗安全不良事件妇儿系统占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110204, 
                                            "text": "医疗安全不良事件门急诊系统占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110205, 
                                            "text": "医疗安全不良事件医技科室占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110206, 
                                            "text": "医疗安全不良事件社康占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110207, 
                                            "text": "医疗安全不良事件行政后勤占比（%）", 
                                            "par_id": 102110200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102110300, 
                                    "text": "医疗安全(不良)事件级别", 
                                    "par_id": 102110000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102110301, 
                                            "text": "医疗安全(不良)事件Ⅳ级别例数", 
                                            "par_id": 102110300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110302, 
                                            "text": "医疗安全(不良)事件Ⅲ级别例数", 
                                            "par_id": 102110300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110303, 
                                            "text": "医疗安全(不良)事件Ⅱ级别例数", 
                                            "par_id": 102110300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110304, 
                                            "text": "医疗安全(不良)事件Ⅰ级别例数", 
                                            "par_id": 102110300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102110400, 
                                    "text": "医疗安全(不良)事件类别划分", 
                                    "par_id": 102110000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 102110401, 
                                            "text": "病历书写不规范", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110402, 
                                            "text": "诊断问题", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110403, 
                                            "text": "技术水平类问题", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110404, 
                                            "text": "输血安全事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110405, 
                                            "text": "责任事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110406, 
                                            "text": "围手术期安全管理", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110407, 
                                            "text": "依法执业类问题", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110408, 
                                            "text": "医护安全事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110409, 
                                            "text": "非医源性损伤事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110410, 
                                            "text": "科间协调不顺", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110411, 
                                            "text": "知情同意事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110412, 
                                            "text": "非预期事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110413, 
                                            "text": "其他事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110414, 
                                            "text": "患方依从性差", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110415, 
                                            "text": "沟通缺陷", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110416, 
                                            "text": "手术并发症", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110417, 
                                            "text": "公共设施安全类问题", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110418, 
                                            "text": "医疗安全隐患事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110419, 
                                            "text": "麻醉不良事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110420, 
                                            "text": "输液不良事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110421, 
                                            "text": "药品不良事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110422, 
                                            "text": "检验标本的问题", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110423, 
                                            "text": "医疗器械、耗材异常、设备出现非人为因素故障或事故", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110424, 
                                            "text": "侵犯患者权益", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110425, 
                                            "text": "医源性损伤事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110426, 
                                            "text": "知情同意书事件", 
                                            "par_id": 102110400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102110500, 
                                    "text": "报告医疗安全(不良)事件手术级别分类", 
                                    "par_id": 102110000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 102110501, 
                                            "text": "医疗安全(不良)事件其他有创操作例数", 
                                            "par_id": 102110500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110502, 
                                            "text": "医疗安全(不良)事件一级手术", 
                                            "par_id": 102110500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110503, 
                                            "text": "医疗安全(不良)事件二级手术", 
                                            "par_id": 102110500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110504, 
                                            "text": "医疗安全(不良)事件三级手术", 
                                            "par_id": 102110500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 102110505, 
                                            "text": "医疗安全(不良)事件四级手术", 
                                            "par_id": 102110500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 102110600, 
                                    "text": "医疗安全(不良)事件报告各科室报告分类", 
                                    "par_id": 102110000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 103000000, 
                    "text": "国家卫计委六大专业医疗质量控制指标Ⅰ", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 103010000, 
                            "text": "麻醉专业医疗质量控制指标", 
                            "par_id": 103000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103010100, 
                                    "text": "麻醉科医患比（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010101, 
                                    "text": "麻醉科医生数", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010102, 
                                    "text": "麻醉科患者数", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010200, 
                                    "text": "各ASA分级麻醉患者比例", 
                                    "par_id": 103010000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103010201, 
                                            "text": "ASAⅠ级麻醉患者比例（%）", 
                                            "par_id": 103010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103010202, 
                                            "text": "ASAⅡ级麻醉患者比例（%）", 
                                            "par_id": 103010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103010203, 
                                            "text": "ASAⅢ级麻醉患者比例（%）", 
                                            "par_id": 103010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103010204, 
                                            "text": "ASAⅣ级麻醉患者比例（%）", 
                                            "par_id": 103010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103010205, 
                                            "text": "ASAⅤ级麻醉患者比例（%）", 
                                            "par_id": 103010200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103010300, 
                                    "text": "麻醉急诊非择期比例（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010400, 
                                    "text": "急诊麻醉占比（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010500, 
                                    "text": "各类麻醉方式比例（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010600, 
                                    "text": "椎管内麻醉比例（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010700, 
                                    "text": "全身麻醉比例（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010800, 
                                    "text": "神经阻滞比例（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103010900, 
                                    "text": "麻醉开始后手术取消率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011000, 
                                    "text": "麻醉后PACU转出延迟率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011100, 
                                    "text": "PACU入室低温率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011200, 
                                    "text": "非计划转入ICU率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011300, 
                                    "text": "非计划二次气管插管率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011400, 
                                    "text": "麻醉开始后24小时死亡率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011500, 
                                    "text": "麻醉开始后24小时内心跳骤停率(%)", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011600, 
                                    "text": "术中自体血输注率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011700, 
                                    "text": "自体血输注病例数", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011800, 
                                    "text": "输血总病例数", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103011900, 
                                    "text": "自体血输注率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103012000, 
                                    "text": "麻醉期间严重过敏反应发生率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103012100, 
                                    "text": "椎管内麻醉后严重神经并发症发生率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103012200, 
                                    "text": "中心静脉穿刺严重并发症发生率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103012300, 
                                    "text": "全身麻醉气管插管后声音嘶哑发生率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103012400, 
                                    "text": "麻醉后新发昏迷发生率（%）", 
                                    "par_id": 103010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 103020000, 
                            "text": "病理专业医疗质量控制指标", 
                            "par_id": 103000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103020100, 
                                    "text": "每百张病床病理医师数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020200, 
                                    "text": "病理医师人数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020300, 
                                    "text": "实际开放病床数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020500, 
                                    "text": "医师数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020600, 
                                    "text": "每百张病床病理技术人员数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020700, 
                                    "text": "病理技术人员数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103020800, 
                                    "text": "实际开放病床数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021000, 
                                    "text": "技术人员数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021100, 
                                    "text": "标本规范化固定率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021200, 
                                    "text": "规范化固定标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021300, 
                                    "text": "非规范化固定标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021400, 
                                    "text": "同期总标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021600, 
                                    "text": "HE染色切片优良率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021700, 
                                    "text": "HE染色优良切片数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021800, 
                                    "text": "HE染色非优良切片数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103021900, 
                                    "text": "同期HE染色切片总数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022100, 
                                    "text": "免疫组化染色切片优良率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022200, 
                                    "text": "免疫组化染色优良切片数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022300, 
                                    "text": "免疫组化染色非优良切片数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022400, 
                                    "text": "同期免疫组化染色切片总数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022600, 
                                    "text": "术中快速病理诊断及时率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022700, 
                                    "text": "规定时间内完成术中快速病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022800, 
                                    "text": "规定时间内未完成术中快速病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103022900, 
                                    "text": "同期术中快速病理诊断标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023100, 
                                    "text": "组织病理诊断及时率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023200, 
                                    "text": "规定时间内完成组织病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023300, 
                                    "text": "规定时间内未完成组织病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023400, 
                                    "text": "同期组织病理诊断标本总数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023600, 
                                    "text": "细胞病理诊断及时率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023700, 
                                    "text": "规定时间内完成细胞病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023800, 
                                    "text": "规定时间内未完成细胞病理诊断报告标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103023900, 
                                    "text": "同期细胞病理诊断标本总数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024100, 
                                    "text": "术中快速诊断与石蜡切片符合率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024200, 
                                    "text": "术中快速诊断与石蜡诊断符合标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024300, 
                                    "text": "术中快速诊断与石蜡诊断不符合标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024400, 
                                    "text": "同期术中快速诊断标本总数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024600, 
                                    "text": "各项分子病理检测室内质控合格率", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024700, 
                                    "text": "各项分子病理室间质评合格率", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024800, 
                                    "text": "免疫组化染色室间质评合格率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103024900, 
                                    "text": "细胞学病理诊断质控符合率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103025000, 
                                    "text": "细胞学原病理诊断与抽查质控诊断符合标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103025100, 
                                    "text": "细胞学原病理诊断与抽查质控诊断不符合标本数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103025200, 
                                    "text": "同期抽查质控标本总数(抽查标本数应占总阴性标本数至少5%)", 
                                    "par_id": 103020000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103025300, 
                                    "text": "病理科各项病理检查例数", 
                                    "par_id": 103020000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103025301, 
                                            "text": "常规病理例数", 
                                            "par_id": 103025300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025302, 
                                            "text": "宫颈细胞TCT例数", 
                                            "par_id": 103025300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025303, 
                                            "text": "宫颈细胞涂片例数", 
                                            "par_id": 103025300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025304, 
                                            "text": "非妇细胞例数", 
                                            "par_id": 103025300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103025400, 
                                    "text": "病理科各项病理检查报告及时率（%）", 
                                    "par_id": 103020000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103025401, 
                                            "text": "常规病理报告及时率（%）", 
                                            "par_id": 103025400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025402, 
                                            "text": "宫颈细胞TCT报告及时率）（%）", 
                                            "par_id": 103025400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025403, 
                                            "text": "宫颈细胞涂片报告及时率（%）", 
                                            "par_id": 103025400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103025404, 
                                            "text": "非妇细胞报告及时率（%）", 
                                            "par_id": 103025400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }
                            ]
                        }, 
                        {
                            "id": 103030000, 
                            "text": "急诊专业医疗质量控制指标", 
                            "par_id": 103000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103030100, 
                                    "text": "急诊科医患比（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 103030101, 
                                            "text": "急诊科医生数", 
                                            "par_id": 103030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030102, 
                                            "text": "急诊科患者数", 
                                            "par_id": 103030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030103, 
                                            "text": "急诊科医患比（%）", 
                                            "par_id": 103030100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103030200, 
                                    "text": "急诊科护患比（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [
                                        {
                                            "id": 103030201, 
                                            "text": "急诊科护士数", 
                                            "par_id": 103030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030202, 
                                            "text": "急诊科护患比（%）", 
                                            "par_id": 103030200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103030300, 
                                    "text": "急诊各级患者比例（%o）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103030301, 
                                            "text": "急诊一级患者比例（%o）", 
                                            "par_id": 103030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030302, 
                                            "text": "急诊二级患者比例（%o）", 
                                            "par_id": 103030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030303, 
                                            "text": "急诊三级患者比例（%o）", 
                                            "par_id": 103030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103030304, 
                                            "text": "急诊四级患者比例（%o）", 
                                            "par_id": 103030300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103030400, 
                                    "text": "抢救室滞留时间中位数", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103030500, 
                                    "text": "急性心肌梗死（STEMI）患者平均门药时间", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103030600, 
                                    "text": "急性心肌梗死（STEMI）患者平均门球时间", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103030700, 
                                    "text": "急诊抢救室患者死亡率（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103030800, 
                                    "text": "急诊手术患者死亡率（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103030900, 
                                    "text": "ROSC成功率（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103031000, 
                                    "text": "非计划重返抢救室率（%）", 
                                    "par_id": 103030000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 103000001, 
                    "text": "国家卫计委六大专业医疗质量控制指标Ⅱ", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 103040000, 
                            "text": "临床检验专业医疗质量控制指标", 
                            "par_id": 103000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103040100, 
                                    "text": "标本类型错误率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040200, 
                                    "text": "标本容器错误率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040300, 
                                    "text": "标本采集量错误率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040400, 
                                    "text": "抗凝标本凝集率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040500, 
                                    "text": "检验前周转时间中位数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040600, 
                                    "text": "检验前周转时间中位数平诊生化", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040700, 
                                    "text": "检验前周转时间中位数平诊免疫", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040800, 
                                    "text": "检验前周转时间中位数平诊临检", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103040900, 
                                    "text": "检验前周转时间中位数急诊生化", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041000, 
                                    "text": "检验前周转时间中位数急诊免疫", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041100, 
                                    "text": "检验前周转时间中位数急诊临检", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041200, 
                                    "text": "室内质控项目变异系数不合格率", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041300, 
                                    "text": "实验室内周转时间中位数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041400, 
                                    "text": "实验室内周转时间中位数平诊生化", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041500, 
                                    "text": "实验室内周转时间中位数平诊免疫", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041600, 
                                    "text": "实验室内周转时间中位数平诊临检", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041700, 
                                    "text": "检验报告不正确率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041800, 
                                    "text": "危急值通报及时率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103041900, 
                                    "text": "微生物室血培养污染率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042000, 
                                    "text": "微生物室血培养送检例数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042100, 
                                    "text": "微生物室血培养污染例数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042200, 
                                    "text": "标本类型错误数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042300, 
                                    "text": "标本容器错误数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042400, 
                                    "text": "标本采集错误数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042500, 
                                    "text": "抗凝标本凝集错误数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042600, 
                                    "text": "标本总数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042700, 
                                    "text": "标本拒收总数", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042800, 
                                    "text": "实验室内周转时间中位数急诊临检", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103042900, 
                                    "text": "实验室内周转时间中位数急诊生化", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103043000, 
                                    "text": "室内质控项目的开展率（%）", 
                                    "par_id": 103040000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 103050000, 
                            "text": "ICU专业医疗质量控制指标", 
                            "par_id": 103000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103050100, 
                                    "text": "ICU患者收治率和ICU患者收治床日率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103050101, 
                                            "text": "ICU患者收治率（%）", 
                                            "par_id": 103050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103050102, 
                                            "text": "ICU患者收治床日率（%）", 
                                            "par_id": 103050100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103050200, 
                                    "text": "急性生理与慢性健康评分（APACHEⅡ评分）≥15分患者收治率（入ICU24小时内）（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050300, 
                                    "text": "感染性休克3h集束化治疗（bundle）完成率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050400, 
                                    "text": "感染性休克6h集束化治疗（bundle）完成率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050500, 
                                    "text": "ICU抗菌药物治疗前病原学送检率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050600, 
                                    "text": "ICU深静脉血栓（DVT）预防率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050700, 
                                    "text": "ICU患者病死率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050800, 
                                    "text": "ICU非计划气管插管拔管率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103050900, 
                                    "text": "ICU气管插管拔管后48h内再插管率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103051000, 
                                    "text": "非计划转入ICU率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103051100, 
                                    "text": "转出ICU后48h内重返率（%）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103051200, 
                                    "text": "ICU呼吸机相关性肺炎（VAP）发病率（‰）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103051300, 
                                    "text": "ICU血管内导管相关血流感染（CRBSI）发病率（‰）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103051400, 
                                    "text": "ICU导尿管相关泌尿系感染（CAUTI）发病率（‰）", 
                                    "par_id": 103050000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }, 
                        {
                            "id": 103060000, 
                            "text": "医院感染管理质量控制指标", 
                            "par_id": 103000001, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 103060100, 
                                    "text": "医院感染管理质量监测指标概况", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060101, 
                                            "text": "医院感染发病率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060102, 
                                            "text": "医院感染漏报率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060103, 
                                            "text": "多重耐药菌感染发现率(多重耐药感染患者数/同期住院病人总数)", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060104, 
                                            "text": "择期手术患者肺部感染发生率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060105, 
                                            "text": "全院环境卫生学监测合格率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060106, 
                                            "text": "全院手卫生监测合格率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060107, 
                                            "text": "院感重点科室人员手卫生依从性", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060108, 
                                            "text": "普通病区医务人员手卫生依从性", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060109, 
                                            "text": "消毒灭菌效果监测合格率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060110, 
                                            "text": "常规器械消毒灭菌合格率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060111, 
                                            "text": "医院感染现患率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060112, 
                                            "text": "院感患者病原学送检率（%）", 
                                            "par_id": 103060100, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060200, 
                                    "text": "2016年重症医学科三项侵入性操作相关感染率（%）", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060201, 
                                            "text": "ICU住院病人数", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060202, 
                                            "text": "ICU医院感染病人数", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060203, 
                                            "text": "ICU医院感染率(院感人数/同期住院病人数)", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060204, 
                                            "text": "ICU医院感染例次数", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060205, 
                                            "text": "ICU医院感染例次率（%）", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060206, 
                                            "text": "呼吸机相关肺炎发病率（‰）", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060207, 
                                            "text": "留置导尿管相关泌尿系统感染发病率（‰）", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060208, 
                                            "text": "血管导管相关流血感染发病率（‰）", 
                                            "par_id": 103060200, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060300, 
                                    "text": "急诊ICU(EICU)三项侵入性操作相关感染率（%）", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060301, 
                                            "text": "EICU医院感染例次数", 
                                            "par_id": 103060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060302, 
                                            "text": "EICU医院感染例次率", 
                                            "par_id": 103060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060303, 
                                            "text": "EICU呼吸机相关肺炎发病率（‰）", 
                                            "par_id": 103060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060304, 
                                            "text": "EICU留置导尿管相关泌尿系统感染发病率（‰）", 
                                            "par_id": 103060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060305, 
                                            "text": "EICU血管导管相关流血感染发病率（‰）", 
                                            "par_id": 103060300, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060400, 
                                    "text": "神经外科ICU三项侵入性操作相关感染率", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060401, 
                                            "text": "神经外科ICU医院感染例次数", 
                                            "par_id": 103060400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060402, 
                                            "text": "神经外科ICU医院感染例次率", 
                                            "par_id": 103060400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060403, 
                                            "text": "神经外科ICU呼吸机相关肺炎发病率（‰）", 
                                            "par_id": 103060400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060404, 
                                            "text": "神经外科ICU留置导尿管相关泌尿系统感染发病率（‰）", 
                                            "par_id": 103060400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060405, 
                                            "text": "神经外科ICU血管导管相关流血感染发病率（‰）", 
                                            "par_id": 103060400, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060500, 
                                    "text": "全院各科ICU三项侵入性操作相关感染率", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060501, 
                                            "text": "全院各科ICU医院感染例次数", 
                                            "par_id": 103060500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060502, 
                                            "text": "全院各科ICU医院感染例次率", 
                                            "par_id": 103060500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060503, 
                                            "text": "全院各科ICU呼吸机相关肺炎发病率（‰）", 
                                            "par_id": 103060500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060504, 
                                            "text": "全院各科ICU留置导尿管相关泌尿系统感染发病率（‰）", 
                                            "par_id": 103060500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060505, 
                                            "text": "全院各科ICU血管导管相关流血感染发病率（‰）", 
                                            "par_id": 103060500, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060600, 
                                    "text": "全院Ⅰ类切口不同感染风险指数", 
                                    "par_id": 103060000, 
                                    "data": [
                                        0
                                    ], 
                                    "children": [
                                        {
                                            "id": 103060601, 
                                            "text": "手术人数", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060602, 
                                            "text": "手术部位感染例数（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060603, 
                                            "text": "手术部位感染发病率（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060604, 
                                            "text": "0级手术部位感染发病率（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060605, 
                                            "text": "1级手术部位感染发病率（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060606, 
                                            "text": "2级手术部位感染发病率（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }, 
                                        {
                                            "id": 103060607, 
                                            "text": "3级手术部位感染发病率（%）", 
                                            "par_id": 103060600, 
                                            "data": [
                                                1
                                            ], 
                                            "children": [ ]
                                        }
                                    ]
                                }, 
                                {
                                    "id": 103060700, 
                                    "text": "抗菌药物治疗前病原学送检率（%）", 
                                    "par_id": 103060000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 103060800, 
                                    "text": "住院患者抗菌药使用率（%）", 
                                    "par_id": 103060000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 104000000, 
                    "text": "医院DRGs数据分析报告", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 104010000, 
                            "text": "医院各月份DRGs指标变化", 
                            "par_id": 104000000, 
                            "data": [
                                0
                            ], 
                            "children": [
                                {
                                    "id": 104010100, 
                                    "text": "CMI（病例组合指数）", 
                                    "par_id": 104010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 104010200, 
                                    "text": "DRGs组数", 
                                    "par_id": 104010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 104010300, 
                                    "text": "费用消耗指数", 
                                    "par_id": 104010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 104010400, 
                                    "text": "时间效率指数（%）", 
                                    "par_id": 104010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }, 
                                {
                                    "id": 104010500, 
                                    "text": "低风险死亡率（%）", 
                                    "par_id": 104010000, 
                                    "data": [
                                        1
                                    ], 
                                    "children": [ ]
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "id": 200000328, 
                    "text": "南山医院绩效考核指标", 
                    "par_id": 100000000, 
                    "data": [
                        0
                    ], 
                    "children": [
                        {
                            "id": 200000329, 
                            "text": "工作量", 
                            "par_id": 200000328, 
                            "data": [
                                0
                            ], 
                            "children": [ ]
                        }, 
                        {
                            "id": 200000330, 
                            "text": "人均出院人次", 
                            "par_id": 200000328, 
                            "data": [
                                0
                            ], 
                            "children": [ ]
                        }
                    ]
                }
            ]
        }
    ]
}

const orgTree = {
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

const dimTree = [
{
    dim_id: '3',
    dim_name: '住院重点疾病维度',
    data: [{
        dim_value_id: '301',
        dim_value_name: '急性心肌梗死 '
    }, {
        dim_value_id: '302',
        dim_value_name: '充血性心力衰竭 '
    }, {
        dim_value_id: '303',
        dim_value_name: '脑出血和脑梗死'
    }, {
        dim_value_id: '304',
        dim_value_name: '创伤性颅脑损伤  '
    }, {
        dim_value_id: '305',
        dim_value_name: '消化道出血（无并发症） '
    }, {
        dim_value_id: '306',
        dim_value_name: '累及身体多部位的损伤'
    }, {
        dim_value_id: '307',
        dim_value_name: '细菌性肺炎（成人、无并发症）'
    }, {
        dim_value_id: '308',
        dim_value_name: '慢性阻塞性肺疾病'
    }, {
        dim_value_id: '309',
        dim_value_name: '糖尿病短期并发症与长期并发症 '
    }, {
        dim_value_id: '310',
        dim_value_name: '结节性甲状腺肿'
    }, {
        dim_value_id: '311',
        dim_value_name: '急性阑尾炎伴弥漫性腹膜炎及脓肿'
    }, {
        dim_value_id: '312',
        dim_value_name: '前列腺增生 '
    }, {
        dim_value_id: '313',
        dim_value_name: '肾衰竭'
    }, {
        dim_value_id: '314',
        dim_value_name: '败血症（成人）'
    }, {
        dim_value_id: '315',
        dim_value_name: '高血压（成人）'
    }, {
        dim_value_id: '316',
        dim_value_name: '急性胰腺炎 '
    }, {
        dim_value_id: '317',
        dim_value_name: '恶性肿瘤术后化疗'
    }, {
        dim_value_id: '318',
        dim_value_name: '恶性肿瘤术后维持性化疗'
    }]
}, {
    dim_id: '4',
    dim_name: '住院重点手术病种维度',
    data: [{
        dim_value_id: '401',
        dim_value_name: '髋、膝关节置换术'
    }, {
        dim_value_id: '402',
        dim_value_name: '椎板切除术或脊柱融合相关手术 '
    }, {
        dim_value_id: '403',
        dim_value_name: '胰腺切除术 '
    }, {
        dim_value_id: '404',
        dim_value_name: '食管切除术'
    }, {
        dim_value_id: '405',
        dim_value_name: '腹腔镜下胆囊切除术'
    }, {
        dim_value_id: '406',
        dim_value_name: '冠状动脉旁路移植术（CABG）'
    }, {
        dim_value_id: '407',
        dim_value_name: '经皮冠状动脉介入治疗（PCI）'
    }, {
        dim_value_id: '408',
        dim_value_name: '颅、脑手术'
    }, {
        dim_value_id: '409',
        dim_value_name: '子宫切除术'
    }, {
        dim_value_id: '410',
        dim_value_name: '剖宫产'
    }, {
        dim_value_id: '411',
        dim_value_name: '阴道分娩'
    }, {
        dim_value_id: '412',
        dim_value_name: '乳腺手术'
    }, {
        dim_value_id: '413',
        dim_value_name: '肺切除术'
    }, {
        dim_value_id: '414',
        dim_value_name: '胃切除术'
    }, {
        dim_value_id: '415',
        dim_value_name: '直肠切除术'
    }, {
        dim_value_id: '416',
        dim_value_name: '肾与前列腺相关手术'
    }, {
        dim_value_id: '417',
        dim_value_name: '血管内修补术'
    }, {
        dim_value_id: '418',
        dim_value_name: '恶性肿瘤手术'
    }, {
        dim_value_id: '419',
        dim_value_name: '甲状腺癌联合根治术'
    }, {
        dim_value_id: '421',
        dim_value_name: ' 喉癌联合根治术 '
    }, {
        dim_value_id: '422',
        dim_value_name: '肺叶切除术'
    }, {
        dim_value_id: '423',
        dim_value_name: '食管部分切除、食管胃弓上吻合术'
    }, {
        dim_value_id: '424',
        dim_value_name: '胃恶性肿瘤手术'
    }, {
        dim_value_id: '425',
        dim_value_name: '肝恶性肿瘤手术'
    }, {
        dim_value_id: '426',
        dim_value_name: '结肠、直肠恶性肿瘤手术'
    }, {
        dim_value_id: '428',
        dim_value_name: '胰腺恶性肿瘤手术'
    }, {
        dim_value_id: '429',
        dim_value_name: '乳腺恶性肿瘤手术'
    }, {
        dim_value_id: '430',
        dim_value_name: '肾恶性肿瘤手术'
    }, {
        dim_value_id: '431',
        dim_value_name: '前列腺癌根治术'
    }, {
        dim_value_id: '432',
        dim_value_name: '根治性膀胱切除 '
    }, {
        dim_value_id: '433',
        dim_value_name: '双侧输卵管-卵癌切除术'
    }, {
        dim_value_id: '434',
        dim_value_name: '全子宫切除术'
    }, {
        dim_value_id: '435',
        dim_value_name: '盆腔淋巴结清扫术'
    }]
}, {
    dim_id: '5',
    dim_name: '单病种名称维度',
    data: [{
        dim_value_id: '501',
        dim_value_name: '急性心肌梗死'
    }, {
        dim_value_id: '502',
        dim_value_name: '心力衰竭'
    }, {
        dim_value_id: '503',
        dim_value_name: '社区获得性肺炎CAP--住院、成人'
    }, {
        dim_value_id: '504',
        dim_value_name: '髋关节置换术'
    }, {
        dim_value_id: '505',
        dim_value_name: '膝关节置换术'
    }, {
        dim_value_id: '506',
        dim_value_name: '脑梗死STK'
    }, {
        dim_value_id: '507',
        dim_value_name: '社区获得性肺炎--住院、儿童'
    }, {
        dim_value_id: '508',
        dim_value_name: '围术期预防感染(PIP)'
    }, {
        dim_value_id: '509',
        dim_value_name: '剖宫产术（CS）'
    }, {
        dim_value_id: '510',
        dim_value_name: '慢性阻塞性肺疾病（急性加重期住院）'
    }, {
        dim_value_id: '511',
        dim_value_name: '围手术期预防深静脉血栓栓塞（DVT）'
    }]
}, {
    dim_id: '6',
    dim_name: '前15位疾病维度',
    data: [{
        dim_value_id: '600',
        dim_value_name: '为肿瘤化学治疗疗程'
    }, {
        dim_value_id: '601',
        dim_value_name: '妊娠期发生的糖尿病'
    }, {
        dim_value_id: '602',
        dim_value_name: '未特指的支气管肺炎'
    }, {
        dim_value_id: '603',
        dim_value_name: '其他特指的医疗照顾'
    }, {
        dim_value_id: '604',
        dim_value_name: '其他特指的椎间盘移位'
    }, {
        dim_value_id: '605',
        dim_value_name: '为以前的子宫手术瘢痕给予的孕产妇医疗'
    }, {
        dim_value_id: '606',
        dim_value_name: '分娩时Ⅰ度会阴裂伤'
    }, {
        dim_value_id: '607',
        dim_value_name: '未特指的急性阑尾炎'
    }, {
        dim_value_id: '608',
        dim_value_name: '非胰岛素依赖型糖尿病伴有多个并发症'
    }, {
        dim_value_id: '609',
        dim_value_name: '肺的其他疾患'
    }, {
        dim_value_id: '610',
        dim_value_name: '胎膜早破,在24小时之内产程开始'
    }, {
        dim_value_id: '611',
        dim_value_name: '稽留流产'
    }, {
        dim_value_id: '612',
        dim_value_name: '贫血并发于妊娠、分娩和产褥期'
    }, {
        dim_value_id: '613',
        dim_value_name: '乳头腺瘤'
    }, {
        dim_value_id: '614',
        dim_value_name: '肾盂积水伴有肾和输尿管结石梗阻'
    }, {
        dim_value_id: '615',
        dim_value_name: '未特指的细菌性肺炎'
    }, {
        dim_value_id: '616',
        dim_value_name: '产程和分娩并发脐带绕颈并伴有受压'
    }, {
        dim_value_id: '617',
        dim_value_name: '涉及骨折板和其他内固定装置的随诊医疗'
    }, {
        dim_value_id: '618',
        dim_value_name: '肾积脓'
    }, {
        dim_value_id: '700',
        dim_value_name: '乳房良性肿瘤'
    }]
}, {
    dim_id: '7',
    dim_name: '前15位手术维度',
    data: [{
        dim_value_id: '700',
        dim_value_name: '子宫下段剖宫产术'
    }, {
        dim_value_id: '701',
        dim_value_name: '会阴侧切缝合术'
    }, {
        dim_value_id: '702',
        dim_value_name: '会阴产科裂伤修补术'
    }, {
        dim_value_id: '703',
        dim_value_name: '分娩时人工破膜'
    }, {
        dim_value_id: '704',
        dim_value_name: '腹腔镜检查术'
    }, {
        dim_value_id: '705',
        dim_value_name: '其他治疗性超声'
    }, {
        dim_value_id: '706',
        dim_value_name: '肛门括约肌切断术'
    }, {
        dim_value_id: '707',
        dim_value_name: '胃镜检查术'
    }, {
        dim_value_id: '708',
        dim_value_name: '宫腔镜检查'
    }, {
        dim_value_id: '709',
        dim_value_name: '痔注射术'
    }, {
        dim_value_id: '710',
        dim_value_name: '其它计算机辅助外科手术'
    }, {
        dim_value_id: '711',
        dim_value_name: '痔切除术'
    }, {
        dim_value_id: '712',
        dim_value_name: '扩张和刮宫术,分娩或流产后'
    }, {
        dim_value_id: '713',
        dim_value_name: '痔套扎术'
    }, {
        dim_value_id: '714',
        dim_value_name: '药物引产,静脉滴注催产素'
    }, {
        dim_value_id: '715',
        dim_value_name: '导尿管插入术'
    }, {
        dim_value_id: '716',
        dim_value_name: '药物置入用于流产'
    }, {
        dim_value_id: '717',
        dim_value_name: '荧光透视的计算机辅助外科手术'
    }, {
        dim_value_id: '718',
        dim_value_name: '冠状动脉造影,两根导管'
    }, {
        dim_value_id: '719',
        dim_value_name: '阑尾切除术,经腹腔镜'
    }, {
        dim_value_id: '720',
        dim_value_name: '耳镜检查术'
    }, {
        dim_value_id: '721',
        dim_value_name: '可曲性光学纤维结肠镜检查术'
    }]
}]
export {kpiTree,orgTree,dimTree}