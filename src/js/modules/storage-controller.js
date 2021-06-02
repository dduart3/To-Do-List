import PubSub from 'pubsub-js';


const storageController = ( () =>{

    const SECTIONS_UPDATED = 'SECTIONS_UPDATED';
    const STORED_SECTIONS = 'STORED_SECTIONS';

    
    const storage = window.localStorage;
    


    const getItem = ( name ) => {
        return JSON.parse ( storage.getItem ( name ) )
    }  

        
    const setItem = ( msg, object ) => {

        const {name, item} = object;

        const stringifiedItem = JSON.stringify( item );

        storage.setItem( name, stringifiedItem);
    }

    
    
    const test = (msg, sections) => {
        console.log(sections);
    }

    //This is the subscriber, is called if this file is imported before the logic
    PubSub.subscribe(SECTIONS_UPDATED, test);


    PubSub.publish(STORED_SECTIONS, 'testfromstorage');



})();

