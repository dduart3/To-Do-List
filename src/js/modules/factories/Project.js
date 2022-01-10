import ToDo from "./Todo";
const Project = ({name, tasksType}) => {
    
    const tasks = [];
    

    const addTask = (taskProps) => {
        const task = ToDo(taskProps);
        tasks.push(task);
    }



    const findTask = (taskUID) => {
       const foundTask = tasks.find(task => task.UID === taskUID)

       return foundTask;
    }

    
    const findTaskIndex = (taskUID) => {
        const foundIndex = tasks.indexOf(findTask(taskUID));

        return foundIndex;
    }

    const editTask = (taskUID, prop, newPropValue) => {
        const task = findTask(taskUID);
        const taskIndex = findTaskIndex(taskUID);

        task[prop] = newPropValue;

        tasks[taskIndex] = task;
    }


    const removeTask = (taskUID) => {
        const index = findTaskIndex(taskUID);
        tasks.splice(index, 1);
    }

    return {
        name,
        tasks,
        tasksType,
        addTask,
        editTask,
        removeTask
    }
}

export default Project;
