<?php
ini_set('display_errors', 1);

// Debug shorthand helper
function d( $first = null, $second = null ) {
  if (isset($first)) {
    echo '<pre>'. print_r($first, true) .'</pre>';
  }
  if (isset($second)) {
    echo '<pre>'. print_r($second, true) .'</pre>';
    d('------------------------------');
  }
}

require_once __DIR__ . '/../vendor/autoload.php';

use Laizerox\Wowemu\SRP\UserClient;

/* Connect to your CMaNGOS database. */
// $db = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);

/* If the form has been submitted. */
$username = 'hioneyyy';
$password = 'aceracer';

/* Grab the users IP address. */
$ip = $_SERVER['REMOTE_ADDR'];

/* Set the join date. */
$joinDate = date('Y-m-d H:i:s');

/* Set GM Level. */
$gmLevel = '0';

/* Set expansion pack - Wrath of the Lich King. */
$expansion = '2';

/* Create your v and s values. */
$client = new UserClient($username);
$salt = $client->generateSalt();
$verifier = $client->generateVerifier($password);

echo "<p>salt: $salt </p>";
echo "<p>verifier: $verifier </p>";

  /* Insert the data into the CMaNGOS database. */
  /* Insert the data into the CMaNGOS database. */
  // mysqli_query($db, "INSERT INTO account (username, v, s, gmlevel, email, joindate, last_ip, expansion) VALUES ('$username', '$verifier', '$salt',  '$gmLevel', '$email', '$joinDate', '$ip', '$expansion')");

  /* Do some stuff to let the user know it was a successful or unsuccessful attempt. */

// d($order);
// $res = Order::findAll();

// echo "<p>result:</p>";
// echo getenv('DB_PASSWORD');
echo "<p>testa</p>";
