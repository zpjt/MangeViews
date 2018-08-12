
import "css/editTemplate.scss";


import {SCombobox,SModal,Calendar} from "js/common/Unit.js";

/*jq对象*/
const $setMd = $("#setComponentMd");

//下拉框
/*const s_combobox = new SCombobox($(".s-comboBox"),{
	data:[
		{"id":"1","text":"333"},
		{"id":"2","text":"d"},
		{"id":"3","text":"4"},
		{"id":"4","text":"5"},
	],
	width:300,
	multiply:true,
});*/
// 模态框
const s_modal = new SModal();

// 日历
const calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
			rotate:4,
			style:2
});



const $templateBox = $("#templateBox"),
	  $setItem = $(".set-item");

//目标组件的拖拽事件
$templateBox.on("dragover",function(){
	event.preventDefault();
	return true;
});

$templateBox.on("drop",function(){
	event.preventDefault();
	s_modal.show($setMd);
});



//全局样式设置
$("#globalOpt").on("click",".s-btn",function(){
		const index = $(this).index();

		switch(index){
			case 0 :
				break;

			case 1 :
			$("#globalBox").hide();
				break;

		}

});


//返回页面
$("#backHistory").click(function(){
	const $slide = $("#slide",window.parent.document);
	const width = $slide.hasClass("collapsed") && 45 || 250;
	$slide.animate({"width":width},500,function(){
				window.history.back();
	});
	
});



