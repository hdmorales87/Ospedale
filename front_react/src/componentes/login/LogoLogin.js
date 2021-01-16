import React, { Component } from 'react';
import logo_login from '../../images/logo_login.jpg?v1.0';

class LogoLogin extends Component {
    
    render() {
        return (            
            <div className="LogoLogin">
                <img src={ logo_login } alt="Ospedale" />
            </div>                                         
        );
    }
}

export default LogoLogin