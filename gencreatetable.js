var fs = require('fs');
var geninfo = require('./geninfo');

var props = geninfo.getProps();
var tableName = geninfo.getTableName();

var keyName = geninfo.getKeyName();
var daoClassName = keyName + "Dao";

fs.writeFile('./DBSqliteHelper.java', 
	getCreateTableString(), 
	"utf-8", 
	function(err){
		if(err){
			console.log(err);
	}
});

function getCreateTableString(){
	var t = "";

	t += "private static final String " + tableName.toUpperCase() + "_CREATE = \"CREATE TABLE \"\n";
	t += "\t\t+ " + daoClassName + ".TABLE_NAME + \" (\"\n";
	t += "\t\t+ BaseColumns._ID  + \" INTEGER PRIMARY KEY AUTOINCREMENT, \"\n";
	for(var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();
		if(i==props.length-1){
			t += "\t\t+ " + daoClassName + "." + column + " + \" TEXT \"\n";
		}else{
			t += "\t\t+ " + daoClassName + "." + column + " + \" TEXT, \"\n";
		}
	}
	t += "\t\t+ \"); \";"

	return t;
}
