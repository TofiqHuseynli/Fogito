// One Members tooltip
import React from "react";

import { ErrorBoundary, Lang } from "fogito-core-ui";
import { Tooltip } from 'antd';


const memberBorders = (type) => {
    switch(type) {
        case 'moderator':
            return {borderColor: '#4EC9B3'};
        case 'employee':
            return {borderColor: '#AECC36'};
        default:
            return {borderColor: '#F99595'};
    }
}

const UsersTooltip = ({ item, children, onDelete, onPermission }) => {

    const [visible, setVisible] = React.useState(false);
    const style = { minWidth: 300 }

    return(
        <ErrorBoundary>
            <Tooltip title={ <Content user={item} onDelete={onDelete} onPermission={onPermission} close={()=> setVisible(false)} /> }
                     trigger='click'
                     color={'#fff'}
                     placement='bottom'
                     visible={!!visible}
                     onVisibleChange={(visible) => setVisible(visible)}
                     overlayStyle={style}
            >
                {children}
            </Tooltip>
        </ErrorBoundary>
    );
}

export default UsersTooltip;


export const Content = ({ user, onPermission, onDelete, close }) => {

    //  styles
    const st = {
        mainCont: {minWidth: 150, borderRadius: 10},
        image:    {minWidth: 65, minHeight: 65, maxWidth: 65, maxHeight: 65, borderRadius: '100%'},
        fullName: {lineHeight: 1, fontSize: 16, color: '#7496AB'},
        type:     {lineHeight: 1, fontSize: 13, color: '#BDC7CD'},
        line:     {height: 2, width: 50, backgroundColor: ()=> memberBorders(user.type)},
    }


    return(
        <div className="d-flex flex-column" style={st.mainCont} >
            <div className="d-flex justify-content-between" style={{ padding:10 }}>
                <div className="d-flex align-items-center mb-3"  >
                    <img src={!!user.avatar && user.avatar} className="mr-3" style={st.image} />
                    <div className="d-flex flex-column justify-content-center">
                        <div className="fw-500 mb-1" style={st.fullName}>{user.fullname}</div>
                        <div className="_mb-15" style={st.type}>@{user.type}</div>
                        <div style={st.line} />
                    </div>
                </div>
                <div className="x-button" style={{top: 13, right: 13}} onClick={close}>
                    <i className="feather feather-x x-button fs-18 cr-pointer" style={{color: "#6FA3C0"}} />
                </div>
            </div>

            <div className="btn tooltip_button d-flex justify-content-start" onClick={onPermission} >
                <div>{Lang.get("UserPermissions")}</div>
            </div>
            <div className="btn tooltip_button d-flex justify-content-start" onClick={onDelete}>
                <div>{Lang.get('Remove')}</div>
            </div>
        </div>
    )
}


