import {
    faBars,
    faDownload,
    faInfoCircle,
    faListSquares,
    faPlusSquare,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
// import mock from "../../../mockserver/server";
import { JsonConvert } from "json2typescript";
import { useContext, useEffect, useState } from "react";
import { ConnectionLineType, ReactFlowProvider } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../CustomizedComponents/Modal/Modal";
import {
    EntityGraphPanelTA1,
    TableRowTA1,
} from "../../CustomizedComponents/TableRow/TableRow";
import { ToggleButtonTA1 } from "../../CustomizedComponents/ToggleButton/ToggleButton";
import {
    DataContext,
    EntitiesContext,
    EventsContext,
    NewsContext,
} from "../../DataReadingComponents/DataReader";
import {
    TA1Entity,
    TA1EntityStrategy,
    TA1Event,
    TA1EventStrategy,
    TA1NodeRenderingStrategy,
} from "../../TA1/LibraryTA1";
import useStoreTA1 from "../../TA1/storeTA1";
import { UniqueString } from "../../utils/TypeScriptUtils";
import "./Menu.css";
// console.log(mock);

function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [option, setOption] = useState("Add JSON");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <>
            <FontAwesomeIcon
                icon={faBars}
                className="menu-icon"
                onClick={toggleMenu}
                title="Menu"
            />
            {isMenuOpen && (
                <div className="menu-container">
                    <div onClick={() => setOption("Add JSON")}>
                        <FontAwesomeIcon
                            icon={faPlusSquare}
                            className="menu-item"
                            title="Add Schema Data"
                        />
                    </div>

                    <div onClick={() => setOption("Download JSON")}>
                        <FontAwesomeIcon
                            icon={faDownload}
                            className="menu-item"
                            title="Download JSON"
                        />
                    </div>
                    <div onClick={() => setOption("See Legend")}>
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="menu-item"
                            title="See Legend"
                        />
                    </div>
                    <div onClick={() => setOption("Global Entity List")}>
                        <FontAwesomeIcon
                            icon={faListSquares}
                            className="menu-item"
                            title="Global Entity List"
                        />
                    </div>
                    <div>
                        <a
                            href="https://duynguyen2001.github.io/RESIN-EDITOR-documentation/"
                            target="_blank"
                        >
                            <FontAwesomeIcon
                                icon={faQuestionCircle}
                                className="menu-item"
                                title="Help"
                            />
                        </a>
                    </div>
                </div>
            )}
            {option && (
                <MenuOptionPanel option={option} setOption={setOption} />
            )}
        </>
    );
}
const MenuOptionPanel = ({ option, setOption }) => {
    const closePanel = () => {
        setOption(null);
    };
    const [isEnlarged, setIsEnlarged] = useState(false);
    const toggleEnlarged = () => {
        setIsEnlarged(!isEnlarged);
    };

    return (
        <div
            className={
                isEnlarged ? "menu-option-panel-enlarged" : "menu-option-panel"
            }
        >
            <Modal
                isEnlarged={isEnlarged}
                handleClick={closePanel}
                toggleEnlarged={toggleEnlarged}
            />
            {option === "Add JSON" && <AddJSONPanel />}
            {option === "Download JSON" && <DownloadJSONPanel />}
            {option === "See Legend" && <SeeLegendPanel />}
            {option === "Global Entity List" && <GlobalEntityList />}
        </div>
    );
};
const DownloadJSONPanel = () => {
    return <TA1DownloadPanel />;
};
const ToggleInput = ({
    id,
    object,
    selected,
    onChange,
    onSelected,
    onDelete,
}) => {
    const [isSelected, setIsSelected] = useState(selected);
    const [text, setText] = useState(object.assumption || "Assumption");

    const handleInputChange = (e) => {
        setText(e.target.value);
        onChange(id, e.target.value);
    };

    const toggleSelection = () => {
        setIsSelected(!isSelected);
        onSelected(id, !isSelected);
    };

    const style = {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "100%",
        cursor: "pointer",
        backgroundColor: isSelected ? "#c0e7f9" : "#fff",
        color: isSelected ? "#05668d" : "#333",
    };

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "space-between",
            }}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={toggleSelection}
            />
            <input
                type="textarea"
                value={text}
                style={style}
                onChange={handleInputChange}
            />

            <button className="button" onClick={() => onDelete(id)}>
                <i className="fa fa-trash"></i>
            </button>
        </div>
    );
};

function AddJSONPanel() {
    const [jsonData, setJsonData] = useContext(DataContext);
    const [Entities, setEntities] = useContext(EntitiesContext);
    const [Events, setEvents] = useContext(EventsContext);
    const [News, setNews] = useContext(NewsContext);
    const [assumptions, setAssumptions] = useState([
        { id: 1, assumption: "Assumption 1", selected: true },
        { id: 2, assumption: "Assumption 2", selected: false },
    ]);

    const [setChosenNodes, setChosenEntities, setClickedNode] = useStoreTA1(
        (state) => [
            state.setChosenNodes,
            state.setChosenEntities,
            state.setClickedNode,
        ]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setChosenNodes([]);
        setChosenEntities([]);
        setClickedNode(null);

        // send request to server
        const formData = assumptions
            .filter((item) => item.selected)
            .map((item) => item.assumption)
            .join("  -  ");

        console.log("formData", formData);
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://newssimulator-mockserver.netlify.app/.netlify/functions/specializingSchema",
            headers: {
                "Content-Type": "text/plain",
            },
            data: `"${formData}"`,
        };

        axios.request(config).then((res) => {
            console.log(res);
            const jsonConverter = new JsonConvert();

            // resolve entities
            const lines = res.data.data.instantiatedEntities
                .split("\n")
                .filter(Boolean);
            const newEntities = new Map();
            const newEntitiesMapCheck = new Map();
            lines.forEach((line) => {
                const entity = jsonConverter.deserialize(
                    JSON.parse(line),
                    TA1Entity
                );
                if (entity.new_entity) {
                    console.log("entity", entity);
                    const newEntityList = entity.new_entity.map((newEntity) => {
                        if (newEntitiesMapCheck.has(newEntity)) {
                            return newEntitiesMapCheck.get(newEntity);
                        }
                        const newId = UniqueString.getUniqueStringWithForm(
                            "resin:Entity/",
                            "/"
                        );
                        const entityListData = newEntity.split(":");
                        if (entityListData.length > 1) {
                            const aNewEntity = jsonConverter.deserialize(
                                {
                                    "@id": newId,
                                    name: entityListData[0],
                                    description: entityListData[1],
                                },
                                TA1Entity
                            );
                            newEntities.set(aNewEntity.id, aNewEntity);
                        } else {
                            const aNewEntity = jsonConverter.deserialize(
                                {
                                    "@id": newId,
                                    name: entityListData[0],
                                    description: "",
                                },
                                TA1Entity
                            );
                            newEntities.set(aNewEntity.id, aNewEntity);
                        }

                        newEntities.set(entity["id"], entity);
                        newEntitiesMapCheck.set(newEntity, entity);
                        return newId;
                    });
                    entity.new_entity = newEntityList;
                }
            });
            console.log("newEntities", newEntities);
            setEntities(newEntities);

            const schema = JSON.parse(res.data.data.specializedSchema);
            const newAssumptionSet = new Set();
            assumptions.forEach((item) => {
                newAssumptionSet.add(item.assumption);
            });
            const listEvents = jsonConverter.deserializeArray(
                Object.entries(schema.event).map(([key, object]) => {
                    if (object.revise_extra_assumption) {
                        newAssumptionSet.add(
                            object.revise_extra_assumption.split(":")[1]
                        );
                    }
                    return {
                        ...object,
                        children_gate: "or",
                        outlinks: object.out_links,
                        "@id": key,
                    };
                }),
                TA1Event
            );

            console.log("listEvents", listEvents);
            console.log("newAssumptionSet", newAssumptionSet);
            setAssumptions([
                ...Array.from(newAssumptionSet).map((item) => ({
                    id: uuidv4(),
                    assumption: item,
                    selected:
                        assumptions.filter(
                            (assumption) => assumption.assumption === item
                        ).length > 0
                            ? assumptions.filter(
                                  (assumption) => assumption.assumption === item
                              )[0].selected
                            : true,
                })),
            ]);
            setEvents(listEvents);

            // set new entities
        });
    };

    // form handling
    const handleAssumptionChange = (key, newAssumption) => {
        const listAssumptions = assumptions.map((item) => {
            if (item.id === key) {
                item.assumption = newAssumption;
            }
            return item;
        });
        setAssumptions(listAssumptions);
    };

    const handleSelectedChange = (id, isSelected) => {
        const listAssumptions = assumptions.map((item) => {
            if (item.id === id) {
                item.selected = isSelected;
            }
            return item;
        });
        setAssumptions(listAssumptions);
    };

    const handleAddAssumptions = () => {
        const newAssumption = {
            id: uuidv4(),
            assumption: "Assumption",
            selected: true,
        };
        setAssumptions([...assumptions, newAssumption]);
    };

    const handleDeleteAssumption = (id) => {
        const listAssumptions = assumptions.filter((item) => item.id !== id);
        setAssumptions(listAssumptions);
    };

    const handleJSONUpload = (event) => {
        setChosenNodes([]);
        setChosenEntities([]);
        setClickedNode(null);
        UniqueString.reset();
        if (event.target.files.length === 0) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            let parsedJson = JSON.parse(e.target.result);
            setJsonData(parsedJson);
        };
    };
    const handleNewsUpload = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            let parsedJson = JSON.parse(e.target.result);
            setNews(parsedJson);
        };
    };
    return (
        <div>
            <>
                <h2>Specializing Schema</h2>
                <h3>Default Schema Upload</h3>
                {jsonData.id && <h4>Current File: {jsonData.id}</h4>}
                <input
                    type="file"
                    accept=".json"
                    multiple
                    onChange={handleJSONUpload}
                />
                <h3>Critics Upload</h3>
                {News === null || News.length === 0 ? (
                    <h4>No Critics Available</h4>
                ) : (
                    <h4>Critics Uploaded</h4>
                )}
                <input
                    type="file"
                    accept=".json"
                    multiple
                    onChange={handleNewsUpload}
                />
                <h3>Assumptions</h3>
                <button
                    type="button"
                    className="button"
                    style={{
                        width: "50%",
                    }}
                    onClick={() => {
                        setAssumptions((prev) => [
                            {
                                id: 1,
                                assumption:
                                    "The mode of transmission of the disease is airborne.",
                                selected: true,
                            },
                            {
                                id: 2,
                                assumption:
                                    "The infectivity of the disease is low.",
                                selected: true,
                            },
                            {
                                id: 3,
                                assumption: "The fatality rate is low.",
                                selected: true,
                            },
                            {
                                id: 4,
                                assumption: "The incubation period is long.",
                                selected: true,
                            },
                            {
                                id: 5,
                                assumption: "The pathogen is not novel.",
                                selected: true,
                            },
                        ]);
                    }}
                >
                    Example 1
                </button>
                <button
                    type="button"
                    className="button"
                    style={{
                        width: "50%",
                    }}
                    onClick={() => {
                        setAssumptions((prev) => [
                            {
                                id: 1,
                                assumption:
                                    "The mode of transmission of the disease is airborne.",
                                selected: true,
                            },
                            {
                                id: 2,
                                assumption:
                                    "The infectivity of the disease is high.",
                                selected: true,
                            },
                            {
                                id: 3,
                                assumption: "The fatality rate is low.",
                                selected: true,
                            },
                            {
                                id: 4,
                                assumption: "The incubation period is long.",
                                selected: true,
                            },
                            {
                                id: 5,
                                assumption: "The pathogen is not novel.",
                                selected: true,
                            },
                        ]);
                    }}
                >
                    Example 2
                </button>

                <form onSubmit={handleSubmit}>
                    {assumptions &&
                        assumptions.map((object) => {
                            return (
                                <ToggleInput
                                    key={uuidv4()}
                                    id={object.id}
                                    object={object}
                                    selected={object.selected}
                                    onChange={handleAssumptionChange}
                                    onSelected={handleSelectedChange}
                                    onDelete={handleDeleteAssumption}
                                />
                            );
                        })}
                    <button
                        type="button"
                        className="button"
                        style={{
                            width: "100%",
                        }}
                        onClick={handleAddAssumptions}
                    >
                        <i className="fa fa-plus"></i>
                    </button>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <button
                            style={{
                                width: "50%",
                            }}
                            className="button"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </>
        </div>
    );
}
const TA1DownloadPanel = () => {
    const [jsonData] = useContext(DataContext);
    const [mapNodes, mapEntities] = useStoreTA1((state) => [
        state.mapNodes,
        state.mapEntities,
    ]);
    const [text, setText] = useState("");
    const jsonConverter = new JsonConvert();
    const newData = { ...jsonData };
    console.log("mapEntity", mapEntities);
    // newData.events.forEach((event) => {
    //     event.entities = event.entities.map((entity) =>
    //         jsonConverter.serialize(mapEntities.get(entity["@id"]), TA1Entity)
    //     );
    // });
    console.log("newData", newData);
    const downloadJSON = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(newData));
        axios
            .post("/api/generateArticles", JSON.stringify(newData), {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                // setText(res.data.data);
            });
    };
    return (
        <div>
            <h2>Situation Reports</h2>
            <button onClick={downloadJSON}>Generate</button>
            {text && <h2>News Article</h2>}
            <p>{text}</p>
        </div>
    );
};
const TA1Legend = () => {
    const [
        updateNodeAttribute,
        updateTreeNodeAttribute,
        edgeStyle,
        updateEdgeStyle,
        updateEdgeAttribute,
        refreshGate,
    ] = useStoreTA1((state) => [
        state.updateNodeAttribute,
        state.updateTreeNodeAttribute,
        state.edgeStyle,
        state.updateEdgeStyle,
        state.updateEdgeAttribute,
        state.nodeRerender,
        state.refreshGate,
    ]);
    const jsonConverter = new JsonConvert();
    return (
        <div className="legend">
            <h2>Legend</h2>
            <h3>Colors</h3>
            {[
                ["event", TA1EventStrategy.colorOptions],
                ["entity", TA1EntityStrategy.colorOptions],
            ].map(([key, value]) => (
                <div
                    key={key}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                            updateNodeAttribute(key, e.target.value)
                        }
                        key={key}
                        style={{ marginRight: "10px" }}
                    />
                    <h4>{key === "event" ? "Event" : "Entity"}</h4>
                </div>
            ))}

            <h3>Shapes</h3>
            {[
                ["parentNode", TA1NodeRenderingStrategy.nodeOptions.parentNode],
                ["leafNode", TA1NodeRenderingStrategy.nodeOptions.leafNode],
                ["entity", TA1NodeRenderingStrategy.nodeOptions.entityNode],
            ].map(([key, value]) => (
                <div key={key}>
                    <h4>
                        {key === "parentNode"
                            ? "Chapter Event"
                            : key === "leafNode"
                            ? "Primitive Event"
                            : "Participant Entity"}
                    </h4>

                    <ReactFlowProvider>
                        {key === "parentNode"
                            ? jsonConverter
                                  .deserialize(
                                      {
                                          "@id": "AA",
                                          children: ["BB", "CC"],
                                          name: "",
                                      },
                                      TA1Event
                                  )
                                  .render()
                            : key === "leafNode"
                            ? jsonConverter
                                  .deserialize(
                                      {
                                          "@id": "AA",
                                          name: "",
                                      },
                                      TA1Event
                                  )
                                  .render()
                            : jsonConverter
                                  .deserialize(
                                      {
                                          "@id": "AA",
                                          name: "",
                                      },
                                      TA1Entity
                                  )
                                  .render()}
                    </ReactFlowProvider>

                    <select
                        value={value}
                        // onChange={(e) => handleShapeChange(e, key)}
                        onChange={(e) =>
                            updateTreeNodeAttribute(key, e.target.value)
                        }
                    >
                        <option value="circle">Circle</option>
                        <option value="diamond">Diamond</option>
                        <option value="square">Square</option>
                    </select>
                </div>
            ))}
            <h3>Edges</h3>
            {["or", "and", "xor", "outlink", "participant", "relation"].map(
                (childrenGate, index) => (
                    <div key={index}>
                        <h4>{childrenGate}</h4>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Color</td>
                                        <td>
                                            <input
                                                type="color"
                                                value={
                                                    edgeStyle[childrenGate]
                                                        .style.stroke
                                                }
                                                onChange={(e) => {
                                                    updateEdgeStyle(
                                                        childrenGate,
                                                        {
                                                            stroke: e.target
                                                                .value,
                                                        }
                                                    );
                                                    if (
                                                        edgeStyle[childrenGate]
                                                            .markerEnd
                                                    ) {
                                                        updateEdgeAttribute(
                                                            childrenGate,
                                                            "markerEnd",
                                                            {
                                                                ...edgeStyle[
                                                                    childrenGate
                                                                ].markerEnd,
                                                                color: e.target
                                                                    .value,
                                                            }
                                                        );
                                                    }
                                                    if (
                                                        childrenGate !==
                                                        "outlink"
                                                    ) {
                                                        refreshGate(
                                                            childrenGate
                                                        );
                                                    }
                                                }}
                                                label="color"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Stroke Width</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={
                                                    edgeStyle[childrenGate]
                                                        .style.strokeWidth
                                                }
                                                onChange={(e) =>
                                                    updateEdgeStyle(
                                                        childrenGate,
                                                        {
                                                            strokeWidth:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Label</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={
                                                    edgeStyle[childrenGate]
                                                        .label
                                                }
                                                onChange={(e) =>
                                                    updateEdgeAttribute(
                                                        childrenGate,
                                                        "label",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Edge Type</td>
                                        <td>
                                            <select
                                                value={
                                                    edgeStyle[childrenGate].type
                                                }
                                                onChange={(e) =>
                                                    updateEdgeAttribute(
                                                        childrenGate,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option
                                                    value={
                                                        ConnectionLineType.Straight
                                                    }
                                                >
                                                    Straight
                                                </option>
                                                <option
                                                    value={
                                                        ConnectionLineType.Bezier
                                                    }
                                                >
                                                    Bezier
                                                </option>
                                                <option
                                                    value={
                                                        ConnectionLineType.SimpleBezier
                                                    }
                                                >
                                                    Simple Bezier
                                                </option>
                                                <option
                                                    value={
                                                        ConnectionLineType.SmoothStep
                                                    }
                                                >
                                                    Smooth Step
                                                </option>
                                                <option
                                                    value={
                                                        ConnectionLineType.Step
                                                    }
                                                >
                                                    Step
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Edge Pattern</td>
                                        <td>
                                            <select
                                                value={
                                                    edgeStyle[childrenGate]
                                                        .style.strokeDasharray
                                                }
                                                onChange={(e) =>
                                                    updateEdgeStyle(
                                                        childrenGate,
                                                        {
                                                            strokeDasharray:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            >
                                                <option value={"none"}>
                                                    Solid
                                                </option>
                                                <option value={"5,5"}>
                                                    Dashed
                                                </option>
                                                <option value={"4 1 2 3"}>
                                                    Uneven Dashed
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Animation</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={
                                                    edgeStyle[childrenGate]
                                                        .animated
                                                }
                                                onChange={(e) =>
                                                    updateEdgeAttribute(
                                                        childrenGate,
                                                        "animated",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};
function SeeLegendPanel() {
    return <TA1Legend />;
}
const TA1GlobalEntityList = () => {
    const [Entities] = useContext(EntitiesContext);
    const [relatedEntities, chosenEntities] = useStoreTA1((state) => [
        state.entitiesRelatedEventMap,
        state.chosenEntities,
    ]);
    const [EntitiesList, setEntitiesList] = useState([]);
    console.log("relatedEntities", relatedEntities);
    console.log("entities", Entities);
    useEffect(() => {
        const newEntitiesList = [];
        for (const [entityName, events] of relatedEntities) {
            const key = `${entityName}`;
            const entity = Entities.get(entityName);
            if (entity === undefined) {
                continue;
            }
            newEntitiesList.push(
                <ToggleButtonTA1
                    key={key}
                    id={key}
                    name={entity.name}
                    relatedEventsLength={events.length}
                    chosen={chosenEntities.includes(key)}
                />
            );
        }
        setEntitiesList(
            newEntitiesList.length > 0 ? (
                newEntitiesList
            ) : (
                <div>No Entities</div>
            )
        );
    }, [Entities]);

    return (
        <div>
            <div>{EntitiesList}</div>
        </div>
    );
};

const TA1GlobalEntityTable = () => {
    const [Entities] = useContext(EntitiesContext);
    const [relatedEntities, chosenEntities] = useStoreTA1((state) => [
        state.entitiesRelatedEventMap,
        state.chosenEntities,
    ]);
    const [EntitiesTable, setEntitiesTable] = useState([]);
    useEffect(() => {
        const newEntitiesTable = [];
        for (const [entityName, events] of relatedEntities) {
            const key = `${entityName}`;
            const entity = Entities.get(entityName);
            if (entity === undefined) {
                continue;
            }
            newEntitiesTable.push(
                <TableRowTA1
                    key={key}
                    id={key}
                    name={entity.name}
                    wd_label={entity.wd_label}
                    relatedEvents={events}
                    chosen={chosenEntities.includes(key)}
                />
            );
        }
        setEntitiesTable(
            newEntitiesTable.length > 0 ? (
                newEntitiesTable
            ) : (
                <div>No Entities</div>
            )
        );
    }, [Entities]);

    return (
        <table>
            <tr>
                <th scope="col">Filter</th>
                <th scope="col">Entity Name</th>
                <th scope="col">WikiData Label</th>
                <th scope="col">Entity Id</th>
                <th scope="col">Participate In</th>
            </tr>
            {EntitiesTable}
        </table>
    );
};
function GlobalEntityList() {
    const [mode, setMode] = useState("list");
    return (
        <>
            <div className="tab-bar">
                <button
                    className={` button-tabbar ${
                        mode === "list" ? "button-tabbar-active" : ""
                    }`}
                    onClick={() => setMode("list")}
                >
                    List
                </button>
                <button
                    className={`button-tabbar ${
                        mode === "table" ? "button-tabbar-active" : ""
                    } `}
                    onClick={() => setMode("table")}
                >
                    Table
                </button>
                <button
                    className={`button-tabbar ${
                        mode === "graph" ? "button-tabbar-active" : ""
                    } `}
                    onClick={() => setMode("graph")}
                >
                    Graph
                </button>
            </div>
            {mode === "list" ? (
                <div>
                    <h2>Global Entity List</h2>
                    <TA1GlobalEntityList />
                </div>
            ) : mode === "table" ? (
                <div>
                    <h2>Global Entity Table</h2>
                    <TA1GlobalEntityTable />
                </div>
            ) : (
                <EntityGraphPanelTA1 />
            )}
        </>
    );
}

export default Menu;
