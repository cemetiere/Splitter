import React from 'react';
import styles from './SplitterBar.module.scss'

interface SplitterBarProps{
    align: string,
    leftClick: ()=>void,
    rightClick: ()=>void
    onMouseDown: (e:any)=>void;
}


function SplitterBar(props: SplitterBarProps) {
    return (
        <div onMouseDown={props.onMouseDown} className={props.align==='vertical'?styles.SplitterBarVertical:styles.SplitterBar}>
            <div className={props.align==='vertical'?styles.SplitterBarButtonsVertical:styles.SplitterBarButtons}>
                <div onMouseDown={event => event.stopPropagation()} onClick={()=>props.leftClick()} className={styles.Button}><span className={styles.leftArrow}></span></div>
                <div onMouseDown={event => event.stopPropagation()} onClick={()=>props.rightClick()} className={styles.Button}><span className={styles.rightArrow}></span></div>
            </div>
        </div>
    );
}

export default SplitterBar;