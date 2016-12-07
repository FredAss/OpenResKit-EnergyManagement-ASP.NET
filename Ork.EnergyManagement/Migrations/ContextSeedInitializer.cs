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

using System.Data.Entity;
using System.Data.Entity.Migrations;
using Ork.EnergyManagement.Models;

namespace Ork.EnergyManagement.Migrations
{
  internal sealed class ContextSeedInitializer : CreateDatabaseIfNotExists<ApplicationDbContext>
  {
    protected override void Seed(ApplicationDbContext context)
    {
     
      var energyAim1 = new EnergyAim
                       {
                         ShortAim = "Wirksamkeit von Maßnahmen überprüfen",
                         LongAim =
                           "Die Methode zur Ermittlung von Energieaspekten ist in regelmäßigen Zeitabständen anzuwenden und kann auch im Sinne einer Überprüfung von Energieaspekten genutzt werden. Die Ergebnisse der Anwendung der Methode sind in geeigneter Form zu dokumentieren."
                       };
      var energyAim2 = new EnergyAim
                       {
                         ShortAim = "Erarbeiten von differenzierten Daten",
                         LongAim = "Differenzierte Daten über den Energiebedarf von Anlagen und Maschinen zu sammeln und als Basis für Analysen und Bewertungen"
                       };
      var energyAim3 = new EnergyAim
                       {
                         ShortAim = "Langfristige Verbrauchstrends aufzuzeigen",
                         LongAim = "Langfristige Verbrauchstrends aufzuzeigen."
                       };
      var energyAim4 = new EnergyAim
                       {
                         ShortAim = "Energiekosten einzelnen Produkten zuordnen",
                         LongAim = ""
                       };
      var energyAim5 = new EnergyAim
                       {
                         ShortAim = "Benchmarks generieren",
                         LongAim = ""
                       };

      var energyStrategy = new EnergyStrategy
                           {
                             Strategy =
                               "Die Realisierung der Energiepolitik erfolgt durch Implementierung eines vollständigen Energiemanagementsystems in welchem der Energieverbrauch systematisch evaluiert wird die Energieströme aufgezeichnet und auf aktuellem Stand gehalten werden, Energiesparmaßnahmen geplant und eingeführt werden, die Ergebnisse der Energiesparmaßnahmen in regelmäßigen Abständen evaluiert werden,  die geplanten Aktivitäten zur Verbesserung der Energieeffizienz kontinuierlich auf den neuesten Stand gebracht werden."
                           };

      var setting = new Setting
                    {
                      ServerUrl = "localhost",
                      ServerPort = 7000,
                      User = "root",
                      Password = "ork123"
                    };

      context.Settings.AddOrUpdate(setting);
      context.EnergyAims.AddOrUpdate(energyAim1);
      context.EnergyAims.AddOrUpdate(energyAim2);
      context.EnergyAims.AddOrUpdate(energyAim3);
      context.EnergyAims.AddOrUpdate(energyAim4);
      context.EnergyAims.AddOrUpdate(energyAim5);
      context.EnergyStrategies.AddOrUpdate(energyStrategy);
      context.SaveChanges();
    }
  }
}