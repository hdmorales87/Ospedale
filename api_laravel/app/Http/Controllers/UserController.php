<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{    

    public function register(Request $request){

    	//Recoger los datos del usuario
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	$params_array = json_decode($json,true);  

    	if(!empty($params) && !empty($params_array)){
	    	//Limpiar datos 
	    	$params_array = array_map('trim',$params_array);	

	    	//Validar datos
	    	$validate = \Validator::make($params_array,[
				'nombre'    => 'required',
				'documento' => 'required|unique:users',//Comprobar si usuario existe (Duplicado)
				'password'  => 'required',
				'genero'    => 'required',
				'fecha_nacimiento' => 'required',
				'telefono' => 'required',
				'eps_id' => 'required',
				'rol_id' => 'required'
	    	]);

	    	if($validate->fails()){
	    		//la validación ha fallado
	    		$data = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'El usuario no se ha creado correctamente',
		    		'errors' => $validate->errors()
		    	);    		
	    	}
	    	else{
	    		//validación pasada correctamente

	    		//Cifrar contraseña
	    		$pwd = hash('sha256',$params->password);

    			//Crear usuario
    			$user = new User();
    			$user->nombre = $params_array['nombre'];
    			$user->documento = $params_array['documento'];
    			$user->password = $pwd;
    			$user->genero = $params_array['genero'];
    			$user->fecha_nacimiento = $params_array['fecha_nacimiento'];
    			$user->telefono = $params_array['telefono'];
    			$user->eps_id = $params_array['eps_id'];
    			$user->rol_id = $params_array['rol_id'];    			

    			//Guardar el usuario
    			$user->save();

	    		$data = array(
		    		'status' => 'suceess',
		    		'code' => 200,
		    		'message' => 'El usuario se ha creado correctamente',
		    		'user' => $user	    		
		    	);
	    	}
	    }
	    else{
	    	$data = array(
	    		'status' => 'error',
	    		'code' => 404,
	    		'message' => 'Los datos enviados no son correctos',
	    	); 
	    } 

    	return response()->json($data,$data['code']);
    }

    public function login(Request $request){

    	$jwtAuth = new \JwtAuth();

    	//Recibir datos por POST
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	$params_array = json_decode($json,true);

    	if(!empty($params) && !empty($params_array)){
	    	//Validar los datos
	    	$validate = \Validator::make($params_array,[			
				'documento' => 'required',//Comprobar si usuario existe (Duplicado)
				'password'  => 'required',
	    	]);

	    	if($validate->fails()){
	    		//la validación ha fallado
	    		$signup = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'El usuario no se ha podido identificar',
		    		'errors' => $validate->errors()
		    	);    		
	    	}
	    	else{
	    		//Cifrar el Password
	    		$pwd = hash('sha256',$params->password);

	    		//Devolver Token o Datos
	    		$signup = $jwtAuth->signup($params->documento,$pwd);
	    		if(!empty($params->getToken)){
	    			$signup = $jwtAuth->signup($params->documento,$pwd,true);
	    		}
	    	}
	    }
	    else{
	    	$signup = array(
	    		'status' => 'error',
	    		'code' => 404,
	    		'message' => 'Los datos enviados no son correctos',
	    	); 
	    }    	

    	return response()->json($signup,200);
    }

    public function update(Request $request){
    	
    	//Comprobar si el usuario está autorizado
    	$token = $request->header('Authorization');
    	$jwtAuth = new \JwtAuth();
    	$checkToken = $jwtAuth->checkToken($token);    	

    	if($checkToken){ 

    		//Recoger los datos por POST
			$json = $request->input('json',null);    		
			$params_array = json_decode($json,true);

			if(!empty($params_array)){
	    		//Sacar usuario identificado
	    		$user = $jwtAuth->checkToken($token,true);   		

	    		//Validar los datos 
	    		$validate = \Validator::make($params_array,[
	    			'nombre'    => 'required',
					'documento' => 'required|unique:users,documento,'.$user->sub,
					'password'  => 'required',
					'genero'    => 'required',
					'fecha_nacimiento' => 'required',
					'telefono' => 'required',
					'eps_id' => 'required',
					'rol_id' => 'required'					
		    	]);

		    	if($validate->fails()){
		    		//la validación ha fallado
		    		$data = array(
			    		'status' => 'error',
			    		'code' => 404,
			    		'message' => 'El usuario no se ha actualizado correctamente',
			    		'errors' => $validate->errors()
			    	);    		
		    	}
		    	else{
		    		//Quitar los campos que no quiero actualizar
		    		unset($params_array['id']);
		    		unset($params_array['created_at']);	

		    		//Cifrar el Password
	    			$pwd = hash('sha256',$params_array['password']);	
	    			$params_array['password'] = $pwd;    		

		    		//Actualizar usuario en bd
		    		$user_update = User::where('id',$user->sub)->update($params_array);

		    		unset($params_array['password']);
		    		
		    		//Devolver array con resultado 
		    		$data = array(
			    		'status' => 'success',
			    		'code' => 200,
			    		'user' => $user,
			    		'changes' => $params_array 
			    	);
			    }
		    }
		    else{
		    	$data = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'Los datos enviados no son correctos',
		    	); 
		    } 
    	}
    	else{
    		$data = array(
	    		'status' => 'error',
	    		'code' => 400,
	    		'message' => 'El usuario no está identificado',
	    	); 
    	}
    	
    	return response()->json($data,$data['code']);
    }    

    public function index(){
    	$users = User::all();

    	return response()->json([
    		'code' => 200,
    		'status' => 'success',
    		'users' => $users
    	]);
    }

    public function detail($id){
    	$user = User::find($id);

    	if(is_object($user)){
    		$data = array(
	    		'status' => 'success',
	    		'code'   => 200,
	    		'user'   => $user,
	    	);
    	}
    	else{
    		$data = array(
				'status'  => 'error',
				'code'    => 404,
				'message' => 'El usuario no existe',
	    	);    		
    	}
    	return response()->json($data,$data['code']);
    }

    public function delete($id){
    	$user_delete = User::where('id',$id)->delete();		
		
		//Devolver array con resultado 
		$data = array(
    		'status' => 'success',
    		'code' => 200,    		
    	);
    	return response()->json($data,$data['code']);
    }

    public function search($search){
    	$users = User::where('nombre', 'LIKE', "%$search%")
    			 ->orWhere('documento', 'LIKE', "%$search%")->get();		
		
		//Devolver array con resultado 
		return response()->json([
    		'code' => 200,
    		'status' => 'success',
    		'users' => $users
    	]);
    	return response()->json($data,$data['code']);
    }
}