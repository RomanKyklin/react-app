import React, {Component} from 'react';
import 'antd/dist/antd.css'
import './App.css';
import Navbar from "./components/Navbar";
import {Layout} from 'antd';
import Images from "./components/Images";
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from 'axios';
import Image from "./components/Image";

const {Content, Footer} = Layout;
const _ = require('lodash');

class App extends Component {
    state = {
        term: '',
    };

    handleSearch = (term) => {
        this.setState({term: term});
    };

    // componentWillMount() {
    //    this.auth();
    // }
    //
    // auth = () => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     if(urlParams.get('code')) {
    //         axios.post('https://unsplash.com/oauth/token', {
    //             client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
    //             client_secret: process.env.REACT_APP_UNSPLASH_SECRET_KEY,
    //             redirect_uri: 'http://localhost:3000',
    //             code: _.get(urlParams.get('code'), '', ''),
    //             grant_type: 'authorization_code'
    //         }).then(response => {
    //             console.log(response);
    //         }).catch(error => {
    //             console.log(error)
    //         });
    //     } else {
    //         window.location.href = "https://unsplash.com/oauth/authorize?client_id=503ff9ab15e3bb7ec386d6f9339a43043cd320c465dc6948160c9e698323b820&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=public";
    //     }
    // };

    render() {
        return (
            <Layout className="layout">
                <Navbar onNavbar={this.handleSearch}/>
                <Content>
                    <Router>
                        <Route path="/image/:id" component={Image}/>
                        <Route path="/home" render={props => <Images {...props} term={this.state.term}/>}/>
                    </Router>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        );
    }
}

export default App;
