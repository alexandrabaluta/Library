sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/resource/ResourceModel"
], function (Controller, JSONModel, MessageToast, MessageBox, Sorter, Filter, FilterOperator, FilterType, ResourceModel) {

	"use strict";

	return Controller.extend("org.ubb.books.view.App", {
		onInit : function () {

			var oMessageManager = sap.ui.getCore().getMessageManager(),
			oMessageModel = oMessageManager.getMessageModel(),
			oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
				new Filter("technical", FilterOperator.EQ, true)),
			oViewModel = new JSONModel({
				busy : false,
				hasUIChanges : false,
				order : 0
			});
		this.getView().setModel(oViewModel, "appView");
		this._bTechnicalErrors = false;
		var i18nModel = new ResourceModel({
			bundleName: "org.ubb.books.i18n.i18n"
		 });
		 this.getView().setModel(i18nModel, "i18n");
        },
	   onSearch : function () {
		var oFilters = [];

		var oView = this.getView(),
			titleValue = oView.byId("searchTitle").getValue(),
			authorValue = oView.byId("searchAuthor").getValue(),
			isbnValue = oView.byId("searchId").getValue(),
			dateValue = oView.byId("searchDate").getValue(),
			languageValue = oView.byId("searchLanguage").getValue(),
			oFilterTitle = new Filter("Title", FilterOperator.Contains, titleValue),
			oFilterAuthor = new Filter("Author", FilterOperator.Contains, authorValue),
			oFilterIsbn = new Filter("Isbn", FilterOperator.Contains, isbnValue),
			oFilterDate = new Filter("PublishedDate", FilterOperator.EQ, dateValue),
			oFilterLanguage = new Filter("Language", FilterOperator.EQ, languageValue);
			if (authorValue.length != 0){

				oFilters.push(oFilterAuthor);

			}

			if (titleValue.length != 0){

				oFilters.push(oFilterTitle);
			}

			if (isbnValue.length != 0){

				oFilters.push(oFilterIsbn);
			}

			if (dateValue != null && dateValue!=""){

				oFilters.push(oFilterDate);
			}

			if (languageValue.length != 0){

			    oFilters.push(oFilterLanguage);
			}

		oView.byId("idBooksTable").getBinding("items").filter(oFilters);
	},
	   checkoutBook: function () {

		var items = this.getView().byId("idBooksTable").getSelectedItems();
		var oData;
		var oView=this.getView();
		var oModel = oView.getModel();
		for (var i = 0; i < items.length; i++) {

			var item = items[i];
			var context = item.getBindingContext();
			var obj = context.getProperty(null, context);
			if (obj.NrAvailableBooks == 0)
			MessageToast.show('0 books available! You cannot check this book out. :)');
		else{
			oData= {
				Isbn: obj.Isbn,
				Author: obj.Author,
				Title: obj.Title,
				PublishedDate: obj.PublishedDate,
				Language: obj.Language,
				TotalNrBooks: obj.TotalNrBooks,
				NrAvailableBooks: obj.NrAvailableBooks
				};

				oModel.create("/SEARCHBOOKS_ABSet", oData, {
					success: function(oResponseData){
					   MessageToast.show('Book checked out');
						//oView.setBusy(false);
					}.bind(this),
					error: function(){
					   MessageToast.show('Error');
						//oView.setBusy(false);
					}
				});
			} }
	  },
	});
});