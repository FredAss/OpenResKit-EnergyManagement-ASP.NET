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

using System.ComponentModel.Composition;
using System.Data.Entity;
using Ork.EnergyManagement.Migrations;

namespace Ork.EnergyManagement.Models
{
  [Export(typeof (IApplicationDbContext))]
  public class ApplicationDbContext : DbContext, IApplicationDbContext
  {
    public ApplicationDbContext()
      : base("Ork.EnergyManagement")
    {
      Database.SetInitializer(new ContextSeedInitializer());
    }

    public IDbSet<SelectedCatalog> SelectedCatalogs { get; set; }
    public IDbSet<EnergyStrategy> EnergyStrategies { get; set; }
    public IDbSet<EnergyAim> EnergyAims { get; set; }
    public IDbSet<Setting> Settings { get; set; }
  }
}