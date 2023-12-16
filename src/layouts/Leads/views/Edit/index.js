import React, { useEffect } from "react";
import {
    ErrorBoundary,
    Lang,
    Popup,
    Loading,
    useToast,
} from "fogito-core-ui";
import { Spinner, Tab, TabPanel, Tabs } from "@components";
import { useParams } from "react-router-dom";
import { statusMinList, leadUpdate, infoLead, groupsMinList } from "@actions";
import { GeneralEdit, MembersEdit } from "./components";





export const Edit = ({ onClose, reload, match }) => {

    const toast = useToast();
    let urlParams = useParams();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            loading: false,
            saveLoading: false,
                id: urlParams?.id,
                activeTab: 'individual',
                grpList: [],
                statusList: [],
                firstname: "",
                lastname: "",
                gender_id: "",
                groups: [],
                email: "",
                phone: "",
                status: {},
                type:"",
                contact_person: {
                    firstname: '',
                    lastname: '',
                    email: '',
                    phone: ''
                }
        }
    );


    const genderList = [
        { value: '1', label: Lang.get('Male') },
        { value: '2', label: Lang.get('Female') },
        { value: '3', label: Lang.get('Other') }]

    const loadData = async () => {
        setState({ loading: true });

        let statusRes = await loadStatus();

        let groupRes = await loadGroups();

        let response = await infoLead({ id: state.id });

        if (response) {
            if (response.status === "success" && response.data) {
                setState({...response.data});
            }
            setState({
                loading: false,
                grpList: groupRes,
                statusList: statusRes
            });

        }

    };


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



    useEffect(() => {
        loadData()
    }, [])


    


    const onSubmit = async () => {
        setState({ saveLoading: true });

        if (state.saveLoading) {
            return;
        }
        // let isGeneral = state.activeTab == 'general';
        let response = await leadUpdate({firstname: state.firstname,
             lastname: state.lastname,
             gender_id: state.gender_id,
             group_ids: state.groups.map((item)=>(item.value)),
             id: state.id,
             email: state.email,
             phone: state.phone,
             status_id: state.status.value,
             contact_person: state.contact_person,
             type: state.type
             


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
            key: "individual",
            title: "Individual",
            permission: true,
            component: <GeneralEdit
                state={state}
                setState={setState}
                loadData={loadData}
                loadGroups={loadGroups}
                genderList={genderList}
                loadStatus={loadStatus}
               
            />,
        },
        {
            key: "company",
            title: "Company",
            permission: true,
            component: (<MembersEdit
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
                    <Tabs
                        selectedTab={state.type}
                        onChange={(type) => setState({ type })}>
                        {tablist.filter((tab) => tab.key == state.type).map((item, index) => (
                            <Tab label={item.title} value={item.key} key={index} />
                        ))}
                    </Tabs>
                    <div className="position-relative mt-4"> 
                        {tablist.filter((tab) => tab.key == state.type).map((item, index) => (
                            <TabPanel
                                value={state.type}
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