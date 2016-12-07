define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/datacontext', 'services/routeConfig', 'knockout.mapping'], function(app, dialog, logger, datacontext, routeConfig, mapping) {

  var ctor = function(aim) {

    var self = this;
    self.model = aim;
    self.title = 'Energieziel bearbeiten';
    self.shortAim = ko.observable(self.model.shortAim()).extend({
      required: true
    });
    self.longAim = ko.observable(self.model.longAim()).extend({
      required: true
    });


    self.errors = ko.validation.group(self);


    this.activate = function() {
      logger.log('Energieziel wird geladen!', null, this.title, true);

      return true;
    };


    this.close = function(dialogResult) {
      dialog.close(self);
    };

    this.save = function(dialogResult) {
      if (self.canSave()) {
        self.model.shortAim(self.shortAim());
        self.model.longAim(self.longAim());
        return datacontext.saveChanges().fin(complete);

        function complete() {
          toastr.success("Daten aktualisiert");
          dialog.close(self);
        }
      } else {
        self.errors.showAllMessages();
      }
    };

    this.canSave = function() {
      if (self.errors().length == 0) {
        return true;
      }
      return false;
    };
  };


  return ctor;

});