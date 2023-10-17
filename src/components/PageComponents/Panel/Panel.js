import React from "react";
import { TA1EventNodeInfoPanel } from "../../TA1/TA1EventNodeInfoPanel";
import "./Panel.css";
export function InfoPanel({ data, onClose }) {
    if (data === undefined) {
        return <></>;
    }
    return <TA1EventNodeInfoPanel data={data} onClose={onClose} />;
}
