import React, {Component} from "react";
import axios from 'axios';
import {Row, Col, Alert, Pagination, Spin} from 'antd';
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
            isLoading: true
        };
    }

    componentDidMount() {
        axios.get(this.GET_PHOTOS_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY}})
            .then((response) => {
                const images = _.get(response, "data", []);

                if (this.props.match.params.term) {
                    this.searchImages(this.props.match.params.term);
                    return;
                }

                if (!Array.isArray(images)) {
                    this.setState({isError: true, isLoading: false});
                    return;
                }
                this.setState({images: _.get(response, "data", []), isLoading: false});
            })
            .catch((error) => {
                this.setState({isError: true, isLoading: false});
                console.log(error);
            });
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
                    totalPages: _.get(response, "data.total_pages", 1),
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({isError: true, isLoading: false});
                console.log(error);
            });
    };

    itemPagination = (page, pageSize) => this.searchImages(this.props.match.params.term, page, pageSize);

    render() {
        const {isError = false, images = [], totalPages = 1, isLoading = true} = this.state;

        if (isError) {
            return (
                < Col span={24}>
                    <Alert
                        message="Ошибка"
                        description="Попробуйте проверить соединение с интернетом или перезагрузить"
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
            <Row>
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