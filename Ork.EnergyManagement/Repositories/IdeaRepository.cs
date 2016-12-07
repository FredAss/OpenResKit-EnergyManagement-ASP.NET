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
  [Export(typeof (IIdeaRepository))]
  internal class IdeaRepository : IIdeaRepository
  {
    private readonly Func<DomainModelContext> m_CreateMethod;
    private DomainModelContext m_Context;

    [ImportingConstructor]
    public IdeaRepository([Import] ISettingsProvider settingsContainer, [Import] Func<DomainModelContext> createMethod)
    {
      m_CreateMethod = createMethod;
      settingsContainer.ConnectionStringUpdated += (s, e) => Initialize();
      HasConnection = true;
      Initialize();
    }

    public event EventHandler ContextChanged;
    public event EventHandler SaveCompleted;


    public bool HasConnection { get; private set; }

    public IList<Idea> Ideas { get; private set; }

    public Idea GetById(int id)
    {
      return Ideas.Single(i => i.Id == id);
    }

    public void Add(Idea idea)
    {
      m_Context.AddToIdeas(idea);
    }

    public void Update(Idea idea)
    {
      var ideaEntity = GetById(idea.Id);

      ideaEntity.LongDescription = idea.LongDescription;
      ideaEntity.ShortDescription = idea.ShortDescription;
      ideaEntity.Solution = idea.Solution;
      ideaEntity.Status = idea.Status;
      ideaEntity.Creator = idea.Creator;

      m_Context.UpdateObject(ideaEntity);
    }

    public void Delete(Idea idea)
    {
      m_Context.DeleteObject(idea);
    }


    public void Save()
    {
      if (m_Context.ApplyingChanges)
      {
        return;
      }
      m_Context.SaveChanges(SaveChangesOptions.Batch);
      LoadIdeas();
      //var result = m_Context.BeginSaveChanges(SaveChangesOptions.Batch, r =>
      //                                                                  {
      //                                                                    var dm = (DomainModelContext) r.AsyncState;
      //                                                                    dm.EndSaveChanges(r);
      //                                                                    RaiseEvent(SaveCompleted);
      //                                                                    LoadIdeas();
      //                                                                  }, m_Context);
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
        LoadIdeas();
        HasConnection = true;
      }
      catch (Exception)
      {
        HasConnection = false;
      }

      RaiseEvent(ContextChanged);
    }

    private void LoadIdeas()
    {
      Ideas = m_Context.CreateQuery<Idea>("Ideas")
                       .ToList();
    }
  }
}