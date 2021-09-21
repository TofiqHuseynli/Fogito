import React from "react";
import {ErrorBoundary} from "fogito-core-ui";



export const MyComp = ({ param, setParam }) => {

    const [data, setData] = React.useState([
        {
            key: 'test 1',
            children: [
                {
                    key: 'child 1',
                    children: []
                }
            ]
        },
        {
            key: 'test 2',
            children: [
                {
                    key: 'child 2',
                    children: []
                }
            ]
        },
        {
            key: 'test 3',
            children: [
                {
                    key: 'child 3',
                    children: []
                }
            ]
        },
        {
            key: 'test 4',
            children: [
                {
                    key: 'child 4',
                    children: []
                }
            ]
        },
    ])
    const [currentItem, setCurrentItem] = React.useState(null)
    const [currentIndex, setCurrentIndex] = React.useState(null)
    const [currentData, setCurrentData] = React.useState(null)
    const [hoverClassname, setHoverClassname] = React.useState(null)

    const getPush = () => {
        setData(data.map((x, i) => {
            return {...x, order: i}
        }))
    }


    function onDragStart(e, item, i) {
        setCurrentItem(item)
        setCurrentIndex(i)
    }

    function onDragLeave(e) {
        e.target.style.border = '1px solid black'
    }

    function onDragEnd(e) {
        e.target.style.border = '1px solid black'
    }

    function onDragOver(e) {
        e.preventDefault()
        e.target.style.border = '1px solid red'
        setHoverClassname(e.target.className)
    }

    function onDrop(e, item, index) {
        e.preventDefault()
        if(hoverClassname === 'test_card_children') {
            setData(data.map((c, i) => {
                if (i === index) {
                    return {...c, order: currentItem.order}
                }

                if (i === currentIndex) {
                    return {...c, order: item.order}
                }
                return c
            }))
        } else {

            setData(data.map((c, i) => {
                if (i === index) {
                    return {...c, children:  'children'}
                }

                if (i === currentIndex) {
                    return {...c, order: item.order}
                }
                return c
            }))
        }
        e.target.style.border = '1px solid black'
    }


    function onDragStartChild(e, item, row, i) {
        setCurrentData(item)
        setCurrentItem(item)
        setCurrentIndex(i)
    }

    function onDragLeaveChild(e) {

    }

    function onDragEndChild(e) {

    }

    function onDragOverChild(e) {
        e.preventDefault()

    }

    function onDropChild(e, item, row, index) {
        e.preventDefault()
        const selectedIndex = currentData.children.indexOf(currentItem)
        currentData.children.splice(selectedIndex, 1)
        const dropIndex = item.children.indexOf(row);
        item.children.splice(dropIndex + 1, 0, currentItem)
        setData(data.map((b,i) => {
            if(i === index) {
                return item
            }
            if (i === currentIndex) {
                return currentData
            }
            return b
        }))
    }

    const sortableF = (a, b) => {
        if(a.order > b.order) {
            return 1
        } else {
            return -1
        }
    }

    console.log('my data',currentData)

    React.useEffect(()=> { getPush() },[])

    return(
        <ErrorBoundary>
            <div className='d-flex flex-column' >
            {
                data.sort(sortableF).map((item,i) => {
                    return (
                        <>
                            <div
                                onDragStart={(e)=> onDragStart(e, item, i)}
                                onDragLeave={(e)=> onDragLeave(e)}
                                onDragEnd={(e)=> onDragEnd(e)}
                                onDragOver={(e)=> onDragOver(e)}
                                onDrop={(e)=> onDrop(e, item, i)}
                                key={i}
                                draggable={true}
                                className='test_card'
                            >
                                <div className='test_card_children' />
                                <div className='item' >
                                    {item.key}
                                </div>
                                <div className='test_card_children' />
                            </div>
                            <div  className='children_'  >
                                {item.children.map((row,i) => (
                                    <div className='children_item'
                                         onDragStart={(e)=> onDragStartChild(e, item, row, i)}
                                         onDragLeave={(e)=> onDragLeaveChild(e)}
                                         onDragEnd={(e)=> onDragEndChild(e)}
                                         onDragOver={(e)=> onDragOverChild(e)}
                                         onDrop={(e)=> onDropChild(e, item, row, i)}
                                         key={i}
                                         draggable={true}
                                    >
                                        {row.key}
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                })
            }
            </div>
        </ErrorBoundary>
    )
}
