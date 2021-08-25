import React from "react";
import {Permissions, ProjectUsersTooltip} from "@components";
import UsersTooltip from "./Tooltip/UsersTooltip";
import {projectUsersDelete} from "../../actions/user";
import {Popup, ErrorBoundary, Lang} from 'fogito-core-ui';
import {App} from '@plugins'

export const Members = ({ state, users, setUsers, openMembersModal }) => {

    const [modal, setModal] = React.useState(false)

    const removeUser = async (user) => {
        let data = {
            project_id: state.id,
            user_id: user.id
        }
        let response = await projectUsersDelete({data})
        if(response.status === 'success') {
            setUsers(users.filter(row => row.id !== user.id))
        }
    }

    return (
        <ErrorBoundary>
            <div className='members' >
                    <div className='members_container' >
                        {
                            users.map((item,i) => i < 3 &&
                                <div key={i} >
                                    {/** User Permission **/}
                                    <Popup
                                        show={modal === i}
                                        title={Lang.get('UserPermissions')}
                                        onClose={()=> setModal(false)}
                                    >
                                        <Permissions state={state} userID={item.id} />
                                    </Popup>
                                    <div className='px-1' key={i} >
                                        <UsersTooltip item={item}
                                                      onDelete={()=> removeUser(item)}
                                                      onPermission={()=> setModal(i)}
                                        >
                                            <img src={item.avatar} alt={item.fullname}
                                                 style={App.memberBorders(item.type)}
                                            />
                                        </UsersTooltip>
                                    </div>
                                </div>
                            )
                        }

                        {
                            // More Users
                            users.length > 3 &&
                            <ProjectUsersTooltip item={users} >
                                <div className='btn more_users' >
                                    +{users.length - 3}
                                </div>
                            </ProjectUsersTooltip>
                        }

                        <div className='row d-flex flex-column' >
                            <button className='btn btn-primary btn-circle'
                                    onClick={openMembersModal} style={{ width:38, height:40, margin:'1px 0 0 13px' }}
                            >
                                <i className='feather feather-plus fs-16' />
                            </button>
                        </div>

                    </div>
            </div>
        </ErrorBoundary>
    )
}