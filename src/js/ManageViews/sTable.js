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
				callback(this.title);

				$(window).on("resize",()=>{
						wrap.css("height", totalH - this.container.find(".tab-head").height()-15);
						!is_overflow && this.container.find(".gutter").show();
		  		 });
			}
		})
	}

	getTabData(){
			
		const res_test = {
				 "data":[["重点疾病","","","01月","02月","03月","04月"],["妇科一病区","总例数","充血性心力衰竭 ","0","0","0","0"],["妇科一病区","总例数","消化道出血（无并发症） ","0","0","0","0"],["妇科一病区","总例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["妇科一病区","死亡例数","充血性心力衰竭 ","0","0","0","0"],["妇科一病区","死亡例数","消化道出血（无并发症） ","0","0","0","0"],["妇科一病区","死亡例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["妇科一病区","死亡率（%）","充血性心力衰竭 ","0.00","0.00","0.00","0.00"],["妇科一病区","死亡率（%）","消化道出血（无并发症） ","0.00","0.00","0.00","0.00"],["妇科一病区","死亡率（%）","细菌性肺炎（成人、无并发症）","0.00","0.00","0.00","0.00"],["肛肠外科","总例数","充血性心力衰竭 ","0","0","0","0"],["肛肠外科","总例数","消化道出血（无并发症） ","0","0","0","1"],["肛肠外科","总例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["肛肠外科","死亡例数","充血性心力衰竭 ","0","0","0","0"],["肛肠外科","死亡例数","消化道出血（无并发症） ","0","0","0","0"],["肛肠外科","死亡例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["肛肠外科","死亡率（%）","充血性心力衰竭 ","0.00","0.00","0.00","0.00"],["肛肠外科","死亡率（%）","消化道出血（无并发症） ","0.00","0.00","0.00","0.00"],["肛肠外科","死亡率（%）","细菌性肺炎（成人、无并发症）","0.00","0.00","0.00","0.00"],["骨科一病区(骨关节科)","总例数","充血性心力衰竭 ","0","0","1","0"],["骨科一病区(骨关节科)","总例数","消化道出血（无并发症） ","0","0","0","0"],["骨科一病区(骨关节科)","总例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["骨科一病区(骨关节科)","死亡例数","充血性心力衰竭 ","0","0","0","0"],["骨科一病区(骨关节科)","死亡例数","消化道出血（无并发症） ","0","0","0","0"],["骨科一病区(骨关节科)","死亡例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["骨科一病区(骨关节科)","死亡率（%）","充血性心力衰竭 ","0.00","0.00","0.00","0.00"],["骨科一病区(骨关节科)","死亡率（%）","消化道出血（无并发症） ","0.00","0.00","0.00","0.00"],["骨科一病区(骨关节科)","死亡率（%）","细菌性肺炎（成人、无并发症）","0.00","0.00","0.00","0.00"],["骨科二病区(脊柱外科科)","总例数","充血性心力衰竭 ","0","0","0","0"],["骨科二病区(脊柱外科科)","总例数","消化道出血（无并发症） ","0","0","0","0"],["骨科二病区(脊柱外科科)","总例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["骨科二病区(脊柱外科科)","死亡例数","充血性心力衰竭 ","0","0","0","0"],["骨科二病区(脊柱外科科)","死亡例数","消化道出血（无并发症） ","0","0","0","0"],["骨科二病区(脊柱外科科)","死亡例数","细菌性肺炎（成人、无并发症）","0","0","0","0"],["骨科二病区(脊柱外科科)","死亡率（%）","充血性心力衰竭 ","0.00","0.00","0.00","0.00"],["骨科二病区(脊柱外科科)","死亡率（%）","消化道出血（无并发症） ","0.00","0.00","0.00","0.00"],["骨科二病区(脊柱外科科)","死亡率（%）","细菌性肺炎（成人、无并发症）","0.00","0.00","0.00","0.00"]],
				    "tabInfo":{
				    	col_wd:["2","3","4"],
				    	row_wd:["1"],
				    	chartName:"test表",
				    }

				}


		
		return api.getTableData(this.chartId).then(res=>{

			if(res){
				const {tabInfo:{chartName,row_wd,col_wd},data} = res;
				this.data =data;
				this.title =chartName;
				this.config = {
					row_wd,
					col_wd
				}

				return this.data;
			}else{
				return false;
			}


		})


	}
	renderTableHead(){

		const {row_wd,col_wd} = this.config;

		const wd_arr=["","时间", "科室", "指标", "维度值"];

		const data = this.data.slice(0,row_wd.length);

		const TableHeadArr = data.map((row,item)=>{
			
			const {headData,colspanCount} = this.colspanCount(row);

			const rowData =  headData.reduce((total,cur,index)=>{

					const str = `<th colspan="${colspanCount}">${cur}</th>`;

					if( (index+1) % colspanCount === 0){
						total.push(str);
					}


					return total ;

			},[]);


			if(item === 0){ // 加第一个td的标题
				
				const titleStr = col_wd.map(val=>{
					return wd_arr[+val];
				});

				rowData.unshift(`<th rowspan="${row_wd.length}" width="${col_wd.length*120 +col_wd.length-1 }">${titleStr.join(" / ")}</th>`);
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