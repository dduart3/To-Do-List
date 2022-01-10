import PubSub from 'pubsub-js';
import { uid } from 'uid';
import projectElement from './components/projectElement.js';
import toDoElement from './components/todoElement.js';
import HTMLElement from './factories/HTMLElement.js';


const displayController = (() =>{


const PROJECTS_INITIALIZED = 'PROJECTS_INITIALIZED';

const PROJECT_ADDED = 'PROJECT_ADDED';

const TASK_ADDED = 'TASK_ADDED';

const UPDATE_ACTUAL_PROJECT = "UPDATE_ACTUAL_PROJECT";

const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";

const GET_CURRENT_PROJECTS = "GET_CURRENT_PROJECTS"; 

const GET_PROJECT_TASKS = "GET_PROJECT_TASKS";

const PROJECT_TASKS = "PROJECT_TASKS";

const actualProject = (()=>{
        
    let project;

    const set = (msg, projectName) => {
        project = projectName;
    }
    const get = () => project;

    return{
        set,
        get
    }
})();



const showElement = (element) => element.classList.remove('hidden');

const hideElement = (element) => element.classList.add('hidden');

const closeModalOnOverlayClick = (e) =>{
    if(e.target == e.currentTarget){
        hideElement(e.currentTarget);
    }
}


const main = (() =>{
    

    const projectsContainer = document.querySelector('.projects');

    const projectTitle = document.querySelector('.project__title');

    const projectContent = document.querySelector('.project__content');

    const tasksHeader = document.querySelector('.project__tasks-header');


   


    const appendProject = (project) => {
        projectsContainer.appendChild(project);
    }

    const setProjectTitle = (msg, title) =>{
        projectTitle.textContent = title;
    }

    const addTaskToProject = (task) =>{
        projectContent.appendChild(task);
    }

    const clearProjectContent = () => projectContent.innerHTML = ""; 


    const renderProject = ((project)=>{

        const createdProjectElement = projectElement({
            title: project.name
        });

        createdProjectElement.addEventListener('click', (e)=>{
            e.preventDefault();
            
            const projectName = createdProjectElement.id;
            const deleteButton = createdProjectElement.children[0];
            
            if(e.target !== deleteButton){
                updateLogic(projectName);
            }
            
        });

        appendProject(createdProjectElement);
    });


    
    const renderTask =((task)=>{
        addTaskToProject(toDoElement({
            id: task.UID,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority
        }));
    });


    const renderProjectList = (projectList) =>{
        projectList.map(renderProject);
    }

    

    const renderProjectTasks = (msg, tasks) =>{
        clearProjectContent();
        tasks.map(renderTask);
    }

    return{
       
        setProjectTitle,
        addTaskToProject,
        renderProject,
        renderProjectList,
        renderTask,
        renderProjectTasks, 
    }

})();


const taskModal = (() =>{

    const addTaskButton = document.querySelector("#add-task");

    const addTaskmodalContainer = document.querySelector('#add-task-modal');
    
    const addTaskModalButton = document.querySelector("#add-task-modal-button");


    const addTaskModalTitleField = document.querySelector('#task-title');

    const addTaskModalDescriptionField = document.querySelector('#task-description');

    const addTaskModalDateField = document.querySelector('#task-date');

    

    const setMinDateValue = () =>{
        const today = new Date().toISOString().slice(0, 10)
        
        addTaskModalDateField.setAttribute('min', today);
    }

    const clearTaskModalInputs = () =>{
        addTaskModalTitleField.value = "";
        addTaskModalDescriptionField.value = "";
        addTaskModalDateField.value = "";
    }

    const initTaskModal = (e) =>{
        
        showElement(addTaskmodalContainer);
        setMinDateValue();

        

        addTaskmodalContainer.addEventListener('click', closeModalOnOverlayClick)
    }



    const saveTask = () =>{
        const addTaskModalPriorityField = document.querySelector('input[name="priority"]:checked');

        const toDoObject = {
            UID: uid(),
            title:addTaskModalTitleField.value,
            description: addTaskModalDescriptionField.value,
            dueDate: addTaskModalDateField.value,
            priority: addTaskModalPriorityField.value
        }

        const taskObject = {
            projectName: actualProject.get(),
            task: toDoObject
        }

        
        PubSub.publish(TASK_ADDED, taskObject);
        main.renderTask(toDoObject);

        clearTaskModalInputs();
        hideElement(addTaskmodalContainer);
    }


    addTaskButton.addEventListener('click', initTaskModal);
    
    addTaskmodalContainer.addEventListener('click', closeModalOnOverlayClick)
    addTaskModalButton.addEventListener('click', saveTask);

   

})();

const projectModal= (() =>{

    const addProjectButton= document.querySelector("#add-project");

    const addProjectModalContainer = document.querySelector('#add-project-modal');

    const addProjectModalButton = document.querySelector("#add-project-modal-button");

    const addProjectModalTitleField = document.querySelector('#project-title');

    const clearProjectModalInputs = () =>{
        addProjectModalTitleField.value = "";
    }


    const initProjectModal = () =>{
        showElement(addProjectModalContainer);
    }


    const saveProject = () => {

        const projectObject= {
            name: addProjectModalTitleField.value,
            tasksType: "ToDo"
        } 
    
        PubSub.publish(PROJECT_ADDED, projectObject);

        main.renderProject(projectObject)
        
        clearProjectModalInputs();
        hideElement(addProjectModalContainer);
    }

    addProjectButton.addEventListener('click', initProjectModal)

    addProjectModalContainer.addEventListener('click', closeModalOnOverlayClick)
    addProjectModalButton.addEventListener('click', saveProject);

})();



const toggleActiveProjectElementClass = (msg, toggledProjectsObject) =>{


    const activeClass = "project--active";

    if(toggledProjectsObject){

        if( toggledProjectsObject.previousProject && toggledProjectsObject.actualProject){
            const previousProjectElement = document.querySelector(`#${toggledProjectsObject.previousProject}`);

            const actualProjectElement = document.querySelector(`#${toggledProjectsObject.actualProject}`);


            previousProjectElement.classList.toggle(activeClass);

            actualProjectElement.classList.toggle(activeClass)

        }

        else if(toggledProjectsObject.actualProject){

            const actualProjectElement = document.querySelector(`#${toggledProjectsObject.actualProject}`);
    
            actualProjectElement.classList.toggle(activeClass);
        }
    }
}


const updateLogic = (projectName)=>{
    
    PubSub.publish(UPDATE_ACTUAL_PROJECT, projectName);
    
    PubSub.publish(GET_PROJECT_TASKS, projectName);
}






const initializeProjects = (msg, object) =>{

    
    if(object.length > 0){
        const defaultProject = object[0].name;

        const projectList = object;

    
        main.renderProjectList(projectList);
    
        updateLogic(defaultProject);
    }
    

}





PubSub.subscribe(GET_ACTUAL_PROJECT, actualProject.set);
PubSub.subscribe(PROJECTS_INITIALIZED, initializeProjects);
PubSub.subscribe(GET_CURRENT_PROJECTS, toggleActiveProjectElementClass);

PubSub.subscribe(GET_ACTUAL_PROJECT, main.setProjectTitle)
PubSub.subscribe(PROJECT_TASKS, main.renderProjectTasks);


})();

