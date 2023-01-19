import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './components/home';
import { DataBase } from './service/storage';

export const wsUrl = "ws:localhost:9381"

export const goTo = (path, reload = true) => {
    if (window.location.pathname !== path) 
        (reload ? window.location.assign(path) : window.history.pushState({}, '', path));
    

}

function Root() {
    if (window.location.pathname === '/') 
    window.location.assign('/home')
    
    DataBase.setItem('uid', Math.random().toString(36).substring(2))
    
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home></Home>}/>
            </Routes>
        </Router>
    )
}

export default Root;
