import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './containers/Auth';
import './index.css';
import {Layout} from "antd";
import ProjectRouter from "./router/ProjectRouter";

const {Content, Footer} = Layout;

ReactDOM.render(
  <Auth>
      <Layout className="layout">
          <Content>
              <ProjectRouter/>
          </Content>
          <Footer style={{textAlign: 'center'}}>©2018</Footer>
      </Layout>
  </Auth>,
  document.getElementById('root')
);
