define(['knockout'], function(ko) {
  var appTitle = 'Energiemanagement';
  var remoteServiceName = 'api/homes';
  var startModule = 'home';
  var routes = [
     {
       route: ['', 'home'],
       title: 'Home',
       moduleId: 'viewmodels/home',
       nav: true
     },
    {
      route: 'meters',
      title: 'Zähler',
      moduleId: 'viewmodels/meterManagement',
      nav: true
    },
    {
      route: 'meters/:id',
      moduleId: 'viewmodels/meter',
      nav: false
    },
    {
      route: 'measures',
      title: 'Maßnahmen',
      moduleId: 'viewmodels/measureManagement',
      nav: true
    },
    {
      route: 'measures/:id',
      title: 'Maßnahme',
      moduleId: 'viewmodels/measure',
      nav: false
    },
    {
      route: 'ideas',
      title: 'Ideen',
      moduleId: 'viewmodels/ideaManagement',
      nav: true
    },
    {
      route: 'measures/:id',
      title: 'Idee',
      moduleId: 'viewmodels/idea',
      nav: false
    },
   
    {
      route: 'setting',
      title: 'Einstellungen',
      moduleId: 'viewmodels/settingManagement',
      nav: false
    }
  ];

  return {
    appTitle: appTitle,
    debugEnabled: ko.observable(true),
    remoteServiceName: remoteServiceName,
    routes: routes,
    startModule: startModule
  };

});