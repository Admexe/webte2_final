<?php
require_once '../classes/quest.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);  
$pathParts = explode("/", $path);
$questionHandler = new QuestionHandler();

if ($_SERVER['REQUEST_METHOD'] === 'POST' &&  (count($pathParts) === 3)) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['user_id']) && isset($data['subject_id']) && isset($data['text'])) {
        $response = $questionHandler->createQuestion($data['user_id'], $data['subject_id'], $data['text']);
        echo json_encode($response);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User ID, Subject ID, and Text of the question are required']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && (count($pathParts) === 4)) {
    $question_code = $pathParts[3];
    $response = $questionHandler->getQuestionByCode($question_code);
    echo json_encode($response);

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' && (count($pathParts) === 4)) {
    $question_id = $pathParts[3];
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['text']) && isset($data['subject_id'])) {
        $response = $questionHandler->updateQuestion($question_id, $data['subject_id'], $data['text']);
        echo json_encode($response);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Text and Subject ID are required']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' && (count($pathParts) === 5)) {
    $question_id = $pathParts[3];
    $status = $pathParts[4];
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($status !== '0' && $status !== '1') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid status value.']);
        exit;
    }

    $response = $questionHandler->updateQuestionStatus($question_id, $status);
    echo json_encode($response);
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
