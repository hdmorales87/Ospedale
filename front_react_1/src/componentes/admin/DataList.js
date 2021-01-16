import React, { Component } from 'react';
import DataRow from './DataRow';
import globalState from '../redux/GlobalState';
import axios from 'axios';
import alertify from 'alertifyjs';

class DataList extends Component {
    constructor(props){
        super(props);
        this.state = {  
            listado  : [],            
        } 
    }  
    componentDidMount(){        
        this.unsubscribe1 = globalState.subscribe( ()=>{           
            if(globalState.getState().type==="updateGrilla"){ 
                let search = globalState.getState()["updateGrilla"].search;                
                this.cargarFilas(search);                                          
            }
        });
    }
    componentWillUnmount(){
        this.unsubscribe1();
    } 
    cargarFilas(search){        
        if(!search){
            search = '';
        }
        else{
            search = '/'+search;
        }
        axios.get('http://api-ospedale.com.devel/api/user'+search, {
            withCredentials: true,
            headers: {"Authorization" : localStorage.token }, 
            params: {

            } 
        })
        .then(res => {
            var response = res.data; 
            if (response.status === "success") {                
                this.setState({ listado: response.users });
                
            } else {
                alertify.alert('Error!', 'Ha ocurrido un error accesando a la base de datos!');                 
            }
        })
        .catch( err => {            
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+err);
        });
    } 
    componentWillMount(){
        this.cargarFilas();
    }    
    render() {   		
        return (
            <tbody>
            {
                this.state.listado.map((listado,i) => {
                      return <DataRow key={ i }
                                numero={i} 
                                fila={listado} 
                             />
                })
            }
            </tbody>                         
        );
    }
}

export default DataList