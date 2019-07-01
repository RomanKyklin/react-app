import React, {Component} from 'react';
import 'antd/dist/antd.css'
import './App.css';
import {Row, Col} from 'antd';

const axios = require('axios');


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {images: []};
    }


    componentDidMount() {
        axios.get('https://api.unsplash.com/photos/?client_id=503ff9ab15e3bb7ec386d6f9339a43043cd320c465dc6948160c9e698323b820')
            .then((response) => {
                this.setState({images: response.data});
                console.log(this.state.images)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <Row>
                    {this.state.images.map((image, i) => {
                        return (
                            <Col span={12} key={i}>
                                <img width={640} height={480} src={image.urls.small} alt="Logo"/>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        );
    }
}

export default App;
