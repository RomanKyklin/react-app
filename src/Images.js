import React, {Component} from "react";
import axios from 'axios';
import {Row, Col} from 'antd';

export default class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {images: []};
        this.getImages = this.getImages.bind(this);
    }

    componentDidMount() {
        axios.get('https://api.unsplash.com/photos/?client_id=503ff9ab15e3bb7ec386d6f9339a43043cd320c465dc6948160c9e698323b820')
            .then((response) => {
                this.setState({images: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getImages() {
        return this.props.term !== '' ? this.state.images.filter(v => {
            if(v.alt_description !== null) {
                return v.alt_description === this.props.term || v.alt_description.match(this.props.term)
            }
            }) : this.state.images;
    }

    render() {
        return (
            <div>
                <Row>
                    {this.getImages().map((image, i) => {
                        return (
                            <Col span={8} key={i}>
                                <img width={320} height={240} src={image.urls.small} alt={image.alt_description}/>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        );
    }
}