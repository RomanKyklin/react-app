import React, {Component} from "react";
import {Card} from 'antd';
import {Row, Col, Alert, Spin, Button} from 'antd';
import axios from 'axios';

const _ = require('lodash');

export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {image: {}, isError: false, isLoading: true, isAuth: false};
        this.GET_PHOTOS_URL = "https://api.unsplash.com/photos/";
    }

    getLikePhotoUrl = (photoId) => `${this.GET_PHOTOS_URL}${photoId}/like`;

    getDislikePhotoUrl = (photoId) => `${this.GET_PHOTOS_URL}${photoId}/like`;

    handleLike = () => {
        const {image = {}} = this.state;
        const access_token = localStorage.getItem('access_token');

        axios.post(this.getLikePhotoUrl(image.id), {access_token})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    };

    handleDislike = () => {
        const {image = {}} = this.state;
        const access_token = localStorage.getItem('access_token');

        axios.delete(this.getDislikePhotoUrl(image.id), {params: {access_token}})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    };

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            this.setState({isAuth: true});
        }

        const {id = ''} = _.get(this.props, 'match.params', '');

        axios.get(this.GET_PHOTOS_URL + id, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY}})
            .then((response) => {
                const responseImage = _.get(response, "data", {});

                if (!_.isObject(responseImage) || _.isEmpty(responseImage)) {
                    this.setState({isError: true});
                    return;
                }

                this.setState({
                    image: {
                        id: _.get(responseImage, 'id', ''),
                        src: _.get(responseImage, "urls.small", ''),
                        description: _.get(responseImage, "alt_description", ''),
                        likes: _.get(responseImage, 'likes', 0),
                        liked_by_user: _.get(responseImage, 'liked_by_user', false)
                    },
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({isError: true, isLoading: false});
                console.log(error);
            });
    }

    render() {
        const {isError = false, image, isLoading = true, isAuth = false} = this.state;

        if (isError) {
            return (
                < Col span={12}>
                    <Alert
                        message="Ошибка"
                        description="Картинка не найдена"
                        type="error"
                        closable
                    />
                </Col>
            );
        }

        return isLoading ? (
            <Row type="flex" justify="center">
                <Col span={12}>
                    <Spin style={{display: "block"}}/>
                </Col>
            </Row>
        ) : (
            <Row type="flex" justify="center">
                <Col span={24}>
                    <Card
                        hoverable
                        style={{width: 500, margin: "0 auto"}}
                        cover={<img src={image.src}
                                    alt={image.description}
                                    style={{margin: 0}}/>}
                    >
                    </Card>
                </Col>
                <Col span={24}>
                    {(isAuth && image.liked_by_user) ?
                        <Button type="danger" size="large"
                                style={{margin: "0 auto", display: "block"}}
                                onClick={this.handleDislike}>Dislike {image.likes}</Button>
                        : null
                    }
                    {(isAuth && !image.liked_by_user) ?
                        <Button type="danger" size="large"
                                style={{margin: "0 auto", display: "block"}}
                                onClick={this.handleLike}>Like {image.likes}</Button>
                        : null
                    }
                </Col>
            </Row>
        )
    }
}