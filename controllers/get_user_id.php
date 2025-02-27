<?php
session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // Cache for 1 day
}

// Handle OPTIONS requests for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: POST, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
    exit(0);
}

header('Content-Type: application/json');

// Debugging information
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'User not logged in',
        'session' => $_SESSION,
        'cookies' => $_COOKIE,
        'session_id' => session_id()
    ]);
    exit();
}

echo json_encode([
    'status' => 'success',
    'message' => 'User  logged in',
    'session' => $_SESSION,
    'cookies' => $_COOKIE,
    'session_id' => session_id(),
    'user_id' => $_SESSION['user_id']
]);
?>
