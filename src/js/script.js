import '../css/reset.css'
import '../css/style.css';

import book from '../../static/images/book.svg'




//Only the subscriber in the first import file is being called 
import './modules/logic-controller.js';
import './modules/storage-controller.js';



const img = document.querySelector('img');

img.src = book;





