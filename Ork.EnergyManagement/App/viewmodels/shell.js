define(['durandal/system', 'durandal/app', 'plugins/dialog', 'plugins/router', 'services/logger', 'config', 'viewmodels/settingManagement'],
    function (system, app,dialog, router, logger, config, settingManagmentVm) {
        var shell = {
            activate: activate,
            router: router,
            showSetting: showSetting
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
          app.title = config.appTitle;
            return boot();
        }

        function boot() {
          
          log(config.appTitle + ' wird geladen!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

           
            router.map(config.routes).buildNavigationModel();
            return router.activate(config.startModule);
        }
      


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
      //#endregion
      
        function showSetting() {
          return dialog.show(new settingManagmentVm())
            .then(function (dialogResult) {
              //do something with the dialog result here
            });
        };
    });