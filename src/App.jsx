import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSQLite } from 'react-sqlite-hook';
import NoEncryption from './components/NoEncryption';

export let sqlite;
const App = () => {

  sqlite = useSQLite();
  return (
    <div className="App">
        <h1>Working with Vite</h1>
        <p>Hello There! This was such a first fun experience creating a React app using Vite.
          The lightning-fast starting of the dev server is such an amazing experience while using this tool compared to the normal<b>npx create-react-app (app-name) way.</b>
          Now I will run the **"npm run serve"** command to experience the instant HMR experience that Vite provides.
        </p>

        <h1>Happy Coding!</h1>
        <NoEncryption></NoEncryption>
   </div>
  )
}

export default App
