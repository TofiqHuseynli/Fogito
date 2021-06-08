import React from "react";
import {ErrorBoundary, Inputs} from "@components";
import {permissionsList, permissionsSet} from "@actions";
import classNames from "classnames";


export const Permissions = ({state, userID}) => {

    const [data, setData] = React.useState([])

    const refresh = async () => {
        let data = {project_id: state.id, user_id: userID}
        let response = await permissionsList({data});

        if(response) {
            if (response.status === 'success') {
                setData(response.data)
            }
        }
    }

    const onSetPermissions = async (val, key) => {
        let response = await permissionsSet({
            data: {
                project_id: state.id,
                field: key,
                value: val,
                user_id: userID
            }
        })
        if(response.status === 'success') {
            setData(
                data?.map((item) => {
                    if (item.key === key) {
                        item.value = val;
                    }
                    return item;
                })
            );
        }
    }


    React.useEffect(()=> {
        refresh()
    },[])



    return (
        <ErrorBoundary>
            <div>
                {data.map((item, key) => (
                    <div className={classNames({ "mt-3": key !== 0 })} key={key}>
                        <Inputs type={'checkbox'}
                                label={item.title}
                                checked={item.value}
                                onChange={(e) => onSetPermissions(e ? 1 : 0, item.key)}
                        />
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}