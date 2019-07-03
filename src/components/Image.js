import React, {Component} from "react";
import {Card} from 'antd';
import {Row, Col, Alert} from 'antd';
import axios from 'axios';

const {Meta} = Card;
const _ = require('lodash');

export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {image: {}, isError: false};
        this.GET_PHOTOS_URL = "https://api.unsplash.com/photos/";
    }

    componentDidMount() {
        const {id = ''} = _.get(this.props, 'match.params', '');

        axios.get(this.GET_PHOTOS_URL + id, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY}})
            .then((response) => {
                const image = _.get(response, "data", {});

                if (!(typeof image === 'object')) {
                    this.setState({isError: true});
                    return;
                }
                this.setState({image})
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    }

    render() {
        const {isError = false, image} = this.state;

        return (
            <Row type="flex" justify="center">
                {(isError === true) ?
                    < Col span={24}>
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
                        cover={<img src={_.get(image, "urls.small", '')}
                                    alt={_.get(image, "alt_description", '')}
                                    style={{margin: 0}}/>}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com"/>
                    </Card>
                </Col>
            </Row>

        )
    }
}