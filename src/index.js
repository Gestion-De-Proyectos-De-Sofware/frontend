import React from "react";
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import BpmnView from "./diagramViewer";
import ModelerCreator from "./diagramCreator/index";
import "./styles.css";

import global_en from "./translations/en/global.json"
import global_es from "./translations/es/global.json"
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      global: global_en
    },
    es: {
      global: global_es
    }
  }
})


function App() {
  return (
    <div className="App">
      <Navbar />
      {/** This is for viewer only 
      https://stackoverflow.com/questions/42708361/integrating-bpmn-js-to-modeler-the-react-component
      */}
      <BpmnView />

      {/** This is for Model creator 
      Comment out the nextblock will reveal the above Viewer
      */}
      {/* <div id="js-canvas-container">
        <ModelerCreator />
      </div> */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
  ,
  rootElement);
