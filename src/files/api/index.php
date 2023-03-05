<?php

$htmlFiles = glob('../../*.html');
$respone = [];

foreach ($htmlFiles as $file) {
    array_push($respone, basename($file));
}

echo json_encode($respone);