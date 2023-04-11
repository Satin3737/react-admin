<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$routeProject = '../project/';
$routeBackups = '../backups/';

$route = '../project/';
$file = $_POST['pageName'];
$newHTML = $_POST['html'];

if (!is_dir($routeBackups)) {
    mkdir($routeBackups);
}

$backups = json_decode(file_get_contents("../backups/backups.json"));
if (!is_array($backups)) {
    $backups = [];
}

if ($newHTML && $file) {
    $backupFileName = uniqid() . ".html";
    copy($routeProject . $file, '../backups/' . $backupFileName);
    $backups[] = ["page" => $file, "file" => $backupFileName, "time" => date("d:m:y | H:i:s")];
    file_put_contents("../backups/backups.json", json_encode($backups));
    file_put_contents($routeProject . $file, $newHTML);
} else {
    header('HTTP/1.0 400 Bad Request');
}