define(function() {

  var routes = {
    
    //Ork domain
    catalogsUrl: "/api/catalogs/getCatalogs/",
    responsibleSubjectsUrl: "/api/catalogs/getResponsibleSubjects/",
    filteredCatalogsUrl: "/api/catalogs/getFilteredCatalogs/",
    selectedCatalogsUrl: "/api/catalogs/getSelectedCatalogs/",
    postSelectedCatalogsUrl: "/api/catalogs/postSelectedCatalog/",
    postMeasureUrl: "/api/catalogs/post",
    putMeasureUrl: "/api/catalogs/put/",
    deleteMeasureUrl: "/api/catalogs/delete/",

    ideasUrl: "api/ideas/get",
    putIdeasUrl: "api/ideas/put/",
    postIdeasUrl: "api/ideas/post",
    deleteIdeasUrl: "api/ideas/delete/",

    metersUrl: "/api/meters/getMeters",
    readingsUrl: "/api/meters/readings/",
  };

  return routes;

});