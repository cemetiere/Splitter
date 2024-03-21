import React, {Children, createRef, useEffect, useRef, useState} from 'react';
import SplitterPanel, {PanelRefType} from "./SplitterPanel/SplitterPanel";
import styles from './QSplitter.module.css'
import SplitterBar from "./SplitterBar/SplitterBar";

interface QSplitterProps{
    width: string,
    height: string,
    align: string,
    leftPanelHeader: string,
    rightPanelHeader: string,
    children: React.ReactNode
}
function QSplitter(props: QSplitterProps) {
    const leftPanel = useRef<PanelRefType>(null);
    const rightPanel= useRef<PanelRefType>(null);
    const thisComponent = useRef<HTMLDivElement>(null)
    const [leftPanelSize, setLeftPanelSize] = useState(50);
    const [rightPanelSize, setRightPanelSize] = useState(50);
    const [minSize, setMinSize] = useState(0)
    const [maxSize, setMaxSize] = useState(100)

    useEffect(() => {
        const size = props.align==='vertical'?
            thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
            thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);
        if (size){
            setMinSize(40/size*100);
            setMaxSize(100-40/size*100);
        }

    },[props.align]);

    if(Children.count(props.children) !== 2){
        throw new Error("Only two panels allowed")
    }

    function hideLeftPanel(){
        if(leftPanel.current&&rightPanel.current){
            setLeftPanelSize(minSize)
            setRightPanelSize(maxSize)
            leftPanel.current.hide()
            rightPanel.current.show()
        }
    }
    function hideRightPanel(){
        if(leftPanel.current&&rightPanel.current){
            setRightPanelSize(minSize)
            setLeftPanelSize(maxSize)
            rightPanel.current.hide()
            leftPanel.current.show()
        }
    }

    function moveSplitterBar(event:any){
        function moveAt(coordinate:number){
            const realSize = props.align==='vertical'?
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);
            if(realSize && thisComponent.current){
                let percent = props.align==='vertical'?
                    (coordinate-thisComponent.current.offsetTop)/realSize*100:
                    (coordinate-thisComponent.current.offsetLeft)/realSize*100;


                if(percent>=minSize && percent<=maxSize){
                    setLeftPanelSize(percent)
                    setRightPanelSize(100-percent)
                }
                if(props.align==='vertical'){
                    if(coordinate<40+thisComponent.current.offsetTop){hideLeftPanel()}
                    if(coordinate>realSize+thisComponent.current.offsetTop-40){hideRightPanel()}
                } else {
                    if(coordinate<40+thisComponent.current.offsetLeft){hideLeftPanel()}
                    if(coordinate>realSize+thisComponent.current.offsetLeft-40){hideRightPanel()}
                }


            }
        }
        function onMouseMove(event:any){
            event.stopPropagation()
            props.align==='vertical'?moveAt(event.pageY):moveAt(event.pageX);
        }

        if(thisComponent.current){
            thisComponent.current.addEventListener('mousemove', onMouseMove)
            const drop = () => thisComponent.current?.removeEventListener('mousemove', onMouseMove);
            thisComponent.current.onmouseup = ()=>drop();
            thisComponent.current.onmouseleave = ()=>drop();
        }

    }

    const childrenArray = Children.toArray(props.children)
    return (
        <div ref={thisComponent} className={props.align==='vertical'?styles.QSplitterVertical:styles.QSplitter} style={{width: props.width, height: props.height}}>
            <SplitterPanel align={props.align} size={leftPanelSize} ref={leftPanel} headerText={props.leftPanelHeader}>{childrenArray[0]}</SplitterPanel>

            <SplitterBar align={props.align} onMouseDown={(e:any)=>moveSplitterBar(e)} leftClick={()=>hideLeftPanel()} rightClick={()=>hideRightPanel()}/>

            <SplitterPanel align={props.align} size={rightPanelSize} ref={rightPanel} headerText={props.rightPanelHeader}>{childrenArray[1]}</SplitterPanel>
        </div>
    );
}

export default QSplitter;