import "css/common/STable.scss";

class STable {


	constructor($el,config,data){
		const {border,size} = config;
		const data_copy = JSON.parse(JSON.stringify(data));
		this.border = border ;
		this.size = size;
		this.container = $el;
		this.init(data_copy);

	}
	
	init(res){

		const {tabInfo:{chartName,row_wd,col_wd,total,tab_style},data} = res;
				this.title =chartName;
				this.config = {row_wd, col_wd, total,tab_style};

		const tabHead = this.renderTableHead(data);
		const tabBody = this.renderTableBody(data);
		const totalH = this.container.height();
		const totalW = this.container.width();

		const border = this.border;

		const titleStr = border === "0" && chartName ? `<p class="s-table-title">${chartName}</p>` : "" ;
		const top_add = border === "0" && chartName ? 30 :　0 ;
		const style = border === "0" ? "" : border === "3" ? 'padding:34px 0 30px;' : 'padding:24px 0 30px;';
		const bottom_add = border === "0" ? "" : 30;

		border === "0" && this.container.css("width",'calc(100% - 10px)');

		const str =  `
						<div  class="s-tableBox fix-tab ${tab_style !=="0" && "border-box"|| ""}" style="${style}">
								${titleStr}
								<div class="tab-head">
									<table class="tab-list table-head"  border="${tab_style}" frame="void">
										<thead>
										    ${tabHead.join("")}   
									    </thead>
									</table>
								</div>
								
								<div class="table-body-wrap ">
									   <table  border="${tab_style}" class="tab-list table-body" frame="void">
											${tabBody.join("")}

									   </table>
								</div>
							</div>
					`
		this.container.html(str);


        const wrap = this.container.find(".table-body-wrap");
        const wrapHead = this.container.find(".tab-head");

  		const maxH = Math.floor(totalH - wrapHead.height() - top_add - bottom_add);
        const is_overflow = maxH - wrap.children("table").height() < 0 ;
        const is_overflowX = totalW - wrapHead.children(".tab-list").width() < 0 ;

      

		const add_bottom = is_overflowX ? 10 : 0 ;
		wrap.css("height", maxH - add_bottom);	

        if(is_overflow){
			this.container.find(".gutter").show();		
        }

        if(is_overflowX){
    	 	this.container.children(".s-tableBox").css("width",wrapHead.children(".tab-list").width());
        }

       
		this.container.find(".tab-list").css({"width":"100%","height":"100%"});
	}

	getRandom(max = 500) {

		return Math.floor(Math.random() * (max - 100 + 1) + 100);

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

				//width="${col_wd.length*120 +col_wd.length-1 }"

                rowData.unshift(`<th colspan="${col_wd.length}" rowspan="${row_wd.length}"  >${titleStr.join(" / ")}</th>`);
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

					//width="120"
					total.push(`<td rowspan="${count}" >${val}</td>`);
				}
			
			}else{

				total.push(`<td>${val}</td>`)	;	
			}
			return total ;

		},[]);
	}

	renderTableBody(_data){
		const { row_wd,col_wd,total,tab_style} = this.config;
	 	const data =_data.slice(row_wd.length);
		const rowspanArr = this.rowspanCount(data);
		const totalArr = ["2","3"].includes(total) && data.pop().splice(col_wd.length) || null;

		let colorCount = 0 ;
		const tabStyle = tab_style === "0" ;
		const tabBodyArr = data.map((row,item)=>{

				 item % rowspanArr[0] === 0 && colorCount++ ;

				const bgClass = tab_style ==="0" ? ( colorCount % 2 === 0  &&　`tr-bg1` || `tr-bg2` ) : "";

				return `<tr class="${bgClass}">${this.renderRow(row,item,rowspanArr).join("")}</tr>`;
		
		});
		
		if(totalArr){

			const totalStr =totalArr && totalArr.map((val)=>{

					return `<td>${val}</td>`;

			});

			tabBodyArr.push(`<tr class="${tab_style ==="0" ? "foot-bg" : ""}"><td colspan="${col_wd.length}">合计</td>${totalStr.join("")}</tr>`);	
		
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

