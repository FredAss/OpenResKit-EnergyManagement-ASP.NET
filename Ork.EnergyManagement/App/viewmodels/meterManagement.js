define(['durandal/app', 'plugins/dialog', 'knockout', 'knockout.mapping', 'services/logger', 'services/routeConfig', 'services/repository', 'dateBinding'], function(app, dialog, ko, mapping, logger, routeConfig, repository, dateBinding) {

  var title = 'Zählermanagement';
  var meters = ko.observableArray();
  var meterReadings = ko.observableArray();
  var selectedMeter = ko.observable();

  selectedMeter.subscribe(function(data) {
    getMeterReadings(data.Id());
  });

  //#region Internal Methods

  var activate = function() {
    moment.lang('de');
    logger.log('Zählerdaten werden geladen!', null, title, true);
    getMeters();
    return true;
  };

  var compositionComplete = function(view, parent) {
    //generateChart();
  };

  var getMeters = function() {

    $.getJSON(routeConfig.metersUrl, function(data) {
      mapping.fromJS(data, {}, meters);
    }).done(function() {
      selectedMeter(meters()[0]);
    });
  };

  var getMeterReadings = function(id) {

    $.getJSON(routeConfig.readingsUrl + id, function(data) {
      mapping.fromJS(data, {}, meterReadings);
    }).done(generateChart);
  };

  var generateChart = function() {
    var elementId = "chart";
    document.getElementById(elementId).innerHTML = '';
    var unmapped = mapping.toJS(meterReadings);

    unmapped.forEach(function(r) {
      r.Date = moment(r.EntryDate.End).format('YYYY-MM-DD');
    });


    Morris.Line({
      element: elementId,
      data: unmapped,
      xkey: 'Date',
      ykeys: ['CounterReading'],
      labels: [],
      hoverCallback: selectReading
      //labels: ['Wert in ' + selectedMeter().Unit()]
    });
  };

  var selectReading = function(index, options, content) {
    index = options.data.length - 1 - index;
    return options.data[index].CounterReading + ' ' + selectedMeter().Unit() + ' (' + options.data[index].Date + ')';
  };

  var onMeterClick = function(data) {
    selectedMeter(data);
  };


  var deactivate = function() {
  };

  var vm = {
    activate: activate,
    compositionComplete: compositionComplete,
    deactivate: deactivate,
    onMeterClick: onMeterClick,
    getMeters: getMeters,
    getMeterReadings: getMeterReadings,
    generateChart: generateChart,
    title: title,
    meters: meters,
    meterReadings: meterReadings,
    selectedMeter: selectedMeter,
    selectReading: selectReading
  };

  return vm;
  //#endregion
});