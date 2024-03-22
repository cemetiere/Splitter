import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import styles from './SplitterPanel.module.scss'

interface SplitterPanelProps{
    align: string,
    headerText: string,
    size: number,
    hidden: boolean,
    children: React.ReactNode,
}

function SplitterPanel(props: SplitterPanelProps) {
    const hidden = props.hidden;

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

export default SplitterPanel;