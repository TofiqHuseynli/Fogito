import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {TreeViewComponent, ContextMenuComponent} from '@syncfusion/ej2-react-navigations';
import {ErrorBoundary, Loading, useCookie, Lang, useToast,} from 'fogito-core-ui'
import {Empty} from "antd";
import {docsMove} from "@actions";

export const DocsSidebar = ({state, setState, onAddRequest}) => {
    const toast = useToast()
    const history = useHistory()
    const cookie = useCookie()

    const [formattedList, setFormattedList] = React.useState([])
    const initData = state.docs;

    async function onDragEnd(data) {
        let response = await docsMove({
            id: data.draggedNodeData.id,
            workspace_id: state.workspace_id,
            parent_id: (data.position === "Inside") ? data.droppedNodeData.id : data.droppedNodeData.parentID,
            position: data.dropIndex + 1
        });

        if (response.status === 'error') {
            toast.fire({
                title: response.description,
                icon: response.status,
            });
        }
    }

    const onNodeClicked = (data) => {
        let docsId = data.node?.dataset.uid;
        if (data.node.ariaExpanded !== null) {
            cookie.set('_stripe_id', docsId, 1)
        }
        history.push(`/docs/${state?.workspace_id}/${docsId}`)
        setState({docs_id: docsId})
    }


    const formatMenuItems = () => {
        if (!initData) return;

        let menuArr = {};
        for (let i in initData) {
            let menu = initData[i];
            if (!menuArr[menu.parent_id])
                menuArr[menu.parent_id] = [];
            menuArr[menu.parent_id].push(menu.id);
        }

        let menuList = [];
        for (let i in initData) {
            let menu = initData[i];
            menu.hasChild = !!(menuArr[menu.id] && menuArr[menu.id].length > 0);
            menu.expandAll = false
            if (menu.parent_id === 0 && menu.hasChild)
                delete menu.parent_id;
            else if (menu.parent_id === 0 && !menu.hasChild)
                delete menu.parent_id
            menuList.push(menu)

            const row = initData.find(x => x.id === cookie.get('_stripe_id')) || ''
            const rowChild = initData.find(x => x.id === state.docs_id) || ''
            Object.assign(row, {expanded: true})
            Object.assign(rowChild, {expanded: true, isSelected: true})
        }
        setFormattedList(menuList)
    }

    useEffect(() => {
        initData && formatMenuItems()
    }, [initData])


    return (
        <ErrorBoundary>
            <button
                className="btn btn-primary m-0 my-2"
                onClick={() => onAddRequest('folder')}
            >
                <i className="feather feather-plus fs-18 align-middle mr-1"/>
                {Lang.get("Add")}
            </button>

            <div className='content_scroll'>

                {state.loadingContent && <Loading/>}

                {!!formattedList.length && (
                    <>
                        <TreeViewComponent
                            id='tree'
                            fields={{
                                dataSource: formattedList,
                                id: 'id',
                                parentID: 'parent_id',
                                text: 'title',
                                selected: 'isSelected',
                                hasChildren: 'hasChild'
                            }}
                            allowDragAndDrop={true}
                            expandOn='Click'
                            nodeDragStop={(data) => onDragEnd(data)}
                            nodeClicked={(data) => onNodeClicked(data)}
                        />
                        <ContextMenuComponent
                            target='#tree'
                            select={(item) => onAddRequest(item?.item?.properties?.id)}
                            items={[
                                {id: "document", text: Lang.get('Request')},
                                {id: "folder", text: Lang.get('Folder')}
                            ]}
                        />
                    </>
                )}

                {!formattedList.length && (
                    <Empty className='text-muted mt-6' description={Lang.get("NoData")}/>
                )}
            </div>
        </ErrorBoundary>
    )
}
