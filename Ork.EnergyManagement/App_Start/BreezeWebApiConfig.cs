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

using System.Web.Http;
using Ork.EnergyManagement.App_Start;
using WebActivator;

[assembly : PreApplicationStartMethod(typeof (BreezeWebApiConfig), "RegisterBreezePreStart")]

namespace Ork.EnergyManagement.App_Start
{
  /// <summary>
  ///   Inserts the Breeze Web API controller route at the front of all Web API routes
  /// </summary>
  /// <remarks>
  ///   This class is discovered and run during startup; see
  ///   http://blogs.msdn.com/b/davidebb/archive/2010/10/11/light-up-your-nupacks-with-startup-code-and-webactivator.aspx
  /// </remarks>
  public static class BreezeWebApiConfig
  {
    public static void RegisterBreezePreStart()
    {
      GlobalConfiguration.Configuration.Routes.MapHttpRoute(name : "BreezeApi",
        routeTemplate : "api/{controller}/{action}");
    }
  }
}