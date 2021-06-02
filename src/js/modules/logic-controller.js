import PubSub from 'pubsub-js';
import Section from '../modules/factories/Section.js';
import ToDo from '../modules/factories/Todo.js';
import Note from '../modules/factories/Note.js'



const sections = (() => {
    
    const STORED_SECTIONS = 'STORED_SECTIONS';

    const SECTIONS_UPDATED = 'SECTIONS_UPDATED';
    
    
    const sectionsList = [];

    
    const updatedSectionListObject = {
            name: 'SECTIONS',
            item: sectionsList
    }

    


    const addSection = ({name, itemsType}) => {

        const newSection = Section({name, itemsType});
        sectionsList.push(newSection);
        
        PubSub.publish(SECTIONS_UPDATED, updatedSectionListObject);
    }


    const getSection = (name) => {
        return sectionsList.find(section => section.name === name);
    }


    const addItemToSection = (sectionName, item) =>{
        const section = getSection(sectionName);
        
        section.addItem(item);

        PubSub.publish(SECTIONS_UPDATED, updatedSectionListObject);
    }


    const addInitialSections = () => {

        addSection({name: 'Home', itemsType: ToDo});
    
        addSection({name: 'Today', itemsType: ToDo});
    
        addSection({name: 'Notes', itemsType: Note});
    }




    
    
    
    
    
    
    const test = (msg, sections) => {
        console.log(sections);
    }
    
    
    //This is the subscriber, is called if this file is imported before the storage
    PubSub.subscribe(STORED_SECTIONS, test);    
    
    PubSub.publish(SECTIONS_UPDATED, 'testfromlogic')
})();