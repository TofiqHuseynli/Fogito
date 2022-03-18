import React from "react";
import {ErrorBoundary} from "fogito-core-ui";



export const MyComp = () => {

    const [data, setData] = React.useState([
        {
            "id": "614989b7917bcf2dcc33a412",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": 0,
            "title": "Offers",
            "index": 1,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "615041644605d0704c1b6a1f",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": 0,
            "title": "Parameters",
            "index": 1,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "6152f23f912b0614922b99a4",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "61501fbb24aa8c4a1a134cc8",
            "title": "info",
            "index": 1,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614989bcfa3e186f0d649602",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Add",
            "index": 2,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "61501b2324aa8c4a1a134ca4",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "61501fbb24aa8c4a1a134cc8",
            "title": "Add",
            "index": 2,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "61501d7a24aa8c4a1a134cac",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "61501b2324aa8c4a1a134ca4",
            "title": "List",
            "index": 3,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "61501df424aa8c4a1a134cb2",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "61501b2324aa8c4a1a134ca4",
            "title": "Delete",
            "index": 3,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "6150225324aa8c4a1a134d14",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Change status",
            "index": 3,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614ee66024aa8c4a1a134c1b",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Delete Item or Fine",
            "index": 4,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614ee73c4605d0704c1b6884",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "List",
            "index": 4,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "6152f28d912b0614922b99ab",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "61501fbb24aa8c4a1a134cc8",
            "title": "Edit",
            "index": 4,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614ee5de4605d0704c1b686d",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Delete",
            "index": 5,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "61501fbb24aa8c4a1a134cc8",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": 0,
            "title": "Terms & Conditions",
            "index": 5,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614ee83ac21710062f5ecd0d",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Info",
            "index": 6,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        },
        {
            "id": "614ee8d924aa8c4a1a134c36",
            "project_id": "614989affa3e186f0d6495fd",
            "parent_id": "614989b7917bcf2dcc33a412",
            "title": "Edit",
            "index": 7,
            "status": {
                "label": "Active",
                "value": 1,
                "dex": "#4b7bec"
            },
            "public": 0
        }
    ])

    const getList = () => {
        let menuArr = {};
        for(let i in data){
            let menu = data[i];
            if(!menuArr[menu.parent_id])
                menuArr[menu.parent_id] = [];
            menuArr[menu.parent_id].push(menu.id);
        }
        let children = [];
        for(let i in data) {
            let menu = data[i]
            menu.child = []
            menu.hasChild = menuArr[menu.id] && menuArr[menu.id].length > 0 ? true : false
            children.push(menu)
        }
        let test = []
        for(let i in children) {
            let menu = children[i]
            menu.child = children.filter(x => x.parent_id === menu.id)
            test.push(menu)
        }
        setData(test.filter(x => !x.parent_id))
    }

    React.useEffect(()=> {
        getList();
    },[])


    return(
        <ErrorBoundary>
            <div className='d-flex flex-column' >
                <File data={data} setData={setData} />
            </div>
        </ErrorBoundary>
    )
}



export const File = ({data, setData}) => {

    const [currentItem, setCurrentItem] = React.useState(null)
    const [currentEnter, setCurrentEnter] = React.useState(null)
    const [currentIndex, setCurrentIndex] = React.useState(null)

    let items = document.querySelectorAll('.test_card .item');

    const onDragStart = (e, item, index) => {
        e.target.style.opacity = '.4';
        setCurrentItem(item);
        setCurrentIndex(index)
    }

    const onDragEnd = (e, item) => {
        e.target.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    const onDrop = (e, item, index) => {
        if(item.id === currentItem.parent_id) {
            console.log('inside')
        } else {
            let elem = data[currentIndex]
            data.splice(currentIndex, 1);
            data.splice(index, 0, elem)
            setData([...data])
        }
    }

    const onDragOver = (e, item) => {
        e.preventDefault();
        return false;
    }

    const onDragEnter = (e, item) => {
        if(!currentItem.id && !item.id) {
        } else {
            if (item.id === currentItem.id) {
            } else {
                e.target.classList.add("over");
            }
            setCurrentEnter(item)
        }
    }

    const onDragLeave = (e) => {
        e.target.classList.remove("over");
    }


    return(
        <div>
            {
                data.length && data.map((item,i) => {
                    return (
                        <div key={i} >
                            <div
                                onDragStart={(e)=> onDragStart(e, item, i)}
                                onDragEnd={(e)=> onDragEnd(e, item)}
                                onDragOver={(e)=> onDragOver(e, item)}
                                onDragEnter={(e)=> onDragEnter(e, item)}
                                onDragLeave={(e)=> onDragLeave(e)}
                                onDrop={(e)=> onDrop(e, item, i)}
                                key={i}
                                draggable={true}
                                className='test_card'
                            >
                                <div className='children' />
                                    <div className='item' >
                                        {item.title}
                                        <div className='ml-2' >
                                            {item.hasChild && <File data={item.child} setData={setData}/>}
                                        </div>
                                    </div>
                                <div className='children' />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export function useDetectFirstRender() {
    const [firstRender, setFirstRender] = React.useState(true);

    React.useEffect(() => {
        setFirstRender(false);
    }, []);

    return firstRender;
}
