<?php

$file = $_FILES['image']['tmp_name'];
$route = '../project/img/';

if (file_exists($file) && is_uploaded_file($file)) {
    $fileExt = explode('/', $_FILES['image']['type'])[1];
    $fileName = uniqid() . '.' . $fileExt;

    if (!is_dir($route)) {
        mkdir($route);
    }

    move_uploaded_file($file, $route . $fileName);
    echo json_encode(array('src' => $fileName));
}