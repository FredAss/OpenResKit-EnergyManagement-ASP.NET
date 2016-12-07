define(['durandal/app', 'plugins/dialog', 'knockout', 'knockout.mapping', 'services/logger', 'services/routeConfig', 'services/repository', 'ideaStatusBinding', 'substringBinding', 'dateBinding', 'viewmodels/ideaAdd', 'viewmodels/ideaEdit', 'viewmodels/measureAdd'], function(app, dialog, ko, mapping, logger, routeConfig, repository, statusBinding, substringBinding, dateBinding, ideaAddVm, ideaEditVm, measureAddVm) {


  var title = 'Ideenmanagement';
  var ideas = ko.observableArray();
  var self = this;


  //#region Internal Methods

  var activate = function() {
    moment.lang('de');
    var self = this;
    self.getIdeas();
    logger.log('Vorschläge werden geladen!', null, title, true);
  };

  var compositionComplete = function(view, parent) {
    initializeTablesorter();
  };

  var getIdeas = function() {
    var self = this;
    $.getJSON(routeConfig.ideasUrl, function(data) {
      mapping.fromJS(data, {}, self.ideas);
    });

  };


  var initializeTablesorter = function() {
    $("#ideaTable").tablesorter({
      headers: {
        5: {
          sorter: false
        }
      }
    });
  };

  var deactivate = function() {

  };

  var addIdea = function() {
    return dialog.show(new ideaAddVm())
      .then(function(dialogResult) {
        if (dialogResult) {
          var ideaVm = mapping.fromJS(dialogResult);
          ideas.push(ideaVm);
        }
        //do something with the dialog result here
      });
  };

  var editIdea = function(idea) {
    return dialog.show(new ideaEditVm(idea))
      .then(function(dialogResult) {

        //do something with the dialog result here
      });
  };

  var rejectIdea = function(idea) {
    return app.showMessage('Möchten Sie den Vorschlag wirklich ablehnen?', 'Vorschlag ablehnen', ['Ablehnen', 'Abbrechen']).then(function(dialogResult) {
      if (dialogResult == 'Ablehnen') {
        idea.Status(2);
        repository.putIdea(idea);
      }
    });
  };
  var deleteIdea = function(idea) {
    return app.showMessage('Möchten Sie den Vorschlag wirklich löschen?', 'Vorschlag löschen', ['Löschen', 'Abbrechen']).then(function(dialogResult) {
      if (dialogResult == 'Löschen') {
        repository.deleteIdea(idea);
        ideas.remove(idea);
      }
    });
  };


  var createMeasure = function(idea) {
    return dialog.show(new measureAddVm(idea))
      .then(function(dialogResult) {

        //do something with the dialog result here
      });
  };

  var vm = {
    addIdea: addIdea,
    editIdea: editIdea,
    rejectIdea: rejectIdea,
    deleteIdea: deleteIdea,
    createMeasure: createMeasure,
    compositionComplete: compositionComplete,
    activate: activate,
    deactivate: deactivate,
    initializeTablesorter: initializeTablesorter,
    getIdeas: getIdeas,
    title: title,
    ideas: ideas
  };

  return vm;
  //#endregion
});