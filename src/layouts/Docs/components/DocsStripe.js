import React from "react";
import {Add} from "./Add";
import {inArray} from "@lib";
import {Lang} from "@plugins";
import {useCookie, useModal} from "@hooks";
import { useHistory } from "react-router-dom";
import {ErrorBoundary, Loading, Popup} from "@components";
import { TreeViewComponent, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';

export const DocsStripe = ({state, setState, onDragEnd, refresh}) => {

    const history =  useHistory()
    const cookie = useCookie()
    const modal = useModal()
    const [data, setData] = React.useState(state.docs)
    const [new_id, setNew_id] = React.useState('')

    const fields = { dataSource: state.docs, expanded: 'expanded', id:'id', text: 'title', child: 'children' }

    const menuClick = () => modal.show("add_sub")

    const getNode = (data) => {
        if(data.node.ariaExpanded !== null) {
            // save id for stripe api
            cookie.set('_stripe_id', data.node?.dataset.uid, 1)
        }
        history.push(`/docs/${state?.project_id}/${data.node?.dataset.uid}`)
        setState({docs_id: data.node?.dataset.uid})
    }


    React.useEffect(()=>{
        setData(state.docs)
    },[state.docs])


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
