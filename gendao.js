var fs = require('fs');
var geninfo = require('./geninfo');

var props = geninfo.getProps();
var tableName = geninfo.getTableName();

var keyName = geninfo.getKeyName();
var beanName = geninfo.getBeanName();

var className = keyName + "Dao";

fs.writeFile('./' + className +'.java', 
	geninfo.getHeader(className) + getDefineString() + getCommonDesc() + getSaveListString() + getSaveSingleString() + getBeanSingleString() + getBeanListString() + geninfo.getTailer(), 
	"utf-8", 
	function(err){
		if(err){
			console.log(err);
	}
});

function getDefineString(){
	var t = "";
	t += "\t//定义表的信息：\n";
	t += "\tpublic static final String TABLE_NAME = \"" + tableName + "\";\n\n";

	for (var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();

		t += "\tpublic static final String " + column + " = \"" + props[i] + "\";\n";
	}
	return t;
};

function getSaveListString(){
	var t = "";
	t += "\tpublic synchronized void saveList" + keyName + "(List<" + beanName +"> items){\n";
	t += "\t\tif(items==null || items.isEmpty()){\n";
	t += "\t\t\treturn;\n";
	t += "\t\t}\n\n";

	t += "\t\tSQLiteDatabase db = dbHelper.getWritableDatabase();\n";
	t += "\t\tdb.beginTransaction();\n\n"
	t += "\t\tContentValues cv = new ContentValues();\n";

	t += "\t\tfor(" + beanName + " item:items) {\n";
	
	for (var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();
		var getMethod = "get" + props[i][0].toUpperCase() + props[i].substring(1)  + "()";
		
		t += "\t\t\tcv.put("+ column + ", item." + getMethod + "==null?\"\":item." + getMethod + ");\n";
	}
	t += "\n";

	t += "\t\t\tString whereClause = COLUMN_ID + \"=?\";\n";
		t += "\t\t\tint updateNumber = db.update(TABLE_NAME, cv, whereClause, new String[]{item.getId()});\n";

		t += "\t\t\tif(updateNumber == 0) {\n";
		t += "\t\t\t\tdb.insert(TABLE_NAME, null, cv);\n";
		t += "\t\t\t}\n";

	t += "\t\t}\n";

	t += "\t\tdb.setTransactionSuccessful();\n";
	t += "\t\tdb.endTransaction();\n";
	t += "\t}\n\n"

	return t;
}

function getSaveSingleString(){
	var t = "";
	t += "\tpublic synchronized void save" + keyName + "(" + beanName +" item){\n";
	t += "\t\tif(item==null){\n";
	t += "\t\t\treturn;\n";
	t += "\t\t}\n\n";

	t += "\t\tSQLiteDatabase db = dbHelper.getWritableDatabase();\n";
	t += "\t\tdb.beginTransaction();\n\n"
	t += "\t\tContentValues cv = new ContentValues();\n";

	for (var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();
		var getMethod = "get" + props[i][0].toUpperCase() + props[i].substring(1)  + "()";
		
		t += "\t\tcv.put("+ column + ", item." + getMethod + "==null?\"\":item." + getMethod + ");\n";
	}

	t += "\n";

	t += "\t\tString whereClause = COLUMN_ID + \"=?\";\n";
	t += "\t\tint updateNumber = db.update(TABLE_NAME, cv, whereClause, new String[]{item.getId()});\n";

	t += "\t\tif(updateNumber == 0) {\n";
	t += "\t\t\tdb.insert(TABLE_NAME, null, cv);\n";
	t += "\t\t}\n";

	t += "\t\tdb.setTransactionSuccessful();\n";
	t += "\t\tdb.endTransaction();\n";
	t += "\t}\n\n"

	return t;
}

function getBeanListString(){
	var t = "";
	t += "\tpublic Set<"+ beanName +"> list" + keyName + "(){\n";
	t += "\t\tSQLiteDatabase db = dbHelper.getWritableDatabase();\n";
	t += "\t\tString sql = \"select * from \" + TABLE_NAME;\n";
	t += "\t\tCursor cursor = db.rawQuery(sql, null);\n\n";

	t += "\t\tSet<"+ beanName +"> result = new HashSet<"+ beanName +">();\n\n";

	t += "\t\twhile(cursor.moveToNext()){\n";
	t += "\t\t\t"+ beanName +" bean = new "+ beanName +"();\n";

	for(var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();
		var setMethod = "set" + props[i][0].toUpperCase() + props[i].substring(1);

		t += "\t\t\tbean." + setMethod + "(cursor.getString(cursor.getColumnIndex(" + column + ")));\n";
	}
	t += "\t\t\tresult.add(bean);\n";
	t += "\t\t}\n";	
	t += "\t\tcursor.close();\n";
	t += "\t\treturn result;\n"

	t += "\t}\n\n"
	return t;
}

function getBeanSingleString(){
	var t = "";
	t += "\tpublic " + beanName + " get" + keyName + "(String id){\n";
	t += "\t\tSQLiteDatabase db = dbHelper.getWritableDatabase();\n";
	t += "\t\tString sql = \"select * from \" + TABLE_NAME + \" where \" + COLUMN_ID + \" = ? \";\n";
	t += "\t\tCursor cursor = db.rawQuery(sql, new String[]{id});\n\n";

	t += "\t\tList<"+ beanName +"> result = new ArrayList<"+ beanName +">();\n\n";

	t += "\t\twhile(cursor.moveToNext()){\n";
	t += "\t\t\t"+ beanName +" bean = new "+ beanName +"();\n";

	for(var i=0;i<props.length;i++){
		var column = "COLUMN_" + props[i].toUpperCase();
		var setMethod = "set" + props[i][0].toUpperCase() + props[i].substring(1);

		t += "\t\t\tbean." + setMethod + "(cursor.getString(cursor.getColumnIndex(" + column + ")));\n";
	}
	t += "\t\t\tresult.add(bean);\n";
	t += "\t\t}\n";	
	t += "\t\tcursor.close();\n\n";


	t += "\t\tif(result != null && result.size() > 0){\n";
	t += "\t\t\treturn result.get(0);\n";
	t += "\t\t}else{\n";
	t += "\t\t\treturn null;\n";
	t += "\t\t}\n";

	t += "\t}\n\n"
	return t;
}

function getCommonDesc(){
	var t = "";
	t += "\tprivate DBSqliteHelper dbHelper;\n\n";
	t += "\tpublic " + className +"(Context context){\n";
	t += "\t\tdbHelper = DBSqliteHelper.getInstance(context);\n";	
	t += "\t}\n\n";
	return t;
}