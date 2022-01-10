import PubSub from 'pubsub-js';


const storageController = ( () =>{

    const PROJECTS_UPDATED = 'PROJECTS_UPDATED';

    const STORED_PROJECTS = 'STORED_PROJECTS';
    
    const storage = window.localStorage;
    


    const getItem = ( name ) => {
        return JSON.parse ( storage.getItem ( name ) )
    }  

        
    const setItem = ( msg, object ) => {

        const {name, item} = object;

        const stringifiedItem = JSON.stringify( item );

        storage.setItem( name, stringifiedItem);
    }

    
    PubSub.publish(STORED_PROJECTS, getItem('PROJECTS'));
    
    PubSub.subscribe(PROJECTS_UPDATED, setItem);


})();

