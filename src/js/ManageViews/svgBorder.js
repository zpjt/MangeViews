
class  Border{
	
	constructor($el,config){
		const {id,title} = config;

		this.box = $el;
		this.w = +$el.attr("echo-w");
		this.h = +$el.attr("echo-y");
		this.id=id;
		this.title=title;
		this.type= +$el.attr("echo-type");
		this.init();
	}
	
	init(){
		this.box.html(this.render());

	}

	getPoint1(config){

		const {rotate,position} =config;

		const  total = (position === "top" || position==="bottom" )&& 950 || 500 ;

		const  is_width = total === 950 ;
		const  addValue	= is_width &&  250 || 115 ,
			   symmetryPoint = position==="bottom" && 235 || position==="top" && 225 || 87.5,
			   originPoint =25 ,
			   originPoint2 = !is_width && 25 || 0 ;




		const brotherDistance = position==="bottom" && 12.5 || position==="top" && 30 || 12.5;
		
		const pointArr = [];

		pointArr[0] = originPoint;
		pointArr[5]= rotate*total - originPoint - originPoint2;
		pointArr[1] = symmetryPoint + originPoint + (rotate-1)*addValue;
		pointArr[2] = pointArr[1] + brotherDistance;
		pointArr[4] = rotate*total - pointArr[1] - originPoint2;
		pointArr[3] = pointArr[4] - brotherDistance;

		const axisIndex = is_width ? 0 : 1 ;
		const otherIndex = 1 -	axisIndex;	

		const axis = [];
		const otherAxis = (position === "top" || position === "left") ? 0 : (position === "bottom" && 500*(this.h)-25 || 950*(this.w));
			  axis[otherIndex] = otherAxis;
		
		

		const standOutPoint =position === "top" && 50 || position === "left" && 25 || position === "bottom" && 500*(this.h) || 950*(this.w)-25; 

		return pointArr.map((val,index)=>{
				
					axis[axisIndex]=val;

					if(index==3 || index==2){
						 axis[otherIndex] = standOutPoint ;
					}else{
						 axis[otherIndex] =otherAxis;
					}
					return axis.join(" ");

		});
	}

	getPoint2(config){

		const {rotate,position} =config;

		const  total = (position === "top" || position==="bottom" )&& 950 || 500 ;

		const  is_width = total === 950 ;
		const  addValue	= is_width &&  100 || 0 ,
			   symmetryPoint = position==="top" && 150 || 0;

			 
				
			   const pointArr = [];

			   if(position==="top"){
				const startPoint1 = 80,
				      startPoint2 = 30;

					  pointArr[0] = startPoint1;
					  pointArr[3] = total*rotate - startPoint2;
					  pointArr[2] = pointArr[3]-150-100*(rotate-1);
					  pointArr[1] = pointArr[2]-60;


			   }else{

			   	  const startPoint1 = position === "left" && 80 || position==="right" && 100 || 50,
			      startPoint2 = 50 ;
				  pointArr[0] = startPoint1;
				  pointArr[1] = total*rotate - startPoint2;
			   
			   }

		const axisIndex =  total === 950 ? 0 : 1 ;
		const otherIndex = 1 -	axisIndex;	

		const axis = [];
		const otherAxis = (position === "top" || position === "left") ? 0 : (position === "bottom" && 500*(this.h) || 950*(this.w));
			  axis[otherIndex] = otherAxis;
		

		return pointArr.map((val,index)=>{
				
					axis[axisIndex]=val;

					if(index==2){
						axis[otherIndex] = 60 ;
					}

					return axis.join(" ");

		});
	}

	

	getPath(){

		const arr = ["","getPoint1","getPoint2"];

		const method = arr[this.type];


		return ["top","right","bottom","left"].map((val,index)=>{

			const item = index % 2 == 0;
			const arr = this[method]({
				position:val,
				rotate:  item && this.w || this.h,
			});

			return index > 1 && arr.reverse().join(" , ") || arr.join(" , ");
		})

	}

	render(){
		const arr = ["","renderBoder1","renderBoder2","renderBoder3"];	
		return this[arr[this.type]]();
	}

	renderBoder1(){


		const id = this.id;

		return 	`
					<svg xmlns="http://www.w3.org/2000/svg"   xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ${950*this.w+20} ${500*this.h+20}" preserveAspectRatio="none">
							<defs >
							   <desc>边框形状的多边形</desc>

							  	<filter width="100%" height="100%" x="0" y="0" id="blur${id}" filterUnits="objectBoundingBox">
								  	<feGaussianBlur stdDeviation="15" in="SourceGraphic" />
								</filter>
					    		<filter x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" id="filter${id}">
			                        <feOffset dx="0" dy="-10" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
			                        <feGaussianBlur stdDeviation="15" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
			                        <feColorMatrix values="0 0 0 0 0.266666667   0 0 0 0 0.694117647   0 0 0 0 0.607843137  0 0 0 0.7 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
			                        <feMerge>
			                            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
			                            <feMergeNode in="SourceGraphic"></feMergeNode>
			                        </feMerge>
                    			</filter>		
								<desc>四个角的形状</desc>

								<g id="angle${id}" class="angle" >
									<path  d="M26.48 4.94L68.35 4.94L70.56 9.46L92.41 9.46L87.78 0.01L68.35 0.01L68.35 0.01L24.67 0.01L24.67 0.01L24.67 0.01L0 27.82L0 27.82L0 74.38L0 77.07L0 98.99L8.38 104.2L8.38 79.59L4.35 77.07L4.37 77.07L4.37 29.87L4.37 29.87L26.48 4.94Z"  />
									<path d="M25.21 27.87L25.21 8.18L7.75 27.87L7.75 27.87L25.21 27.87Z" id="a4eOZ2LBP"/>
								</g>
								<desc>小菱形</desc>
								<pattern id="pattern${id}" x="0" y="0" width="10" height="10"
							           patternUnits="userSpaceOnUse" >
							     	<rect x="2.5" y="0" width="5" height="10" fill="#3B9CCB"/>
							    </pattern>
							    <g id="rhombic${id}" class="rhombic" fill="#3B9CCB">
							   		<desc>大菱形左</desc>
							    	<rect x="105" y="0" width="30" height="10"  />
									<rect x="140" y="0" width="${60+100*(this.w-1)}" height="10" fill="url(#pattern${id})" />
									<desc>大菱形右</desc>
									<rect x="${205+(this.w-1)*100}" y="0" width="30" height="10" />
							    </g>
									<image xlink:href="./img/view_bg1.png" ></image>
									
							</defs>

							<g transform="translate(10 10)" >
								
								
								<g style="opacity:0.3;" >
									<polygon id="shape"  fill="#d2ebf0" class="shade" stroke="" points="${this.getPath().join(" , ")}"  />
								</g>

									<polygon   fill="none" filter="url(#blur${id})" stroke-width="4" stroke="#d2ebf0" points="${this.getPath().join(" , ")}"  />

								<g fill="#95d3df">
									<use xlink:href="#angle${id}"/>
									<use xlink:href="#angle${id}" transform="scale(-1,1) translate(-${950*this.w})" ></use>
									<use xlink:href="#angle${id}" transform="scale(1,-1) translate(0 -${500*this.h-25})"/>
									<use xlink:href="#angle${id}" transform="scale(-1,-1) translate(-${950*this.w} -${500*this.h-25})"/>
								</g>
								<g 	fill="#95d3df" >
								   <use xlink:href="#rhombic${id}" transform="skewX(30)" />
								   <use xlink:href="#rhombic${id}" transform="translate(${950*this.w-210-130-100*(this.w-1)} 0) skewX(-30)" />
								</g>
								
								<text x="${950*this.w/2}" y="30" fill="white" text-anchor="middle" font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ${this.title} </text>
							</g>
					</svg>

				`;

	}

	renderBoder2(){

		const id = this.id;

		return 	`
					<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ${950*this.w+20} ${500*this.h+20}" preserveAspectRatio="none">
							<defs >
									<linearGradient id="line${id}" gradientUnits="objectBoundingBox">
					                  <stop offset="0" stop-color="#2c93d2"/>
					                  <stop offset="1" stop-color="#3fbccf"/>
					              	</linearGradient>
					              	<g id="border${id}">
										<polygon   points="${this.getPath().join(" , ")}"  
										/>
					              	</g>
							</defs>

							<g transform="translate(10 10)" stroke="url(#line${id})" stroke-width="5" >
									<use xlink:href="#border${id}" fill="none"/>
									<defc>三角形</defc>
									<path  fill="none" d="M 0 0 L 50 0 L 0 50 Z"  />
									<defc>斜线</defc>
									<line x1="${935+950*(this.w-1)}" y1="${435+500*(this.h-1)}" x2="${885+950*(this.w-1)}" y2="${485+500*(this.h-1)}"  />
									<line x1="${740+850*(this.w-1)}" y1="0" x2="${785+850*(this.w-1)}" y2="45"  />

									
							</g>
							<text x="${(950*this.w-90-150-100*(this.w-1))/2}" y="50" fill="white" text-anchor="middle" font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ${this.title} </text>

					</svg>

				`;
	}

	renderBoder3(){

		const id = this.id;

		return 	`
					<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ${950*this.w+20} ${500*this.h+20}" preserveAspectRatio="none">
							<defs >
									<linearGradient id="line${id}" gradientUnits="objectBoundingBox">
					                  <stop offset="0" stop-color="#2c93d2"/>
					                  <stop offset="1" stop-color="#3fbccf"/>
					              	</linearGradient>
					              	<filter width="100%" height="100%" x="0" y="0" id="blur${id}" filterUnits="objectBoundingBox">
								  		<feGaussianBlur stdDeviation="5" in="SourceGraphic" />
									</filter>
					              	<g id="border${id}" stroke-opacity="0.8">
										<rect x="0" y="0" rx="15" ry="15" width="${this.w*950}" height="${this.h*500}" />
					              	</g>
					              	<g id="title${id}" transform="translate(30 20)" stroke-width="2">
										<polygon  fill="none" points="0 0 ,800 0 ,800 30,770 60,0 60" />
					              	</g>
					              	<g id="radius${id}" stroke-width="6"  stroke="#3fbccf">
										<path d="M55 0 h-40 A15 15 0 0 0 0 15 v40"  fill="none" stroke-linecap="round" />
					              	</g>
							</defs>

							<g transform="translate(10 10)" stroke="url(#line${id})" stroke-width="3" fill="none">
									<use xlink:href="#border${id}" />
									<defc>标题</defc>
									<use xlink:href="#title${id}" />
									<use xlink:href="#radius${id}"  />
									<use xlink:href="#radius${id}"  transform="scale(-1 1) translate(${-this.w*950} 0)"/>
									<use xlink:href="#radius${id}" transform="scale(1 -1) translate(0 ${-this.h*500})" />
									<use xlink:href="#radius${id}" transform="scale(-1 -1) translate(${-this.w*950} ${-this.h*500})" />
 							</g>
 							<text x="60" y="70" fill="white"  font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ${this.title} </text>
					</svg>

				`;
	}



}

export {Border} ;

