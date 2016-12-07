define(['durandal/app', 'plugins/dialog', 'services/logger', 'services/repository', 'services/datacontext', 'services/routeConfig', 'knockout.mapping', 'responsibleSubjectBinding', 'datepickerBinding', 'starRatingBinding'], function(app, dialog, logger, repository, datacontext, routeConfig, mapping, responsibleSubjectBinding, datepickerBinding, starRatingBinding) {

  var ctor = function(measure) {

    var self = this;
    self.model = measure;
    self.title = 'Maßnahme bearbeiten';
    self.name = ko.observable(self.model.Name()).extend({
      required: true
    });
    self.description = ko.observable(self.model.Description()).extend({
      required: true
    });

    self.evaluation = ko.observable(self.model.Evaluation());
    self.evaluationRating = ko.observable(self.model.EvaluationRating());
    self.priority = ko.observable(self.model.Priority()).extend({
      required: true
    });
    self.dueDate = ko.observable(moment(self.model.DueDate()).format('DD.MM.YYYY')).extend({
      required: true
    });
    self.entryDate = ko.observable();
    if (moment(self.model.EntryDate()).isValid()) {
      self.entryDate(moment(self.model.EntryDate()).format('DD.MM.YYYY'));
    }
    self.isEditable = ko.observable(true);
    self.status = ko.observable();
    self.status.subscribe(function(value) {
      if (value == 2) {
        self.isEditable(false);
      } else {
        self.isEditable(true);
      }
    });


    self.responsibleSubject = ko.observable();

    self.responsibleSubjects = ko.observableArray();

    self.selectedCatalog = ko.observable();


    self.errors = ko.validation.group(self);

    this.getName = function(responsibleSubject) {
      if (typeof responsibleSubject.Name == "function") {
        return responsibleSubject.Name();
      } else {
        return responsibleSubject.FirstName() + " " + responsibleSubject.LastName();
      }
    };


    this.rate = function(data, index, foo) {
      var observable = data(); // Get the associated observable

      if (self.isEditable()) {
        observable((index * 0.2) + 0.2); // Write the new rating to it
      }
    };

    this.activate = function() {
      logger.log(this.title + ' View Activated', null, this.title, true);

      return true;
    };

    this.compositionComplete = function(view, parent) {

      self.getResponsibleSubjects();


      $('#dueDateDatepicker').datepicker({
        todayBtn: "linked",
        language: "de",
        autoclose: true,
        todayHighlight: true
      }).on("changeDate", function(ev) {
        self.dueDate(ev.date);
      });


      $('#entryDateDatepicker').datepicker({
        todayBtn: "linked",
        language: "de",
        autoclose: true,
        todayHighlight: true
      }).on("changeDate", function(ev) {

        self.entryDate(ev.date);
      });
      self.status(self.model.Status());
    };

    this.close = function(dialogResult) {
      dialog.close(self);
    };

    this.save = function(dialogResult) {
      if (self.canSave()) {
        self.putMeasure(self.updateMeasure());
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

    this.putMeasure = function(measure) {
      $.ajax({
        url: routeConfig.putMeasureUrl + measure.Id,
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: ko.toJSON(measure),
        dataType: "json"
      }).done(function(result) {
        self.model.Name(result.Name);
        self.model.Description(result.Description);
        self.model.Evaluation(result.Evaluation);
        self.model.EvaluationRating(result.EvaluationRating);
        self.model.Priority(result.Priority);
        self.model.Status(result.Status);
        self.model.DueDate(result.DueDate);
        self.model.EntryDate(result.EntryDate);
        self.model.CreationDate(result.CreationDate);
        self.model.ResponsibleSubject(mapping.fromJS(result.ResponsibleSubject));
        self.model.MeasureImageSource = mapping.fromJS(result.MeasureImageSource);
        self.model.AttachedDocuments(result.AttachedDocuments);
        dialog.close(self, result);
        toastr.success("Maßnahme bearbeitet");
      });

    };

    this.getResponsibleSubjects = function() {
      $.getJSON(routeConfig.responsibleSubjectsUrl, function(data) {
        mapping.fromJS(data, {}, self.responsibleSubjects);
      }).done(function() {
        var result = ko.utils.arrayFirst(self.responsibleSubjects(), function(element) {
          return element.Id() == self.model.ResponsibleSubject().Id();
        });
        if (result != null) {
          self.responsibleSubject(result);
        }
      });
    };


    this.updateMeasure = function() {

      var entryDate = moment(self.entryDate(), 'DD.MM.YYYY').add('h', 2);

      var measure = {
        Id: self.model.Id(),
        Name: self.name(),
        Description: self.description(),
        Evaluation: self.evaluation(),
        EvaluationRating: self.evaluationRating(),
        Priority: self.priority(),
        Status: self.status(),
        DueDate: moment(self.dueDate(), 'DD.MM.YYYY').add('h', 2),
        CreationDate: self.model.CreationDate(),
        ResponsibleSubjectId: self.responsibleSubject().Id(),
        MeasureImageSource: self.model.MeasureImageSource,
        AttachedDocuments: self.model.AttachedDocuments(),
      };
      if (entryDate.isValid()) {
        measure.EntryDate = entryDate;
      }
      return measure;
    };
  };


  return ctor;

});