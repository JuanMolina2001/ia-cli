import 'terminal.css';
import './styles.css';
import { Image } from './pages';
window.electron.on('image', (event, data) => {
    document.body.innerHTML = Image.html;
    Image.script();
});