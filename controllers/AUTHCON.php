<?php
require_once '../classes/auth.php'; // Ensure this path correctly points to the Auth class file.
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Handle CORS requests
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

// Extract the action from the path
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);  
$pathParts = explode("/", $path);
$auth = new Auth();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($pathParts[3])) {
    $action = $pathParts[3];
    switch ($action) {
        case 'login':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['email']) && isset($data['password'])) {
                
                $response = $auth->login($data['email'], $data['password']);
                echo json_encode($response);
                
                if ($response['status'] == 'success') {
                    $_SESSION['logged_in'] = true;
                    $_SESSION['user_id'] = $response['user_id'];  // Assuming the login method returns user ID
                    echo json_encode(['status' => 'success', 'message' => 'Logged in successfully']);
                }
            }
            else{
                echo json_encode(['status' => 'error', 'message' => 'Email and password required']);
                exit;
            }
           
            break;

        case 'logout':
            $response = $auth->logout();
            echo json_encode($response);
            break;

        default:
            header("HTTP/1.1 404 Not Found");
            echo json_encode(['status' => 'error', 'message' => 'Action not found']);
            break;
    }
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
