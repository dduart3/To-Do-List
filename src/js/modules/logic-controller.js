import PubSub from 'pubsub-js';
import Project from './factories/Project.js';
import ToDo from '../modules/factories/Todo.js';
import Note from '../modules/factories/Note.js'
import { uid } from 'uid';



const projects = (() => {
    
    const STORED_PROJECTS = 'STORED_PROJECTS';

    const PROJECTS_UPDATED = 'PROJECTS_UPDATED';

    const PROJECTS_INITIALIZED = 'PROJECTS_INITIALIZED';

    const PROJECT_ADDED = 'PROJECT_ADDED';
    
    const TASK_ADDED = 'TASK_ADDED';

    const TASK_REMOVED = 'TASK_REMOVED';
    
    const PROJECT_REMOVED = "PROJECT_REMOVED";

    const UPDATE_ACTUAL_PROJECT = "UPDATE_ACTUAL_PROJECT";

    const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";
    
    const GET_CURRENT_PROJECTS = "GET_CURRENT_PROJECTS"; 

    const GET_PROJECT_TASKS = "GET_PROJECT_TASKS";

    const PROJECT_TASKS = "PROJECT_TASKS";


    
    const projectsList = [];

    
    const projectListObject = {
        name: 'PROJECTS',
        item: projectsList
    }


    const projectsManager = (()=>{

        let actualProject, previousProject, currentProjects;

        const setActualProject = (projectName) => actualProject = projectName;
        
        const getActualProject = () => actualProject;

        const setPreviousProject = (projectName) => previousProject = projectName;
        
        const getPreviousProject = () => previousProject;

        const toggleActiveProject = (msg, projectName) =>{

            

            if( getPreviousProject() && getActualProject() && getActualProject() != projectName){

                setPreviousProject( getActualProject() );

                setActualProject( projectName );

                
                currentProjects = {
                    previousProject: getPreviousProject(),
                    actualProject: getActualProject()
                }

                

                PubSub.publish(GET_ACTUAL_PROJECT, projectsManager.getActualProject());
                PubSub.publish(GET_CURRENT_PROJECTS, currentProjects);
            }else if( !getPreviousProject() && getActualProject() && getActualProject != projectName){

                setPreviousProject( getActualProject() );

                setActualProject( projectName );



                currentProjects = {
                    previousProject: getPreviousProject(),
                    actualProject: getActualProject()
                }

                PubSub.publish(GET_ACTUAL_PROJECT, projectsManager.getActualProject());
                PubSub.publish(GET_CURRENT_PROJECTS, currentProjects);

            }else if ( !getActualProject() ){
                setActualProject( projectName );

                currentProjects = {
                    actualProject: getActualProject()
                }


                PubSub.publish(GET_ACTUAL_PROJECT, projectsManager.getActualProject());
                PubSub.publish(GET_CURRENT_PROJECTS, currentProjects);
            }
        }
        return {
            setActualProject,
            getActualProject,
            setPreviousProject,
            getPreviousProject,
            toggleActiveProject
        };
    })();


    const isProjectListEmpty = () =>{
        return projectsList
    }


    const addProject = (msg, {name, tasksType}) => {

        const newProject = Project({name, tasksType});
        projectsList.push(newProject);
        
        
        PubSub.publish(PROJECTS_UPDATED, projectListObject);
    }


    const getProject = (name) => {
        return projectsList.find(project => project.name == name);
    }

    const getProjectTasks = (msg, projectName) =>{
        const tasks = getProject(projectName).tasks;

        PubSub.publish(PROJECT_TASKS, tasks)
    }


    const addTaskToProject = (msg, {projectName, task}) =>{
        const project = getProject(projectName);
        project.addTask(task);

        PubSub.publish(PROJECTS_UPDATED, projectListObject);
    }

    const removeProject = (msg, projectName) =>{
        const foundProject = getProject(projectName);
        
        const newTaskList = projectsList.filter(project => project !== foundProject);    

        projectsList.splice(0, projectsList.length);

        newTaskList.map(project => projectsList.push(project))


    
        PubSub.publish(PROJECTS_UPDATED, projectListObject);

    }

    const removeTask = (msg, {projectName, taskUID}) =>{
        const project = getProject(projectName);

        project.removeTask(taskUID);

        PubSub.publish(PROJECTS_UPDATED, projectListObject);
    }




    const addInitialProjects = () => {

        addProject("msg",{name: 'Home', tasksType: "ToDo"});
        addProject("msg",{name: 'DummieProject', tasksType: "ToDo"});
        addProject("msg",{name: 'TestProject', tasksType: "ToDo"});

        addTaskToProject("msg", {
            projectName: "Home",
            task: {
                UID: uid(),
                title: "eat",
                description: "i need to eat to live",
                dueDate: "2021-01-30",
                priority: "High"
                }
            });

            addTaskToProject("msg", {
                projectName: "Home",
                task: {
                    UID: uid(),
                    title: "sleep",
                    description: "i also need to sleep to live",
                    dueDate: "2021-01-20",
                    priority: "High"
                    }
                });

                addTaskToProject("msg", {
                    projectName: "Home",
                    task: {
                        UID: uid(),
                        title: "play halo",
                        description: "i really need to rank in halo to live",
                        dueDate: "2021-01-20",
                        priority: "High"
                        }
                    });

    
    }
    


    const initializeProjectsList = (msg, storageProjects) => {
        
        const isDataValid = () =>{
            return (storageProjects != null);
        }

        const createProjectsFromStorage = () =>{
            storageProjects.map(project =>{

                addProject("msg", {
                    name: project.name,
                    tasksType: project.tasksType
                });

                project.tasks.map(task =>{
                    addTaskToProject("msg", {
                        projectName: project.name,
                        task: task
                    });
                });
            });
        }

        if ( isDataValid() ){

            createProjectsFromStorage();

            PubSub.publish(PROJECTS_INITIALIZED, projectsList);

        } else {

            addInitialProjects();
            PubSub.publish(PROJECTS_INITIALIZED, projectsList);
        }
    }





    
    


    PubSub.subscribe(STORED_PROJECTS, initializeProjectsList);

    PubSub.subscribe(TASK_ADDED, addTaskToProject);

    PubSub.subscribe(PROJECT_ADDED, addProject);

    PubSub.subscribe(TASK_REMOVED, removeTask);

    PubSub.subscribe(PROJECT_REMOVED, removeProject)

    PubSub.subscribe(UPDATE_ACTUAL_PROJECT, projectsManager.toggleActiveProject);  
    
    PubSub.subscribe(GET_PROJECT_TASKS, getProjectTasks)



})();