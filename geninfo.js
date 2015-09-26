
var props = ['id','teacherName','maxOrderNum','ordered','deleted','remark','beginDate','endDate','teacherID','courderID','orderNum']; 
var tableName = "courseOrder";
var keyName = tableName[0].toUpperCase() + tableName.substring(1);
var beanName = keyName + "Bean";

exports.getProps = function(){
	return props;
}

exports.getTableName = function(){
	return tableName;
}

exports.getKeyName = function(){
	return keyName;
}

exports.getBeanName = function(){
	return beanName;
}

exports.getHeader = function(className){
	return head = "public class " + className + " {\n";
}

exports.getTailer = function(){
	return "}";
}