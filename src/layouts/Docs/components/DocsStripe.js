import React, {useEffect} from "react";
import {Add} from "./Add";
import { useHistory } from "react-router-dom";
import { TreeViewComponent, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import {Popup, ErrorBoundary, Loading, useCookie, useModal} from 'fogito-core-ui'
import {Lang} from "@plugins";

export const DocsStripe = ({state, setState, onDragEnd, refresh}) => {

    const history =  useHistory()
    const cookie = useCookie()
    const modal = useModal()

    const [data, setData] = React.useState([])
    const initData = state.docs;

    const fields = {
        dataSource: data,
        id:'id',
        parentID: 'parent_id',
        text: 'title',
        selected: 'isSelected',
        hasChildren: 'hasChild'
    }

    const menuClick = () => modal.show("add_sub")

    const getNode = (data) => {
        if(data.node.ariaExpanded !== null) {
            // save id for stripe api
            cookie.set('_stripe_id', data.node?.dataset.uid, 1)
        } else {
            // cookie.set('_stripe_child_id', data.node?.dataset.uid, 1)
        }
        history.push(`/docs/${state?.pro_id}/${data.node?.dataset.uid}`)
        setState({docs_id: data.node?.dataset.uid})
    }



    const onOpen = () => {
        if(initData) {
            let menuArr = {};
            for(let i in initData){
                let menu = initData[i];
                if(!menuArr[menu.parent_id])
                    menuArr[menu.parent_id] = [];
                    menuArr[menu.parent_id].push(menu.id);
            }
            let menuList = [];
            for(let i in initData){
                let menu = initData[i];
                menu.hasChild = menuArr[menu.id] && menuArr[menu.id].length > 0 ? true : false;
                menu.expandAll = false
                if(menu.parent_id == 0 && menu.hasChild)
                    delete menu.parent_id;
                else if(menu.parent_id == 0 && !menu.hasChild)
                    delete menu.parent_id
                menuList.push(menu)

                const row = initData.find(x => x.id === cookie.get('_stripe_id')) || ''
                const rowChild = initData.find(x => x.id === state.docs_id) || ''
                Object.assign(row, { expanded: true })
                Object.assign(rowChild, { expanded: true, isSelected: true })
            }
            setData(menuList)
        }
    }

    useEffect(() => {
        initData && onOpen()
    }, [initData])


    return (
        <ErrorBoundary>
            {/** Docs Sub Add Modal **/}
            <Popup
                show={modal.modals.includes("add_sub")}
                title={Lang.get("AddSub")}
                onClose={() => modal.hide("add_sub")}
            >
                <Add
                    _id={state.docs_id}
                    type={'add_sub'}
                    reFocus={onOpen}
                    refreshBoolean={true}
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
