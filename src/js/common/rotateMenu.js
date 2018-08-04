
class RotateMenu{

	constructor(){
		this.config = {
			offset:40,
		    radius:80,
		    outSpeed:90,
		    OffsetSpeed:200,
		    OutIncr:90,
		}
	}

	setPath($el,rangle=180){
		this.container = $el.parent();
		this.rangeAngle = rangle;
		this.menuBox = $el.siblings();
		const btnArr = this.menuBox.children();
		 this.open(btnArr);
	}

	getPoint(angle){

		const {offset,radius} = this.config;

		let X,Y,X1,Y1;

		
		if(angle === -90 || angle === 90 ){
				 X = angle < 0 ? -radius :radius;  
			     Y = 0; 
			     X1 = X + (angle < 0 ? -offset :offset);
				 Y1 = 0 ;

		}else if(angle==0){
				 X = 0;  
			     Y = radius ; 
			     X1 =0;
				 Y1 = Y + offset;
		}else{
		       	const radian = Math.PI / 180 ;
				 Y = radius  * Math.cos( angle  * radian );  
			     X = radius  * Math.sin( angle  * radian ); 
			     X1 = X + (angle < 0 ? -offset :offset);
				 Y1 = Y + offset;	
		}

		return {X,Y,X1,Y1} ;
	}

	open($arr){

		const {offset,radius,outSpeed,OffsetSpeed,OutIncr} = this.config;
		const count = $arr.length;
		const angleItem = this.rangeAngle/(count-1);

		$.map($arr,(val,index)=>{
			
			const angle =angleItem * index -90;
			const point = this.getPoint(angle);	
			$(val).children().animate({rotate:720},600);
			$(val).animate({left:point.X1-17.5,top:-point.Y1},outSpeed+index*OutIncr,function(){
				$(val).animate({left:point.X-17.5,top:-point.Y},OffsetSpeed);
			});

		});

	}

	close($arr){
			
			
		
	}
}


export default RotateMenu;