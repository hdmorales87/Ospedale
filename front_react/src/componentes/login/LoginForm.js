import React, { Component } from 'react';
import axios from 'axios';
import alertify from 'alertifyjs';
import './login.css';
import usuario_login from './../../images/usuario_login.png?v1.0';
import password_login from './../../images/password_login.png?v1.0';
import '../../css/alertify.css';

class LoginForm extends Component {
	constructor(props) {
        super(props);
        this.inputDocumento = React.createRef();
        this.inputPassword = React.createRef();
        this.state = {
        	documento : '',
        	password : ''
        }
    }
    handleUserChange(e) { 
        this.setState({documento: e.target.value}); 
    }
    handlePasswordChange(e) { 
        this.setState({password: e.target.value}); 
    }    
    handleEnterLogin(event){//Pulsar enter        
        let key = event.keyCode;        
        if(key === 13){
            this.handleLogin();
        }
    } 
    handleLogin(){
    	//validar que los campos no estén vacios
    	if(this.state.documento === undefined || this.state.documento === ''){
            alertify.error('Digite su numero de identificación!'); 
            this.inputDocumento.current.focus();
            return;            
        }   
        else if(this.state.password === undefined || this.state.password === ''){
            alertify.error('Digite su password!'); 
            this.inputPassword.current.focus();
            return;
        } 
        //componer el JSON que será enviado al backend
    	let json = {
    		documento : this.state.documento,
    		password  : this.state.password
    	};
    	json = JSON.stringify(json);
    	axios({
    	    method: 'post',
    	    url: 'http://api-ospedale.com.devel/api/login',
    	    data: { 
                'json' : json,                   
            },
    	    withCredentials: true
    	})
    	.then(res => {
    		let response = res.data;    		
    		if(response.status === 'error'){
    			//error en el login
    			alertify.alert('Aviso!', response.message);
    		}
    		else {
    			//login exitoso
                localStorage.token = response;
    			this.props.history.push({pathname: '/admin'});    			
    		} 
		}) 
        .catch( err => {  
        	//alert('Error! No se ha logrado la conexion con el servidor!\n'+err);          
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+err);            
        });	    	
    }
    render() {
        return (            
            <form className="DivLogin">
                <div className="ContentField">
                    <div className="FieldImage">
                        <img alt="Usuario" src={ usuario_login } />
                    </div>
                    <div className="FieldDiv">
                        <input 
                            type="text" 
                            value={this.state.documento} 
                            className="inputLogin mytext" 
                            name="usuario" 
                            id="usuario" 
                            placeholder="Usuario" 
                            required 
                            onChange={this.handleUserChange.bind(this)}                             
                            ref={this.inputDocumento}
                        />
                    </div>
                </div>
                <div className="ContentField" styles= {{marginTop: '20px',marginBottom: '20px'}}>
                    <div className="FieldImage">
                        <img alt="Contraseña" src={ password_login } />
                    </div>
                    <div className="FieldDiv">
                        <input type="password" className="inputLogin mytext" name="password" id="password" placeholder="Contraseña" required onChange={this.handlePasswordChange.bind(this)} onKeyUp={this.handleEnterLogin.bind(this)} ref={this.inputPassword}/>
                    </div>
                </div>
                <div className="DivBoton">
                    <input type="button" id="validateUser" onClick={this.handleLogin.bind(this)} value=" " />
                </div>
            </form>                                         
        );
    }
}

export default LoginForm