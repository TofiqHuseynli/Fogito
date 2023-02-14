import React from "react";


export const renderStatusColumn = (status) => {

    return (
        <div className="d-flex align-items-center">
            <span
                className={`bg-${status.class}`}
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    marginTop: 2,
                }}
            />
            <p
                className="text-lowercase mb-0 ml-2 fw-400 lh-20 fs-14"
                style={{whiteSpace: "nowrap"}}>
                {status.label}
            </p>
        </div>
    )
}
