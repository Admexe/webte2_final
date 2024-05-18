<?php
require_once __DIR__ . '/vendor/autoload.php';

use Workerman\Worker;
use Workerman\Connection\TcpConnection;

// Create a WebSocket server listening on 0.0.0.0:8282
$ws_worker = new Worker("websocket://0.0.0.0:8282");

// Set the number of processes to 5
$ws_worker->count = 5;

// Define behavior when a new connection is established
$ws_worker->onConnect = function($connection) {
    echo "New connection\n";
    $uuid = uniqid();
    $connection->send(json_encode(["uuid" => $uuid]));
};

// Define behavior when a message is received
$ws_worker->onMessage = function(TcpConnection $connection, $data) use ($ws_worker) {
    foreach ($ws_worker->connections as $client_connection) {
        $client_connection->send($data);
    }
};

// Define behavior when a connection is closed
$ws_worker->onClose = function(TcpConnection $connection) {
    echo "Connection closed\n";
};

// Run all workers
Worker::runAll();
