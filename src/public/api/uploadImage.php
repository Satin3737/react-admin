<?php

$file = $_FILES['image']['tmp_name'];

if (file_exists($file) && is_uploaded_file($file)) {
    $fileExt = explode('/', $_FILES['image']['type'])[1];
    $fileName = uniqid() . '.' . $fileExt;

    move_uploaded_file($file, '../project/img/' . $fileName);
    echo json_encode(array('src' => $fileName));
}