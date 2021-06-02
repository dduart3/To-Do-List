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

    
    
    PubSub.subscribe(SECTIONS_UPDATED, setItem);
    PubSub.publish(STORED_SECTIONS, getItem('SECTIONS'));

    

})();

