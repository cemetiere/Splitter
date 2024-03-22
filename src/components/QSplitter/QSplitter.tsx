import React, {Children, createRef, useEffect, useRef, useState} from 'react';
import SplitterPanel from "./SplitterPanel/SplitterPanel";
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
    const thisComponent = useRef<HTMLDivElement>(null)
    let [sizes, setSizes]  = useState(Array<number>(Children.count(props.children)).fill(100/Children.count(props.children)));
    const [minSize, setMinSize] = useState(0)
    let [hiddenPanels, setHiddenPanels] = useState(Array<boolean>(Children.count(props.children)).fill(false))
    if(props.align!='vertical' && props.align!='horizontal'){
        throw new Error('align can be only horizontal or vertical')
    }
    useEffect(() => {
        const size = props.align==='vertical'?
            thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
            thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);
        if (size){
            setMinSize(40/size*100);
        }
    },[props.align]);



    function hideLeftPanel(leftPanelIndex: number, rightPanelIndex: number){
        let modifiedSizes = sizes.map((s,i)=>{
            if(i==leftPanelIndex) {
                return minSize
            } else if(i==rightPanelIndex){
                return sizes[leftPanelIndex]+sizes[rightPanelIndex]-minSize
            } else {
                return s;
            }
        })
        setSizes(modifiedSizes);
        let modifiedHiddenPanels = hiddenPanels.map((p, i)=>{
            if(i==leftPanelIndex){
                return true;
            } else if (i==rightPanelIndex) {
                return false;
            } else {
                return p;
            }
        })
        setHiddenPanels(modifiedHiddenPanels)

    }
    function hideRightPanel(leftPanelIndex: number, rightPanelIndex: number){
        let modifiedSizes = sizes.map((s,i)=>{
            if(i==leftPanelIndex) {
                return sizes[leftPanelIndex]+sizes[rightPanelIndex]-minSize
            } else if(i==rightPanelIndex){
                return minSize
            } else {
                return s;
            }
        })
        setSizes(modifiedSizes)
        let modifiedHiddenPanels = hiddenPanels.map((p, i)=>{
            if(i==leftPanelIndex){
                return false;
            } else if (i==rightPanelIndex) {
                return true;
            } else {
                return p;
            }
        })
        setHiddenPanels(modifiedHiddenPanels)
    }

    function moveSplitterBar(event:any, leftPanelIndex: number, rightPanelIndex: number){
        let leftSum: number = 0;
        let rightSum: number = 0;

        for(let i = 0; i<leftPanelIndex; i++){
            leftSum+=sizes[i];
        }
        for(let i = rightPanelIndex+1; i<sizes.length; i++){
            rightSum+=sizes[i];
        }


        function moveAt(coordinate:number){
            const realSize = props.align==='vertical'?
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);
            const offset = props.align==='vertical'?thisComponent.current?.offsetTop:thisComponent.current?.offsetLeft

            if(realSize && offset!=undefined){

                let percent = (coordinate-offset-realSize*leftSum/100)/(realSize)*100;

                if((coordinate>40+offset+(realSize*leftSum/100)) && (coordinate<realSize+offset-40-(realSize*rightSum/100))){
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

                if(coordinate<40+offset+(realSize*leftSum/100)){
                    hideLeftPanel(leftPanelIndex,rightPanelIndex)
                }
                else if(coordinate>realSize+offset-40-(realSize*rightSum/100)){hideRightPanel(leftPanelIndex,rightPanelIndex)}
                else {
                    let modifiedHiddenPanels = hiddenPanels.map((p, i)=>{
                        if(i==leftPanelIndex){
                            return false;
                        } else if (i==rightPanelIndex) {
                            return false;
                        } else {
                            return p;
                        }
                    })
                    setHiddenPanels(modifiedHiddenPanels)
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
                    <SplitterPanel align={props.align} size={sizes[index]} hidden={hiddenPanels[index]}  headerText={props.headers[index]}>{panel}</SplitterPanel>
                    <SplitterBar align={props.align} leftClick={()=>hideLeftPanel(index, index+1)} rightClick={()=>hideRightPanel(index, index+1)} onMouseDown={(e:any)=>moveSplitterBar(e, index,index+1)}/>
                </>
            )
        } else {
            return (<SplitterPanel align={props.align} size={sizes[index]} hidden={hiddenPanels[index]}  headerText={props.headers[index]}>{panel}</SplitterPanel>)
        }

    })

    return (
        <div ref={thisComponent} className={props.align==='vertical'?styles.QSplitterVertical:styles.QSplitter} style={{width: props.width, height: props.height}}>
            {splitterItems}
        </div>
    );
}

export default QSplitter;