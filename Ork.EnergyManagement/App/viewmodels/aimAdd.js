define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/datacontext', 'services/routeConfig', 'knockout.mapping'], function(app, dialog, logger, datacontext, routeConfig, mapping) {

  var ctor = function() {

    var self = this;
    self.model = ko.observable();
    self.title = 'Energieziel hinzufügen';
    self.shortAim = ko.observable().extend({
      required: true
    });
    self.longAim = ko.observable().extend({
      required: true
    });


    self.errors = ko.validation.group(self);


    this.activate = function() {
      //logger.log('Energieziel wird geladen!', null, this.title, true);
      self.model(datacontext.createAim());
      self.shortAim(self.model().shortAim());
      self.longAim(self.model().longAim());
    };


    this.close = function(dialogResult) {
      dialog.close(self);
    };

    this.save = function(dialogResult) {
      if (self.canSave()) {
        self.model().shortAim(self.shortAim());
        self.model().longAim(self.longAim());
        return datacontext.saveChanges().fin(complete);

        function complete(result) {
          toastr.success("Energieziel hinzugefügt");
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