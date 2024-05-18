<?php
require_once '../classes/response.php';
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


// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Initialize ResponseHandler
$responseHandler = new ResponseHandler();

// Handle request method
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);  
$pathParts = explode("/", $path);

// Function to send WebSocket message
function sendWebSocketMessage($question_id, $response_text) {
    $ws_message = json_encode([
        'action' => 'new_response',
        'question_id' => $question_id,
        'response' => $response_text
    ]);

    // Send WebSocket notification
    $client = stream_socket_client('tcp://127.0.0.1:2346');
    fwrite($client, $ws_message);
    fclose($client);
}

// Function to handle WebSocket messages
function handleWebSocketMessages() {
    $ws = new WebSocket\Client('wss://node95.webte.fei.stuba.sk:2346/wss');

    $ws->on('message', function ($data) use ($responseHandler) {
        $message = json_decode($data, true);
        if ($message['action'] === 'new_response') {
            // Insert new response into the database
            $question_id = $message['question_id'];
            $response_text = $message['response'];
            $result = $responseHandler->createResponse($question_id, $response_text);
            if ($result['status'] === 'success') {
                // Handle successful response insertion
            } else {
                // Handle failed response insertion
            }
        }
    });

    $ws->run();
}

// Run WebSocket message handling in the background
if (php_sapi_name() === 'cli') {
    handleWebSocketMessages();
}



switch ($method) {
    case 'GET':
        // Retrieve response information by ID
        if (count($pathParts) === 4) {
            $response_id = $pathParts[3];
            $result = $responseHandler->getResponseById($response_id);
            if ($result['status'] === 'success') {
                http_response_code(200); // OK
                header('Content-Type: application/json');
                echo json_encode($result['response']);
            } else {
                http_response_code(404); // Not Found
            }
        } 
        // Retrieve all responses for a given question ID
        else if (count($pathParts) === 5 && $pathParts[3] === 'question') {
            $question_id = $pathParts[4];
            $result = $responseHandler->getResponsesByQuestionId($question_id);
            if ($result['status'] === 'success') {
                http_response_code(200); // OK
                header('Content-Type: application/json');
                echo json_encode($result['responses']);
            } else {
                http_response_code(404); // Not Found
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    case 'POST':
        // Create a new response
        if (count($pathParts) === 3) {
            $data = json_decode(file_get_contents('php://input'), true);
            $question_id = filter_var($data['question_id'], FILTER_SANITIZE_NUMBER_INT);
            $text = filter_var($data['text'], FILTER_SANITIZE_STRING);
            $votes = isset($data['votes']) ? intval($data['votes']) : 0;

            // Validate input
            if (empty($question_id) || empty($text)) {
                http_response_code(400); // Bad Request
                break;
            }

            // Insert new response into the database
            $result = $responseHandler->createResponse($question_id, $text, $votes);
            if ($result['status'] === 'success') {
                http_response_code(201); // Created
                
                sendWebSocketMessage($question_id, $text); // Send WebSocket notification
                
            } else {
                http_response_code(500); // Internal Server Error
            }
        } else {
            http_response_code(400); // Bad Request
        }
        break;
    case 'PUT':
        // Update an existing response
        // You can implement this if needed
        http_response_code(405); // Method Not Allowed
        break;
    case 'DELETE':
        // Delete an existing response
        // You can implement this if needed
        http_response_code(405); // Method Not Allowed
        break;
    default:
        // Invalid request method
        http_response_code(400); // Bad Request
        break;
}
?>
