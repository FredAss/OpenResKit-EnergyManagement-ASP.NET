define(['durandal/app', 'plugins/dialog', 'knockout', 'knockout.mapping', 'services/logger', 'services/routeConfig', 'services/repository', 'measureStatusBinding', 'priorityBinding', 'dateBinding', 'dueDateBinding', 'responsibleSubjectBinding', 'viewmodels/measureAdd', 'viewmodels/measureEdit'], function(app, dialog, ko, mapping, logger, routeConfig, repository, statusBinding, priorityBinding, dateBinding, dueDateBinding, responsibleSubjectBinding, measureAddVm, measureEditVm) {


  var title = 'Maßnahmenmanagement';
  var catalogs = ko.observableArray();
  var selectedCatalog = ko.observable();


  //#region Internal Methods

  var activate = function() {
    moment.lang('de');
    var self = this;
    self.getCatalogs();
    logger.log('Maßnahmen werden geladen!', null, title, true);
    
  };

  var compositionComplete = function () {
    initializeTablesorter();
  };

  var getDueDate = function(dueDate, state) {
    var stateUnwrapped = ko.utils.unwrapObservable(state);
    var dueDateUnwrapped = ko.utils.unwrapObservable(dueDate);
    var date = moment(dueDateUnwrapped);


    if (date.isValid()) {
      if (moment().diff(date, 'days') > 0 && stateUnwrapped != 2) {
        var htmlString = '<span class="glyphicon glyphicon-warning-sign" data-toggle="tooltip" title="Planungsdatum ist bereits überschritten!"></span>';
        return date.format('L') + " " + htmlString;
      } else {
        return date.format('L');
      }
    } else {
      return "";
    }
  };

  var getCatalogs = function() {
    var self = this;
    $.getJSON(routeConfig.filteredCatalogsUrl, function(data) {
      mapping.fromJS(data, {}, self.catalogs);
      if (self.catalogs() !== null) {
        ko.utils.arrayForEach(self.catalogs(), function(catalog) {
          ko.utils.arrayForEach(catalog.Measures(), function(measure) {
            measure.ResponsibleSubject = ko.observable(measure.ResponsibleSubject);
          });
        });
      }
    }).done(function () {
      if (self.catalogs() !== null) {
        self.selectedCatalog(self.catalogs()[0]);
      }
    });

  };

  var addMeasure = function() {
    var self = this;
    return dialog.show(new measureAddVm())
      .then(function(dialogResult, catalogId) {
        if (dialogResult) {
          var measureVm = mapping.fromJS(dialogResult);
          var catalog = ko.utils.arrayFirst(self.catalogs(), function(catalog) {
            return catalog.Id() === catalogId;
          });
          catalog.Measures.push(measureVm);
        }
        //do something with the dialog result here
      });
  };

  var editMeasure = function(measure) {
    return dialog.show(new measureEditVm(measure))
      .then(function(dialogResult) {
      });
  };


  var deleteMeasure = function(measure) {
    return app.showMessage('Möchten Sie die Maßnahme wirklich löschen?', 'Maßnahme löschen', ['Löschen', 'Abbrechen']).then(function(dialogResult) {
      if (dialogResult == 'Löschen') {
        repository.deleteMeasure(measure);
        selectedCatalog().Measures.remove(measure);
      }
    });
  };

  var onCatalogClick = function(data) {
    selectedCatalog(data);
  };

  var initializeTablesorter = function() {
    $("#measuresTable").tablesorter({
      headers: {
        7: {
          sorter: false
        }
      }
    });


  };

  var deactivate = function() {

  };

  var vm = {
    activate: activate,
    deactivate: deactivate,
    addMeasure: addMeasure,
    editMeasure: editMeasure,
    deleteMeasure: deleteMeasure,
    compositionComplete: compositionComplete,

    getCatalogs: getCatalogs,
    getDueDate: getDueDate,
    title: title,
    catalogs: catalogs,
    selectedCatalog: selectedCatalog,
    onCatalogClick: onCatalogClick
  };

  return vm;
//#endregion
});