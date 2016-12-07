define(['durandal/app', 'services/logger'], function(app, logger) {

  var ctor = function(model) {
    this.id = model.Id;
    this.name = model.Name;
    this.orkHubId = model.Id;
  };

  return ctor;
})