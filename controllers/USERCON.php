<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Include config file
require_once '../config.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle request method
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);  
$pathParts = explode("/", $path);


switch ($method) {
    case 'GET':
        // Retrieve user information
        if (count($pathParts) === 4) {
            
            $user_id = $pathParts[3];
            $sql = "SELECT * FROM Users WHERE id = :user_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['user_id' => $user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                http_response_code(200); // OK
                header('Content-Type: application/json');
                echo json_encode($user);
            } else {
                http_response_code(404); // Not Found
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    case 'POST':
        // Create a new user
        if (count($pathParts) === 3) {
            $data = json_decode(file_get_contents('php://input'), true);
            $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
            $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $role = isset($data['role']) ? intval($data['role']) : 0;

            // Validate input
            if (empty($name) || empty($email) || empty($password)) {
                http_response_code(400); // Bad Request
                break;
            }

            // Insert new user into the database
            $sql = "INSERT INTO Users (name, email, password, role) VALUES (:name, :email, :password, :role)";
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute(['name' => $name, 'email' => $email, 'password' => $password, 'role' => $role])) {
                http_response_code(201); // Created
            } else {
                http_response_code(500); // Internal Server Error
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    case 'PUT':
        // Update an existing user
        if (count($pathParts) === 4 ) {
            $user_id = $pathParts[3];
            $data = json_decode(file_get_contents('php://input'), true);
            $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
            $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
            $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;
            $role = isset($data['role']) ? intval($data['role']) : 0;
    
            // Validate input
            if (empty($name) || empty($email)) {
                http_response_code(400); // Bad Request
                break;
            }
    
            // Update user in the database
            $sql = "UPDATE Users SET name = :name, email = :email, role = :role";
            if ($password !== null) {
                $sql .= ", password = :password";
            }
            $sql .= " WHERE id = :user_id";
    
            $stmt = $pdo->prepare($sql);
            $params = ['user_id' => $user_id, 'name' => $name, 'email' => $email, 'role' => $role];
            if ($password !== null) {
                $params['password'] = $password;
            }
    
            if ($stmt->execute($params)) {
                http_response_code(200); // OK
            } else {
                http_response_code(500); // Internal Server Error
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    case 'DELETE':
        // Delete an existing user
        if (count($pathParts) === 4) {
            $user_id = $pathParts[3];
            $sql = "DELETE FROM Users WHERE id = :user_id";
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute(['user_id' => $user_id])) {
                http_response_code(200); // OK
            } else {
                http_response_code(500); // Internal Server Error
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    default:
        // Invalid request method
        http_response_code(400); // Bad Request
        break;
}
?>
