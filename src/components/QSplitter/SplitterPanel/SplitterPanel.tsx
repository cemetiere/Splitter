import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import styles from './SplitterPanel.module.scss'

interface SplitterPanelProps{
    align: string,
    headerText: string,
    size: number,
    children: React.ReactNode,
}
export interface PanelRefType{
    hide: ()=>void,
    show: ()=>void
}
function SplitterPanel(props: SplitterPanelProps, ref: Ref<PanelRefType>) {
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        if (props.size <= 5) {
            setHidden(true)
        }
        if (props.size > 5) {
            setHidden(false)
        }
    }, [props.size]);

    const hide = () => {
        setHidden(true)
    }
    const show = () => {
        setHidden(false)
    }

    useImperativeHandle(ref, () => ({hide, show}))
    return props.align === 'vertical' ?
        <div className={hidden?styles.SplitterPanelVerticalHidden:styles.SplitterPanelVertical}
             style={{height: `${props.size}%`}}>
            <div className={hidden ? styles.SplitterPanelHeaderHidden : styles.SplitterPanelHeader}><span
                className={hidden ? styles.HeaderTextHidden : styles.HeaderText}>{props.headerText}</span></div>
            <div
                className={hidden ? styles.SplitterPanelContentHidden : styles.SplitterPanelContent}>{props.children}</div>
        </div>
        :
        <div className={hidden?styles.SplitterPanelHidden:styles.SplitterPanel}
             style={{width: `${props.size}%`}}>
            <div className={hidden ? styles.SplitterPanelHeaderHidden : styles.SplitterPanelHeader}><span
                className={hidden ? styles.HeaderTextHidden : styles.HeaderText}>{props.headerText}</span></div>
            <div
                className={hidden ? styles.SplitterPanelContentHidden : styles.SplitterPanelContent}>{props.children}</div>
        </div>

}

export default forwardRef(SplitterPanel);