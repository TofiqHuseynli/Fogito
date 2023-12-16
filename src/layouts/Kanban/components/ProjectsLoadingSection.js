import React from "react";
import Skeleton from "antd/lib/skeleton";
import { AppContext, ErrorBoundary, Header } from "fogito-core-ui";


export const ProjectsLoadingSection = React.memo(({state}) => {
  const { props } = React.useContext(AppContext);

  React.useEffect(() => {
    if (props.target === "board") {
      document.querySelector(".core-header")?.classList?.add("w-100");
    }
  }, []);

  return (
    <ErrorBoundary>
      <section
        ref={(el) => {
          if (el) {
            el.style.paddingTop = `${el.firstChild.offsetHeight}px`;
          }
        }}
        className="board"
      >
      
        
        <div className="container-fluid position-relative mg-0  h-100">
          <div className="d-flex flex-row">
            <Skeleton.Button
              active
              size={"default"}
              block={false}
              className="d-block py-1"
              style={{
                width: 300,
                height: "calc(100vh - 300px)",
                borderRadius: "7px",
                marginRight: "1rem",
              }}
            />
            <Skeleton.Button
              active
              size={"default"}
              block={false}
              className="d-block py-1"
              style={{
                width: 300,
                height: "calc(100vh - 400px)",
                borderRadius: "7px",
                marginRight: "1rem",
              }}
            />
            <Skeleton.Button
              active
              size={"default"}
              block={false}
              className="d-block py-1"
              style={{
                width: 300,
                height: "calc(100vh - 500px)",
                borderRadius: "7px",
                marginRight: "1rem",
              }}
            />
            <Skeleton.Button
              active
              size={"default"}
              block={false}
              className="d-block py-1"
              style={{
                width: 300,
                height: "calc(100vh - 400px)",
                borderRadius: "7px",
                marginRight: "1rem",
              }}
            />
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
});
