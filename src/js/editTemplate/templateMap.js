class TemplateMap{

	constructor(){

		this.viewsMap = new Map();

	}

	/**
	 * [init 初始化模板数据]
	 * @param  {[String]}  size   [大小]
	 * @param  {[String]}  point [位置]
	 * @param  {[String]}  viewID [视图id]
	 * @param  {[String]}  type [类型]
	 * @param  {[String]}  borderType [边框类型]
	 * @param  {[String]}  par [被合并的对象]
	 * @return {[type]}    [description]
	 */
	init(viewsDomArr,templateDatas){

		console.log(viewsDomArr);

		viewsDomArr.forEach((val,item)=>{

			const attributeObj = templateDatas[item];

			const {
					size,
					point,
					viewID,
					borderType,
					type,
					par,
			} = attributeObj;

			const viewData = null;

			const data = {
				attributeObj,
				viewData,
			};

			this.viewsMap.set(val,data);

			
		});	

		console.log(this.viewsMap,"init");
	}

	add(node,$dom,attr){

		const {borderType,type} = attr ;

		const view = this.viewsMap.get($dom[0]);

		const {attributeObj:{size}} = view;

			  view.data = node ;
			  view.attributeObj.borderType = borderType;
			  view.attributeObj.type = type;

	 	const border_str = borderType  === "0" ? "" : `<div class="bgSvg" echo-w="${size[0]}" echo-y="${size[1]}" echo-type="${borderType}"></div>`;

		const htmlStr = border_str + `<div class="view-content"></div>`;
		console.log(htmlStr);
	//	$dom.html(htmlStr);

	}

	remove(){


	}

	getMap(){


		return this.viewsMap;
	}





}

export {TemplateMap};