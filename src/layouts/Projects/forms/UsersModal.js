// All Users Modal
import React from 'react';
import {ErrorBoundary, Loading, Permissions, CustomModal, Inputs} from "@components";
import {projectUsersAdd, projectUsersDelete, userList} from "../../../actions/user";
import {inArray} from "@lib";
import {App, Lang} from "@plugins";


export const UsersModal = ({users, project_id, setUsers}) => {

    const initialState = {
        id: project_id,
        data: [],
        userID: "",
        loading: false,
        permissions_modal: false
    };

    //  actions
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    const [permsModal, setPermsModal] = React.useState(false)
    const [input, setInput] = React.useState("")

    const getUpdate = async (user, selected) => {
        setState({ loading: true })
        let response = null;
        if(selected) {
            response = await projectUsersDelete({ data:{ project_id: state.id, user_id: user.id }})
        } else {
            response = await projectUsersAdd({ data:{ project_id: state.id, user_id: user.id }})
        }

        if(response) {
            setState({loading: false})
            if(response.status === 'success') {
                    setUsers(
                        selected
                            ?
                            users.filter((item) => item.id !== user?.id)
                            :
                            users.concat([user])
                    )
            }
        }
    }


    const refresh = async () => {
        setState({ loading: true })
        let response = await userList();
        if(response.status === 'success') {
            setState({
                data: response.data,
                loading: false
            })
        }
    }

    React.useEffect(()=> {
        refresh()
    },[])

    return (
        <ErrorBoundary>
            {/*** Content ***/}
            {state.loading && <Loading />}
            <div>
                <Inputs
                    onChange={(e)=> setInput(e.target.value)}
                    placeholder={Lang.get("Search")}
                    autoFocus={true}
                    divClass='mb-3'
                    type='input'
                />
                {state.data.filter(x => x.fullname.toLowerCase().includes(input.toLowerCase())).map((item,i) => {
                    let selected = inArray(item.id, users.map(row => row.id))

                    return (
                        <>
                            {/* User Permissions */}
                            <CustomModal
                                show={permsModal === i}
                                title={Lang.get('UsersPermissions')}
                                onHide={()=> setPermsModal(false)}
                            >
                                <Permissions state={state} userID={item.id} />
                            </CustomModal>
                            <div className='users_list' key={i} >
                                <div className='list__item justify-content-between' style={{ opacity: selected ? 1 : .6 }} onClick={()=> getUpdate(item, selected)} >
                                    <div className='d-flex align-items-center ' >
                                        <img src={item.avatar} alt='' style={App.memberBorders(item.type)} />
                                        <div className='list__info' >
                                            <p>{item.fullname} {selected && <i className='feather feather-check text-success mt-5' />}</p>
                                            <p className='badge badge-primary' >{item.type}</p>
                                        </div>
                                    </div>

                                    {
                                        selected &&
                                        <i className='feather feather-more-vertical fs-18'
                                            onClick={(e) => setPermsModal(i) + e.stopPropagation()}
                                        />
                                    }
                                </div>

                            </div>
                        </>
                    )})
                }
            </div>
        </ErrorBoundary>
    )
}