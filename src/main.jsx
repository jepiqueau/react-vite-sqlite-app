import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

customElements.define('jeep-sqlite', JeepSqlite);

window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();
  const sqlite = new SQLiteConnection(CapacitorSQLite)
  try {
    if(platform === "web") {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      // Initialize the Web store
      await sqlite.initWebStore();
    } 

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("db_reactvite")).result;
    var db = null;
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("db_reactvite");
    } else {
      db = await sqlite.createConnection("db_reactvite", false, "no-encryption", 1);
    }

    await db.open();
    let query = `
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    `

    const res = await db.execute(query);
    console.log(`res: ${JSON.stringify(res)}`);
    await db.close();
    await sqlite.closeConnection("db_reactvite");

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    )
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`)
  }
});

