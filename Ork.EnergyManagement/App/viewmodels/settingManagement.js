define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/repository', 'services/datacontext', 'services/routeConfig', 'viewmodels/selectableCatalog'], function(app, dialog, logger, repository, datacontext, routeConfig, selectableCatalogVm) {

  var ctor = function() {

    this.title = 'Einstellungen';
    this.selectedCatalogs = ko.observableArray();
    this.selectableCatalogs = ko.observableArray();
    this.setting = ko.observable();

    this.activate = function() {
      logger.log('Einstellungen werden geladen!', null, this.title, true);
      this.getCatalogs();
      datacontext.getSetting(this.setting, true);
      
     
    };

    this.compositionComplete = function() {
      $('.chosen-select').chosen();
    };

    this.close = function(dialogResult) {
      var self = this;
      dialog.close(self, dialogResult);
    };

    this.save = function(dialogResult) {
      var self = this;
      self.postSelectedCatalogs();
      return datacontext.saveChanges().fin(complete);

      function complete() {
        dialog.close(self, dialogResult);
      }
    };

    this.postSelectedCatalogs = function() {
      var self = this;

      $.ajax({
        url: routeConfig.postSelectedCatalogsUrl,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: ko.toJSON(
          self.selectedCatalogs
        ),
        dataType: "json",
        success: function(data, status) {
          toastr.success(status + " - Kataloge gespeichert");
        }
      });
    };

    this.getCatalogs = function() {
      var self = this;
      $.getJSON(routeConfig.catalogsUrl, function(data) {
        if (data !== null) {
          $.each(data, function(i, model) {
            var selectableCatalog = new selectableCatalogVm(model);
            self.selectableCatalogs.push(selectableCatalog);

          });
        }
      }).done(function() {
        $.getJSON(routeConfig.selectedCatalogsUrl, function(data) {
          $.each(data, function(i, model) {
            var result = ko.utils.arrayFirst(self.selectableCatalogs(), function(element) {
              return model.OrkHubId == element.id;
            });
            if (result != null) {
              self.selectedCatalogs.push(result);
            }
          });
        });
      });
    };

  };
  return ctor;

});