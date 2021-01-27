import React from 'react';
import { Route, Switch } from 'react-router-dom'
import {Layout} from 'antd';

import "./LayoutPersonal.scss"

export default function LayoutPersonal(props){
    const {routes} = props;
    const {Content, Footer} = Layout;
    return(
        <Layout>
            <h2>Menu Personal</h2>
            <Layout>
                <Content>
                    <LoadRoutes routes={routes}/>
                </Content>
                <Footer>Bryan Amaguaña</Footer>
            </Layout>
        </Layout>
    );
}

function LoadRoutes({routes}){
    return (
        <Switch>
            {routes.map((route, index) => (
         <Route
         key={index}
         path={route.path}
         exact={route.exact}
         component={route.component}
         />
     ))}
        </Switch>
    );
 }