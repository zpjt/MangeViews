import {api} from "api/ManageViews.js";


/*
	chartType:用来区分图形类别
	3:表格
	4:折线
	5:饼图
	6:雷达图
	7:散点图

*/

class Chart{

	constructor($el,config,data){

		const {border} = config;
		this.type="";
		this.Box=$el;
		this.init(data,border);
		this.color=["#1CA7DA","#92BCF5"];
		
	}

	init(res,border){
		const typeObject={
			"3":"tabConfig",
			"4":"lineConfig",
			"5":"pieConfig",
			"6":"radarConfig",
			"7":"scatterConfig",
		}	


		const {graphInfo:{chartType,chartName,contrastDim,rowDim},data} = res;
		 
		this.type=chartType;

		const option = this[typeObject[this.type]](data);
			  option.Dim={contrastDim, rowDim,};

		if(!border){ // 没边框
			option.title={
				text:chartName,
				left:"center",
				textStyle:{
					color:"white",
					fontSize:14,
				}
			}
		};
		let myChart= echarts.init(this.Box); 
			myChart.setOption(option);
			//窗口自适应
			$(window).on("resize",function(){
				myChart.resize();
  		 });
		 
	}

	barConfig(res){

		return {
			legend: {
				orient: 'horizontal',
				x: 'center',
				top: '12%',
				itemWidth: 12,
				itemHeight: 12,
				data: ['test'],
				textStyle: { //图例文字的样式
					fontSize: 12,
					color: "white"
				}
			},
			tooltip: {
				show: true,
				trigger: 'item',
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: true
					},

				}
			},

			xAxis: {
				type: 'category',
				data: [{
					value: 'Mon',
					textStyle: {
						color: "white"

					}

				}, {
					value: 'Mon1',
					textStyle: {
						color: "white"

					}

				}, {
					value: 'Mon2',
					textStyle: {
						color: "white"

					}

				}, {
					value: 'Mon3',
					textStyle: {
						color: "white"

					}

				}, {
					value: 'Mon4',
					textStyle: {
						color: "white"

					}

				}, ],
				show: true,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				}
			},
			yAxis: {
				type: 'value',
				show: false,
			},
			series: [{
					name: 'test',
					type: 'bar',
					barWidth: 20, //柱图宽度
					data: [2800, 1700, 1200, 1000, 900],
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: '#00fcae'
							}, {
								offset: 1,
								color: '#006388'
							}]),
							opacity: 1,
						}
					},
				},

			]
		};
	}

	pieConfig(res){

		const data =res[0].rowData.map((val,index)=>{

			return {
 					"name": res[0].rowDimName[index],
				    "value": val !="--" && val || 0,
			}
		}) ;


		const startColor = ['#0157be', '#7a18ed', '#00bbce', '#ea865a'];
		const endColor = ['#0367d4', '#2743ed', '#00c4a5', '#ea2e41'];
		const borderStartColor = ['#05acff', '#ee36ff', '#05fcfb', '#ffa597'];
		const borderEndColor = ['#09c1ff', '#8171ff', '#05ffff', '#ff6584'];
		
		const RealData = data.map((val,index)=>{
			
			const itemStyle = {
					normal: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: startColor[index] // 0% 处的颜色
							}, {
								offset: 1,
								color: endColor[index] // 100% 处的颜色
							}],
							globalCoord: false // 缺省为 false
						},
					}
				};
				return Object.assign({},val,{itemStyle});
		});

		const borderData = data.map((val,index)=>{
			
			const itemStyle = {
					normal: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: borderStartColor[index] // 0% 处的颜色
							}, {
								offset: 1,
								color: borderEndColor[index] // 100% 处的颜色
							}],
							globalCoord: false // 缺省为 false
						},
					}
				};
				return Object.assign({},val,itemStyle);
		});
		



		return {
			tooltip: {
				show: true,
				trigger: 'item',
			},
			legend: {
				top:20,
				// left: 10,
				textStyle: {
					color: '#f2f2f2',
					fontSize: 12,

				},
				icon: 'circle', //形状
				data: data,
			},
			series: [
				// 主要展示层的
				{
					radius: ['33%', '61%'],
					center: ['50%', '50%'],
					type: 'pie',
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					name: "",
					data: RealData,
					tooltip: {
						formatter: "{a}：<br/>{b}: {c}人"
					}
				},
				// 边框的设置
				{
					radius: ['31%', '36%'],
					center: ['50%', '50%'],
					type: 'pie',
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					animation: false,
					tooltip: {
						show: false
					},
					data: borderData
				},
				// 中心的圆圈
				{
					radius: ['26%', '31%'],
					center: ['50%', '50%'],
					type: 'pie',
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					tooltip: {
						show: false
					},
					data: [{
						value: 100,
						name:'',
						itemStyle: {
							normal: {
								color: '#0FC8FE',
							}
						}
					}],
					animation: false
				}
			]
		};
	}

	lineConfig(res){


		/*
			legendArr：图例数组，
			xAxisData:X轴的数据，
			series:系列对象，

		*/

		
		const xAxisData = res[0].rowDimName.map(val=>{
			return {
						value:val,
						textStyle: {
							color: "white"
						}
					}
		});

		let legendArr=[];
		const series=res.map((val,index)=>{

			/*
				contrastDimName:对比的维度，

			*/

			const {contrastDimName,lineType,rowData} = val;
			
			legendArr[index]=contrastDimName;

			const areaStyle = this.type==="2" && {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(199, 237, 250,0.5)'
						}, {
							offset: 1,
							color: 'rgba(199, 237, 250,0.2)'
						}], false)
					}
			} || null;

			const data = rowData.map(val=>{
				return val != "--" && val || null ;
			});
			
			return{
				name:contrastDimName,
				type:lineType === "1" && "line" || "bar" ,
				areaStyle,
				smooth: true,
				showSymbol: true,
				symbol: 'circle',
				symbolSize: 6,

				barWidth: 20, //柱图宽度
				data,
			}
		});



		return {
			
			color:this.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					lineStyle: {
						color: '#ddd'
					}
				},
				backgroundColor: 'rgba(255,255,255,1)',
				padding: [5, 10],
				textStyle: {
					color: '#7588E4',
				},
				extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
			},
			legend: {
				right: "center",
				top:20,
				orient: 'horizontal',
				textStyle: { //图例文字的样式
					fontSize: 12,
					color: "white"
				},
				data: legendArr,
			},
			xAxis: {
				type: 'category',
				data: xAxisData,
				boundaryGap: false,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					margin: 10,
					textStyle: {
						fontSize: 12
					}
				}
			},
			yAxis: {
				type: 'value',
				show:false,
				
			},
			series: series,
		};
	}

	scatterConfig(res) {

			const dataBJ = [
				[1, 55, 9, 56, 0.46, 18, 6, "良"],
				[2, 25, 11, 21, 0.65, 34, 9, "优"],
				[6, 82, 58, 90, 1.77, 68, 33, "良"],
				[8, 78, 55, 80, 1.29, 59, 29, "良"],
				[9, 267, 216, 280, 4.8, 108, 64, "重度污染"],
				[10, 185, 127, 216, 2.52, 61, 27, "中度污染"],
				[11, 39, 19, 38, 0.57, 31, 15, "优"],
				[19, 57, 31, 54, 0.96, 32, 14, "良"],
				[28, 160, 120, 186, 2.77, 91, 50, "中度污染"],
				[29, 134, 96, 165, 2.76, 83, 41, "轻度污染"],
				[31, 46, 5, 49, 0.28, 10, 6, "优"]
			];

			const dataGZ = [
				[1, 26, 37, 27, 1.163, 27, 13, "优"],
				[2, 85, 62, 71, 1.195, 60, 8, "良"],
				[7, 64, 30, 28, 0.924, 51, 2, "良"],
				[11, 84, 39, 60, 0.964, 25, 11, "良"],
				[23, 93, 77, 104, 1.165, 53, 7, "良"],
				[25, 146, 84, 139, 1.094, 40, 17, "轻度污染"],
				[27, 81, 48, 62, 1.619, 26, 3, "良"],
				[28, 56, 48, 68, 1.336, 37, 9, "良"],
				[29, 82, 92, 174, 3.29, 0, 13, "良"],
				[30, 106, 116, 188, 3.628, 101, 16, "轻度污染"],
				[31, 118, 50, 0, 1.383, 76, 11, "轻度污染"]
			];

			const dataSH = [
				[1, 91, 45, 125, 0.82, 34, 23, "良"],
				[3, 83, 60, 84, 1.09, 73, 27, "良"],
				[4, 109, 81, 121, 1.28, 68, 51, "轻度污染"],
				[7, 106, 77, 114, 1.07, 55, 51, "轻度污染"],
				[15, 108, 80, 121, 1.3, 85, 37, "轻度污染"],
				[19, 97, 71, 113, 1.17, 88, 31, "良"],
				[22, 104, 77, 119, 1.09, 73, 48, "轻度污染"],
				[27, 39, 24, 39, 0.59, 50, 19, "优"],
				[28, 93, 68, 96, 1.05, 79, 29, "良"],
				[30, 174, 131, 174, 1.55, 108, 50, "中度污染"],
				[31, 187, 143, 201, 1.39, 89, 53, "中度污染"]
			];

			const schema = [{
				name: 'date',
				index: 0,
				text: '日'
			}, {
				name: 'AQIindex',
				index: 1,
				text: 'AQI指数'
			}, {
				name: 'PM25',
				index: 2,
				text: 'PM2.5'
			}, {
				name: 'PM10',
				index: 3,
				text: 'PM10'
			}, {
				name: 'CO',
				index: 4,
				text: '一氧化碳（CO）'
			}, {
				name: 'NO2',
				index: 5,
				text: '二氧化氮（NO2）'
			}, {
				name: 'SO2',
				index: 6,
				text: '二氧化硫（SO2）'
			}];


			const itemStyle = {
				normal: {
					opacity: 0.8,
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			};

			return  {
				color: [
					'#dd4444', '#fec42c', '#80F1BE'
				],
				legend: {
					y: 'top',
					data: ['北京', '上海', '广州'],
					textStyle: {
						color: '#fff',
						fontSize: 12
					}
				},
				grid: {
					x: 100,
					x2: 100,
					y: '18%',
					y2: '10%'
				},
				tooltip: {
					padding: 10,
					backgroundColor: '#222',
					borderColor: '#777',
					borderWidth: 1,
					formatter: function(obj) {
						const value = obj.value;
						return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;">' +
							obj.seriesName + ' ' + value[0] + '日：' +
							value[7] +
							'</div>' +
							schema[1].text + '：' + value[1] + '<br>' +
							schema[2].text + '：' + value[2] + '<br>' ;
					}
				},
				xAxis: {
					type: 'value',
					name: '日期',
					nameGap: 16,
					nameTextStyle: {
						color: '#fff',
						fontSize: 14
					},
					max: 31,
					axisLine: {
						show:false,
						
					},
					axisTick: {
						show: false,
					},
					 splitLine: {
			            show: false
			        }
				},
				yAxis: {
					type: 'value',
					show:false,

				},
				visualMap: [{
					left:0,
					top: '5%',
					dimension: 2,
					min: 0,
					max: 250,
					itemWidth: 15,
					itemHeight: 70,
					calculable: true,
					precision: 0.1,
					text: ['圆形大小：PM2.5'],
					textGap: 30,
					textStyle: {
						color: '#fff'
					},
					inRange: {
						symbolSize: [10, 70]
					},
					outOfRange: {
						symbolSize: [10, 70],
						color: ['rgba(255,255,255,.2)']
					},
					controller: {
						inRange: {
							color: ['#c23531']
						},
						outOfRange: {
							color: ['#444']
						}
					}
				}, {
					right: '0',
					top: '5%',
					dimension: 6,
					min: 0,
					max: 50,
					itemHeight: 70,
					itemWidth: 15,
					calculable: true,
					precision: 0.1,
					text: ['明暗：二氧化硫'],
					textGap: 30,
					textStyle: {
						color: '#fff'
					},
					inRange: {
						colorLightness: [1, 0.5]
					},
					outOfRange: {
						color: ['rgba(255,255,255,.2)']
					},
					controller: {
						inRange: {
							color: ['#c23531']
						},
						outOfRange: {
							color: ['#444']
						}
					}
				}],
				series: [{
					name: '北京',
					type: 'scatter',
					itemStyle: itemStyle,
					data: dataBJ
				}, {
					name: '上海',
					type: 'scatter',
					itemStyle: itemStyle,
					data: dataSH
				}, {
					name: '广州',
					type: 'scatter',
					itemStyle: itemStyle,
					data: dataGZ
				}]
			};
	}

	radarConfig(res){

		const color = "#189cbb";
		const scale = 1;

		const radar =  res[0].rowDimName.map(val=>{
			return {
				text:val,
				max:function(row){
					return row.max*1.5;
				}
			}
		});
		const legend =[];
		const data = res.map((val,index)=>{

			const {rowData,contrastDimName} = val;
			legend[index] = contrastDimName ;
			return {
				value: rowData,
				name: contrastDimName
			}
		});
		return  {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
		          top: 20,
		          itemWidth: 12,
		          itemHeight: 12,
		          data: legend,
		          textStyle: {
		              color: '#fff'
		          }
		     },
			radar: [{
				indicator: radar,
				center: ['50%', '50%'],
				radius: '50%',
				name: {
					textStyle: {
						color: "white",
						fontSize: 12,
						fontWeight: 'bold'
					}
				},
				splitLine: {
					lineStyle: {
						color: '#0b5263',
						opacity: 0.5,
						width: 2
					},
				},
				splitArea: {
		            areaStyle: {
	                  color: 'rgba(127,95,132,.3)',
	                  opacity: 1,
	                  shadowBlur: 45,
	                  shadowColor: 'rgba(0,0,0,.5)',
	                  shadowOffsetX: 0,
	                  shadowOffsetY: 15,
		            }
		        },
				axisLine: {
					show: true,
					lineStyle: {
						color: color,
						type: "dashed",
					}
				}
			}, ],
			series: [{
				type: 'radar',
				tooltip: {
					trigger: 'item'
				},
				data: data,
				symbolSize: 2 * scale,
				itemStyle: {
					normal: {
						borderColor: '#ffc72b',
						borderWidth: 3 * scale,
					}
				},
				lineStyle: {
					normal: {
						color: "#fff",
						width: 3 * scale
					}
				},
				areaStyle: {
	               normal: {
	                  shadowBlur: 13,
	                  shadowColor: 'rgba(127,95,132,.3)',
	                  shadowOffsetX: 0,
	                  shadowOffsetY: 10,
	                  opacity: 1
	              }
	          	},
			}, ]
		};

	}

}
export {Chart};