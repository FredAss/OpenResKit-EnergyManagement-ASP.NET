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

using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Data.Services.Client;
using Ork.EnergyManagement.DomainModelService;

namespace Ork.EnergyManagement.Repositories
{
  [Export(typeof (IMeterRepository))]
  internal class MeterRepository : IMeterRepository
  {
    private readonly Func<DomainModelContext> m_CreateMethod;
    private DomainModelContext m_Context;

    [ImportingConstructor]
    public MeterRepository([Import] ISettingsProvider settingsContainer, [Import] Func<DomainModelContext> createMethod)
    {
      m_CreateMethod = createMethod;
      settingsContainer.ConnectionStringUpdated += (s, e) => Initialize();
      HasConnection = true;
      Initialize();
    }

    public IEnumerable<EntityDescriptor> Entities
    {
      get { return m_Context.Entities; }
    }

    public bool HasConnection { get; private set; }

    public IEnumerable<LinkDescriptor> Links
    {
      get { return m_Context.Links; }
    }

    public DataServiceQuery<Map> Maps { get; private set; }
    public DataServiceQuery<ResponsibleSubject> ResponsibleSubjects { get; private set; }
    public DataServiceQuery<Series> Series { get; private set; }
    public DataServiceQuery<ScheduledTask> MeterReadings { get; private set; }

    public DataServiceQuery<Meter> Meters { get; private set; }
    public event EventHandler ContextChanged;
    public event EventHandler SaveCompleted;

    public void DeleteObject(object objectToDelete)
    {
      m_Context.DeleteObject(objectToDelete);
    }

    public void Save()
    {
      if (m_Context.ApplyingChanges)
      {
        return;
      }

      var result = m_Context.BeginSaveChanges(SaveChangesOptions.Batch, r =>
                                                                        {
                                                                          var dm = (DomainModelContext) r.AsyncState;
                                                                          dm.EndSaveChanges(r);
                                                                          RaiseEvent(SaveCompleted);
                                                                        }, m_Context);
    }

    private void Initialize()
    {
      m_Context = m_CreateMethod();

      try
      {
        LoadMeters();
        LoadMaps();
        LoadResponsibleSubjects();
        LoadSeries();
        LoadMeterReadings();
        HasConnection = true;
      }
      catch (Exception)
      {
        HasConnection = false;
      }

      RaiseEvent(ContextChanged);
    }

    private void LoadMeters()
    {
      Meters = m_Context.Meters.Expand("MapPosition/Map");
    }


    private void LoadMaps()
    {
      Maps = m_Context.Maps;
    }

    private void LoadResponsibleSubjects()
    {
      ResponsibleSubjects = m_Context.ResponsibleSubjects.Expand("OpenResKit.DomainModel.Employee/Groups");
    }

    private void LoadSeries()
    {
      Series = m_Context.Series;
    }

    private void LoadMeterReadings()
    {
      MeterReadings = m_Context.ScheduledTasks.Expand("DueDate")
                               .Expand("EntryDate")
                               .Expand("OpenResKit.DomainModel.MeterReading/ReadingMeter");
    }

    private void RaiseEvent(EventHandler eventHandler)
    {
      if (eventHandler != null)
      {
        eventHandler(this, new EventArgs());
      }
    }
  }
}