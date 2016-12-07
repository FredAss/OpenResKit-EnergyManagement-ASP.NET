define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/repository', 'services/datacontext', 'services/routeConfig', 'knockout.mapping', 'responsibleSubjectBinding', 'datepickerBinding'], function(app, dialog, logger, repository, datacontext, routeConfig, mapping, responsibleSubjectBinding, datepickerBinding) {

  var ctor = function(idea) {

    var self = this;
    self.title = 'Maßnahme hinzufügen';
    self.name = ko.observable().extend({
      required: true
    });
    self.description = ko.observable().extend({
      required: true
    });
    self.priority = ko.observable(1).extend({
      required: true
    });
    self.dueDate = ko.observable(moment().format('DD.MM.YYYY')).extend({
      required: true
    });
    self.responsibleSubject = ko.observable().extend({
      required: true
    });

    if (idea) {
      self.idea = idea;
      self.name(idea.ShortDescription());
      self.description(idea.LongDescription());
    }

    self.responsibleSubjects = ko.observableArray();
    self.catalogs = ko.observableArray();
    self.selectedCatalog = ko.observable();


    self.errors = ko.validation.group(self);

    this.getName = function(responsibleSubject) {
      if (typeof responsibleSubject.Name == "function") {
        return responsibleSubject.Name();
      } else {
        return responsibleSubject.FirstName() + " " + responsibleSubject.LastName();
      }
    };


    this.activate = function() {
      logger.log(this.title + ' View Activated', null, this.title, true);

      return true;
    };

    this.compositionComplete = function(view, parent) {
      self.getCatalogs();
      self.getResponsibleSubjects();
      $('#datepickerGroup .input-group.date').datepicker({
        todayBtn: "linked",
        language: "de",
        autoclose: true,
        todayHighlight: true
      }).on("changeDate", function(ev) {
        self.dueDate(ev.date);
      });
    };

    this.close = function(dialogResult) {
      dialog.close(self);
    };

    this.save = function(dialogResult) {
      if (self.canSave()) {
        self.postMeasure(self.createMeasure());
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

    this.postMeasure = function(model) {
      $.ajax({
        url: routeConfig.postMeasureUrl,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: ko.toJSON(model),
        dataType: "json"
      }).done(function(result) {
        if (self.idea) {
          self.idea.Status(1);
        }
        dialog.close(self, result, model.CatalogId);
        toastr.success("Maßnahme hinzugefügt");
      });
    };

    this.getResponsibleSubjects = function() {
      $.getJSON(routeConfig.responsibleSubjectsUrl, function(data) {
        mapping.fromJS(data, {}, self.responsibleSubjects);
      }).done(function() {
        self.responsibleSubject(self.responsibleSubjects()[0]);
      });
    };

    this.getCatalogs = function() {
      $.getJSON(routeConfig.filteredCatalogsUrl, function(data) {
        mapping.fromJS(data, {}, self.catalogs);
      }).done(function() {
      });

    };

    this.createMeasure = function() {

      var measure = {
        Name: self.name(),
        Description: self.description(),
        Priority: self.priority(),
        DueDate: moment(self.dueDate(), 'DD.MM.YYYY').add('h', 2),
        IdeaId: null,
        ResponsibleSubject: self.responsibleSubject(),
        CatalogId: self.selectedCatalog().Id()
      };

      if (self.idea) {
        measure.IdeaId = self.idea.Id();
      }

      return measure;
    };
  };


  return ctor;

});