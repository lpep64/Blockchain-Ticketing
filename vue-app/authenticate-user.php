<?php
session_start();
require_once 'vendor/autoload.php';

phpCAS::client(CAS_VERSION_2_0, 'cas-msb-dev.grove.ad.uconn.edu', 443, '/cas', 'https://blockchainticketing.ue.r.appspot.com/authenticate-user.php');
phpCAS::setNoCasServerValidation();

phpCAS::forceAuthentication();

// Get the authenticated user's NetID
$netid = phpCAS::getUser();
?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title>Authenticated User</title>
</head>
<body>
   <h1>Welcome, <?php echo htmlspecialchars($netid); ?>!</h1>
   <p><a href="logout.php">Logout</a></p>
</body>
</html>

