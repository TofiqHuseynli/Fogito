import React from 'react';

import {ErrorBoundary, Header, Inputs, Loading, Members, Permissions, Popup} from "@components";
import {App, Lang} from "@plugins";
import {projectsData, projectsInfo, projectsUpdate} from "@actions";
import {inArray} from "@lib";
import {useModal} from "@hooks";
import {UsersModal} from "../forms";
import {Link} from "react-router-dom";
import {projectUsersList} from "../../../actions/user";
import {AppContext} from "@contexts";


export const Edit = ({name, match, history}) => {
    const initialState = {
        id: match.params.id,
        data: {
            title: "",
            slug: "",
            description: "",
            api_url: "",
            api_path: "",
            members: false,
            status: '',
            public: ''
        },
        loading: false,

        permissions_data: [],
        status_data: [],
        public_data: [],
        editor_type: 'json'
    };

    //  actions
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    const modal = useModal();
    const { setProps } = React.useContext(AppContext);

    const [users, setUsers] = React.useState([])

    const refresh = async () => {
        setState({ loading:true })
        let id = state.id;
        let response = await projectsInfo({id})
        if(response.status === 'success') {
            setState({
                data: response.data,
                loading: false
            })
        }
    }

    const getUsers = async () => {
        let response = await projectUsersList({ data: { project_id: state.id }})
        if (response.status === 'success')
            setUsers(response.data)
    }

    const getList = async () => {
        let response = await projectsData()
        if(response.status === 'success') {
            setState({
                status_data: response.data.status,
                public_data: response.data.public
            })
        }
    }

    const getUpdate = async () =>{
        let response = await projectsUpdate({
            id: state.id,
            data: state.data
        })
        if(response.status === 'success') {
            App.successModal(response.description)
            // props.history.goBack()
        } else {
            App.errorModal(response.description)
        }
    }


    React.useEffect(()=> {
        refresh()
        getList()
        getUsers()
    },[])


    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <ErrorBoundary>
            {/*** Modals ***/}
            <Popup
                show={inArray("members", modal.modals)}
                title={Lang.get("Users")}
                size='sm'
                onClose={() => modal.hide("members")}
            >
                <UsersModal users={users}
                            onClose={() => modal.hide("members")}
                            setUsers={setUsers}
                            project_id={state.id}
                />
            </Popup>
            {/*** Header ***/}
            <Header>
                <div className="col d-flex justify-content-between align-items-center px-0">
                    <div className="col-md-1 pl-0 ml-0">
                        <button
                            className="btn btn-primary lh-24 px-3 text-center"
                            onClick={() => history.goBack()}
                        >
                            <i className="feather feather-chevron-left fs-22 align-middle" />
                        </button>
                    </div>

                    <h3 className='text-primary' >{Lang.get(name)}</h3>


                    <div className='d-flex justify-content-end' >

                        <Link to={{ pathname: `/docs/${state.data?.id}` }}
                              className="btn btn-primary lh-24 col-md-12 px-3 d-flex align-items-center justify-content-between"
                        >
                            {Lang.get("GoDocs")}
                            <i className="feather feather-chevron-right fs-20 " />
                        </Link>
                        <div className="col-md-7 pr-0">
                            <button
                                className="btn btn-success btn-block lh-24 px-3"
                                onClick={() => getUpdate()}
                            >
                                {Lang.get("Save")}
                            </button>
                        </div>
                    </div>
                </div>
            </Header>
            {/*** Content ***/}
            {state.loading && <Loading />}
            <section className="container-fluid position-relative px-md-3 px-2 pb-1">
                <div className="card p-3">
                    <div style={{ minHeight: 500 }} >
                        <div className="row">
                            <Inputs type='input'
                                    onChange={(e) => setState({...state, data: {...state.data, title: e.target.value}})}
                                    value={state.data.title}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-8 px-2 mt-1'}
                                    placeholder={'Title'}
                                    label={'Title'}
                            />
                            <Inputs type='select'
                                    onSelect={(e) => setState({...state, data: {...state.data, status: parseInt(e.target.value)}})}
                                    data={state.status_data}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-4 px-2 mt-1'}
                                    selected={state.data.status?.value}
                                    label={'Status'}
                            />
                        </div>
                        <div className="row">
                            <Inputs type='input'
                                    onChange={(e) => setState({...state, data: {...state.data, slug: e.target.value}})}
                                    value={state.data.slug}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-8 px-2 mt-4'}
                                    placeholder={'Slug'}
                                    label={'Slug'}
                            />
                            <Inputs type='select'
                                    onSelect={(e) => setState({...state, data: {...state.data, public: parseInt(e.target.value)}})}
                                    data={state.public_data}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-4 px-2 mt-4'}
                                    selected={state.data.public?.value}
                                    label={"Public"}
                            />
                        </div>
                        <div className="row">
                            <Inputs type='input'
                                    onChange={(e) => setState({...state, data: {...state.data, api_url: e.target.value}})}
                                    value={state.data.api_url}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-4 px-2 mt-4'}
                                    placeholder={'ApiUrl'}
                                    label={'ApiUrl'}
                            />
                            <Inputs type='input'
                                    onChange={(e) => setState({...state, data: {...state.data, api_path: e.target.value}})}
                                    value={state.data.api_path}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-4 px-2 mt-4'}
                                    placeholder={'ApiPath'}
                                    label={'ApiPath'}
                            />
                            <div className='mt-5' >
                                <Members state={state}
                                         users={users}
                                         setUsers={setUsers}
                                         openMembersModal={()=> modal.show('members')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <Inputs type='text-area'
                                    onChange={(e) => setState({...state, data: {...state.data, description: e.target.value}})}
                                    value={state.data.description}
                                    propsClass={'custom-input'}
                                    divClass={'col-md-8 px-2 mt-4'}
                                    placeholder={'Description'}
                                    label={'Description'}
                            />
                        </div>

                        {/** Permission **/}
                        <div className='mt-4' >
                            <label className='label mb-2' >{Lang.get('Permissions')}</label>
                            <Permissions state={state}
                                         setState={setState}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </ErrorBoundary>
    )
}