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
using System.Collections.ObjectModel;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Newtonsoft.Json.Linq;
using Ork.EnergyManagement.DomainModelService;
using Ork.EnergyManagement.Models;
using Ork.EnergyManagement.Repositories;

namespace Ork.EnergyManagement.Controllers
{
  [Export]
  [PartCreationPolicy(CreationPolicy.NonShared)]
  public class CatalogsController : ApiController
  {
    private readonly IMeasureRepository _measureRepository;
    private IApplicationDbContext _dbContext;

    [ImportingConstructor]
    public CatalogsController([Import] IMeasureRepository measureRepository, IApplicationDbContext applicationDbContextContext)
    {
      _measureRepository = measureRepository;
      _dbContext = applicationDbContextContext;
    }


    public IEnumerable<ResponsibleSubject> GetResponsibleSubjects()
    {
      return _measureRepository.ResponsibleSubjects;
    }


    // GET api/measures
    public IEnumerable<Catalog> GetCatalogs()
    {
      return _measureRepository.Catalogs;
    }


    public IEnumerable<Catalog> GetFilteredCatalogs()
    {
      _measureRepository.RefreshData();
      ICollection<Catalog> filteredCatalogs = new Collection<Catalog>();
      var catalogs = _measureRepository.Catalogs;

      if (catalogs != null)
      {
        foreach (var catalog in catalogs)
        {
          if (_dbContext.SelectedCatalogs.Any(c => c.OrkHubId == catalog.Id))
          {
            filteredCatalogs.Add(catalog);
          }
        }

        return filteredCatalogs;
      }
      return null;
    }


    public IEnumerable<SelectedCatalog> GetSelectedCatalogs()
    {
      return _dbContext.SelectedCatalogs;
    }


    [Route("api/catalogs/put/{id}")]
    [ResponseType(typeof (Measure))]
    // PUT api/ideas/5
    public IHttpActionResult Put(int id, JObject data)
    {
      dynamic json = data;
      var measure = data.ToObject<Measure>();
      measure.ResponsibleSubject = _measureRepository.GetResponsibleSubjectById((int) json.ResponsibleSubjectId);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      if (id != measure.Id)
      {
        return BadRequest();
      }

      if (!MeasureExists(id))
      {
        return NotFound();
      }
      _measureRepository.UpdateMeasure(measure);
      _measureRepository.Save();

      return Ok(measure);
    }

    [ResponseType(typeof (SelectedCatalog))]
    public void PostSelectedCatalog(IEnumerable<SelectedCatalog> catalogs)
    {
      if (catalogs == null)
      {
        return;
      }

      foreach (var selectedCatalog in _dbContext.SelectedCatalogs)
      {
        if (!catalogs.Any(c => c.OrkHubId == selectedCatalog.OrkHubId))
        {
          _dbContext.SelectedCatalogs.Remove(selectedCatalog);
        }
      }

      foreach (var catalog in catalogs)
      {
        if (!_dbContext.SelectedCatalogs.Any(c => c.OrkHubId == catalog.OrkHubId))
        {
          _dbContext.SelectedCatalogs.Add(catalog);
        }
      }
      _dbContext.SaveChanges();
    }

    [ResponseType(typeof (Measure))]
    public IHttpActionResult Post(JObject data)
    {
      dynamic json = data;


      int catalogId = json.CatalogId;
      int responsibleSubjectId = json.ResponsibleSubject.Id;

      if (!CatalogExists(catalogId) ||
          !ResponsibleSubjectExists(responsibleSubjectId))
      {
        return NotFound();
      }

      Measure measure;

      if (json["IdeaId"] != null)
      {
        measure = CreateMeasure(json, catalogId, responsibleSubjectId, (int) json.IdeaId);
      }
      else
      {
        measure = CreateMeasure(json, catalogId, responsibleSubjectId, null);
      }


      _measureRepository.Save();

      return CreatedAtRoute("DefaultApi", new
                                          {
                                            id = measure.Id
                                          }, measure);
    }

    [Route("api/catalogs/delete/{id}")]
    [ResponseType(typeof (Measure))]
    // DELETE api/ideas/5
    public IHttpActionResult Delete(int id)
    {
      if (!MeasureExists(id))
      {
        return NotFound();
      }
      var measure = _measureRepository.GetMeasureById(id);

      _measureRepository.Delete(measure);
      _measureRepository.Save();

      return Ok(measure);
    }

    private bool CatalogExists(int id)
    {
      return _measureRepository.Catalogs.Any(i => i.Id == id);
    }

    private bool MeasureExists(int id)
    {
      return _measureRepository.Catalogs.Any(i => i.Measures.Any(m => m.Id == id));
    }

    private bool ResponsibleSubjectExists(int id)
    {
      return _measureRepository.ResponsibleSubjects.Any(i => i.Id == id);
    }

    private bool IdeaExists(int? id)
    {
      return _measureRepository.Ideas.Any(i => i.Id == id);
    }


    private Measure CreateMeasure(dynamic json, int catalogId, int responsibleSubjectId, int? ideaId)
    {
      var measure = new Measure
                    {
                      Name = json.Name,
                      CreationDate = DateTime.Now,
                      DueDate = json.DueDate,
                      Description = json.Description,
                      Priority = json.Priority,
                      Status = 0,
                      ResponsibleSubject = _measureRepository.GetResponsibleSubjectById(responsibleSubjectId)
                    };

      _measureRepository.AddMeasure(measure);

      var catalog = _measureRepository.GetById(catalogId);
      catalog.Measures.Add(measure);

      if (ideaId != null &&
          IdeaExists(ideaId))
      {
        var idea = _measureRepository.GetIdeaById((int) ideaId);
        idea.Measures.Add(measure);
        idea.Status = 1;
        _measureRepository.Update(idea);
        _measureRepository.AddLink(idea, "Measures", measure);
      }


      _measureRepository.AddLink(catalog, "Measures", measure);
      _measureRepository.SetLink(measure, "ResponsibleSubject", measure.ResponsibleSubject);

      return measure;
    }
  }
}