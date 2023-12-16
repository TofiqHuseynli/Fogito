import React from "react";
import Skeleton from "antd/lib/skeleton";
import { AppContext, ErrorBoundary, Header } from "fogito-core-ui";
import { HeaderCustom } from "./HeaderCustom";

export const ProjectsLoading = React.memo(({state}) => {
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
        
          <Header>
          <div className="row ">
          <div className="col-md-1 col-2 p-0 m-0 ">
              <Skeleton.Button
                active
                size={"default"}
                block={false}
                className="d-block py-1 mx-2"
                style={{ height: 45, width: "2rem", borderRadius: "7px" }}
              />
            </div> 
            
            <div className="col-md-4 col-8 mt-md-0 mt-3">
              <Skeleton.Button
                active
                size={"default"}
                block={false}
                className="d-block py-1 mx-2"
                style={{ height: 42, width: "17rem", borderRadius: "7px" }}
              />
            </div> 


            <div className="col-md-4 col-1 mt-md-0 mt-3">
              <Skeleton.Button
                active
                size={"default"}
                block={false}
                className="d-block py-1"
                style={{ height: 42, width: "14rem", borderRadius: "7px" }}
              />
            </div> 

            <div className="col-md-2 col-1 mt-md-0 mt-3">
              <Skeleton.Button
                active
                size={"default"}
                block={false}
                className="d-block py-1"
                style={{ height: 42, width: "8rem", borderRadius: "7px" }}
              />
            </div> 


            <div className="col-md-1 col-4 mt-md-0 mt-3 order-md-3 order-2 ms-auto ml-auto">
              <Skeleton.Button
                active
                size={"default"}
                block={false}
                className="d-block py-1"
                style={{ height: 42, width: "2rem", borderRadius: "7px" }}
              />
            </div>
          </div>
        </Header>
        
        
        <div className="container-fluid position-relative h-100">
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
