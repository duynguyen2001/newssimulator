import { JsonConvert } from "json2typescript";
import React, { createContext, useEffect } from "react";
import { Relation, TA1Entity, TA1Event } from "../TA1/LibraryTA1";

import defaultData from "../../data/resin-resin-task1-ce2013.json";
import defaultText from "../../data/triggers.json";
import GraphTA1 from "../../pages/TA1/GraphTA1.jsx";
import Gate from "../CustomizedComponents/Gates/Gate.jsx";
import { CustomNode } from "../CustomizedNodes/CustomNode/CustomNode.js";

export const EntitiesContext = createContext({});
export const ProvenanceContext = createContext([]);
export const DataContext = createContext({});
export const ExtractedFilesContext = createContext(new Map());
export const ExtractedTextsContext = createContext({});
export const RelationsContext = createContext([]);
export const EventsContext = createContext([]);
export const nodeTypes = {
    customNode: CustomNode,
    gate: Gate,
};

const defaultExtractedText = () => {
    const mapText = new Map();
    for (const [key, value] of Object.entries(defaultText.rsd_data.en)) {
        mapText.set(key, value);
    }
    return mapText;
};

const DataReader = () => {
    const [data, setData] = React.useState(defaultData);
    let jsonConvert = new JsonConvert();
    const [Entities, setEntities] = React.useState([]);
    const [Events, setEvents] = React.useState([]);
    const [Relations, setRelations] = React.useState([]);
    const [Provenances, setProvenances] = React.useState({});
    const [extractedFiles, setExtractedFiles] = React.useState(new Map());
    const [extractedTexts, setExtractedTexts] = React.useState(
        defaultExtractedText()
    );

    useEffect(() => {
        console.log("rawdata", data);
        // ta1 handling
        if (data.events && data.events.length > 0) {
            setEvents(jsonConvert.deserializeArray(data.events, TA1Event));

            const entitiesMap = new Map();
            const relationList = [];
            data.events.forEach((event) => {
                if (event.relations) {
                    event.relations.forEach((relation) => {
                        relationList.push(
                            jsonConvert.deserialize(relation, Relation)
                        );
                    });
                }
                if (event.entities) {
                    event.entities.forEach((entity) => {
                        entitiesMap.set(
                            entity["@id"],
                            jsonConvert.deserialize(entity, TA1Entity)
                        );
                    });
                }
            });
            setEntities(entitiesMap);
            setRelations(relationList);
        }

        return;
    }, [data]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <DataContext.Provider value={[data, setData]}>
                <ProvenanceContext.Provider
                    value={[Provenances, setProvenances]}
                >
                    <EventsContext.Provider value={[Events, setEvents]}>
                        <EntitiesContext.Provider
                            value={[Entities, setEntities]}
                        >
                            <ExtractedTextsContext.Provider
                                value={[extractedTexts, setExtractedTexts]}
                            >
                                <ExtractedFilesContext.Provider
                                    value={[extractedFiles, setExtractedFiles]}
                                >
                                    <RelationsContext.Provider
                                        value={[Relations, setRelations]}
                                    >
                                        (
                                        <GraphTA1 />)
                                    </RelationsContext.Provider>
                                </ExtractedFilesContext.Provider>
                            </ExtractedTextsContext.Provider>
                        </EntitiesContext.Provider>
                    </EventsContext.Provider>
                </ProvenanceContext.Provider>
            </DataContext.Provider>
        </div>
    );
};
export default DataReader;
