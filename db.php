<?php

$server = 'ec2-18-235-45-217.compute-1.amazonaws.com';
$username = 'zfdmjepycjwbxc';
$password = 'dc600e2398001a8c61a4ac7af3ea7d8dd457f93f4b9c08cde9b918b0a1ed8857';
$db_name = 'd9m22slngbh4er';

$dbcon = pg_connect("host=$server port=5432 dbname=$db_name user=$username password=$password")

?>