<?php
session_start();
require_once 'vendor/autoload.php';

phpCAS::client(CAS_VERSION_2_0, 'cas-msb-dev.grove.ad.uconn.edu', 443, '/cas', 'https://blockchainticketing.ue.r.appspot.com/authenticate-user.php');
phpCAS::setNoCasServerValidation();
phpCAS::forceAuthentication();

// Get the authenticated user's NetID
$netid = phpCAS::getUser();
$_SESSION["netID"] = $netid;

header("Location: /");
exit;
?>