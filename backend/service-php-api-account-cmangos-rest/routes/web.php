<?php

/** @var \Laravel\Lumen\Routing\Router $router */

// Debug shorthand helper
function d( $first = null, $second = null ) {

    if (isset($first)) {
        echo '<pre>'. var_export($first, true) .'</pre>';
    }
    if (isset($second)) {
        echo '<pre>'. var_export($second, true) .'</pre>';
        d('------------------------------');
    }
  }

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Laizerox\Wowemu\SRP\UserClient;

$router->get('/', function () use ($router) {
    $results = DB::select("SELECT * FROM account");
    /* Connect to your CMaNGOS database. */
    // $db = new mysqli('mangosdb', 'root', 'mangos', 'tbcrealmd', 3306);
    d($results);
    // foreach ($results as $account) {
        //     echo $account->username;
        // }
    // return $router->app->version();
});


$router->post('register', function (Request $request) {

    $this->validate($request, [
        'username' => 'required|unique:account|max:32',
        'password' => 'required'
    ]);

    
    /* If the form has been submitted. */
    $username = $request->input('username');
    $password = $request->input('password');

    // $username = 'hioneyyy';
    // $password = 'hioneyyy12';

    /* Grab the users IP address. */
    $ip = $_SERVER['REMOTE_ADDR'];

    /* Set the join date. */
    $joinDate = date('Y-m-d H:i:s');

    /* Set GM Level. */
    $gmLevel = '0';

    /* Set expansion pack - TBC */
    $expansion = '1';

    /* Create your v and s values. */
    $client = new UserClient($username);
    $salt = $client->generateSalt();
    $verifier = $client->generateVerifier($password);

    // echo "<p>salt: $salt </p>";
    // echo "<p>verifier: $verifier </p>";
    return response()->json(1);

    
    /* Insert the data into the CMaNGOS database. */
    // mysqli_query($db, "INSERT INTO account (username, v, s, gmlevel, email, joindate, lockedIp, expansion) VALUES ('$username', '$verifier', '$salt',  '$gmLevel', '$email', '$joinDate', '$ip', '$expansion')");
    $results = DB::insert(
        'INSERT INTO account (username, v, s, gmlevel, joindate, lockedIp, expansion) values (?, ?, ?, ?, ?, ?, ?)'
        , [$username, $verifier, $salt, $gmLevel, $joinDate, $ip, $expansion]
    );
    return $results;

    return 'Hello $username / $password';
});