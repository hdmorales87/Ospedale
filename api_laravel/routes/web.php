<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Middleware\ApiAuthMiddleware;

//RUTAS DE PRUEBA
Route::get('/', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}', function ($texto=null) {
	$texto = '<h2>Texto desde Laravel '.$texto.'</h2>';
    return view('prueba',array(
    	'texto' => $texto
    ));
});

Route::get('/animales', 'PruebaController@index');
Route::get('/test-orm', 'PruebaController@testOrm');

//RUTAS DEL API

	//Rutas de Prueba
	//Route::get('/usuario/pruebas', 'UserController@pruebas');
	//Route::get('/categoria/pruebas', 'CategoryController@pruebas');
	//Route::get('/post/pruebas', 'PostController@pruebas');

	//Rutas del Controlador de Usuarios
	Route::post('/api/user/register', 'UserController@register')->middleware(ApiAuthMiddleware::class);
	Route::post('/api/login', 'UserController@login');
	Route::put('/api/user/update', 'UserController@update');	
	Route::get('/api/user/detail/{id}','UserController@detail')->middleware(ApiAuthMiddleware::class);
	Route::get('/api/user','UserController@index')->middleware(ApiAuthMiddleware::class);
	Route::get('/api/user/{search}','UserController@search')->middleware(ApiAuthMiddleware::class);
	Route::delete('/api/user/delete/{id}','UserController@delete')->middleware(ApiAuthMiddleware::class);

	//Rutas del Controlador de Eps
	Route::resource('/api/eps', 'EpsController');

	//Rutas del Controlador de Rol
	Route::resource('/api/roles', 'RolController');