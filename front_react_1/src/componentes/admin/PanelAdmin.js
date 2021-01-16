import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DataGrid from './DataGrid';
import alertify from 'alertifyjs';

class PanelAdmin extends Component { 
    handleLogout(){
    	alertify.confirm('Confirmacion', 'Esta seguro(a) de cerrar sesión?', this.handleConfirmLogout.bind(this), function(){});      
    }
    handleConfirmLogout(id){
    	localStorage.removeItem('token');
    	this.props.history.push({pathname: '/'});
    }
    render() {
    	if (!localStorage.token) {//sesion inexistente, cargar login
            alert('Su sesion ha finalizado, debe registrarse de nuevo!');
        	return <Redirect to={'/'} />;
      	}   		
        return (
            <div style={{"background":"#FFF",'height':'100%'}}  className="col px-md-5">  
            	<h5 style={{'cursor':'pointer','textDecoration': 'underline'}} className="pt-3 float-right" onClick={this.handleLogout.bind(this)}>Cerrar Sesión</h5>                
            	<h1 className="pt-3 display-4">Usuarios</h1>
                <DataGrid />
            </div>                          
        );
    }
}

export default PanelAdmin