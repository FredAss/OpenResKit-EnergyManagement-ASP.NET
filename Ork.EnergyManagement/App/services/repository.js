define([
    'durandal/system',
    'services/partialMapper',
    'services/logger',
    'services/routeConfig',
    'config'],
  function(system, mapper, logger, routeConfig, config) {

    var getFilteredCatalogs = function(filteredCatalogsObservable) {
      $.getJSON(routeConfig.filteredCatalogsUrl, function(data) {
        return data;
      }).done(function() {
        logger.log('success', null, true);
      }).fail(function() {
        logger.log('error!', null, true);
      });
    };

    //var getCatalogs = function() {
    //  $.getJSON(routeConfig.catalogsUrl, function(data) {
    //    return data;
    //  }).done(function() {
    //    logger.log('success', null, true);
    //  }).fail(function() {
    //    logger.log('error!', null, true);
    //  });
    //};

    var postSelectedCatalogs = function() {
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

    var getCatalogs = function() {

      $.getJSON(routeConfig.catalogsUrl, function(data) {
        $.each(data, function(i, model) {
          var selectableCatalogViewModel = new selectableCatalogVm(model);
          self.selectableCatalogs.push(selectableCatalogViewModel);

        });
      }).done(function() {
        $.getJSON(routeConfig.selectedCatalogsUrl, function(data) {
          $.each(data, function(i, item) {
            var result = ko.utils.arrayFirst(self.selectableCatalogs(), function(element) {
              return item.OrkHubId == element.Id();
            });
            if (result != null) {
              self.selectedCatalogs.push(result);
            }
          });
        }).done(function() {
          $('.chosen-select').chosen();
        });
      });
    };

    var putIdea = function(model) {
      $.ajax({
        url: routeConfig.putIdeasUrl + model.Id(),
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: ko.toJSON(model),
        dataType: "json",
        statusCode: {
          200: function(response) {
            toastr.success("Vorschlag aktualisiert");
          }
        }
      });
    };

    var postIdea = function(model) {
      var newIdea;
      $.post(routeConfig.postIdeasUrl, model, null, "json").done(function(o) {
        newIdea = o;
        toastr.success("Vorschlag hinzugefügt");
      });
      return newIdea;
      //$.ajax({
      //  url: routeConfig.postIdeasUrl,
      //  type: "POST",
      //  contentType: "application/json; charset=utf-8",
      //  data: ko.toJSON(model),
      //  dataType: "json",
      //  statusCode: {
      //    201: function (response) {
      //      toastr.success("Vorschlag hinzugefügt");
      //    }
      //  }
      //});
    };

    var deleteIdea = function(model) {
      $.ajax({
        url: routeConfig.deleteIdeasUrl + model.Id(),
        type: "DELETE",
        success: function(response) {
          toastr.info("Vorschlag gelöscht");
        }
      });
    };

    var deleteMeasure = function(model) {
      $.ajax({
        url: routeConfig.deleteMeasureUrl + model.Id(),
        type: "DELETE",
        success: function(response) {
          toastr.info("Maßnahme gelöscht");
        }
      });
    };

    var repository = {
      getFilteredCatalogs: getFilteredCatalogs,
      getCatalogs: getCatalogs,
      putIdea: putIdea,
      postIdea: postIdea,
      deleteIdea: deleteIdea,
      deleteMeasure: deleteMeasure,
      postSelectedCatalogs: postSelectedCatalogs
    };

    return repository;
  })