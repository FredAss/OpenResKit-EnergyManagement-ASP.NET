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
using Ork.EnergyManagement.DomainModelService;

namespace Ork.EnergyManagement.Repositories
{
  public interface IMeasureRepository
  {
    IList<ResponsibleSubject> ResponsibleSubjects { get; }
    IList<Catalog> Catalogs { get; }
    IList<Idea> Ideas { get; }

    bool HasConnection { get; }
    Idea GetIdeaById(int id);
    Measure GetMeasureById(int id);
    void AddMeasure(Measure measure);
    void Save();
    void Update(Object entity);
    void UpdateMeasure(Measure measure);
    void Delete(Measure measure);
    void RefreshData();
    //void UpdateCatalog(Catalog catalog);
    Catalog GetById(int id);
    ResponsibleSubject GetResponsibleSubjectById(int id);
    void AddLink(Object source, string sourceProperty, Object target);
    void SetLink(Object source, string sourceProperty, Object target);
    event EventHandler ContextChanged;
    event EventHandler SaveCompleted;
  }
}