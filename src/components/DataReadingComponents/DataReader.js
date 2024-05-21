import { JsonConvert } from "json2typescript";
import React, { createContext, useEffect } from "react";
import { Relation, TA1Entity, TA1Event } from "../TA1/LibraryTA1";
import Page from "../../pages/TA1/Page";
import Gate from "../CustomizedComponents/Gates/Gate.jsx";
import { CustomNode } from "../CustomizedNodes/CustomNode/CustomNode.js";
import { set } from "idb-keyval";

export const EntitiesContext = createContext({});
export const DataContext = createContext({});
export const RelationsContext = createContext([]);
export const EventsContext = createContext([]);
export const NewsContext = createContext([]);
export const NewsChosenContext = createContext([]);
export const FilteredNewsContext = createContext([]);
export const nodeTypes = {
    customNode: CustomNode,
    gate: Gate,
};

const DataReader = () => {
    const [data, setData] = React.useState({});
    let jsonConvert = new JsonConvert();
    const [Entities, setEntities] = React.useState(new Map());
    const [Events, setEvents] = React.useState([]);
    const [Relations, setRelations] = React.useState([]);
    const [News, setNews] = React.useState([]);
    const [chosenNews, setChosenNews] = React.useState(null);
    const [filteredNews, setFilteredNews] = React.useState([]);

    useEffect(() => {
        // ta1 handling
        if (data.events && data.events.length > 0) {
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
            setEvents(jsonConvert.deserializeArray(data.events, TA1Event));
            setEntities(entitiesMap);
            setRelations(relationList);
        }

        return;
    }, [data]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <NewsContext.Provider value={[News, setNews]}>
                <FilteredNewsContext.Provider
                    value={[filteredNews, setFilteredNews]}
                >
                    <NewsChosenContext.Provider
                        value={[chosenNews, setChosenNews]}
                    >
                        <DataContext.Provider value={[data, setData]}>
                            <EventsContext.Provider value={[Events, setEvents]}>
                                <EntitiesContext.Provider
                                    value={[Entities, setEntities]}
                                >
                                    <RelationsContext.Provider
                                        value={[Relations, setRelations]}
                                    >
                                        <Page />
                                    </RelationsContext.Provider>
                                </EntitiesContext.Provider>
                            </EventsContext.Provider>
                        </DataContext.Provider>
                    </NewsChosenContext.Provider>
                </FilteredNewsContext.Provider>
            </NewsContext.Provider>
        </div>
    );
};
export default DataReader;
