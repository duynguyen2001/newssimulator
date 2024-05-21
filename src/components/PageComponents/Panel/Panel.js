import React from "react";
import { TA1Entity, TA1Event } from "../../TA1/LibraryTA1";
import { TA1EntityInfoPanel } from "../../TA1/TA1EntityInfoPanel";
import { TA1EventNodeInfoPanel } from "../../TA1/TA1EventNodeInfoPanel";
import "./Panel.css";

export function InfoPanel({ data, onClose }) {
    if (data === undefined) {
        return <></>;
    }
    if (data instanceof TA1Entity) {
        return <TA1EntityInfoPanel data={data} onClose={onClose} />;
    }
    if (data instanceof TA1Event) {
        return <TA1EventNodeInfoPanel data={data} onClose={onClose} />;
    }
}
