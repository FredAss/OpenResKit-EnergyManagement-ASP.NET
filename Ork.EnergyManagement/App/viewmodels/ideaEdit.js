define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/repository', 'services/datacontext', 'services/routeConfig'], function(app, dialog, logger, repository, datacontext, routeConfig) {

  var ctor = function(idea) {

    var self = this;
    self.title = 'Vorschlag bearbeiten';
    self.model = idea;

    self.shortDescription = ko.observable(self.model.ShortDescription()).extend({
      required: true,
      minLength: 3
    });
    self.solution = ko.observable(self.model.Solution()).extend({
      required: true
    });
    self.longDescription = ko.observable(self.model.LongDescription()).extend({
      required: true
    });
    self.name = self.model.Creator().split(" ");
    self.firstName = ko.observable(self.name[0]).extend({
      required: true
    });
    self.lastName = ko.observable(self.name[1]).extend({
      required: true
    });
    self.creator = ko.computed(function() {
      return self.firstName() + " " + self.lastName();
    });

    self.errors = ko.validation.group(self);

    this.activate = function() {
      logger.log(this.title + ' View Activated', null, this.title, true);
      return true;
    };

    this.close = function(dialogResult) {
      dialog.close(self);
    };

    this.save = function(dialogResult) {
      if (self.canSave()) {
        self.updateModel();
        repository.putIdea(self.model);
        dialog.close(self, dialogResult);
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

    this.updateModel = function() {
      self.model.ShortDescription(self.shortDescription());
      self.model.LongDescription(self.longDescription());
      self.model.Solution(self.solution());
      self.model.Creator(self.creator());
    };
  };


  return ctor;

});