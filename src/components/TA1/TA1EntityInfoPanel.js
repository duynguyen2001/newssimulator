import React, {useState} from 'react';
import useStoreTA1 from './storeTA1';
import {Modal} from '../CustomizedComponents/Modal/Modal.js';
import EditableText from '../CustomizedComponents/EditableText/EditableText.jsx';

export const TA1EntityInfoPanel = ({data, onClose}) => {

    const [isEnlarged, setIsEnlarged] = useState(false);
    const [mapEntities] = useStoreTA1((state) => [state.mapEntities]);
    const [timeFrame, setTimeFrame] = useState(Date.now());

    const toggleEnlarged = () => {
        setIsEnlarged(!isEnlarged);
    };
    const handleOnSave = (value, field) => {
        mapEntities.get(data.id).set(field, value);
    }
    console.log("rendering TA1EntityInfoPanel", data)

    return (
        
        <div
            className={isEnlarged ? "info-panel-enlarge" : "info-panel"}
            key={timeFrame}
        >
            <Modal
                isEnlarged={isEnlarged}
                toggleEnlarged={toggleEnlarged}
                handleClick={onClose}
            />
            {data.name && (
                <EditableText
                    values={data.name}
                    variant="h2"
                    onSave={handleOnSave}
                    field="name"
                />
            )}
            {data.description && (
                <EditableText
                    values={data.description[0]}
                    variant="p"
                    onSave={handleOnSave}
                    field="description"
                />
            )}
            {data.wd_node && data.wd_node !== null && data.wd_node !== "null" && (
                <details open>
                    <summary
                        style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Event Type
                    </summary>
                    {data.wd_node.map((node, index) => (
                        <div key={node}>
                            <EditableText
                                values={data.wd_label[index]}
                                variant="h3"
                                index={index}
                                onSave={handleOnSave}
                                field="wd_label"
                            />
                            <EditableText
                                values={data.wd_description[index]}
                                variant="p"
                                index={index}
                                onSave={handleOnSave}
                                field="wd_description"
                            />
                        </div>
                    ))}


                </details>
            )}

            {data.new_entity && data.new_entity !== null  && (
                <details open>
                    <summary
                        style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        New Entities
                    </summary>
                    {data.new_entity.map((entity, index) => (
                        <div key={entity}>
                            <EditableText
                                values={entity}
                                variant="p"
                                index={index}
                                onSave={handleOnSave}
                                field="newEntity"
                            />
                        </div>

                    ))}
                    </details>

            )}

        </div>
    );
}