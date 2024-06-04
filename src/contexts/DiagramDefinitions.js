import { createContext, useContext, useState } from "react";

const DiagramDefinitionsContext = createContext(null); // Proporciona un valor inicial nulo para el contexto

export const DiagramDefinitionsProvider = ({ children }) => {
    const [diagramDefinitions, setDiagramDefinitions] = useState(null);
    const [canvas, setCanvas] = useState(null);

    const newDiagram = () => {
        const emptyBPMN = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
        'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
        'xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" ' +
        'xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" ' +
        'targetNamespace="">' +
        '<process id="Process_1" isExecutable="false">' +
        '</process>' +
        '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
        '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
        '</bpmndi:BPMNPlane>' +
        '</bpmndi:BPMNDiagram>' +
        '</definitions>';
        if (diagramDefinitions) {
            diagramDefinitions.importXML(emptyBPMN);
        }
    };

    return (
        <DiagramDefinitionsContext.Provider value={{ 
            diagramDefinitions, 
            setDiagramDefinitions, 
            canvas, 
            setCanvas, 
            newDiagram   
        }}>
            {children}
        </DiagramDefinitionsContext.Provider>
    );
};

export const useDiagramDefinitions = () => useContext(DiagramDefinitionsContext);
