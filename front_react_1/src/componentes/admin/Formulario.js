import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ComboBox from './ComboBox';
import Form from 'react-bootstrap/Form';
import globalState from '../redux/GlobalState';
import axios from 'axios';
import alertify from 'alertifyjs';

class Formulario extends Component { 
    constructor(props){
        super(props);
        this.state = {
            fields : ['nombre','documento','password','genero','fecha_nacimiento','telefono','eps_id','rol_id'],
            show   : false,
            id     : 0,
            nombre : '',
            documento : '',
            password : '',            
            genero : '',
            fecha_nacimiento : '',
            telefono : '',
            eps_id : '',
            rol_id : ''                     
        }
    }  
    componentWillMount(){
        //this.cargarCampos();
    }
    componentDidMount(){        
        this.unsubscribe1 = globalState.subscribe( ()=>{           
            if(globalState.getState().type===this.props.action){ 
                this.setState({                     
                    show : globalState.getState()[this.props.action].show,
                    id : globalState.getState()[this.props.action].id,
                },()=>{
                    if(this.state.show){
                        if(this.state.id > 0){
                            this.cargarCampos();
                        }
                    }
                });  
                                          
            }
        });
    }
    componentWillUnmount(){
        this.unsubscribe1();
    } 
    componentDidUpdate(prevProps,prevState){
        //
    }  
    cargarCampos(){
        axios.get('http://api-ospedale.com.devel/api/user/detail/'+this.state.id, {
            withCredentials: true,  
            headers: {"Authorization" : localStorage.token },           
        })
        .then(res => {
            var response = res.data; 
            if (response.status === "success") {
                let user = response.user;
                this.setState({ nombre : user.nombre });
                this.setState({ documento : user.documento });
                this.setState({ genero : user.genero });
                this.setState({ fecha_nacimiento : user.fecha_nacimiento });
                this.setState({ telefono : user.telefono });
                this.setState({ eps_id : user.eps_id });
                this.setState({ rol_id : user.rol_id });                 
            } else {
                alertify.alert('Error!', 'Ha ocurrido un error accesando a la base de datos!');                 
            }
        })
        .catch( err => {            
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+err);
        });
    } 
    handleClose(){
        globalState.dispatch({
            type   : this.props.action,
            params : {
                        show : false
                     }
        }); 
    }
    changeField(field,e){
        this.setState({[field] : e.target.value});
    }
    handleGuardar(){
        //validar que los campos esten diligenciados
        let json = {};
        let count = 0;
        this.state.fields.forEach((field,i) => {
            if(this.state[field] === undefined || this.state[field] === ''){
                alertify.error('Ingrese '+field+'!'); 
                count++;
            }
            else{
                json[field] = this.state[field];
            }
        });
        if(count>0){
            return;
        }
        else{
            json['id'] = this.state.id;
            json = JSON.stringify(json);
            let metodo = 'POST';
            let ruta = 'register';
            let title = 'Almacenado';
            if(this.state.id > 0){
                metodo = 'PUT';
                ruta = 'update';
                title = 'Actualizado';
            }
            //llamar el metodo insertar POST o actualizar PUT            
            axios({
                method: metodo,
                url: 'http://api-ospedale.com.devel/api/user/'+ruta,
                data: {
                    json : json,                    
                },
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
                    alertify.alert('Aviso!', 'Se ha '+title+' la información');
                    globalState.dispatch({
                        type   : this.props.action,
                        params : {
                                    show : false
                                 }
                    }); 
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
    }
    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose.bind(this)} scrollable="true">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.action} Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="Form.ControlInput1">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="" value={this.state.nombre} onChange={this.changeField.bind(this,'nombre')}/>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput2">
                        <Form.Label>Documento</Form.Label>
                        <Form.Control type="text" placeholder="" value={this.state.documento} onChange={this.changeField.bind(this,'documento')}/>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="" value={this.state.password} onChange={this.changeField.bind(this,'password')}/>
                    </Form.Group>                    
                    <Form.Group controlId="Form.ControlInput5">
                        <Form.Label>Género</Form.Label>                      
                        <Form.Control as="select" value={this.state.genero} onChange={this.changeField.bind(this,'genero')}>
                            <option value="">Seleccione...</option>
                            <option value="M">M</option>
                            <option value="F">F</option>                            
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput6">
                        <Form.Label>Fecha Nacimiento</Form.Label>
                        <Form.Control type="date" placeholder="" value={this.state.fecha_nacimiento} onChange={this.changeField.bind(this,'fecha_nacimiento')}/>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput7">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" placeholder="" value={this.state.telefono} onChange={this.changeField.bind(this,'telefono')}/>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput8">
                        <Form.Label>EPS</Form.Label>
                        <ComboBox functionChange={this.changeField.bind(this,'eps_id')} tabla="eps" value={this.state.eps_id}/>
                    </Form.Group>
                    <Form.Group controlId="Form.ControlInput9">
                        <Form.Label>Rol</Form.Label>
                        <ComboBox functionChange={this.changeField.bind(this,'rol_id')} tabla="roles" value={this.state.rol_id}/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                        CANCELAR
                    </Button>
                    <Button variant="primary" onClick={this.handleGuardar.bind(this)}>
                        GUARDAR
                    </Button>
                </Modal.Footer>
            </Modal>                         
        );
    }
}

export default Formulario