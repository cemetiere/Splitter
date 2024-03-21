import React, {Children, createRef, useEffect, useRef, useState} from 'react';
import SplitterPanel, {PanelRefType} from "./SplitterPanel/SplitterPanel";
import styles from './QSplitter.module.css'
import SplitterBar from "./SplitterBar/SplitterBar";

interface QSplitterProps{
    width: string,
    height: string,
    align: string,
    headers: string[],
    children: React.ReactNode
}
function QSplitter(props: QSplitterProps) {
    let panels  = Array(Children.count(props.children)).fill(0).map(i=>React.createRef<PanelRefType>());
    const thisComponent = useRef<HTMLDivElement>(null)
    let [sizes, setSizes]  = useState(Array(Children.count(props.children)).fill(100/Children.count(props.children)));
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



    function hideLeftPanel(leftPanelIndex: number, rightPanelIndex: number){

        if(panels[leftPanelIndex].current && panels[rightPanelIndex].current){
            let modifiedSizes = sizes.map((s,i)=>{
                if(i==leftPanelIndex) {
                    return minSize
                } else if(i==rightPanelIndex){
                    return maxSize
                } else {
                    return s;
                }
            })
            setSizes(modifiedSizes);
            panels[leftPanelIndex].current?.hide();
            panels[rightPanelIndex].current?.show();
        }
    }
    function hideRightPanel(leftPanelIndex: number, rightPanelIndex: number){
        if(panels[leftPanelIndex].current && panels[rightPanelIndex].current){
            let modifiedSizes = sizes.map((s,i)=>{
                if(i==leftPanelIndex) {
                    return maxSize
                } else if(i==rightPanelIndex){
                    return minSize
                } else {
                    return s;
                }
            })
            setSizes(modifiedSizes)
            panels[leftPanelIndex].current?.show()
            panels[rightPanelIndex].current?.hide()

        }
    }

    function moveSplitterBar(event:any, leftPanelIndex: number, rightPanelIndex: number){
        let leftSum: number = 0;
        for(let i = 0; i<leftPanelIndex; i++){
            leftSum+=sizes[i];

        }

        function moveAt(coordinate:number){
            const realSize = props.align==='vertical'?
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);

            if(realSize && thisComponent.current){
                console.log((coordinate-thisComponent.current.offsetLeft-realSize*leftSum/100)+" "+(realSize))
                let percent = props.align==='vertical'?
                    (coordinate-thisComponent.current.offsetTop-realSize*leftSum/100)/(realSize)*100:
                    (coordinate-thisComponent.current.offsetLeft-realSize*leftSum/100)/(realSize)*100;


                if(percent>=minSize && percent<=maxSize){
                    let modifiedSizes = sizes.map((s,i)=>{
                        if(i==leftPanelIndex) {

                            return percent
                        } else if(i==rightPanelIndex){

                            return sizes[leftPanelIndex]+sizes[rightPanelIndex]-percent
                        } else {
                            return s;
                        }
                    })
                    setSizes(modifiedSizes)
                }

                if(props.align==='vertical'){
                    if(coordinate<40+thisComponent.current.offsetTop){hideLeftPanel(leftPanelIndex,rightPanelIndex)}
                    if(coordinate>realSize+thisComponent.current.offsetTop-40){hideRightPanel(leftPanelIndex,rightPanelIndex)}
                } else {
                    if(coordinate<40+thisComponent.current.offsetLeft){hideLeftPanel(leftPanelIndex,rightPanelIndex)}
                    if(coordinate>realSize+thisComponent.current.offsetLeft-40){hideRightPanel(leftPanelIndex,rightPanelIndex)}
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

    const splitterItems = childrenArray.map((panel, index)=>{
        if(index!=childrenArray.length-1){
            return (
                <>
                    <SplitterPanel align={props.align} size={sizes[index]} ref={panels[index]} headerText={props.headers[index]}>{panel}</SplitterPanel>
                    <SplitterBar align={props.align} leftClick={()=>hideLeftPanel(index, index+1)} rightClick={()=>hideRightPanel(index, index+1)} onMouseDown={(e:any)=>moveSplitterBar(e, index,index+1)}/>
                </>
            )
        } else {
            return (<SplitterPanel align={props.align} size={sizes[index]} ref={panels[index]} headerText={props.headers[index]}>{panel}</SplitterPanel>)
        }

    })

    return (
        <div ref={thisComponent} className={props.align==='vertical'?styles.QSplitterVertical:styles.QSplitter} style={{width: props.width, height: props.height}}>
            {splitterItems}
        </div>
    );
}

export default QSplitter;