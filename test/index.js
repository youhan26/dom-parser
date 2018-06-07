import DomSelector from '../src/index';

import data1 from 'data1';
import data2 from 'data2';


const root1 = DomSelector(data1);
root1.getElementById('myCarousel');


const root2 = DomSelector(data2);
root2.getElementsByClassName('item');
root2.getElementsByTagName('dov');
root2.getElementsByTagName('div');

