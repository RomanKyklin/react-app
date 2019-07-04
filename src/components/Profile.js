import React, {Component} from "react";
import {Link} from "react-router-dom"
import {Row, Col, Alert, Spin, Avatar} from 'antd';
import axios from 'axios';

const _ = require('lodash');

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {isError: false, profileData: {}, isLoading: true};
        this.GET_PROFILE_INFO_URL = 'https://api.unsplash.com/me';
    }

    componentDidMount() {
        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
            this.setState({isError: true});
            return;
        }
        axios.get(this.GET_PROFILE_INFO_URL, {params: {access_token}})
            .then(response => {
                if (!_.isObject(response.data) || _.isEmpty(response.data)) {
                    this.setState({isError: true, isLoading: false});
                    return;
                }
                this.setState({
                    profileData: {
                        name: _.get(response, 'data.name', ''),
                        username: _.get(response, 'data.username', ''),
                        followed_by_user: _.get(response, 'data.followed_by_user', false),
                        followers_count: _.get(response, 'data.followers_count', 0),
                        following_count: _.get(response, 'data.following_count', 0),
                        instagram_username: _.get(response, 'data.instagram_username', null),
                        location: _.get(response, 'data.location', null),
                        total_collections: _.get(response, 'data.total_collections', 0),
                        total_likes: _.get(response, 'data.total_likes', 0),
                        total_photos: _.get(response, 'data.total_photos', 0),
                        twitter_username: _.get(response, 'data.twitter_username', null),
                        updated_at: _.get(response, 'data.updated_at', ""),
                    }, isLoading: false
                });
            })
            .catch(error => {
                this.setState({isError: true, isLoading: false});
                console.log(error)
            });
    }

    render() {
        const {isError = false, profileData = {}} = this.state;

        if (isError) {
            return (
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <Alert
                            message="Ошибка"
                            description="Доступ запрещен. Попробуйте авторизоваться перейдя на главную страницу."
                            type="error"
                            closable
                        />
                        <div style={{"text-align": "center"}}>
                            <Link to="/">Главная страница</Link>
                        </div>
                    </Col>
                </Row>
            )
        }
        return (
            <div style={{padding: 20}}>
                <Row type="flex" justify="center">
                    <Col span={4}>
                        <div className="avatar">
                            <Avatar size="large" icon="user"/>
                        </div>
                    </Col>
                </Row>
                <div style={{marginTop: 50}}>
                    {Object.keys(profileData).map((key) => {
                        return (<Row type="flex" justify="center" key={key}>
                            <Col span={4}>
                                <h1>{key}: </h1>
                            </Col>
                            <Col span={4}>
                                <h1>{profileData[key]}</h1>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        )
    }
}