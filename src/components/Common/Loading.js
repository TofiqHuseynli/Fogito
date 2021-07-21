import React from "react";
import classNames from "classnames";
import { DashLoading } from "respinner";

export const Loading = ({
        type = "partial",
        stroke = "#5ecc62",
        strokeWidth = 2.5,
        duration = 1.5,
        opacity = 0.8,
        size = type === "partial" ? 40 : 50,
    }) => {
    return (
        <div className={classNames("loader-content", { [type]: type })}>
            <DashLoading
                className="spinner"
                strokeWidth={strokeWidth}
                duration={duration}
                opacity={opacity}
                stroke={stroke}
                size={size}
            />
        </div>
    );
};