import React, {useEffect} from "react";
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

    const [initData, setInitData] = React.useState([])
    const [data, setData] = React.useState([])

    const fields = {
        dataSource: data,
        id:'id',
        parentID: 'parent_id',
        text: 'title',
        child: 'children',
        selected: 'isSelected'
    }

    const menuClick = () => modal.show("add_sub")

    const getNode = (data) => {
        if(data.node.ariaExpanded !== null) {
            // save id for stripe api
            cookie.set('_stripe_id', data.node?.dataset.uid, 1)
        } else {
            cookie.set('_stripe_child_id', data.node?.dataset.uid, 1)
        }
        history.push(`/docs/${state?.project_id}/${data.node?.dataset.uid}`)
        setState({docs_id: data.node?.dataset.uid})
    }


    React.useEffect(()=>{
        setInitData(state.docs)
    },[state.docs])


    const onOpen = () => {
        if(initData) {
            let row = initData.find(x => x.id === cookie.get('_stripe_id')) || '';
            let ret = initData.map(x => {
                if (x.id === row.id) {
                    let ret = {
                        id: x.id,
                        title: x.title,
                        children: x.children,
                        expanded: true,
                        isSelected: true
                    }
                    return ret
                    } else {
                        return {...x}
                    }
                }
            )
            setData([...ret])
        }
    }


    useEffect(() => {
        initData && onOpen()
    }, [initData])

    const onFocus = () => {
        let row = initData.find(x => x.id === state.docs_id);
        console.log( 'rrr',row.children.slice(-1))
        let ret = initData.map(x => {
                if (x.id === row) {
                    let ret = {
                        id: x.id,
                        title: x.title,
                        children: x.children.map(c => {
                            if(c.id === row.children.slice(-1).id)
                            return {
                                ...c,
                                id: c.id,
                                title: c.title,
                                isSelected: true
                            }
                        }),
                        expanded: true,
                    }
                    return ret
                } else {
                    return {...x}
                }
            }
        )
        console.log('ret',ret)
        setData([...ret])
    }

    console.log('data',data)

    return (
        <ErrorBoundary>
            {/** Docs Sub Add Modal **/}
            <Popup
                show={inArray("add_sub", modal.modals)}
                title={Lang.get("AddSub")}
                onClose={() => modal.hide("add_sub")}
            >
                <Add
                    _id={state.docs_id}
                    type={'add_sub'}
                    refresh={refresh}
                    onClose={() => modal.hide("add_sub")}
                />
            </Popup>
            {/*<div onClick={()=> onFocus()} >Click</div>*/}

            <div className='content__scroll' >
                {state.loadingStripe && <Loading />}
                {
                    data.length
                        ?
                        <>
                            <TreeViewComponent
                                id='tree'
                                fields={fields}
                                allowDragAndDrop={true}
                                expandOn='Click'
                                nodeDragStop={(data)=>onDragEnd(data)}
                                nodeClicked={(data)=> getNode(data)}
                            />
                            <ContextMenuComponent
                                target='#tree'
                                items={[{ text: 'Add Sub' }]}
                                select={() => menuClick()}
                            />
                        </>
                        :
                        <div className='d-flex justify-content-center align-items-center' style={{ height:'30rem' }} >
                            {
                                !state.loading &&
                                <div className='d-flex justify-content-center  align-items-center flex-column' >
                                    <img src='/frame/docspanel/assets/icons/noDocs.svg' style={{ width:80, opacity: .4 }} />
                                    <h4 className='mt-2' style={{ opacity: .4 }} >{Lang.get("NoData")}</h4>
                                </div>
                            }
                        </div>
                }
            </div>
        </ErrorBoundary>
    )
}
