import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Lab1 from './views/lab1';
import Lab2 from './views/lab2';
import Lab3 from './views/lab3';
import Lab4 from './views/lab4';
import Lab5 from './views/lab5';
import "./App.css";

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Lab1/>} />
        <Route path="/lab1" element={<Lab1/>}/>
        <Route path="/lab2" element={<Lab2/>}/>
        <Route path="/lab3" element={<Lab3/>}/>
        <Route path="/lab4" element={<Lab4/>}/>
        <Route path="/lab5" element={<Lab5/>}/>
      </Routes>
      <div className="sidebar">
        <nav>
          <ul>
            <li>                            
              <Link to='/lab1' className="MyLinks">Лабораторная 1</Link>                   
            </li>
            <li>                            
              <Link to='/lab2'>Лабораторная 2</Link>                   
            </li>
            <li>                            
              <Link to='/lab3'>Лабораторная 3</Link>                   
            </li>
            <li>                            
              <Link to='/lab4'>Лабораторная 4</Link>                   
            </li>
            <li>                            
              <Link to='/lab5'>Лабораторная 5</Link>                   
            </li>

          </ul>
        </nav>
      </div>
        
      </BrowserRouter>
  );
}


