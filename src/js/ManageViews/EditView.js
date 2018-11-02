
class EditView{

	constructor(box,config,data){

		this.borderType = config.borderType;
		this.box = box ;
		this.init(data);	

	}
	
	init(data){
		this.box.html(data);
	}

}
export {EditView};