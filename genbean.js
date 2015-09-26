var fs = require('fs');
var geninfo = require('./geninfo');

var props = geninfo.getProps();

var className = geninfo.getBeanName();

fs.writeFile('./' + className +'.java', 
	geninfo.getHeader(className) + getPropsString() + getSetString() + geninfo.getTailer(), 
	"utf-8", 
	function(err){
		if(err){
			console.log(err);
	}
});

function getPropsString(){
	var t = "";
	for(var i=0;i<props.length;i++){
		t += "\tprivate String " + props[i] +";\n";
	}

	t += "\n";

	return t;
}

function getSetString(){
	var t = "";
	for(var i=0;i<props.length;i++){

		var setMethod = "set" + props[i][0].toUpperCase() + props[i].substring(1);
		var getMethod = "get" + props[i][0].toUpperCase() + props[i].substring(1)  + "()";

		t += "\tpublic String " + getMethod + " {\n";
		t += "\t\treturn " + props[i] + ";\n";
		t += "\t}\n\n";

		t += "\tpublic void "+setMethod+"(String "+ props[i] +") {\n";
		t += "\t\tthis."+ props[i] +" = "+ props[i] +";\n";
		t += "\t}\n\n";

	}

	return t;
}