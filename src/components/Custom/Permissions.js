import React from "react";
import {permissionsList, permissionsSet} from "@actions";
import classNames from "classnames";
import {ErrorBoundary, InputCheckbox, Loading} from 'fogito-core-ui';


export const Permissions = ({state, userID}) => {

    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])

    const refresh = async () => {
        setLoading(true)
        let data = {project_id: state.id, user_id: userID}
        let response = await permissionsList({data});

        if(response) {
            setLoading(false)
            if (response.status === 'success') {
                setData(response.data)
            }
        }
    }

    const onChange = async (field, value) => {
        setLoading(true)
        let response = await permissionsSet({
            data: {
                project_id: state.id,
                field: field,
                value: value,
                user_id: userID
            }
        })
        if (response) {
            setLoading(false)
            if (response.status === "success") {
                setData(
                    data.map((item) => {
                        if (field === "set_permission" && value) {
                            item.value = value;
                        } else {
                            if (item.key === field) {
                                item.value = value;
                            }
                        }
                        return item;
                    })
                );
            } else {
                toast.fire({ icon: "error", title: response.description });
            }
        }
    };



    React.useEffect(()=> {
        refresh()
    },[])



    return (
        <ErrorBoundary>
            {loading && <Loading />}
            {data.map((item, key) => (
                <div className={classNames({ "mt-3": key !== 0 })} key={key}>
                    <InputCheckbox label={item.title}
                                   checked={item.value}
                                   onChange={(e) => onChange(item.key, e.target.checked)}
                    />
                </div>
            ))}
        </ErrorBoundary>
    )
}