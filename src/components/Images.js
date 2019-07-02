import React, {Component} from "react";
import axios from 'axios';
import {Row, Col, Alert, Pagination} from 'antd';

export default class Images extends Component {
    static SEARCH_PHOTOS_URL = 'https://api.unsplash.com/search/photos';
    static GET_PHOTOS_URL = 'https://api.unsplash.com/photos';

    constructor(props) {
        super(props);
        this.state = {images: [], isError: false, pagesCount: 1};
        const SEARCH_PHOTOS_URL = "";
    }

    componentDidMount() {
        axios.get(Images.GET_PHOTOS_URL, {params: {client_id: process.env.REACT_APP_UNSPLASH_API_KEY}})
            .then((response) => {
                this.setState({images: response.data});
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.term && nextProps.terms !== this.props.term && nextState.images === this.state.images) {
            this.searchImages(nextProps.term)
        }
    }

    searchImages = (term, page = 1, pageSize = 10) => {
        axios.get(Images.SEARCH_PHOTOS_URL, {
            params: {
                client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
                query: term,
                page: page,
                per_page: pageSize
            }
        })
            .then((response) => {
                this.setState({images: response.data.results, pagesCount: response.data.total_pages});
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    };

    itemPagination = (page, pageSize) => {
        this.searchImages(this.props.term, page, pageSize);
    };

    render() {
        const {isError = false, images = [], pagesCount = 1} = this.state;

        return (
            <div>
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
                                <img width={320} height={240} src={image.urls.small} alt={image.alt_description}/>
                            </Col>
                        )
                    })}
                </Row>
                <Row>
                    <Col span={24}>
                        <Pagination defaultCurrent={1} total={pagesCount} onChange={this.itemPagination}/>
                    </Col>
                </Row>
            </div>
        );
    }
}