import React from 'react';
import {Members, Permissions} from "@components";
import {projectsData, projectsInfo, projectsUpdate} from "@actions";
import {UsersModal} from "../forms";
import {Link} from "react-router-dom";
import {projectUsersList} from "../../../actions/user";
import {
    Popup,
    ErrorBoundary,
    Header,
    Loading,
    AppContext,
    useModal,
    inArray,
    InputLazy,
    Textarea,
    useToast
} from 'fogito-core-ui'
import {Lang, App} from '@plugins'

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

    const toast = useToast()
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
            toast.fire({
                title: response.description,
                icon: "success",
            });
        } else {
            toast.fire({
                title: response.description,
                icon: "error",
            });
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
                show={modal.modals.includes("members")}
                title={Lang.get("Users")}
                size='md'
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
                            <div className='col-md-8 px-2 mt-1' >
                                <label>{Lang.get("Title")}<span className='text-danger fs-18 ml-1' >*</span></label>
                                <input className='form-control'
                                       placeholder={Lang.get('Title')}
                                       value={state.data.title}
                                       onChange={(e) => setState({...state, data: {...state.data, title: e.target.value}})}
                                />
                            </div>
                            <div className='col-md-4 px-2 mt-2' >
                                <label>{Lang.get("Status")}</label>
                                <select
                                    className="custom-select"
                                    onChange={(e) => setState({...state, data: {...state.data, status: parseInt(e.target.value)}})}
                                >
                                    <option value="" selected="" >{Lang.get("Select")}</option>
                                    {state.status_data.map((item, key) => (
                                        <option value={item.value} key={key} selected={item.value === state.data.status?.value} >
                                            {Lang.get(item.label)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-md-8 px-2 mt-3' >
                                <label>{Lang.get("Slug")}</label>
                                <input className='form-control'
                                       placeholder={Lang.get('Slug')}
                                       value={state.data.slug}
                                       onChange={(e) => setState({...state, data: {...state.data, slug: e.target.value}})}
                                />
                            </div>
                            <div className='col-md-4 px-2 mt-3' >
                                <label>{Lang.get("Public")}</label>
                                <select
                                    className="custom-select"
                                    onChange={(e) => setState({...state, data: {...state.data, public: parseInt(e.target.value)}})}
                                >
                                    <option value="" selected="" >{Lang.get("Select")}</option>
                                    {state.public_data.map((item, key) => (
                                        <option value={item.value} key={key} selected={item.value === state.data.public?.value} >
                                            {Lang.get(item.label)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-md-4 px-2 mt-3' >
                                <label>{Lang.get("ApiUrl")}<span className='text-danger fs-18 ml-1' >*</span></label>
                                <input className='form-control'
                                       placeholder={Lang.get('Slug')}
                                       value={state.data.api_url}
                                       onChange={(e) => setState({...state, data: {...state.data, api_url: e.target.value}})}
                                />
                            </div>
                            <div className='col-md-4 px-2 mt-3' >
                                <label style={{ marginTop: 5 }} >{Lang.get("ApiPath")}</label>
                                <input className='form-control'
                                       placeholder={Lang.get('Slug')}
                                       value={state.data.api_path}
                                       onChange={(e) => setState({...state, data: {...state.data, api_path: e.target.value}})}
                                />
                            </div>
                            <div className='mt-3' >
                                <label>{Lang.get("Members")}</label>
                                <Members state={state}
                                         users={users}
                                         setUsers={setUsers}
                                         openMembersModal={()=> modal.show('members')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-md-8 px-2 mt-3' >
                                <label>{Lang.get("Description")}</label>
                                <Textarea
                                    rows="4"
                                    maxLength="1500"
                                    value={state.data.description}
                                    onChange={(e) => setState({...state, data: {...state.data, description: e.target.value}})}
                                    placeholder={Lang.get("Description")}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/** Permission **/}
                        <div className='col-md-8 mt-4' style={{ position: 'relative' }} >
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