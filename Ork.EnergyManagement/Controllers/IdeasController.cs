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
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Ork.EnergyManagement.DomainModelService;
using Ork.EnergyManagement.Repositories;

namespace Ork.EnergyManagement.Controllers
{
  [Export]
  [PartCreationPolicy(CreationPolicy.NonShared)]
  public class IdeasController : ApiController
  {
    private readonly IIdeaRepository _ideaRepository;

    [ImportingConstructor]
    public IdeasController([Import] IIdeaRepository ideaRepository)
    {
      _ideaRepository = ideaRepository;
    }


    // GET api/ideas
    public IEnumerable<Idea> Get()
    {
      return _ideaRepository.Ideas;
    }

    [Route("api/ideas/get/{id}")]
    // GET api/ideas/5
    public IHttpActionResult Get(int id)
    {
      if (!IdeaExists(id))
      {
        return NotFound();
      }

      var idea = _ideaRepository.GetById(id);

      return Ok(idea);
    }

    [Route("api/ideas/put/{id}")]
    [ResponseType(typeof (Idea))]
    // PUT api/ideas/5
    public IHttpActionResult Put(int id, Idea idea)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      if (id != idea.Id)
      {
        return BadRequest();
      }

      if (!IdeaExists(id))
      {
        return NotFound();
      }
      _ideaRepository.Update(idea);
      _ideaRepository.Save();

      return Ok(idea);
    }

    [ResponseType(typeof (Idea))]
    // POST api/ideas
    public IHttpActionResult Post(Idea idea)
    {
      if (idea != null)
      {
        idea.CreationDate = DateTime.Now;
      }
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      _ideaRepository.Add(idea);
      _ideaRepository.Save();

      return CreatedAtRoute("DefaultApi", new
                                          {
                                            id = idea.Id
                                          }, idea);
    }

    [Route("api/ideas/delete/{id}")]
    [ResponseType(typeof (Idea))]
    // DELETE api/ideas/5
    public IHttpActionResult Delete(int id)
    {
      if (!IdeaExists(id))
      {
        return NotFound();
      }
      var idea = _ideaRepository.GetById(id);

      _ideaRepository.Delete(idea);
      _ideaRepository.Save();

      return Ok(idea);
    }

    private bool IdeaExists(int id)
    {
      return _ideaRepository.Ideas.Any(i => i.Id == id);
    }
  }
}