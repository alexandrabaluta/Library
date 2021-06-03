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
		handleDelete: function(oEvent){
			var sBookPath= oEvent.getParameter('listItem').getBindingContext().getPath();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("correctdeleteMessage", [sRecipient]);
			var mMsg=oBundle.getText("wrongdeleteMessage", [sRecipient]);
			this.getView().getModel().remove(sBookPath,{
				success: function(){
					MessageToast.show(sMsg);
				},
			error: function(){
				MessageToast.show(mMsg);
				oView.setBusy(false);
			}
			})
		},
		/**
		 * Create a new entry.
		 */
		 onCreate : function () {
			 var oData;
			 var oView=this.getView();
			 var oModel = oView.getModel();
			 var oBundle = this.getView().getModel("i18n").getResourceBundle();
			 var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			 var sMsg = oBundle.getText("correctaddMessage", [sRecipient]);
			 var mMsg=oBundle.getText("wrongaddMessage", [sRecipient]);
			 oData= {
				Isbn :	this.getView().byId("inIsbn").getValue(),
				Author : this.getView().byId("inAuthor").getValue(),
				Title : this.getView().byId("inTitle").getValue(),
				PublishedDate : this.getView().byId("inPublisheddate").getDateValue(),
				Language : this.getView().byId("inLanguage").getValue(),
				TotalNrBooks : parseInt(this.getView().byId("inTotalnrbooks").getValue()),
				NrAvailableBooks :parseInt(this.getView().byId("inNravailablebooks").getValue())

			 };
			 oView.setBusy(true);
			 oModel.create("/ZBOOKS_ABSet", oData, {
				 success: function(oResponseData){
					MessageToast.show(sMsg);
					 oView.setBusy(false);
				 }.bind(this),
				 error: function(){
					MessageToast.show(mMsg);
					 oView.setBusy(false);
				 }
			 });

		},
		onInit : function () {
			var oViewModel = new JSONModel({
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
		onInputNrChange: function(oEvent){
            var value = oEvent.getSource().getValue();
            var bindingContext = oEvent.getSource().getBindingContext().getPath();
            this.getView().getModel().setProperty(bindingContext+"/NrAvailableBooks",parseInt(value));
        },
		
		/**
		 * Lock UI when changing data in the input controls
		 * @param {sap.ui.base.Event} oEvt - Event data
		 */
		 onInputChange : function (oEvt) {
			if (oEvt.getParameter("escPressed")) {
				this._setUIChanges();
			} else {
				this._setUIChanges(true);
			}
		},

		/**
		 * Refresh the data.
		 */
		onRefresh : function () {
			var oBinding = this.byId("idBooksTable").getBinding("items");
			oBinding.refresh();
		},
		/**
		 * Save changes to the source.
		 */
		onSave : function () {
			var oView= this.getView();
            var oModel=oView.getModel();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("correctupdateMessage", [sRecipient]);
		 var mMsg=oBundle.getText("wrongupdateMessage", [sRecipient]);
            oModel.submitChanges({
                success: function(){
                    MessageToast.show(sMsg);
                    //oView._setBusy(false);

                },
                error: function(){
                    MessageToast.show(mMsg);
                    oView.setBusy(false);
                }
            });

		},


		/**
		 * Set hasUIChanges flag in View Model
		 * @param {boolean} [bHasUIChanges] - set or clear hasUIChanges
		 * if bHasUIChanges is not set, the hasPendingChanges-function of the OdataV4 model determines the result
		 */
		_setUIChanges : function (bHasUIChanges) {
			if (bHasUIChanges === undefined) {
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/hasUIChanges", bHasUIChanges);
		},


	});
});