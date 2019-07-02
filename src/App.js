import React, {Component} from 'react';
import 'antd/dist/antd.css'
import './App.css';
import Navbar from "./components/Navbar";
import {Layout} from 'antd';
import Images from "./components/Images";

const {Content, Footer} = Layout;

class App extends Component {
    state = {
        term: ''
    };

    handleSearch = (term) => {
        this.setState({term: term});
    };

    render() {
        return (
            <Layout className="layout">
                <Navbar onNavbar={this.handleSearch}/>
                <Content>
                    <Images term={this.state.term}/>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        );
    }
}

export default App;
