import React, {Component} from 'react';
import 'antd/dist/antd.css'
import './App.css';
import Navbar from "./components/Navbar";
import {Layout, Alert} from 'antd';
import Images from "./components/Images";
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from 'axios';
import Image from "./components/Image";
import Profile from "./components/Profile";

const {Content, Footer} = Layout;
const _ = require('lodash');

class App extends Component {
    state = {
        term: '',
    };
    REACT_OAUTH_URL = 'https://unsplash.com/oauth/authorize';

    componentDidMount() {
        this.auth();
    }

    auth = () => {
        const urlParams = new URLSearchParams(window.location.search);

        if(localStorage.getItem('access_token')) {
           return false;
        }
        if (urlParams.get('code')) {
            axios.post('https://unsplash.com/oauth/token', {
                client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
                client_secret: process.env.REACT_APP_UNSPLASH_SECRET_KEY,
                redirect_uri: 'http://localhost:3000/',
                code: urlParams.get('code'),
                grant_type: 'authorization_code'
            }).then(response => {
                localStorage.setItem('access_token', _.get(response, 'data.access_token', ''));
                window.location.href = "http://localhost:3000/profile";
            }).catch(error => {
                this.setState({isError: true});
                console.log(error)
            });
        } else {
            window.location.href = this.REACT_OAUTH_URL + `?client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=public`;
        }
    };

    render() {
        const {isError = false} = this.state;

        return (
            <Layout className="layout">
                <Content>
                    {(isError === true) ?
                        <Alert
                            message="Ошибка авторизации"
                            description="Попробуйте проверить соединение с интернетом или перезагрузить"
                            type="error"
                            closable
                        />
                        : null
                    }
                    <Router>
                        <Route path="/" exact component={Navbar}/>
                        <Route path="/images/:term?" component={Images}/>
                        <Route path="/image/:id" component={Image}/>
                        <Route path="/profile" component={Profile}/>
                    </Router>
                </Content>
                <Footer style={{textAlign: 'center'}}>©2018</Footer>
            </Layout>
        );
    }
}

export default App;
