<?php
require_once __DIR__ . '/vendor/autoload.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
    exit(0);
}


use Workerman\Worker;
use Workerman\Connection\TcpConnection;

$ws_worker = new Worker("websocket://0.0.0.0:8080");

$ws_worker->onConnect = function (TcpConnection $connection) {
    echo "New connection\n";
};

$ws_worker->onMessage = function (TcpConnection $connection, $data) use ($ws_worker) {
    foreach ($ws_worker->connections as $client_connection) {
        $client_connection->send($data);
    }
};

$ws_worker->onClose = function (TcpConnection $connection) {
    echo "Connection closed\n";
};

Worker::runAll();
