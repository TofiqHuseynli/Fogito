import React from "react";
import {ErrorBoundary, Inputs, Loading} from "@components";
import {apisMinList, apisMove, documentationStripe, projectsMinList} from "@actions";
import {Lang} from "@plugins";


export const MoveModal = ({state, setState, id, onHide}) => {

    const [loading, setLoading] = React.useState(true)
    const [project, setProject] = React.useState([])
    const [apis, setApis] = React.useState([])
    const [params, setParams] = React.useState({
        projectID: '',
        parentID: ''
    })

    const loadProject = async () => {
        setLoading(true)
        let response = await projectsMinList({sort: {field: "created_at", order: "asc"}})
        if(response.status === 'success') {
            setProject(response.data)
            setLoading(false)
        }
    }

    const loadApis = async () => {
        setLoading(true)
        let response = await documentationStripe({project_id: state.data.project_id && params.projectID})
        if(response.status === 'success') {
            setApis(response.data.list)
            setLoading(false)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const url = 'dataMove';
        const obj = {
            id: id,
            project_id: state.data.project_id && params.projectID,
            parent_id: state.data.project_id && params.parentID,
            position: 1
        };
        await apisMove(url, obj);
        onHide();
    }

    React.useEffect(()=> {
        loadProject()
    },[])

    React.useEffect(()=> {
        loadApis()
    },[params.projectID])


    return (
        <ErrorBoundary>
            {loading && <Loading />}
            <form onSubmit={onSubmit} >
                <Inputs type='select'
                        onSelect={(v) => setParams({...params, projectID: v.target.value}) + console.log('dsd',v.target.value)}
                        data={project}
                        propsClass={'custom-input'}
                        divClass={'row px-2'}
                        selected={state.data.project_id}
                        label={"Project"}
                />
                <Inputs type='select'
                        onSelect={(v) => setParams({...params, parentID: v.target.value})}
                        data={apis}
                        propsClass={'custom-input'}
                        divClass={'row px-2 mt-2'}
                        selected={state.docs_id}
                        label={"Apis"}
                />

                <div>
                    <label className='label' >{Lang.get("Position")}</label>
                    <select placeholder={'Position'}
                            className="custom-select border-none shadow-none"
                            style={{height: 45, paddingLeft: 15, border: 'none', color: '#737373'}}
                            // onChange={onSelect}
                    >
                        {
                            !!apis && apis.map((item, index) => (
                                <option key={index}
                                        value={"1"}
                                        selected={'1'}
                                >
                                    {index + 1}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button>{Lang.get("Move")}</button>
            </form>
        </ErrorBoundary>
    )
}