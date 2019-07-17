import {Layout, Menu, Input, Button, Col, Spin, Row, Alert} from 'antd';
import React, {Component} from 'react';
import axios from 'axios';

const _ = require('lodash');
const {Header} = Layout;

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {images: {}, randomImages: {}, isError: false, isLoading: true};
        this.RANDOM_PHOTO_URL = 'https://api.unsplash.com/photos/random';
        this.GET_PHOTOS_URL = 'https://api.unsplash.com/photos';
    }

    componentDidMount() {
        this.getPhotos(100);
    }

    handleSearch = () => {
        const {term = ""} = this.state;
        window.location.href = `http://localhost:3000/images/${term}`;
    };

    handleChange = (event) => this.setState({term: event.target.value});

    changeRandomPhoto = () => {
        const {images = []} = this.state;
        let randomImages = this.state.randomImages;
        const randomImagesKey = Math.floor(Math.random() * (randomImages.length));
        const imagesKey = Math.floor(Math.random() * (images.length));

        if (randomImages.length > 0 && randomImages[randomImagesKey].id === images[imagesKey].id) {
            randomImages = randomImages.filter((value, index) => index !== randomImagesKey);
            this.setState({images, randomImages});
            return;
        }

        if (randomImages.length > 0) {
            images[imagesKey] = randomImages[randomImagesKey];
            randomImages = randomImages.filter((value, index) => index !== randomImagesKey);
            this.setState({images, randomImages});
        } else {
            clearInterval(this.timerId);
            this.getRandomPhotos();
        }
    };

    getPhotos = (count) => {
        axios.get(this.GET_PHOTOS_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY, per_page: count}})
            .then(response => {
                if (!_.isArray(response.data)) {
                    this.setState({isError: true, isLoading: false});
                    return;
                }
                this.setState({images: _.get(response, 'data', []), isLoading: false}, () => this.getRandomPhotos());
            })
            .catch(error => {
                this.setState({isError: true, isLoading: false})
            })
    };

    getRandomPhotos = (count = 30) => {
        axios.get(this.RANDOM_PHOTO_URL, {
            params: {
                client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
                count: count
            }
        })
            .then(response => {
                if (!_.isArray(response.data)) {
                    this.setState({isError: true, isLoading: false});
                    return;
                }
                this.setState({
                    randomImages: _.get(response, 'data', []),
                    isLoading: false
                }, () => {
                    this.timerId = setInterval(() => this.changeRandomPhoto(), 1000);
                });
                return;
            })
            .catch(error => {
                this.setState({isError: true, isLoading: false});
                return;
            });
    };

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        const {images = [], isLoading = true, isError = false} = this.state;

        if (isError) {
            return (
                <Alert
                    message="Ошибка"
                    description="Попробуйте проверить соединение с интернетом или перезагрузить"
                    type="error"
                    closable
                />
            )
        }

        return isLoading ? (
            <Row type="flex" justify="center">
                <Col span={12}>
                    <Spin style={{display: "block"}}/>
                </Col>
            </Row>
        ) : (
            <Header style={{height: '600px', textAlign: 'center', padding: 0}}>
                {images.map((image) => {
                    return (
                        <img src={image.urls.small} style={{width: '10%', height: '11%'}} key={image.id}/>
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