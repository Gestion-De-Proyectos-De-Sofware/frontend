import React, { useEffect } from "react";
import BpmnModeler from "bpmn-js";
import diagramXML from "./resources/newDiagram.bpmn";

const ModelerCreator = () => {
  useEffect(() => {
    const diagramModeler = new BpmnModeler({
      container: "#js-canvas"
    });

    const loadDiagram = (xml) => {
      diagramModeler.importXML(xml, err => {
        if (err) {
          console.error("Failed to load diagram:", err);
        } else {
          console.log("Diagram loaded successfully");
        }
      });
    };

    const resetDiagram = () => {
      if (window.confirm("Are you sure to delete what you made and create a new canvas?")) {
        loadDiagram(diagramXML); // Reload the initial diagram
        console.log("Diagram reset to new");
      }
    };

    // Load initial diagram on mount
    loadDiagram(diagramXML);

    // Cleanup on unmount
    return () => {
      diagramModeler.destroy();
    };
  }, []);

  return <div id="js-canvas" />;
};

export default ModelerCreator;
