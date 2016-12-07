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
using System.ComponentModel.Composition.Hosting;
using System.Web.Http.Dependencies;

namespace Ork.EnergyManagement
{
  public class MefDependencyResolver : IDependencyResolver, System.Web.Mvc.IDependencyResolver
  {
    private readonly CompositionContainer m_Container;

    public MefDependencyResolver(CompositionContainer container)
    {
      m_Container = container;
    }

    public IDependencyScope BeginScope()
    {
      return this;
    }

    /// <summary>
    ///   Called to request a service implementation.
    ///   Here we call upon MEF to instantiate implementations of dependencies.
    /// </summary>
    /// <param name="serviceType">Type of service requested.</param>
    /// <returns>Service implementation or null.</returns>
    public object GetService(Type serviceType)
    {
      if (serviceType == null)
      {
        throw new ArgumentNullException("serviceType");
      }

      var name = AttributedModelServices.GetContractName(serviceType);
      var export = m_Container.GetExportedValueOrDefault<object>(name);
      return export;
    }

    /// <summary>
    ///   Called to request service implementations.
    ///   Here we call upon MEF to instantiate implementations of dependencies.
    /// </summary>
    /// <param name="serviceType">Type of service requested.</param>
    /// <returns>Service implementations.</returns>
    public IEnumerable<object> GetServices(Type serviceType)
    {
      if (serviceType == null)
      {
        throw new ArgumentNullException("serviceType");
      }

      var exports = m_Container.GetExportedValues<object>(AttributedModelServices.GetContractName(serviceType));
      return exports;
    }

    public void Dispose()
    {
    }
  }
}