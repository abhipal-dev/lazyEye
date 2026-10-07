import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Navbar from './Navbar';
import AdminDashboard from './AdminPanel';

export default class App extends React.Component{
    render(){
        return(
        <>
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/Register_view" element={<Register />} />
                <Route exact path="/Login_view" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </>
    )
}
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'))
}
