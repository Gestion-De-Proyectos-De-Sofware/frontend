import { createContext, useContext, useState } from "react";

const DiagramDefinitionsContext = createContext(null); // Proporciona un valor inicial nulo para el contexto

export const DiagramDefinitionsProvider = ({ children }) => {
    const [diagramDefinitions, setDiagramDefinitions] = useState(null);
    const [canvas, setCanvas] = useState(null);

    return (
        <DiagramDefinitionsContext.Provider value={{ diagramDefinitions, setDiagramDefinitions, canvas, setCanvas }}>
            {children}
        </DiagramDefinitionsContext.Provider>
    );
};

export const useDiagramDefinitions = () => useContext(DiagramDefinitionsContext);
