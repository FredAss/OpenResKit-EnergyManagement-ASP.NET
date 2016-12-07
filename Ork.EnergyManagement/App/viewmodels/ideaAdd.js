define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/repository', 'services/datacontext', 'services/routeConfig'], function(app, dialog, logger, repository, datacontext, routeConfig) {

  var ctor = function() {

    var self = this;
    self.title = 'Vorschlag hinzufügen';

    self.shortDescription = ko.observable().extend({
      required: true,
      minLength: 3
    });
    self.solution = ko.observable().extend({
      required: true
    });
    self.longDescription = ko.observable().extend({
      required: true
    });

    self.firstName = ko.observable().extend({
      required: true
    });
    self.lastName = ko.observable().extend({
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
        self.postIdea(self.createIdea());
        //repository.postIdea(self.createIdea());
        //dialog.close(self, dialogResult);
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

    this.postIdea = function(model) {
      $.post(routeConfig.postIdeasUrl, model, null, "json").done(function(o) {
        dialog.close(self, o);
        toastr.success("Vorschlag hinzugefügt");
      });
    };

    this.createIdea = function() {
      var idea = {
        ShortDescription: self.shortDescription(),
        LongDescription: self.longDescription(),
        Solution: self.solution(),
        Creator: self.creator(),
        Status: 0,
      };
      return idea;
    };
  };


  return ctor;

});