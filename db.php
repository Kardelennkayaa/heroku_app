<?php

$server = 'ec2-52-73-149-159.compute-1.amazonaws.com';
$username = 'qsdefbsjuutnav';
$password = '5c313ea9744c5f77eb74735793555027639f5e3d23301d69db9a57b9d861a959';
$db_name = 'd3epg3noqco662';

$dbcon = pg_connect("host=$server port=5432 dbname=$db_name user=$username password=$password")

?>
