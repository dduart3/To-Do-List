import HTMLElement from '../factories/HTMLElement.js';

const PROJECT_REMOVED = "PROJECT_REMOVED";


const deleteElement = (element) => element.style.display = "none";



const project = ({title}) =>{

   const taskContainer = HTMLElement({
        elementType: 'div',
        elementClass: 'projects__task',
        elementId: title
    });

    const taskTitle = HTMLElement({
        elementType: "p",
        elementContent: title
    })

    const taskDeleteButton = HTMLElement({
        elementType: 'div',
        elementClass: 'projects__delete-button',
        elementContent: 'x',
        eventListener: {
            type: 'click',
            function: (e) =>{
                e.preventDefault();
                
                deleteElement(taskContainer);
                PubSub.publish(PROJECT_REMOVED, title);

            }
        }
    });

    taskContainer.appendChild(taskDeleteButton);
    taskContainer.appendChild(taskTitle);

    return taskContainer

}

export default project;