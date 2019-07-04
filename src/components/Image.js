import React, {Component} from "react";
import {Card} from 'antd';
import {Row, Col, Alert, Spin} from 'antd';
import axios from 'axios';

const _ = require('lodash');

export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {image: {}, isError: false, isLoading: true};
        this.GET_PHOTOS_URL = "https://api.unsplash.com/photos/";
    }

    componentDidMount() {
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
                        src: _.get(responseImage, "urls.small", ''),
                        description: _.get(responseImage, "alt_description", '')
                    },
                    isLoading: false
                })
            })
            .catch((error) => {
                this.setState({isError: true, isLoading: false});
                console.log(error);
            });
    }

    render() {
        const {isError = false, image, isLoading = true} = this.state;

        return isLoading ? (
            <Row type="flex" justify="center">
                <Col span={12}>
                    <Spin style={{display: "block"}}/>
                </Col>
            </Row>
        ) : (
            <Row type="flex" justify="center">
                {(isError === true) ?
                    < Col span={12}>
                        <Alert
                            message="Ошибка"
                            description="Картинка не найдена"
                            type="error"
                            closable
                        />
                    </Col>
                    : null
                }
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
            </Row>
        )
    }
}