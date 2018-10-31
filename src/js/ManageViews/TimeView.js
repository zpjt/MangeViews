import "css/common/TimeView.scss";

class TimeView{
	constructor(box,config,data){
		this.borderType = config.borderType;
		this.box = box ;
		this.init(data);
	}
	
	init(res){
		const {tabInfo:{tabStyle},data} = res;

		const strArr = data.slice(1).map(val=>{
				return this.getItem(tabStyle,val);
		});
		this.box.html(strArr.join(""))
	}

	getItem(style,data){
		const zb = data[0];
		const total = data.slice(1).reduce((total,cur)=>{
			const val = ~~cur;
			return total + val ;
		},0);	


		const htmlStr = `<div class="timeItem timeStyle${style}">
							<p>${zb}</p>
							<div>${total}</div>
						 </div>`;
		return htmlStr ;
	}
}
export {TimeView};