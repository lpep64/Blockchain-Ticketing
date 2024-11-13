<?php
session_start();
require_once 'vendor/autoload.php';

phpCAS::client(CAS_VERSION_2_0, 'login.uconn.edu', 443, '/cas', 'https://blockchainticketing.ue.r.appspot.com/authenticate-user');
phpCAS::setNoCasServerValidation();

phpCAS::forceAuthentication();

$_SESSION['netid'] = phpCAS::getUser();

// Redirect back to the Vue app
header('Location: https://blockchainticketing.ue.r.appspot.com/');
exit();
