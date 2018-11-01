import "css/common/TimeView.scss";


class TimeView{

	constructor(box,config,data){

		this.numCount = 6 ;
		this.borderType = config.borderType;
		this.box = box ;
		this.oldArr = Array.from({length:data.data.length-1},val=>"000000");
		this.init(data);	

	}
	
	init(res){

		const {tabInfo,tabInfo:{tab_style},data} = res;
		const newArr = [];
		const strArr = data.slice(1).map((val,oIndex)=>{
				return this.getItem(tab_style,val,oIndex,newArr);
		});
		this.box.html(strArr.join(""));
		this.oldArr = newArr ;
	}
	getRandom(){

		return Math.floor(Math.random()*(800-10+1)+10);
	}

	closeReload(){

		clearInterval(this.timer);
		this.timer = null ;
	}

	getItem(style,data,oIndex,newArr){
		const zb = data[0];
		const total = data.slice(1).reduce((total,cur)=>{
			//const val = ~~cur;
			const val = this.getRandom();
			return total + val ;
		},0);	
		const num = this.numCount;
		const total_str = (total+"").padStart(num,"0");
		newArr.push(total_str);
		const totalArr = [...total_str];
		const old = this.oldArr[oIndex];
		const oldArr = [...old];
		const htmlStr = `<div class="timeItem timeStyle${style}">
							<p class="real-zb">${zb}</p>
							<ul class="reak-dataBox">
								${this.renderData(totalArr,oldArr).join("")}
							</ul>
						 </div>`;
		return htmlStr ;
	}

	renderData(arr,oldArr){


		const leg = arr.length;

		return arr.map((val,index)=>{

			const old = +oldArr[index];

			const total = old + +val ;

		    const is_over = val > old ;

		    const flag = is_over ? val : old ;
	
			const className = val == old ? "" : is_over ? "real-down" : "real-up" ;


			return `<li class="item-data " >
						<div class="${className}" style="animation-duration:${0.5*(leg - index)}s"><p>${flag}</p><p>${total - flag}</p></div>
					</li>`;


		/*	return `<li class="item-data ${className}" style="animation-duration:${0.5*(leg - index)}s">
						<p class="real-show">${flag}</p><p class="real-hide">${total - flag}</p>
					</li>`;*/
		});
	}
}
export {TimeView};