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

using System.ComponentModel.Composition.Hosting;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;

namespace Ork.EnergyManagement.App_Start
{
  public class MefConfig
  {
    public static void RegisterMef()
    {
      var asmCatalog = new AssemblyCatalog(Assembly.GetExecutingAssembly());
      var container = new CompositionContainer(asmCatalog);
      var resolver = new MefDependencyResolver(container);
      // Install MEF dependency resolver for MVC
      DependencyResolver.SetResolver(resolver);
      // Install MEF dependency resolver for Web API
      GlobalConfiguration.Configuration.DependencyResolver = resolver;
    }
  }
}