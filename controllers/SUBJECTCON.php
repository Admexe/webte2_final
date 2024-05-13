<?php
require_once '../classes/subject.php'; // Uistite sa, že tento súbor správne ukazuje na triedu pre manipuláciu s predmetmi.
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
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
    exit(0);
}

// Extract the action from the path
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);  
$pathParts = explode("/", $path);
$subjectHandler = new SubjectHandler();

if ($_SERVER['REQUEST_METHOD'] === 'POST' &&  (count($pathParts) === 3)) {
    
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['text'])) {
                $response = $subjectHandler->createSubject($data['text']);
                echo json_encode($response);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Text of the subject is required']);
            }
            
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && (count($pathParts) === 4)) {
    
    $subject_id_or_text = $pathParts[3];
    if (is_numeric($subject_id_or_text)) {
        // Je to ID
        $response = $subjectHandler->getSubject($subject_id_or_text);
        echo json_encode($response);
    } else {
        // Je to text
        $response = $subjectHandler->getSubjectByText($subject_id_or_text);
        echo json_encode($response);
    }
   
    
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
