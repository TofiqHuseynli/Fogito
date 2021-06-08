import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { AppContext, SidebarContext } from "@contexts";
import { ErrorBoundary } from "@components";
import { useWindowDimensions} from "@hooks";
import { Toggler } from "./components";
import { Lang } from "@plugins";

export const Sidebar = ({ routes }) => {
    const dimensions = useWindowDimensions();
    const { mode, setMode } = React.useContext(SidebarContext);
    const { activeRoute } = React.useContext(AppContext);

    const renderLinks = () => {
        return routes
            .filter((item) => !item.isHidden)
            .map((link, key) => (
                <li className="nav-item" key={key}>
                    <Link
                        to={link.path}
                        {...(link.nestedRoutes?.filter((item) => !item.isHidden).length > 0
                            ? {
                                role: "button",
                                "data-toggle": "collapse",
                                "data-target": `.${link.path.replace("/", "")}-${key}`,
                                "aria-expanded": activeRoute?.path?.indexOf(link.path) === 0,
                            }
                            : {
                                onClick: () => dimensions.width <= 1200 && setMode("closed"),
                            })}
                        className={classNames(
                            "nav-link d-flex align-items-center justify-content-center",
                            {
                                active: activeRoute?.path?.indexOf(link.path) === 0,
                            }
                        )}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                        {link.nestedRoutes?.filter((item) => !item.isHidden).length > 0 && (
                            <i className="arrow feather feather-chevron-right" />
                        )}
                    </Link>
                    {link.nestedRoutes?.filter((item) => !item.isHidden).length > 0 && (
                        <div
                            data-parent=".navbar-nav"
                            className={classNames(
                                "collapse",
                                `${link.path.replace("/", "")}-${key}`,
                                {
                                    show: activeRoute?.path?.indexOf(link.path) === 0,
                                }
                            )}
                        >
                            <ul className="m-0">
                                {link.nestedRoutes
                                    ?.filter((item) => !item.isHidden)
                                    .map((subLink, key) => (
                                        <li className="nav-item" key={key}>
                                            <Link
                                                to={link.path + subLink.path}
                                                onClick={() =>
                                                    dimensions.width <= 1200 && setMode("closed")
                                                }
                                                className={classNames(
                                                    "nav-link d-flex align-items-center justify-content-center",
                                                    {
                                                        active:
                                                            activeRoute?.path === link.path + subLink.path,
                                                    }
                                                )}
                                            >
                                                {subLink.icon}
                                                <span>{subLink.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </li>
            ));
    };

    return (
        <ErrorBoundary>
            {dimensions.width <= 1200 && mode === "opened" && (
                <div className="sidebar-backdrop" onClick={() => setMode("closed")} />
            )}
            <aside className={classNames("frame-sidebar", { [mode]: mode })}>
                <nav className="navbar bg-white shadow d-block h-100 p-0">
                    <div className="navbar-head bg-white d-flex justify-content-center align-items-center w-100">
                        <Link
                            to="/"
                            className="navbar-brand d-flex align-items-center mr-2"
                        >
                            <h1 className="mb-0">{Lang.get("Fogito - Docs")}</h1>
                        </Link>
                        <Toggler />
                    </div>
                    <ul className="navbar-nav w-100 m-0">{renderLinks()}</ul>
                </nav>
            </aside>
        </ErrorBoundary>
    );
};
