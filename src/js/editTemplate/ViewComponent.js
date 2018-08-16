import {STable} from "js/ManageViews/sTable.js";
import "css/ManageViews.scss";

class Table extends STable{

	constructor($el,config){
		const {data} = config;
		super($el,{id:""});
		this.allData = data;
	}

	getTabData(){
		
		return new Promise((resolve)=>{
				resolve(123);
		}).then(res=>{

			const {tabInfo:{chartName,row_wd,col_wd},data} = this.allData;
				this.title =chartName;
				this.config = {
					row_wd,
					col_wd,
				};

				this.data = data ;

				return data ;

		});
	}
}

class ViewComponent{
	
	constructor($el,data){

		this.container = $el;
		this.data= data;
		this.init();
	}

	init(){

		const data = this.data;

		this.view = new Table(this.container,{data:data});
	}



}


export {ViewComponent} ;