import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './componentes/login/Login';
import PanelAdmin from './componentes/admin/PanelAdmin';

class App extends Component {
  render() {
    return (//router de la aplicacion
      <BrowserRouter>               
          <Switch>
              <Route exact path={'/'} component={Login} />  
              <Route exact path={'/admin'} component={PanelAdmin} />                         
          </Switch>        
      </BrowserRouter>
    );
  }
}
export default App;
