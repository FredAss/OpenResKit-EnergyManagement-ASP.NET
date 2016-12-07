#region License

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at
//  
// http://www.apache.org/licenses/LICENSE-2.0.html
//  
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  
// Copyright (c) 2013, HTW Berlin

#endregion

using System.Linq;
using System.Web.Http;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;
using Ork.EnergyManagement.Models;

namespace Ork.EnergyManagement.Controllers
{
  [BreezeController]
  public class HomesController : ApiController
  {
    private readonly EFContextProvider<ApplicationDbContext> _contextProvider = new EFContextProvider<ApplicationDbContext>();

    [HttpGet]
    public string Metadata()
    {
      return _contextProvider.Metadata();
    }

    [HttpPost]
    public SaveResult SaveChanges(JObject saveBundle)
    {
      return _contextProvider.SaveChanges(saveBundle);
    }

    [HttpGet]
    public IQueryable<EnergyAim> EnergyAims()
    {
      return _contextProvider.Context.EnergyAims;
    }

    [HttpGet]
    public IQueryable<EnergyStrategy> EnergyStrategy()
    {
      return _contextProvider.Context.EnergyStrategies;
    }

    [HttpGet]
    public IQueryable<Setting> Settings()
    {
      return _contextProvider.Context.Settings;
    }

    [HttpGet]
    public IQueryable<SelectedCatalog> SelectedCatalogs()
    {
      return _contextProvider.Context.SelectedCatalogs;
    }
  }
}