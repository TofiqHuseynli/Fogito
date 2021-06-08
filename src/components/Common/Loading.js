import React from "react";
import { DashLoading, BounceLoading } from "respinner";

export const Loading = React.memo(
  ({
    duration = 1.5,
    stroke = "#36a0ea",
    opacity = 0.8,
    strokeWidth = 2.5,
    size = 40,
    bgStyle = {
      backgroundColor: "rgba(255, 255, 255, 0.77)",
      borderRadius: "calc(0.375rem - 1px)",
    },
    bgClass = false,
    ...props
  }) => {
    let bgProps = {
      className: `loading-container ${bgClass ? bgClass : ``}`,
      style: bgStyle ? bgStyle : {},
    };

    return (
      <div {...bgProps}>
        <DashLoading
          className="loading-spinner"
          duration={duration}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          size={size}
          {...props}
        />
      </div>
    );
  }
);

export const ScrollLoading = () => {
  return (
    <BounceLoading
      {...{
        ...{
          duration: 2,
          fill: "var(--primary-rgb-60)",
          size: 25,
          count: 4,
        },
      }}
    />
  );
};
