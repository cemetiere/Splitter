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
    const HIDDEN_PANEL_SIZE = 40;
    const BAR_SIZE = 12;
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
            setMinSize(HIDDEN_PANEL_SIZE/size*100);
        }
    },[props.align]);



    function hideLeftPanel( tempSizes: number[],leftPanelIndex: number, rightPanelIndex: number): number[]{
        let modifiedSizes = tempSizes.map((s,i)=>{
            if(i==leftPanelIndex) {
                return minSize
            } else if(i==rightPanelIndex){
                return tempSizes[leftPanelIndex]+tempSizes[rightPanelIndex]-minSize
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
        return modifiedSizes;
    }
    function hideRightPanel(tempSizes: number[], leftPanelIndex: number, rightPanelIndex: number): number[]{

        let modifiedSizes = tempSizes.map((s,i)=>{
            if(i==leftPanelIndex) {
                return tempSizes[leftPanelIndex]+tempSizes[rightPanelIndex]-minSize
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
        return modifiedSizes;
    }

    function moveSplitterBar(event:any, leftPanelIndex: number, rightPanelIndex: number){
        let baseLeftIndex = leftPanelIndex;
        let baseRightIndex = rightPanelIndex;

        let previousCoordinate = 0;
        let tempSizes = sizes.slice(0);
        let modifiedHiddenPanels = hiddenPanels.slice(0)

        function moveAt(coordinate:number){
            let isRight: boolean = false;

            if(tempSizes[baseRightIndex]<=minSize) {
                let i = 1;
                while (rightPanelIndex != tempSizes.length - 1) {
                    rightPanelIndex = baseRightIndex + i;
                    i++;
                    if (tempSizes[rightPanelIndex] > minSize) break;
                }
                isRight = true;
            }
            if(coordinate<previousCoordinate){
                rightPanelIndex = baseRightIndex

            }


            if(tempSizes[baseLeftIndex]<=minSize) {
                let i = 1;
                while (leftPanelIndex != 0) {
                    leftPanelIndex = baseLeftIndex - i;
                    i++;
                    if (tempSizes[leftPanelIndex] > minSize) break;
                }
                isRight = false;
            }
            if(coordinate>previousCoordinate){
                leftPanelIndex = baseLeftIndex
            }



            let leftSum: number = 0;
            let leftCount: number = 0;
            let rightSum: number = 0;
            let rightCount: number = 0;
            let middleSum: number = 0;
            let middleCount: number = 0;
            for(let i = 0; i<leftPanelIndex; i++){
                leftSum+=tempSizes[i];
                leftCount++;
            }
            // console.log(hiddenPanels)
            for(let i = leftPanelIndex+1; i<rightPanelIndex; i++){
                middleSum+=tempSizes[i];
                middleCount++;
            }
            for(let i = rightPanelIndex+1; i<sizes.length; i++){
                rightSum+=tempSizes[i];
                rightCount++;
            }
            const realSize = props.align==='vertical'?
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).height):
                thisComponent.current && Number.parseInt(window.getComputedStyle(thisComponent.current).width);
            const offset = props.align==='vertical'?thisComponent.current?.offsetTop:thisComponent.current?.offsetLeft

            if(realSize && offset!=undefined){
                let percent: number;
                if(!isRight){
                    percent = (coordinate-offset-(leftCount+middleCount)*BAR_SIZE/2-realSize*(leftSum+middleSum)/100)/(realSize)*100;
                } else {
                    percent = (coordinate-offset-(leftCount)*BAR_SIZE/2-realSize*(leftSum)/100)/(realSize)*100;
                }
                let minCoordinate = isRight?
                    HIDDEN_PANEL_SIZE+offset+(leftCount+middleCount)*BAR_SIZE/2+(realSize*(leftSum+middleSum)/100):
                    HIDDEN_PANEL_SIZE+offset+(leftCount)*BAR_SIZE/2+(realSize*(leftSum)/100)


                if((coordinate>minCoordinate) && (coordinate<realSize+offset-HIDDEN_PANEL_SIZE-(realSize*(rightSum+middleSum)/100))){

                    tempSizes = tempSizes.map((s,i)=>{
                        if(i==leftPanelIndex) {
                            return percent
                        } else if(i==rightPanelIndex){
                            return tempSizes[leftPanelIndex]+tempSizes[rightPanelIndex]-percent
                        } else {
                            return s;
                        }
                    })
                    setSizes(tempSizes)
                }
                if(coordinate<=HIDDEN_PANEL_SIZE+offset+(leftCount+middleCount)*BAR_SIZE+(realSize*(leftSum+middleSum)/100)){
                    tempSizes = hideLeftPanel(tempSizes, leftPanelIndex,rightPanelIndex)
                }
                else if(coordinate>realSize+offset-HIDDEN_PANEL_SIZE*(rightCount+middleCount)-(realSize*(rightSum+middleSum)/100)){
                    tempSizes =hideRightPanel(tempSizes,leftPanelIndex,rightPanelIndex)
                }
                else {

                    // let modifiedHiddenPanels = hiddenPanels.map((p, i)=>{
                    //     if(i==leftPanelIndex){
                    //         return false;
                    //     } else if (i==rightPanelIndex) {
                    //         return false;
                    //     } else {
                    //         return p;
                    //     }
                    // })
                    // setHiddenPanels(modifiedHiddenPanels)

                    tempSizes.forEach((v, i)=>{
                        if(v>minSize) {
                            console.log(i)
                            modifiedHiddenPanels[i] = false
                        }

                    })
                    setHiddenPanels(modifiedHiddenPanels)
                    console.log(hiddenPanels)
                }
            }
            previousCoordinate = coordinate;
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
                    <SplitterPanel minSize={minSize} align={props.align} size={sizes[index]} hidden={hiddenPanels[index]}  headerText={props.headers[index]}>{panel}</SplitterPanel>
                    <SplitterBar align={props.align} leftClick={()=>hideLeftPanel(sizes, index, index+1)} rightClick={()=>hideRightPanel(sizes, index, index+1)} onMouseDown={(e:any)=>moveSplitterBar(e, index,index+1)}/>
                </>
            )
        } else {
            return (<SplitterPanel minSize={minSize} align={props.align} size={sizes[index]} hidden={hiddenPanels[index]}  headerText={props.headers[index]}>{panel}</SplitterPanel>)
        }

    })

    return (
        <div ref={thisComponent} className={props.align==='vertical'?styles.QSplitterVertical:styles.QSplitter} style={{width: props.width, height: props.height}}>
            {splitterItems}
        </div>
    );
}

export default QSplitter;