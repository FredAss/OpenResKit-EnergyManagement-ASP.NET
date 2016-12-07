define(['config', 'durandal/system', 'services/logger'],
  function(config, system, logger) {

    var orderBy = {
      selectedCatalog: 'id',
      energyAim: 'id',
      energyStrategy: 'id',
      setting: 'id'
    };

    var entityNames = {
      selectedCatalog: 'SelectedCatalog',
      setting: 'Setting',
      energyAim: 'EnergyAim',
      energyStrategy: 'EnergyStrategy'
    };

    var model = {
      configureMetadataStore: configureMetadataStore,
      entityNames: entityNames,
      orderBy: orderBy
    };

    return model;

    //#region Internal Methods

    function configureMetadataStore(metadataStore) {
      metadataStore.registerEntityTypeCtor(
        'SelectedCatalog', function() { this.isPartial = false; }, selectedCatalogInitializer);
      metadataStore.registerEntityTypeCtor(
        'Setting', function() { this.isPartial = false; }, settingInitializer);
      metadataStore.registerEntityTypeCtor(
        'EnergyAim', function() { this.isPartial = false; });
      metadataStore.registerEntityTypeCtor(
        'EnergyStrategy', function() { this.isPartial = false; });
    }

    function selectedCatalogInitializer(selectedCatalog) {

    }

    function settingInitializer(setting) {

    }

    function log(msg, data, showToast) {
      logger.log(msg, data, system.getModuleId(model), showToast);
    }

//#endregion
  });