import React, { Component } from "react";
import BpmnModeler from "bpmn-js";
import diagramXML from "./resources/newDiagram.bpmn";

class ModelerCreator extends Component {
  constructor() {
    super();
    this.diagramModeler = new BpmnModeler({
      container: "#js-canvas"
    });
  }

  componentDidMount() {
    this.loadDiagram(diagramXML);
  }

  loadDiagram = (xml) => {
    this.diagramModeler.importXML(xml, err => {
      if (err) {
        console.error("Failed to load diagram:", err);
      } else {
        console.log("Diagram loaded successfully");
      }
    });
  }

  resetDiagram = () => {
    if (window.confirm("¿Está seguro de eliminar lo realizado y crear un lienzo nuevo?")) {
      this.loadDiagram(diagramXML); // Reload the initial diagram
      console.log("Diagram reset to new");
    }
  }

  render() {
    return <div id="js-canvas" />;
  }
}

export default ModelerCreator;
