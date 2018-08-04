let autoprefixer= require("autoprefixer");
let cssnano = require("cssnano");

const plugins = [
	autoprefixer({
				browsers: [
					'>10%',
					'last 4 versions',
					'Firefox ESR',
					'not ie < 9',
				],

	}),
	cssnano({
		 	preset: ['default',{
				/*discardUnused:[
					{fontFace:true},
					{keyframes:false},
					{namespace:false},
					{counterStyle:false},
	            ]*/
		 	}],
            reduceIdents: false,
            zindex:false //防止编译时z-index 被改变
         

	})
];

module.exports = ({file,options,env})=>{

   /* env=="development" && plugins.push(cssnano({
				//preset: 'default',
				reduceIdents: false 
	}));*/
	return {
		ident: 'postcss',
		plugins: plugins,
	}


};

