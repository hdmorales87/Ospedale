import React, { Component } from 'react';
import DataTable from './DataTable';
import Formulario from './Formulario';
import Button from 'react-bootstrap/Button';
import globalState from '../redux/GlobalState';

class DataGrid extends Component {
    constructor(props){
        super(props);
        this.state = {
            search : ''
        }
    }      
    handleNewButton(){
        globalState.dispatch({
            type   : "Nuevo",
            params : {
                        show : true,
                        id   : 0
                     }
        });       
    }  
    handleSearch(e){
        this.setState({search:e.target.value});
    }
    handleBuscar(){
        //actualizar la tabla
        globalState.dispatch({
            type   : 'updateGrilla',
            params : { search : this.state.search }
        });
    }  
    render() {         
        return (
            <div style={{"background":"#FFF"}}> 
                <div style={{width: '100%'}}>
                	<div style={{width: '320px'}} className="pt-2 pb-4 float-left">               
                    	<Button id="dataGridBtnNew" variant="primary" onClick={this.handleNewButton.bind(this)}>AGREGAR NUEVO</Button>
                	</div>
                    <div style={{width: '320px'}} className="pt-2 pb-4 float-right"> 
                        <input className="mr-2" type="text" value={this.state.search} onChange={this.handleSearch.bind(this)}/>              
                        <Button id="dataGridBtnNew" variant="primary" onClick={this.handleBuscar.bind(this)}>BUSCAR</Button>
                    </div>
                </div>
                <DataTable />
                <Formulario action="Nuevo"/>                
            </div>                          
        );
    }
}

export default DataGrid