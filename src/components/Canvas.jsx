import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCoorToList, updateCoorsInList, getCoorsQuantity } from '../slices/coordinatesSlice';
import { setCurrentDot, getDeleteDotState, getAddDotState, getCurrentDot } from '../slices/operationSlice';
import '../assets/style/components/Canvas.scss';
import Cross from './Cross';
import Figure from './Figure';

const getMouseCoorsRelativeTo = (event, element) => {
    const {x, y, width, height} = document.querySelector(element).getBoundingClientRect();
    let coorX = ((event.clientX - x) * 100) / width;
    let coorY = ((event.clientY - y) * 100) / height;
            
    return {coorX, coorY};
}

const Canvas = () => {

    const currentDot = useSelector(getCurrentDot);
    const deleteDotState = useSelector(getDeleteDotState);
    const addDotState = useSelector(getAddDotState);
    const dispatch = useDispatch();

    const handleMouseClick = (event) => {
        if(addDotState){
            const { coorX, coorY } = getMouseCoorsRelativeTo(event,'.canvas');
            dispatch(addCoorToList({x: coorX, y: coorY}));
        }
    }    

    useEffect( () => {  
        const handleMousePosition = (event) => {
            event.preventDefault(); 
    
            if(currentDot !== -1 && !deleteDotState && !addDotState){
                let { coorX, coorY } = getMouseCoorsRelativeTo(event,'.canvas');
    
                coorX = coorX<0? 0 : coorX>100? 100 : coorX;
                coorY = coorY<0? 0 : coorY>100? 100 : coorY;
                
                dispatch(updateCoorsInList({ ndx:currentDot, coors:{x: coorX, y: coorY}}))
            }
        }
     
        const setCurrentDotToNull = () => {
            dispatch(setCurrentDot(-1));
        }
        
        window.addEventListener('mouseup', setCurrentDotToNull);
        window.addEventListener('mousemove', handleMousePosition);
        return () => {
            window.removeEventListener('mouseup', setCurrentDotToNull);
            window.removeEventListener('mousemove', handleMousePosition);
        }
    });

    return (
      <div className="canvas" onClick={handleMouseClick}>
        {Array(useSelector(getCoorsQuantity)).fill(0).map( (val,ndx) => 
            <Cross id={ndx} key={ndx}/> 
        )}
        <Figure />
      </div>
    );
}

export default Canvas;