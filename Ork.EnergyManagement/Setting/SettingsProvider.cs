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
using System.ComponentModel.Composition;
using Ork.EnergyManagement.Models;

namespace Ork.EnergyManagement
{
  [Export(typeof (ISettingsProvider))]
  public class SettingsProvider : ISettingsProvider
  {
    private IApplicationDbContext m_Db;
    private Setting m_Setting;

    public SettingsProvider()
    {
      m_Db = new ApplicationDbContext();
      m_Setting = m_Db.Settings.Find(1);
    }


    public string ConnectionString
    {
      get { return "http://" + m_Setting.ServerUrl + ":" + m_Setting.ServerPort; }
    }

    public string User
    {
      get { return m_Setting.User; }
    }

    public string Password
    {
      get { return m_Setting.Password; }
    }

    public string Url
    {
      get { return m_Setting.ServerUrl; }
    }

    public int Port
    {
      get { return m_Setting.ServerPort; }
    }

    public void Refresh()
    {
      if (ConnectionStringUpdated != null)
      {
        ConnectionStringUpdated(this, new EventArgs());
      }
    }

    public event EventHandler<EventArgs> ConnectionStringUpdated;

    [Export]
    public void NewConnectionSettings(int id)
    {
      m_Db = new ApplicationDbContext();
      m_Setting = m_Db.Settings.Find(id);

      if (ConnectionStringUpdated != null)
      {
        ConnectionStringUpdated(this, new EventArgs());
      }
    }
  }
}