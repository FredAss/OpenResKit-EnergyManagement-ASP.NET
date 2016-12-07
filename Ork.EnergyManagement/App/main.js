// Maps the files so Durandal knows where to find these.
require.config({
  baseUrl: 'App',
  paths: {
    'config': '../config',
    'text': '../Scripts/text',
    'durandal': '../Scripts/durandal',
    'plugins': '../Scripts/durandal/plugins',
    'transitions': '../Scripts/durandal/transitions',
    'knockout.mapping': '../Scripts/knockout.mapping-latest.debug',
    'knockout.validation': '../Scripts/knockout.validation',
    'moment': '../Scripts/moment',
    'moment-with-langs': '../Scripts/moment-with-langs', 
    'measureStatusBinding': '../Scripts/knockout.bindings/measureStatus',
    'ideaStatusBinding': '../Scripts/knockout.bindings/ideaStatus',
    'starRatingBinding': '../Scripts/knockout.bindings/starRating',
    'priorityBinding': '../Scripts/knockout.bindings/priority',
    'dateBinding': '../Scripts/knockout.bindings/date',
    'datepickerBinding': '../Scripts/knockout.bindings/datepicker',
    'dueDateBinding': '../Scripts/knockout.bindings/dueDate',
    'substringBinding': '../Scripts/knockout.bindings/substring',
    'responsibleSubjectBinding': '../Scripts/knockout.bindings/responsibleSubject',
    'raphael': '../Scripts/raphael-min',
    'morris': '../Scripts/morris',
  }  
});

// Durandal 2.x assumes no global libraries. It will ship expecting 
// Knockout and jQuery to be defined with requirejs. .NET 
// templates by default will set them up as standard script
// libs and then register them with require as follows: 
define('jquery', function () { return jQuery; });
define('knockout', ko);

//define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'plugins/router', 'services/logger'], boot);

//function boot (app, viewLocator, system, router, logger) {

//    // Enable debug message to show in the console 
//    system.debug(true);

//    app.title = config.title;

//    app.configurePlugins({
//        router: true
//    });
    
//    app.start().then(function () {
//        toastr.options.positionClass = 'toast-bottom-right';
//        toastr.options.backgroundpositionClass = 'toast-bottom-right';

//        // When finding a viewmodel module, replace the viewmodel string 
//        // with view to find it partner view.
//        // [viewmodel]s/sessions --> [view]s/sessions.html
//        // Defaults to viewmodels/views/views. 
//        // Otherwise you can pass paths for modules, views, partials
//        viewLocator.useConvention();
        
//        //Show the app by setting the root view model for our application.
//        app.setRoot('viewmodels/shell', 'entrance');
//    });
//};

define(['durandal/system',
    'durandal/app',
    'durandal/viewLocator',
    'config'],
  function (system,
    app,
    viewLocator,
    config, moment) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = config.appTitle;

    app.configurePlugins({
      router: true,
      dialog: true,
      widget: true
    });

    
    app.start().then(function () {
      //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
      //Look for partial views in a 'views' folder in the root.
      viewLocator.useConvention();

      //Show the app by setting the root view model for our application with a transition.
      app.setRoot('viewmodels/shell', 'entrance');
    });
  });