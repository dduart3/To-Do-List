import HTMLElement from "../factories/HTMLElement";
import PubSub, { publish } from "pubsub-js";

let actualProject;

const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";

const TASK_REMOVED = 'TASK_REMOVED';


const descriptionModal = document.querySelector('#description-modal');

const descriptionModalContent = document.querySelector('.modal__content');


const setActualProject = (msg, project) =>{
    actualProject = project
}



const showModal = () => descriptionModal.classList.remove('hidden');

const hideModal = () => descriptionModal.classList.add('hidden');

const deleteElement = (element) => element.style.display = "none";

const setDescriptionModalText = (text) =>{
    descriptionModalContent.textContent = text;
}


const closeModalOnOverlayClick = (e) =>{
    if(e.target == descriptionModal){
        hideModal();
    }
}

const getPriorityColorClass = (priority) =>{
    let priorityClass;

    if(priority == "Low"){
        priorityClass = "low-priority";
    }else if(priority == "Medium"){
        priorityClass = "medium-priority";
    }else if(priority == "High"){
        priorityClass = "high-priority";
    }else{
        console.error("The priority attribute it's invalid");
    }
    return priorityClass;
} 



const toDoElement = ({id, title, description, dueDate, priority }) => {

    

    const taskContainer = HTMLElement({
        elementType: 'div',
        elementClass: 'task',
        elementId: id
    });


    const taskInput = HTMLElement({
        elementType: 'input',
        inputType: 'checkbox',
        eventListener: {
            type: 'click',
            function: ()=>{
                
                deleteElement(taskContainer);
                PubSub.publish(TASK_REMOVED, {projectName: actualProject, taskUID: id});

            }
        }
    });

    const taskWrapper = HTMLElement({
        elementType: 'div',
        elementClass: 'task__wrapper'
    });

    
    const taskTitle = HTMLElement({
        elementType: 'p',
        elementClass: 'task__title',
        elementContent: title,
    });


    const taskDescription = HTMLElement({
        elementType: 'p',
        elementClass: 'task__description',
        elementContent: "Click to see",
        eventListener: {
            type: 'click',
            function: (e)=>{
                setDescriptionModalText(description);
                showModal();

                descriptionModal.addEventListener('click', closeModalOnOverlayClick)
            }
        }
    });

    const taskDate = HTMLElement({
        elementType: 'p',
        elementClass: 'task__date',
        elementContent: dueDate,
      
    });


    const taskPriority = HTMLElement({
        elementType: 'p',
        elementClass: getPriorityColorClass(priority),
        elementContent: priority,
        
    });


    taskWrapper.appendChild(taskTitle);
    taskWrapper.appendChild(taskDescription);
    taskWrapper.appendChild(taskDate);
    taskWrapper.appendChild(taskPriority);

    

    taskContainer.appendChild(taskInput);
    taskContainer.appendChild(taskWrapper);

    
    return taskContainer;
}
PubSub.subscribe(GET_ACTUAL_PROJECT, setActualProject)

export default toDoElement;


