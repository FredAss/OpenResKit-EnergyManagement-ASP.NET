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

using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web.Http;
using Ork.EnergyManagement.DomainModelService;
using Ork.EnergyManagement.Repositories;

namespace Ork.EnergyManagement.Controllers
{
  [Export]
  [PartCreationPolicy(CreationPolicy.NonShared)]
  public class MetersController : ApiController
  {
    private readonly IMeterRepository _meterRepository;

    [ImportingConstructor]
    public MetersController([Import] IMeterRepository meterRepository)
    {
      _meterRepository = meterRepository;
    }

    // GET api/meters
    public IEnumerable<Meter> GetMeters()
    {
      return _meterRepository.Meters;
    }

    [Route("api/meters/readings/{id}")]
    public IEnumerable<MeterReading> GetReadings(int id)
    {
      var meterReadings = _meterRepository.MeterReadings.OfType<MeterReading>()
                                           .Where(mr => mr.ReadingMeter.Id == id && mr.EntryDate != null);

      return meterReadings.OrderByDescending(r => r.EntryDate.End);
    }
  }
}