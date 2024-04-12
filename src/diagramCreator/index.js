import React, { Component } from "react";
// import Modeler from 'bpmn-js';
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
    console.log("diagramModeler: ", this.diagramModeler);

    // diagramModeler.attachTo('js-canvas-container');
    this.diagramModeler.importXML(diagramXML, err => {
      if (err) console.error(err);
      else {
        console.log("New diagram is ready");
      }
    });
  }

  render() {
    return <div id="js-canvas" />;
  }
}

export default ModelerCreator;
