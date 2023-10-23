import {
    faBars,
    faDownload,
    faInfoCircle,
    faListSquares,
    faPlusSquare,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JsonConvert } from "json2typescript";
import { useContext, useEffect, useState } from "react";
import { ConnectionLineType, ReactFlowProvider } from "reactflow";
import { Modal } from "../../CustomizedComponents/Modal/Modal";
import {
    EntityGraphPanelTA1,
    TableRowTA1,
} from "../../CustomizedComponents/TableRow/TableRow";
import { ToggleButtonTA1 } from "../../CustomizedComponents/ToggleButton/ToggleButton";
import {
    DataContext,
    EntitiesContext,
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
import mock from "../../../mockserver/server";
import axios from "axios";
function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [option, setOption] = useState(null);

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

function AddJSONPanel() {
    const [jsonData, setJsonData] = useContext(DataContext);
    const [attributes, setAttributes] = useState({
        attribute_1: "value_1",
        attribute_2: "value_2",
    });

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
        const formData = JSON.stringify(attributes);
        console.log("attributes", attributes);
        axios
            .post("/api/specializingSchema", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                // setJsonData(res.data.data.data);
            });
    };

    // form handling

    const handleKeyChange = (oldKey, newKey) => {
        if (oldKey !== newKey) {
            setAttributes((prev) => {
                const newAttributes = { ...prev, [newKey]: prev[oldKey] };
                delete newAttributes[oldKey];
                return newAttributes;
            });
        }
    };

    const handleValueChange = (key, value) => {
        setAttributes((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddAttribute = () => {
        const newKey = `attribute_${Object.keys(attributes).length + 1}`;
        setAttributes((prev) => ({ ...prev, [newKey]: "" }));
    };

    const handleRemoveAttribute = (keyToRemove) => {
        const updatedAttributes = { ...attributes };
        delete updatedAttributes[keyToRemove];
        setAttributes(updatedAttributes);
    };
    return (
        <div>
            <>
                <h2></h2>
                <h2>Assumptions</h2>

                <form onSubmit={handleSubmit}>
                    {Object.entries(attributes).map(([key, value]) => (
                        <div key={key}>
                            
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                        handleValueChange(key, e.target.value)
                                    }
                                />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAttribute}>
                        Add Attribute
                    </button>
                    <button type="submit">Submit</button>
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
            axios.post("/api/generateArticles", JSON.stringify(newData), {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((res) => {
                console.log(res);
                // setText(res.data.data);
            });
    };
    return (
        <div>
            <h2>Situation Report</h2>
            <button onClick={downloadJSON}>Generate</button>
            {text && (<h2>News Article</h2>)}
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
