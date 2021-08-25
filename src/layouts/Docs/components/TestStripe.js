import React from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {apisMove} from "@actions";


export const TestStripe = ({state, setState}) => {

    const [data, setData] = React.useState([]);
    const [currentBoard, setCurrentBoard] = React.useState(null)
    const [currentItem, setCurrentItem] = React.useState({});
    const [currentItem2, setCurrentItem2] = React.useState(null)
    const initData = state.docs;

    const onData = () => {
        if(initData) {
            let menuArr = {}
            for(let i in initData) {
                let menu = initData[i];
                if(!menuArr[menu.parent_id])
                    menuArr[menu.parent_id] = []
                    menuArr[menu.parent_id].push(menu.id)
            }
            let menuList = []
            for(let i in initData) {
                let menu = initData[i]
                menu.hasChild = !!menuArr[menu.id] && menuArr[menu.id].length > 0
                menuList.push(menu)
            }
            setData(menuList)
        }
    }

    React.useEffect(()=> {
        initData && onData()
    },[initData])


    // functions
    function dragStartHandlerParent(e, item) {
        console.log('drag', item)
        setCurrentItem(item)
    }

    function dragEndHandlerParent(e) {
        e.target.style.opacity = 1
    }

    function dragOverHandlerParent(e) {
        e.preventDefault();
        e.target.style.opacity = .5
    }

    async function dropHandlerParent(e, item) {
        // e.preventDefault();
        if(currentBoard) {
            item.children.push(currentBoard)
            const currentIndex = currentBoard.children.indexOf(currentItem)
            currentBoard.children.splice(currentIndex, 1)
        }
        setData(data.map(x => {
            if (x.id === item.id) {
                return {...x, index: currentItem.index}
            }
            else if (x.id === currentItem.id) {
                return {...x, index: item.index}
            }
            else if (x.id === currentBoard && currentBoard.id) {
                return currentBoard
            }
            return {...x}
        }
        ))
        e.target.style.opacity = 1
        e.target.style.boxShadow = 'none'
        //         await apisMove(
        //     'dataMove',
        //     {
        //         id: currentItem.id,
        //         project_id: state.pro_id,
        //         parent_id: 0,
        //         // (data.position === "Inside") ? data.droppedNodeData.id : data.droppedNodeData.parentID,
        //         position: item.index
        //     }
        // )
    }


    function dragOverHandler(e, item, child) {
        e.preventDefault()
        if(e.target.className === 'child_item')
            e.target.style.boxShadow = '0 2px 3px gray'
    }

    function dragStartHandler(e, board, child) {
        setCurrentBoard(board)
        setCurrentItem(child)
    }

    function dragEndHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dragLeaveHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dropHandler(e, board, child) {
        e.preventDefault()
        const currentIndex = currentBoard.children.indexOf(currentItem)
        currentBoard.children.splice(currentIndex, 1)
        const dropIndex = board.children.indexOf(child)
        board.children.splice(dropIndex, 0, currentItem)
        setData(
            data.map(b => {
                if(b.id === board.id) {
                    return board
                }
                else if (b.id === currentBoard.id) {
                    return currentBoard
                }
                return b
            })
        )
    }


    const sortItems = (a, b) => {
        if(a.index > b.index) {
            return 1
        } else {
            return -1
        }
    }


    return (
        <ErrorBoundary>
            <div className='stripe' >
                {
                    data.sort(sortItems).map((item,i) => {
                        return (
                            <>
                                <div
                                    onDragStart={(e)=> dragStartHandlerParent(e, item)}
                                    onDragLeave={(e)=> dragEndHandlerParent(e)}
                                    onDragEnd={(e) => dragEndHandlerParent(e)}
                                    onDragOver={(e)=> dragOverHandlerParent(e)}
                                    onDrop={(e)=> dropHandlerParent(e, item)}
                                    draggable={true}
                                    className='stripe_item'
                                    key={i}
                                >
                                    {item.title}
                                </div>
                                {item.children.map(child =>
                                    <div
                                        draggable={true}
                                        onDragOver={(e)=> dragOverHandler(e)}
                                        onDragLeave={(e)=> dragLeaveHandler(e)}
                                        onDragStart={(e)=> dragStartHandler(e, item, child)}
                                        onDragEnd={(e) => dragEndHandler(e)}
                                        onDrop={(e)=> dropHandler(e, item, child)}
                                        className='child_item'
                                    >
                                        {child.title}
                                    </div>
                                )}
                            </>
                        )
                    })
                }
            </div>
        </ErrorBoundary>
    )
}