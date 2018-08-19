import "css/common/STable.scss";
import {api} from "api/ManageViews.js";

class STable {


	constructor($el,config,data){
		const {border} = config;
		this.container = $el;
		this.init(data);
	}
	
	init(res){

		const {tabInfo:{chartName,row_wd,col_wd,total},data} = res;
				this.title =chartName;
				this.config = {row_wd, col_wd, total};

		const tabHead = this.renderTableHead(data);
		const tabBody = this.renderTableBody(data);
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
		wrap.css("height", totalH - this.container.find(".tab-head").height()-20);		

		const is_overflow = wrap.height() - wrap.children("table").height() > 0 ;

		!is_overflow && this.container.find(".gutter").show();
		$(window).on("resize",()=>{
				wrap.css("height", totalH - this.container.find(".tab-head").height()-20);
				!is_overflow && this.container.find(".gutter").show();
  		 });
	}

	renderTableHead(_data){

		const {row_wd,col_wd,total} = this.config;

		const wd_arr=["","时间", "科室", "指标", "维度值"];

		const rowLeg = row_wd.length;

		const data = _data.slice(0,rowLeg);

		const TableHeadArr = data.map((row,item)=>{
			
			const {headData,colspanCount} = this.colspanCount(row,total);

			const rowData =  headData.reduce((totalArr,cur,index)=>{

					let str = ""; 

					if( item < rowLeg - 1 && (index+1) % colspanCount === 0){
	
						str = 	`<th colspan="${colspanCount}">${cur}</th>`;
					}else if(item == rowLeg - 1){
						str = 	`<th>${cur}</th>`;
					}
					
					totalArr.push(str);

					return totalArr ;

			},[]);


			if(item === 0){ // 加第一个td的标题
				
				const titleStr = col_wd.map(val=>{
					return wd_arr[+val];
				});

                rowData.unshift(`<th rowspan="${row_wd.length}" width="${col_wd.length*120 +col_wd.length-1 }">${titleStr.join(" / ")}</th>`);
			    //列字段的合并,第一行最后一列的第一个
			    
		     	if( ["1","3"].includes(total)){
		     		 const lastIndex = rowData.length;
					rowData[lastIndex]=`<th rowspan="${rowLeg}">合计</th>`;
		     	}
				rowData.push(`<th class="gutter" rowspan="${rowLeg}"></th>`);
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

	renderTableBody(_data){
		const { row_wd,col_wd,total} = this.config;
	 	const data =_data.slice(row_wd.length);
		const rowspanArr = this.rowspanCount(data);
		const totalArr = ["2","3"].includes(total) && data.pop().splice(col_wd.length) || null;
		const tabBodyArr = data.map((row,item)=>{
				return `<tr>${this.renderRow(row,item,rowspanArr).join("")}</tr>`;
		});
		
		if(totalArr){

			const totalStr =totalArr && totalArr.map((val)=>{

					return `<td>${val}</td>`;

			});

			tabBodyArr.push(`<tr><td colspan="${col_wd.length}">合计</td>${totalStr.join("")}</tr>`);	
		
		}
		

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

	colspanCount(row,total){
		const {row_wd,col_wd} = this.config;
		 row.splice(0,col_wd.length);
		 ["1","3"].includes(total) && row.pop();
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

