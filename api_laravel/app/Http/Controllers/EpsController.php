<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Eps;

class EpsController extends Controller
{
	public function __construct(){
		$this->middleware('api.auth',['except' => ['index','show']]);
	}

    public function index(){
    	$eps = Eps::all();

    	return response()->json([
    		'code' => 200,
    		'status' => 'success',
    		'rows' => $eps
    	]);
    }

    public function show($id){
    	$eps = Eps::find($id);

    	if(is_object($category)){
    		$data = array(
	    		'code' => 200,
	    		'status' => 'success',
	    		'result' => $eps
	    	);
    	}
    	else{
    		$data = array(
	    		'code' => 404,
	    		'status' => 'error',
	    		'eps' => 'La Eps no existe'
	    	);
    	}

    	return response()->json($data,$data['code']);    	
    }

    public function store(Request $request){
    	//Recoger los datos por POST
    	$json = $request->input('json',null);
    	$params_array = json_decode($json,true);

    	//Validar los datos
    	$validate = \Validator::make($params_array,[
			'name' => 'required',			
    	]);

    	//Guardar la eps

    	//Devolver resultado
    }
}
