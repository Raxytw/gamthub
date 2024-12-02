import { useState, useEffect, useRef } from 'react';
import { TiDelete } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa";
import styles from './Reat.module.scss';

import Loading from './loading/Loading';

export default function Reat() {

    const [data, setData] = useState(null);
    const [savedata, setSavedata] = useState({});
    const [remove, setRemove] = useState(null);
    const [newitem, setNewitem] = useState(null);
    const [draggingItem, setDraggingItem] = useState(null);
    const foodRef = useRef(null);

    // 獲取數據
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetch('https://gamt-api.vercel.app/api/private/reat')
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setData(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    })
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [])

    // 註冊 save 事件
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                updateData();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    // 移除移動
    const moveToWhite = (item) => {
        setRemove(item);
        setTimeout(() => {
            setData((prevData) => {
                const updatedBlack = prevData.black.filter((blackItem) => blackItem !== item);
                const updatedWhite = [...prevData.white, item];
                return { black: updatedBlack, white: updatedWhite };
            });
            setRemove(null);

            setTimeout(() => {
                setNewitem(item);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }, 300);
    };

    const moveToBlack = (item) => {
        setRemove(item);
        setTimeout(() => {
            setData((prevData) => {
                const updatedWhite = prevData.white.filter((whiteItem) => whiteItem !== item);
                const updatedBlack = [...prevData.black, item];
                return { black: updatedBlack, white: updatedWhite };
            });
            setRemove(null);

            setTimeout(() => {
                setNewitem(item);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }, 300);
    };

    // save api
    const updateData = async () => {
        setSavedata(data)
        try {
            await ('https://gamt-api.vercel.app/api/private/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: savedata
            })
                .then((res) => res.json())
                .then((data) => {
                    alert("已存處: ", data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
        } catch (e) {
            alert("當前網路不佳，稍後在試")
        }
    }

    // 輸入添加食物
    const addFood = () => {
        const newFood = foodRef.current.value;
        if (data.white.includes(newFood)) {
            foodRef.current.value = '';
        } else if (newFood !== '') {
            setData((prevData) => ({
                ...prevData,
                white: [...prevData.white, newFood],
            }));
            foodRef.current.value = '';
            setTimeout(() => {
                setNewitem(newFood);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }
    };

    // input 觸發添加
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addFood();
        }
    };

    const handleDragStart = (item) => {
        setDraggingItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add(styles.dragOver);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove(styles.dragOver);
        if (draggingItem) {
            setData((prevData) => {
                const updatedWhite = prevData.white.filter((whiteItem) => whiteItem !== draggingItem);
                const updatedBlack = [...prevData.black, draggingItem];
                return { black: updatedBlack, white: updatedWhite };
            });
            setDraggingItem(null);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.list}>
                <h2>目前抽過</h2>
                <ul
                    className={styles.black}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {Array.isArray(data?.black) ? (
                        data.black.length > 0 ? (
                            data.black.map((item, key) => (
                                <li
                                    key={key}
                                    className={`${newitem === item ? styles.new : ""} ${remove === item ? styles.remove : ""}`}
                                >
                                    <p>{item}</p>
                                    <TiDelete title="刪除" onClick={() => moveToWhite(item)} />
                                </li>
                            ))
                        ) : (
                            <li className={styles.empty}>目前沒有抽過的項目</li>
                        )
                    ) : (
                        <Loading />
                    )}
                </ul>
                <h2>尚未抽過</h2>
                <ul className={styles.white}>
                    {Array.isArray(data?.white) ? (
                        data.white.length > 0 ? (
                            data.white.map((item, key) =>
                                <li
                                    key={key}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className={`${newitem === item ? styles.new : ""} ${remove === item ? styles.remove : ""}`}
                                >
                                    <p>{item}</p>
                                    <FaArrowRight title='移出' onClick={() => moveToBlack(item)} />
                                </li>
                            )) :
                            (
                                <li className={styles.empty}>目前沒有抽過的項目</li>
                            )
                    ) :
                        <Loading />
                    }
                </ul>
                <div className={styles.input}>
                    <input type="text" ref={foodRef} onKeyDown={handleKeyPress} placeholder='Input new food...' />
                </div>
            </div>
            <div className={styles.ui}>
                <div className={styles.view}>

                </div>
                <div className={styles.cmd}>

                </div>
            </div>
        </main >
    )
}