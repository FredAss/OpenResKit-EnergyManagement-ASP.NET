define(['durandal/app', 'services/logger', 'plugins/dialog', 'services/datacontext', 'services/routeConfig', 'knockout.mapping', 'viewmodels/aimAdd', 'viewmodels/aimEdit'], function (app, logger, dialog, datacontext, routeConfig, mapping, aimAddVm, aimEditVm) {
  var title = 'Home';
 
  var energyStrategy = ko.observable();
  var energyAims = ko.observableArray();
  var ideas = ko.observableArray();
  var editing = ko.observable(false);
  var numberOfNewIdeas = ko.observable();
  var numberOfUnfinishedMeasures = ko.observable();
  

    //#region Internal Methods
  var activate = function() {
      var self = this;
      datacontext.getEnergyAims(self.energyAims, true);
     
      datacontext.getEnergyStrategy(self.energyStrategy, true);
      logger.log('Daten werden geladen!', null, title, true);
    }

  var compositionComplete = function() {
    getIdeas();
    getCatalogs();
  };
  
  
    var editStrategy = function() {
     editing(true);
    }
  
    var editAim = function (aim) {
      return dialog.show(new aimEditVm(aim))
      .then(function (dialogResult) {
      });
    }
  
    var getIdeas = function () {

      $.ajax(routeConfig.ideasUrl, {
        async: false,
        dataType: "json",
        success: success
      });

      function success(data) {
        // mapping.fromJS(data, {}, ideas);
        var number = 0;
        for (var i in data) {
          if (data[i].Status === 0) {
            number++;
          }
        }
        numberOfNewIdeas(number);
      };
    };
 
    var getCatalogs = function () {
      var self = this;
      $.getJSON(routeConfig.filteredCatalogsUrl, {
        async: false,
        dataType: "json"
        //success: success
      }).done(success);

      function success(data) {
        var number = 0;
        for (var i in data) {
          var measures = data[i].Measures;
          for (var j in measures) {
            if (measures[j].Status != 2) {
              number++;
            }
          }      
        }
        numberOfUnfinishedMeasures(number);
      };
    };

    var deleteAim = function (aim) {
    
      return app.showMessage('Möchten Sie das Energieziel wirklich löschen?', 'Ziel löschen', ['Löschen', 'Abbrechen']).then(function (dialogResult) {
        if (dialogResult == 'Löschen') {
          aim.entityAspect.setDeleted(aim);
          energyAims.remove(aim);
          return datacontext.saveChanges().fin(complete);

          function complete() {
            toastr.success("Ziel gelöscht");
          }
        }
      });
    }

    var addAim = function () {
      var self = this;
      return dialog.show(new aimAddVm())
       .then(function (dialogResult) {
         datacontext.getEnergyAims(self.energyAims, true);
       });
    }

    var save = function () {
      return datacontext.saveChanges().fin(complete);

      function complete() {
        toastr.success("Daten aktualisiert");
        editing(false);
      }
     
    }
  
    var vm = {
      activate: activate,
      compositionComplete: compositionComplete,
      title: title,
      energyStrategy: energyStrategy,
      energyAims: energyAims,
      editing: editing,
      save: save,
      editAim: editAim,
      deleteAim: deleteAim,
      addAim: addAim,
      editStrategy: editStrategy,
      getIdeas: getIdeas,
      getCatalogs: getCatalogs,
      numberOfNewIdeas: numberOfNewIdeas,
      numberOfUnfinishedMeasures: numberOfUnfinishedMeasures
    };

    return vm;
    //#endregion
});