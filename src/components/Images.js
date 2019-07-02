import React, {Component} from "react";
import axios from 'axios';
import {Row, Col, Alert} from 'antd';

require('dotenv').config();

export default class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {images: [], isError: false};
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_UNSPLASH_API_KEY_GET_PHOTOS)
            .then((response) => {
                this.setState({images: response.data});
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {term = ''} = this.props;

        if(term !== '') {
            this.searchImages(term);
        }
    }

    searchImages = (term) => {
        axios.get(process.env.REACT_APP_UNSPLASH_API_KEY_SEARCH_PHOTOS + `&query=${term}`)
            .then((response) => {
                console.log(response);
                this.setState({images: response.data.results});
            })
            .catch((error) => {
                this.setState({isError: true});
                console.log(error);
            });
    };

    render() {
        const {isError = false} = this.state;
        const {images = []} = this.state;

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
                            <img width={320} height={240} src={image.urls.small} alt={image.alt_description}/>
                        </Col>
                    )
                })}
            </Row>
        );
    }
}