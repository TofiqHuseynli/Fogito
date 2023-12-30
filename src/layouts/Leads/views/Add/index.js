import React, { useEffect } from "react";
import {
    ErrorBoundary,
    Lang,
    Popup,
    Loading,
    useToast,
} from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { Spinner, Tab, TabPanel, Tabs } from "@components";

import { General, Members } from "./components";
import { statusMinList, listCreate, groupsList, groupsMinList } from "@actions";

export const Add = ({ onClose, reload, match }) => {

    const toast = useToast();
    let urlParams = useParams();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            id: urlParams?.id,
            loading: false,
            saveLoading: false,
            activeTab: 'general',
            grpList: [],
            statusList: [],
            defaultStatusList: [],
            firstName: "",
            lastName: "",
            gender_id: "",
            group: [],
            email: "",
            phone: "",
            status: null,
            contact_person: {
                firstname:'',
                lastname:'',
                email:'',
                phone: ''
            },
        }
    );

    console.log(state.id)


    const genderList = [
        { value: '1', label: Lang.get('Male') },
        { value: '2', label: Lang.get('Female') },
        { value: '3', label: Lang.get('Other') }
    ]

    const loadData = async () => {
        setState({ loading: true });

        let statusRes = await loadStatus();
        let defaultStatusRes = await loadDefaultStatus();
        let groupRes = await loadGroups();  

        if(state.id){
            let selectedStatus = statusRes.find((item)=>(item.value==state.id));
            setState({status:selectedStatus ? selectedStatus : null})
        }else{
            setState({status: defaultStatusRes})

        }

        setState({
            loading: false,
            grpList: groupRes,
            statusList: statusRes,
            defaultStatusList: defaultStatusRes
        });
    };

    console.log(state.status)

    const loadGroups = async (title = '') => {
        let response = await groupsMinList({
            title,
            skip: 0,
            limit: 20,
        });

        if (response?.status === "success") {
            return response.data;
        } else {
            toast.fire({ icon: response?.status, title: response.description });
        }

        return [];
    };



    const loadStatus = async (title = '') => {
        let response = await statusMinList({
            title,
            skip: 0,
            limit: 20,
        });
        if (response?.status === "success") {
            return response.data;
        }
        return [];
    };

    const loadDefaultStatus = async (title = '') => {
        let response = await statusMinList({
            title,
            skip: 0,
            limit: 20,
        });
        if (response?.status === "success") {
            return response.default_status;
        }
        return [];
    };



    useEffect(() => {
        loadData()
    }, [])



    const onSubmit = async () => {
        setState({ saveLoading: true });

        if (state.saveLoading) {
            return;
        }
        let isGeneral = state.activeTab == 'general';
        let response = await listCreate({
            firstname: state.firstName,
            lastname: state.lastName,
            gender_id: state.gender_id,
            group_ids: state.group.map(item=>item.value),
            email: state.email,
            phone: state.phone,
            status_id: state.status,
            contact_person: state.contact_person,
            type: isGeneral ? 'individual' : 'company',
        });
        if (response) {
            setState({ saveLoading: false });
            toast.fire({
                icon: response.status,
                title: response.description,
            });
            if (response.status === "success") {
                await reload();
                onClose();
            }
        }
    }


    const tablist = [
        {
            key: "general",
            title: "Individual",
            permission: true,
            component: <General
                state={state}
                setState={setState}
                loadData={loadData}
                loadGroups={loadGroups}
                genderList={genderList}
                loadStatus={loadStatus}
            />,
        },
        {
            key: "members",
            title: "Company",
            permission: true,
            component: (<Members
                state={state}
                setState={setState}
                loadData={loadData}
                loadGroups={loadGroups}
                loadStatus={loadStatus}
                genderList={genderList}
            />),
        },
    ];


    return (
        <ErrorBoundary>
            <Popup
                size="xl"
                show
                onClose={onClose}
                header={
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <button
                                onClick={() => onClose()}
                                className="btn btn-primary btn-block">
                                <i className="feather feather-chevron-left" />
                            </button>
                        </div>
                        <h5 className="title fs-16">{Lang.get("Create")} {Lang.get(match?.params?.type)}</h5>
                        <div>
                            <button onClick={onSubmit} className="btn btn-primary px-4">
                                {state.saveLoading ? (
                                    <Spinner color="#fff" style={{ width: 30 }} />
                                ) : (
                                    Lang.get("Save")
                                )}
                            </button>
                        </div>
                    </div>
                }>

                {state.loading && <Loading />}

                <div style={{ minHeight: 400 }}>
                    {/* Content */}
                    <Tabs
                        selectedTab={state.activeTab}
                        onChange={(activeTab) => setState({ activeTab })}>
                        {tablist.filter((tab) => !!tab.permission).map((item, index) => (
                            <Tab label={item.title} value={item.key} key={index} />
                        ))}
                    </Tabs>
                    <div className="position-relative mt-4">
                        {tablist.filter((tab) => !!tab.permission).map((item, index) => (
                            <TabPanel
                                value={state.activeTab}
                                selectedIndex={item.key}
                                key={index}
                            >
                                {item.component}
                            </TabPanel>
                        ))}
                    </div>
                </div>
            </Popup>

        </ErrorBoundary>
    )
}


