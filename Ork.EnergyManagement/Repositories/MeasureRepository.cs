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
using System.Linq;
using Ork.EnergyManagement.DomainModelService;

namespace Ork.EnergyManagement.Repositories
{
  [Export(typeof (IMeasureRepository))]
  internal class MeasureRepository : IMeasureRepository
  {
    private readonly Func<DomainModelContext> m_CreateMethod;
    private DomainModelContext m_Context;


    [ImportingConstructor]
    public MeasureRepository([Import] ISettingsProvider settingsContainer, [Import] Func<DomainModelContext> createMethod)
    {
      m_CreateMethod = createMethod;
      settingsContainer.ConnectionStringUpdated += (s, e) => Initialize();
      HasConnection = true;
      Initialize();
    }

    public IList<Idea> Ideas { get; private set; }

    public event EventHandler ContextChanged;
    public event EventHandler SaveCompleted;

    public bool HasConnection { get; private set; }
    public IList<ResponsibleSubject> ResponsibleSubjects { get; private set; }
    public IList<Catalog> Catalogs { get; private set; }

    public void SetLink(object source, string sourceProperty, object target)
    {
      m_Context.SetLink(source, sourceProperty, target);
    }

    public void AddMeasure(Measure measure)
    {
      m_Context.AddToMeasures(measure);
    }

    public ResponsibleSubject GetResponsibleSubjectById(int id)
    {
      return ResponsibleSubjects.Single(i => i.Id == id);
    }

    public void AddLink(Object source, string sourceProperty, Object target)
    {
      m_Context.AddLink(source, sourceProperty, target);
    }

    //public void UpdateCatalog(Catalog catalog)
    //{
    //  var catalogEntity = GetById(catalog.Id);

    //  catalogEntity.IsSelected = catalog.IsSelected;

    //  m_Context.UpdateObject(catalog);
    //}

    public void Update(Object entity)
    {
      m_Context.UpdateObject(entity);
    }

    public void UpdateMeasure(Measure measure)
    {
      var measureEntity = GetMeasureById(measure.Id);

      measureEntity.Name = measure.Name;
      measureEntity.Description = measure.Description;
      measureEntity.CreationDate = measure.CreationDate;
      measureEntity.DueDate = measure.DueDate;
      measureEntity.EntryDate = measure.EntryDate;
      measureEntity.Evaluation = measure.Evaluation;
      measureEntity.EvaluationRating = measure.EvaluationRating;
      measureEntity.MeasureImageSource = measure.MeasureImageSource;

      measureEntity.Status = measure.Status;
      measureEntity.Priority = measure.Priority;
      measureEntity.AttachedDocuments = measure.AttachedDocuments;

      if (measureEntity.ResponsibleSubject != measure.ResponsibleSubject)
      {
        measureEntity.ResponsibleSubject = measure.ResponsibleSubject;
        m_Context.SetLink(measureEntity, "ResponsibleSubject", measureEntity.ResponsibleSubject);
      }

      m_Context.UpdateObject(measureEntity);
    }

    public void Save()
    {
      if (m_Context.ApplyingChanges)
      {
        return;
      }

      m_Context.SaveChanges(SaveChangesOptions.Batch);
      LoadResponsibleSubjects();
      LoadCatalogs();
      LoadIdeas();
      //var result = m_Context.BeginSaveChanges(SaveChangesOptions.Batch, r =>
      //                                                                  {
      //                                                                    var dm = (DomainModelContext) r.AsyncState;
      //                                                                    dm.EndSaveChanges(r);
      //                                                                    RaiseEvent(SaveCompleted);
      //                                                                    LoadResponsibleSubjects();
      //                                                                    LoadCatalogs();
      //                                                                  }, m_Context);
    }


    public Catalog GetById(int id)
    {
      return Catalogs.Single(i => i.Id == id);
    }

    public Idea GetIdeaById(int id)
    {
      return Ideas.Single(i => i.Id == id);
    }

    public Measure GetMeasureById(int id)
    {
      return Catalogs.Single(i => i.Measures.Any(m => m.Id == id))
                     .Measures.Single(m => m.Id == id);
    }

    public void Delete(Measure measure)
    {
      m_Context.DeleteObject(measure);
    }

    public void RefreshData()
    {
      Initialize();
    }

    private void RaiseEvent(EventHandler eventHandler)
    {
      if (eventHandler != null)
      {
        eventHandler(this, new EventArgs());
      }
    }

    private void Initialize()
    {
      m_Context = m_CreateMethod();

      try
      {
        LoadResponsibleSubjects();
        LoadCatalogs();
        LoadIdeas();
        HasConnection = true;
      }
      catch (Exception)
      {
        HasConnection = false;
      }

      RaiseEvent(ContextChanged);
    }

    private void LoadResponsibleSubjects()
    {
      ResponsibleSubjects = m_Context.CreateQuery<ResponsibleSubject>("ResponsibleSubjects")
                                     .ToList();
    }

    private void LoadCatalogs()
    {
      Catalogs = m_Context.CreateQuery<Catalog>("Catalogs")
                          .Expand("Measures/OpenResKit.DomainModel.Measure/ResponsibleSubject")
                          .Expand("Measures/OpenResKit.DomainModel.Measure/MeasureImageSource")
                          .Expand("Measures/OpenResKit.DomainModel.Measure/AttachedDocuments/DocumentSource")
                          .ToList();
    }

    private void LoadIdeas()
    {
      Ideas = m_Context.CreateQuery<Idea>("Ideas")
                       .ToList();
    }
  }
}