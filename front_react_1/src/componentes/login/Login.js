import React, { Component } from 'react';
import LoginForm from './LoginForm';
import LogoLogin from './LogoLogin';

class Login extends Component {    
    render() {   		
        return (
            <div id="table_login"> 
            	<div style={{width: '320px'}}>               
                	<LogoLogin />
                	<LoginForm history={this.props.history}/>
            	</div>                
            </div>                          
        );
    }
}

export default Login