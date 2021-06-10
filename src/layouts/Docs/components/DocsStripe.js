import React from "react";
import {Add} from "./Add";
import {inArray} from "@lib";
import {Lang} from "@plugins";
import {useModal} from "@hooks";
import { useHistory, Link } from "react-router-dom";
import {ErrorBoundary, Loading, Popup} from "@components";
import { TreeViewComponent, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';

export const DocsStripe = ({state, setState, onDragEnd, refresh}) => {

    const [new_id, setNew_id] = React.useState('')
    const [data, setData] = React.useState(state.docs)
    const modal = useModal()
    const history =  useHistory()


    const menuClick = () => {
        modal.show("add_sub")
    }

    const fields = { dataSource: state.docs, id: 'id', text: 'title', child: 'children', hasChild: true }

    React.useEffect(()=>{
        setData(state.docs)
    },[state.docs])

    const getNode = (data) => {
        // $(".e-treeview")[1].querySelector(".e-list-item")
        history.push(`/docs/${state?.project_id}/${data.node?.dataset.uid}`)
        setState({docs_id: data.node?.dataset.uid})


        // if(data.event.path[0].classList[0] === 'feather') {
        //     setData(data.node.ariaExpanded = false)
        // }
        // else {
        //     $(".e-treeview")[1].querySelector(".e-list-item")
        //     history.push(`/docs/${state?.project_id}/${data.node?.dataset.uid}`)
        //     setState({docs_id: data.node?.dataset.uid})
        // }
    }


    function nodeTemplate(data) {
        return (
            <div className='w-100' >
                <div className="dropdown d-flex justify-content-between align-items-center">
                    <span>{data.title}</span>
                    <i className='feather feather-more-vertical' id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />

                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <ErrorBoundary>
            {/** Docs Sub Add Modal **/}
            <Popup
                show={inArray("add_sub", modal.modals)}
                title={Lang.get("AddSub")}
                onClose={() => modal.hide("add_sub")}
            >
                <Add
                    _id={new_id || state.docs_id}
                    type={'add_sub'}
                    refresh={refresh}
                    onClose={() => modal.hide("add_sub")}
                />
            </Popup>

            <div className='docs__stripe py-3' style={{ overflowY:'auto' }} >
                {
                    state.docs.length
                        ?
                        <div>
                            <TreeViewComponent
                                id='tree'
                                fields={fields}
                                allowDragAndDrop={true}
                                expandOn={'Click'}
                                nodeDragStop={(data)=>onDragEnd(data) + console.log(data)}
                                // nodeTemplate={(data)=> nodeTemplate(data)}
                                nodeClicked={(data)=> getNode(data)}
                            />
                            <ContextMenuComponent
                                target='#tree'
                                items={[{ text: 'Add Sub' }]}
                                select={() => menuClick()}
                            />
                        </div>
                        :
                        <div className='text-cent   er mt-5' >
                            {state.data.length ? <h1>{Lang.get("NoDocs")}</h1> : <Loading />}
                        </div>
                }
            </div>
        </ErrorBoundary>
    )
}
