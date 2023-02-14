import React from "react";
import {ErrorBoundary, Lang, Textarea, Members, InputCheckbox} from "fogito-core-ui";
import {Parameters} from "@plugins";
import Select from "react-select";

export const General = ({state, setParams}) => {


    return (
        <ErrorBoundary>
            <div className="row">
                <div className="col-md-8">

                    {/* Title */}
                    <div className="form-group">
                        <label>{Lang.get("Title")}</label>
                        <input
                            className="form-control"
                            value={state.params.title}
                            onChange={e => setParams({title: e.target.value})}
                            placeholder={Lang.get("Title")}
                        />
                        <span className="text-muted fs-12 mt-1">
                          {Lang.get("MaxLength").replace("{length}", 300 - state.params.title?.length)}
                        </span>
                    </div>


                    {/* Description */}
                    <div className="form-group">
                        <label>{Lang.get("Description")}</label>
                        <Textarea
                            rows="2"
                            maxLength={1500}
                            value={state.params.description}
                            onChange={e => setParams({description: e.target.value})}
                            placeholder={Lang.get("Description")}
                            className="form-control"
                        />
                        <span className="text-muted fs-12 mt-1">
                            {Lang.get("MaxLength").replace("{length}", 1500 - state.params.title?.length)}
                        </span>
                    </div>

                    {/* Slug */}
                    <div className="form-group">
                        <label>{Lang.get("Slug")}</label>
                        <input
                            value={state.params.slug}
                            onChange={e => setParams({slug: e.target.value})}
                            placeholder={Lang.get("Slug")}
                            className="form-control"
                        />
                        <span className="text-muted fs-12 mt-1">
                          {Lang.get("MaxLength").replace("{length}", 300 - state.params.title?.length)}
                        </span>
                    </div>

                    <div className="row">
                        {/* url */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{Lang.get("ApiUrl")}</label>
                                <input
                                    value={state.params.api_url}
                                    onChange={e => setParams({api_url: e.target.value})}
                                    placeholder={Lang.get("ApiUrl")}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {/* path */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{Lang.get("ApiPath")}</label>
                                <input
                                    value={state.params.api_path}
                                    onChange={e => setParams({api_path: e.target.value})}
                                    placeholder={Lang.get("ApiPath")}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">

                    {/* Staff */}
                    <div className="form-group">
                        <label>{Lang.get("Members")}</label>
                        <Members
                            id={state.id}
                            users={state.members}
                            ids={state.members?.ids}
                            toggleUrl="workspaceUsers"
                            permissionsUrl="permissions"
                            userListUrl="userList"
                            toggleParams={{
                                cardKey: "workspace_id",
                                userKey: "user_id",
                            }}
                            permissionParams={{
                                cardKey: "workspace_id",
                                userKey: "user_id",
                            }}
                        />
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>{Lang.get("Status")}</label>
                        <Select
                            options={Parameters.getStatusList()}
                            value={state.params.status}
                            placeholder={Lang.get("All")}
                            onChange={status => setParams({status})}
                            className="form-control"
                        />
                    </div>

                    {/* Public */}
                    <InputCheckbox
                        label={Lang.get("Public")}
                        checked={state.params.public}
                        onChange={(e) => setParams({public: !!e.target.checked ? 1 : 0,})}
                        className='d-inline mr-3 mt-3'
                    />

                </div>
            </div>
        </ErrorBoundary>
    );
};
