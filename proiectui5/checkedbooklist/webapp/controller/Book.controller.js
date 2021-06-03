sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
], function (Controller, JSONModel, MessageToast, MessageBox, Sorter, Filter, FilterOperator, FilterType) {

	"use strict";

	return Controller.extend("org.ubb.books.view.App", {
		formatDate:function(date){
            if (date != null)
                return date.slice(6,8)+'.'+date.slice(4,6)+'.'+date.slice(0,4);
        },
	});
});