import { createContext, useContext, useState } from "react";

const DiagramDefinitionsContext = createContext({});

export const DiagramDefinitionsProvider = (props) => {
    const [diagramDefinitions, setDiagramDefinitions] = useState();

    return (
        <DiagramDefinitionsContext.Provider
            value={{
                diagramDefinitions,
                setDiagramDefinitions
            }}
        >
            {props.children}
        </DiagramDefinitionsContext.Provider>
    );
};

export const useDiagramDefinitions = () => {
    return useContext(DiagramDefinitionsContext);
};
