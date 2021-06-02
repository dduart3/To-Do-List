const Section = ({name, itemsType}) => {
    const items = [];
    

    const addItem = (itemProps) => {
        const item = itemsType(itemProps);
        items.push(item);
    }



    const findItem = (itemUID) => {
       const foundItem = items.find(item => item.UID === itemUID)

       return foundItem;
    }

    
    const findItemIndex = (itemUID) => {
        const foundIndex = items.indexOf(findItem(itemUID));

        return foundIndex;
    }


    const removeItem = (itemUID) => {
        const index = findItemIndex(itemUID);
        items.splice(index, 1);
    }

    return {
        name,
        items,
        addItem,
        removeItem    }
}

export default Section;
