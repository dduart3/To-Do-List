const HTMLElement = ({elementType, elementClass, elementContent, elementSource, elementHref, elementId, elementName, eventListener, inputType }) =>{
    
   const addClasses = (element, classes) =>{
       classes.split(',').map(el => element.classList.add(el))
    }


    const element = document.createElement(elementType);

    if(elementClass){
        addClasses(element, elementClass);
    }
    
    if(elementContent){
        element.textContent = elementContent;
    }
            
    if(elementSource){
        element.setAttribute('src', elementSource)
    }

    if(elementHref){
        element.setAttribute('href', elementHref);
    }

    if(inputType){
        element.setAttribute('type', inputType);
    }

    if(elementName){
        element.setAttribute('name', elementName);
    }

    if(elementId){
        element.id = elementId;
    }



    if(eventListener){
        element.addEventListener(eventListener.type, eventListener.function);
    }
    
    return element;
}

export default HTMLElement;