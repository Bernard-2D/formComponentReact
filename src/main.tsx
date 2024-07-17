import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import XDemo from './xrender/index.tsx'
import InitForm from './myFormRender/initHookForm/index.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>
      <App />
      <div>手动分割--------------------------------------------------</div>
      <XDemo/>
      <div>手动分割--------------------------------------------------</div>
      <InitForm/>
    </div>
  </React.StrictMode>,
)
