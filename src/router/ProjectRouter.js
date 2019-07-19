import React, {Component} from 'react';
import {Route} from "react-router";
import Navbar from "../components/Navbar";
import Images from "../components/Images";
import Image from "../components/Image";
import Profile from "../components/Profile";
import {BrowserRouter as Router} from "react-router-dom";

export default class ProjectRouter extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Navbar}/>
                <Route path="/images/:term?" component={Images}/>
                <Route path="/image/:id" component={Image}/>
                <Route path="/profile" component={Profile}/>
            </Router>
        )
    }
}