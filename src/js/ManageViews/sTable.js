import "css/common/STable.scss";
import {api} from "api/ManageViews.js";

class STable {


	constructor($el,config,callback){
		const {id} = config;
		this.chartId = id;
		this.container = $el;
		this.init(callback);
	}
	
	init(callback){
		this.getTabData().then(res=>{

			if(res){
				const tabHead = this.renderTableHead();
				const tabBody = this.renderTableBody();
				const {row_wd,col_wd} = this.config;
				const totalH = this.container.height();

				
				const str =  `
								<div  class="s-tableBox fix-tab">
										<table class="tab-list tab-head">
											<thead>
											    ${tabHead.join("")}   
										    </thead>
										</table>
										<div class="table-body-wrap " >
											   <table  border="1" class="tab-list table-body">
													${tabBody.join("")}

											   </table>
										</div>
									</div>
							`

				this.container.html(str);

				const wrap = this.container.find(".table-body-wrap");
				const height = totalH-row_wd.length*50 ;
				wrap.css("height", totalH - this.container.find(".tab-head").height()-15);		

				const is_overflow = wrap.height() - wrap.children("table").height() > 0 ;

				
				!is_overflow && this.container.find(".gutter").show();
				callback && callback(this.title);

				$(window).on("resize",()=>{
						wrap.css("height", totalH - this.container.find(".tab-head").height()-15);
						!is_overflow && this.container.find(".gutter").show();
		  		 });
			}
		})
	}

	getTabData(){
		
		return api.getTableData(this.chartId).then(res=>{

			if(res){
				const {tabInfo:{chartName,row_wd,col_wd,total},data} = res;
				this.data =data;
				this.title =chartName;
				this.config = {
					row_wd,
					col_wd,
					total
				}
				return this.data;
			}else{
				return false;
			}
		});
	}

	renderTableHead(){

		const {row_wd,col_wd,total} = this.config;

		const wd_arr=["","时间", "科室", "指标", "维度值"];

		const data = this.data.slice(0,row_wd.length);

	

		const TableHeadArr = data.map((row,item)=>{
			
			const {headData,colspanCount} = this.colspanCount(row);

			const rowData =  headData.reduce((totalArr,cur,index)=>{

					const str = `<th colspan="${colspanCount}">${cur}</th>`;

					if( (index+1) % colspanCount === 0){
						totalArr.push(str);
					}


					return totalArr ;

			},[]);


			if(item === 0){ // 加第一个td的标题
				
				const titleStr = col_wd.map(val=>{
					return wd_arr[+val];
				});

                rowData.unshift(`<th rowspan="${row_wd.length}" width="${col_wd.length*120 +col_wd.length-1 }">${titleStr.join(" / ")}</th>`);
			    //列字段的合并,第一行最后一列的第一个
			    
		     	if( headData[headData.length-1].includes("合计") ){
		     		 const lastIndex = row_wd.length ==1 && rowData.length-1 || rowData.length;
					rowData[lastIndex]=`<th rowspan="${row_wd.length}">合计</th>`;
		     	}
				rowData.push(`<th class="gutter" rowspan="${row_wd.length}"></th>`);
			}

		


			return `<tr>${rowData.join("")}</tr>`;
		

		});


		return TableHeadArr ;
	}

	renderRow(row,item,rowspan){

		return row.reduce((total,val,index)=>{

			let str = null;
			
			if(index < rowspan.length){

				const count = rowspan[index]
				if(  ( item + 1) % count === 1 || count === 1){
					total.push(`<td rowspan="${count}" width="120">${val}</td>`);
				}
			
			}else{

				total.push(`<td>${val}</td>`)	;	
			}
			return total ;

		},[]);
	}

	renderTableBody(){
		const { row_wd} = this.config;
	 	const data = this.data.slice(row_wd.length);
		const rowspanArr = this.rowspanCount(data);
		console.log(rowspanArr,"asdf");
		const tabBodyArr = data.map((row,item)=>{

				return `<tr>${this.renderRow(row,item,rowspanArr).join("")}</tr>`;
		});

		return tabBodyArr;
	}

	rowspanCount(rows){
		const {col_wd} = this.config;
		return  col_wd.map((val,index)=>{

			const first = rows[0][index];

			const _index = rows.findIndex((row,item)=>{
				return row[index] != first;
			});

			return _index === -1 && 1 || _index	;

		});	
	}

	colspanCount(row){
		const {row_wd,col_wd} = this.config;
		 row.splice(0,col_wd.length);
		 const count = row.findIndex(val=>{
		 	return val !== row[0] ;
		 });

		return {
			headData:row,
			colspanCount:count,
		};

	}
}

export {STable};