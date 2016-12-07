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
using System.Web.Optimization;

namespace Ork.EnergyManagement
{
  public class BundleConfig
  {
    public static void RegisterBundles(BundleCollection bundles)
    {
      bundles.IgnoreList.Clear();
      AddDefaultIgnorePatterns(bundles.IgnoreList);

      bundles.Add(new ScriptBundle("~/Scripts/vendor").Include("~/Scripts/jquery-{version}.js")
                                                      .Include("~/Scripts/jquery.tablesorter.min.js")
                                                      .Include("~/Scripts/jquery.tablesorter.pager.js")
                                                      .Include("~/Scripts/jquery.tablesorter.widgets.js")
                                                      .Include("~/Scripts/raphael-min.js")
                                                      .Include("~/Scripts/morris.min.js")
                                                      .Include("~/Scripts/chosen.jquery.js")
                                                      .Include("~/Scripts/knockout-{version}.js")
                                                      .Include("~/Scripts/knockout.validation.js")
                                                      .Include("~/Scripts/koValidation/de-DE.js")
                                                      .Include("~/Scripts/koValidation/validationConfiguration.js")
                                                      .Include("~/Scripts/toastr.js")
                                                      .Include("~/Scripts/Q.js")
                                                      .Include("~/Scripts/breeze.min.js")
                                                      .Include("~/Scripts/bootstrap.min.js")
                                                      .Include("~/Scripts/bootstrap-datepicker.js")
                                                      .Include("~/Scripts/locales/bootstrap-datepicker.de.js")
                                                      .Include("~/Scripts/moment.min.js")
                                                      .Include("~/Scripts/moment-with-langs.min.js"));

      bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/ie10mobile.css")
                                                  .Include("~/Content/bootstrap.min.css")
                                                  .Include("~/Content/bootstrap-responsive.css")
                                                  .Include("~/Content/bootstrap-chosen.css")
                                                  .Include("~/Content/bootstrap-datepicker3.css")
                                                  .Include("~/Content/font-awesome.min.css")
                                                  .Include("~/Content/metro-bootstrap.css")
                                                  .Include("~/Content/durandal.css")
                                                  .Include("~/Content/toastr.min.css")
                                                  .Include("~/Content/sorter/style.css")
                                                  .Include("~/Content/theme.bootstrap.css")
                                                  .Include("~/Content/morris.css")
                                                  .Include("~/Content/app.css"));
    }

    public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
    {
      if (ignoreList == null)
      {
        throw new ArgumentNullException("ignoreList");
      }

      ignoreList.Ignore("*.intellisense.js");
      ignoreList.Ignore("*-vsdoc.js");

      //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
      //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
      //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
    }
  }
}