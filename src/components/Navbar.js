import {Layout, Menu, Input, Button, Col, Spin, Row} from 'antd';
import React, {Component} from 'react';
import axios from 'axios';

const _ = require('lodash');
const {Header} = Layout;

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {images: {}, isError: false, isLoading: true};
        this.RANDOM_PHOTO_URL = 'https://api.unsplash.com/photos/random'
    }

    componentDidMount() {
        axios.get(this.RANDOM_PHOTO_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY, count: 30}})
            .then(response => {
                if (!_.isArray(response.data)) {
                    this.setState({isError: true, isLoading: false});
                    return;
                }
                this.setState({images: _.get(response, 'data', {}), isLoading: false});
                this.changeRandomPhoto();
            })
            .catch(error => {
                this.setState({isError: true, isLoading: false})
            })
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log(this.state);
        console.log(nextState.images);
    }

    handleSearch = () => {
        const {term = ""} = this.state;
        window.location.href = `http://localhost:3000/images/${term}`;
    };

    handleChange = (event) => this.setState({term: event.target.value});

    changeRandomPhoto = () => {
        setInterval(() => {
            axios.get(this.RANDOM_PHOTO_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY, count: 1}})
                .then(response => {
                    if (!_.isArray(response.data)) {
                        this.setState({isError: true, isLoading: false});
                        return;
                    }
                    const {images = {}} = this.state;

                    images[Math.floor(Math.random() * (images.length))] = response.data[0];
                    this.setState({images, isLoading: false});
                })
                .catch(error => {
                    this.setState({isError: true, isLoading: false})
                });
        }, 1000);
    };

    render() {
        const {images = [], isLoading = true} = this.state;

        return isLoading ? (
            <Row type="flex" justify="center">
                <Col span={12}>
                    <Spin style={{display: "block"}}/>
                </Col>
            </Row>
        ) : (
            <Header style={{height: '360px', textAlign: 'center', padding: 0}}>
                {images.map((image) => {
                    return (
                        <img src={image.urls.small} style={{width: '10%', height: '120px'}} key={image.id}/>
                    )
                })}
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{
                        lineHeight: '64px',
                        position: "absolute",
                        top: '20%',
                        left: '30%',
                        right: '30%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <Menu.Item>
                        <Input onChange={this.handleChange}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Button type="primary" onClick={this.handleSearch}> Search </Button>
                    </Menu.Item>
                </Menu>
            </Header>
        );
    }
}