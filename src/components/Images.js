import React, {Component} from "react";
import axios from 'axios';
import {Row, Col, Alert, Pagination} from 'antd';
import {Link} from "react-router-dom";

const _ = require('lodash');

export default class Images extends Component {
    constructor(props) {
        super(props);
        this.SEARCH_PHOTOS_URL = 'https://api.unsplash.com/search/photos';
        this.GET_PHOTOS_URL = 'https://api.unsplash.com/photos';
        this.state = {
            images: [],
            isError: false,
            totalPages: 1,
        };
    }

    componentDidMount() {
        axios.get(this.GET_PHOTOS_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY}})
            .then((response) => {
                const images = _.get(response, "data", []);

                if (!Array.isArray(images)) {
                    this.setState({isError: true});
                    return;
                }
                this.setState({images: _.get(response, "data", [])});
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.term && nextProps.term !== this.props.term) {
            this.searchImages(nextProps.term)
        }
    }

    searchImages = (query, page = 1, per_page = 10) => {
        axios.get(this.SEARCH_PHOTOS_URL, {
            params: {
                client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
                query,
                page,
                per_page
            }
        })
            .then((response) => {
                const images = _.get(response, "data.results", []);
                const totalPages = _.get(response, "data.total_pages", 1);

                if (!Array.isArray(images) || !Number.isInteger(totalPages)) {
                    this.setState({isError: true});
                    return;
                }
                this.setState({
                    images: _.get(response, "data.results", []),
                    totalPages: _.get(response, "data.total_pages", 1)
                });
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    };

    itemPagination = (page, pageSize) => this.searchImages(this.props.term, page, pageSize);

    render() {
        const {isError = false, images = [], totalPages = 1} = this.state;

        return (
            <Row>
                {(isError === true) ?
                    < Col span={24}>
                        <Alert
                            message="Ошибка"
                            description="Попробуйте проверить соединение с интернетом или перезагрузить"
                            type="error"
                            closable
                        />
                    </Col>
                    : null
                }
                {images.map((image, i) => {
                    return (
                        <Col span={8} key={i}>
                            <Link to={"/image/" + _.get(image, "id", '')}>
                                <img width={320} height={240} src={_.get(image, "urls.small", '')}
                                     alt={_.get(image, "alt_description", '')}/>
                            </Link>
                        </Col>
                    )
                })}
                <Col span={24}>
                    <Pagination defaultCurrent={1} total={totalPages} onChange={this.itemPagination}/>
                </Col>
            </Row>
        );
    }
}