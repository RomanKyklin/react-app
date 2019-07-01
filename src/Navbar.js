import {Layout, Menu, Input, Button} from 'antd';
import React, {Component} from 'react';

const {Header} = Layout;

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSearch() {
        this.props.onNavbar(this.state.term);
    }
    handleChange(event) {
        this.setState({term: event.target.value});
    }
    render() {
        return (
            <Header>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{lineHeight: '64px'}}
                >
                    <Menu.Item>
                        <Input onChange={this.handleChange}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Button type="primary" onClick={this.handleSearch}> Search </Button>
                    </Menu.Item>
                </Menu>
            </Header>
        )
    }
}