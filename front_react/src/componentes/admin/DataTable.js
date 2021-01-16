import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import DataList from './DataList';

class DataGrid extends Component { 
    render() {   		
        return (
            <div style={{"background":"#FFF"}}>             	
                <Table responsive table-striped="true">
                    <thead className="cf">
                        <tr>
                            <th style={{fontSize:'12px'}}>No.</th>
                            <th style={{fontSize:'12px'}}>Nombre</th>
                            <th style={{fontSize:'12px'}}>Documento</th>
                            <th style={{fontSize:'12px'}}>Genero</th>
                            <th style={{fontSize:'12px'}}>Edad</th>
                            <th style={{fontSize:'12px'}}>Teléfono</th>
                            <th style={{fontSize:'12px'}}>EPS</th>
                            <th style={{fontSize:'12px'}}>ROL</th>
                            <th style={{fontSize:'12px'}}>&nbsp;</th>
                            <th style={{fontSize:'12px'}}>&nbsp;</th>
                        </tr>
                    </thead> 
                    <DataList />  
                </Table>             
            </div>                          
        );
    }
}

export default DataGrid