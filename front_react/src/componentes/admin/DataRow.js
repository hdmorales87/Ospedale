import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Formulario from './Formulario';
import alertify from 'alertifyjs';
import globalState from '../redux/GlobalState';
import axios from 'axios';

class DataRow extends Component {
    editarRegistro(id){
        globalState.dispatch({
            type   : "Editar",
            params : {
                        show : true,
                        id   : id
                     }
        });    
    }
    eliminarRegistro(id){
        alertify.confirm('Confirmacion', 'Esta seguro(a) de eliminar este usuario?', this.handleConfirmEliminar.bind(this,id), function(){});      
    }
    handleConfirmEliminar(id){
        axios.delete('http://api-ospedale.com.devel/api/user/delete/'+id,{            
            data: {},
            headers: {"Authorization" : localStorage.token },
            withCredentials: true
        })
        .then(res => {
            var response = res.data; 
            if(response.status === 'error'){
                //error al guardar
                alertify.alert('Aviso!', response.message);
            }
            else{
                alertify.alert('Aviso!', 'Se ha eliminado la información');                
                //actualizar la tabla
                globalState.dispatch({
                    type   : 'updateGrilla',
                    params : { }
                }); 
            }
        })
        .catch( err => {            
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+err);
        });
    }
    //funcion para calcular la edad
    calcularEdad(fecha) {
        var hoy = new Date();
        var cumpleanos = new Date(fecha);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }

        return edad;
    }
    render() {
        let listado = this.props.fila; 
        let edad =  this.calcularEdad(listado.fecha_nacimiento); 	
        let title = 'Año';
        if(edad > 1){
            title = 'Años';
        }	
        //color del texto
        let color = 'black';
        if(edad < 18){
            color = 'green';
        }
        if(edad > 50){
            color = 'red';
        }
        return (
            <tr>
                <td>{this.props.numero+1}</td>
                <td style={{'color':color}}>{listado.nombre}</td>
                <td>{listado.documento}</td>
                <td>{listado.genero}</td>
                <td>{edad+' '+title}</td>
                <td>{listado.telefono}</td>
                <td>{listado.eps_id}</td>
                <td>{listado.rol_id}</td>
                <td>
                    <Button id="dataGridBtnNew" variant="primary" onClick={this.editarRegistro.bind(this,listado.id)}>EDITAR</Button>
                </td>                
                <td >
                    <Button id="dataGridBtnNew" variant="danger" onClick={this.eliminarRegistro.bind(this,listado.id)}>ELIMINAR</Button>
                </td>
                <Formulario action="Editar"/>
            </tr>                         
        );
    }
}

export default DataRow