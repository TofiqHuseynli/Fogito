// More Users with Tooltip
import React from "react";
import {ErrorBoundary} from "@components";
import {Tooltip} from "antd";
import {Lang} from "@plugins";



export const ProjectUsersTooltip = ({item, children}) => {

    const [visible, setVisible] = React.useState(false);
    const style = { minWidth: 300 }

    return (
        <ErrorBoundary>
            <Tooltip title={ <Content user={item} close={()=> setVisible(false)} /> }
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
    )
}


export const Content = ({user, close}) => {

    //  styles
    const st = {
        mainCont: {minWidth: 150, borderRadius: 10, paddingBottom: 5, maxHeight:270, overflowY:'auto'},
        image:    {minWidth: 65, minHeight: 65, maxWidth: 65, maxHeight: 65, borderRadius: '100%'},
        fullName: {lineHeight: 1, fontSize: 16, color: '#7496AB'},
        type:     {lineHeight: 1, fontSize: 13, color: '#BDC7CD'},
        line:     {height: 2, width: 50, backgroundColor: ()=> memberBorders(user.type)},
    }

    return(
        <div className="d-flex flex-column" style={st.mainCont} >
            <div className='tooltip__header' >
                <p>{Lang.get("Users")}</p>
                <i className='feather feather-x' onClick={close} />
            </div>
            <div>
                {user.map((item,i) =>
                    <div className='users_list px-1' key={i} >
                        <div className='list__item' >
                            <img src={item.avatar} alt='' style={{ width:43, height: 43 }} />
                            <div className='list__info' >
                                <h5>{item.fullname}</h5>
                                <p className='badge badge-primary' >{item.type}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
