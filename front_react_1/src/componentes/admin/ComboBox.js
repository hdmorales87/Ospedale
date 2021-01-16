import React, { Component } from 'react';
import alertify from 'alertifyjs';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

class DataRow extends Component {    
    constructor(props){
        super(props);
        this.state = {
            listado : []
        };
    }
    componentWillMount(){        
        axios.get('http://api-ospedale.com.devel/api/'+this.props.tabla, {
            withCredentials: true,             
        })
        .then(res => {
            var response = res.data; 
            if (response.status === "success") {
                this.setState({listado : response.rows})                 
            } else {
                alertify.alert('Error!', 'Ha ocurrido un error accesando a la base de datos!');                 
            }
        })
        .catch( err => {            
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+err);
        });
    }
    render() {          		
        return (
            <Form.Control as="select" onChange={this.props.functionChange} value={this.props.value}>
                <option value="" >Seleccione...</option>
                {
                    this.state.listado.map((content,i) => {                       
                        return <option key={ i } value={content.id} >{content.nombre}</option>

                    })                                        
                }
            </Form.Control>                         
        );
    }
}

export default DataRow