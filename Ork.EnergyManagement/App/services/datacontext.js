define([
    'durandal/system',
    'services/logger',
    'services/partialMapper',
    'services/model',
    'config'],
  function(system, logger, mapper, model, config) {

    var orderBy = model.orderBy; // this contains order definitions for all entity types
    var entityNames = model.entityNames;
    var EntityQuery = breeze.EntityQuery;
    var manager = configureBreezeManager();
    var hasChanges = ko.observable(false);

    manager.hasChangesChanged.subscribe(function(eventArgs) {
      hasChanges(eventArgs.hasChanges);
    });

    var getEnergyAims = function(energyAimsObservable, forceRemote) {

      var query = EntityQuery.from('EnergyAims');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {

        energyAimsObservable(data.results);

        logger.info('Retrieved [EnergyAims] from remote data source',
          data, true);
      }

    };

    var createAim = function() {
      return manager.createEntity(entityNames.energyAim);
    };

    var getEnergyStrategy = function(energyStrategyObservable, forceRemote) {

      var query = EntityQuery.from('EnergyStrategy');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {

        energyStrategyObservable(data.results[0]);

        logger.info('Retrieved [EnergyStrategy] from remote data source',
          data, true);
      }

    };

    var getSettingById = function(settingId, settingObservable) {
      // 1st - fetchEntityByKey will look in local cache 
      // first (because 3rd parm is true) 
      // if not there then it will go remote
      return manager.fetchEntityByKey(
        entityNames.setting, settingId, true)
        .then(fetchSucceeded)
        .fail(queryFailed);

      // 2nd - Refresh the entity from remote store (if needed)

      function fetchSucceeded(data) {
        var s = data.entity;
        return s.isPartial() ? refreshSetting(s) : settingObservable(s);
      }

      function refreshSetting(setting) {
        return EntityQuery.fromEntities(setting)
          .using(manager).execute()
          .then(querySucceeded)
          .fail(queryFailed);
      }

      function querySucceeded(data) {
        var s = data.results[0];
        s.isPartial(false);
        log('Retrieved [Setting] from remote data source', s, true);
        return settingObservable(s);
      }

    };

    var getSetting = function(settingObservable, forceRemote) {

      var query = EntityQuery.from('Settings');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {

        settingObservable(data.results[0]);

        logger.info('Retrieved [Settings] from remote data source',
          data, true);
      }


    };

    var getSelectedCatalogs = function(catalogsObservable, forceRemote) {
      var query = EntityQuery.from('SelectedCatalogs')
        .select('id, name, orkHubId');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {
        var list = mapper.mapDtosToEntities(
          manager, data.results, entityNames.selectedCatalog, 'id');
        if (catalogsObservable) {
          catalogsObservable(list);
        }
        log('Retrieved [SelectedCatalogs] from remote data source',
          data, true);
      }
    };


    var cancelChanges = function() {
      manager.rejectChanges();
      logger.info('Canceled changes', null, true);
    };

    var saveChanges = function() {
      return manager.saveChanges()
        .then(saveSucceeded)
        .fail(saveFailed);

      function saveSucceeded(saveResult) {
        logger.info('Saved data successfully', saveResult, true);
      }

      function saveFailed(error) {
        var msg = 'Save failed: ' + getErrorMessages(error);
        logger.error(msg, error);
        error.message = msg;
        throw error;
      }
    };


    // internal funtions ------------------------------------------------------

    function getLocal(resource, ordering) {
      var query = EntityQuery.from(resource)
        .orderBy(ordering);

      return manager.executeQueryLocally(query);
    }

    function configureBreezeManager() {
      breeze.NamingConvention.camelCase.setAsDefault();
      var mgr = new breeze.EntityManager(config.remoteServiceName);
      model.configureMetadataStore(mgr.metadataStore);
      return mgr;
    }

    function getErrorMessages(error) {
      var msg = error.message;
      if (msg.match(/validation error/i)) {
        return getValidationMessages(error);
      }
      return msg;
    }

    function getValidationMessages(error) {
      try {
        //foreach entity with a validation error
        return error.entitiesWithErrors.map(function(entity) {
          // get each validation error
          return entity.entityAspect.getValidationErrors().map(function(valError) {
            // return the error message from the validation
            return valError.errorMessage;
          }).join('; <br/>');
        }).join('; <br/>');
      } catch(e) {
      }
      return 'validation error';
    }

    function queryFailed(error) {
      var msg = 'Error retreiving data. ' + error.message;
      logger.error(msg, error);
      throw error;
    }

    // the datacontext -----------------------------------------------------

    var datacontext = {
      hasChanges: hasChanges,
      getEnergyAims: getEnergyAims,
      getEnergyStrategy: getEnergyStrategy,
      getSelectedCatalogs: getSelectedCatalogs,
      getSetting: getSetting,
      createAim: createAim,
      getSettingById: getSettingById,
      cancelChanges: cancelChanges,
      saveChanges: saveChanges
    };

    return datacontext;
  });