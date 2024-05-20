<?php
require_once '../config.php';  

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


class QuestionHandler {
    private $pdo;
    private $webSocketServer;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
        $this->webSocketServer = 'wss://node126.webte.fei.stuba.sk:2346'; // Replace with your WebSocket server URL
    }
   /* 
    public function createQuestion($user_id, $subject_id, $text, $options = 0) {
        $code = $this->generateUniqueCode();
        $stmt = $this->pdo->prepare("INSERT INTO Questions (user_id, subject_id, text, code, options) VALUES (:user_id, :subject_id, :text, :code, :options)");
        $stmt->execute(['user_id' => $user_id, 'subject_id' => $subject_id, 'text' => $text, 'code' => $code, 'options' => $options]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Question created successfully.', 'code' => $code];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create question.'];
        }
    }*/

    public function createQuestion($user_id, $subject_id, $text, $options = 0) {
        $code = $this->generateUniqueCode();
        $stmt = $this->pdo->prepare("INSERT INTO Questions (user_id, subject_id, text, code, options) VALUES (:user_id, :subject_id, :text, :code, :options)");
        $stmt->execute(['user_id' => $user_id, 'subject_id' => $subject_id, 'text' => $text, 'code' => $code, 'options' => $options]);
        
        if ($stmt->rowCount() > 0) {
            $questionId = $this->pdo->lastInsertId(); // získajte posledné vložené ID
            
            return ['status' => 'success', 'message' => 'Question created successfully.', 'code' => $code, 'question_id' => $questionId];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create question.'];
        }
    }
    

    public function getQuestionById($question_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Questions WHERE id = :question_id");
        $stmt->execute(['question_id' => $question_id]);
        
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($question) {
            return ['status' => 'success', 'question' => $question];
        } else {
            return ['status' => 'error', 'message' => 'Question not found.'];
        }
    }

    public function updateQuestion($question_id, $subject_id, $text, $options = 0) {
        $stmt = $this->pdo->prepare("UPDATE Questions SET subject_id = :subject_id, text = :text, options = :options WHERE id = :question_id");
        $stmt->execute(['subject_id' => $subject_id, 'text' => $text, 'options' => $options, 'question_id' => $question_id]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Question updated successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update question.'];
        }
    }

    private function generateUniqueCode() {
        $code = mt_rand(10000, 99999); 
        $stmt = $this->pdo->prepare("SELECT code FROM Questions WHERE code = :code");
        $stmt->execute(['code' => $code]);
        $existing_code = $stmt->fetchColumn();

        while ($existing_code) {
            $code = mt_rand(10000, 99999);
            $stmt->execute(['code' => $code]);
            $existing_code = $stmt->fetchColumn();
        }

        return $code;
    }

    public function updateQuestionStatus($question_id, $status) {
        // Aktualizovať stav otázky
        $stmt = $this->pdo->prepare("UPDATE Questions SET status = :status WHERE id = :question_id");
        $stmt->execute(['status' => $status, 'question_id' => $question_id]);
        
        // Ak sa otázka úspešne aktualizovala
        if ($stmt->rowCount() > 0) {
            // Ak je stav 0 (neaktívny), získať aktuálny čas z databázy
            if ($status == 0) {
                // Získať aktuálny čas z databázy
                $stmt_timestamp = $this->pdo->query("SELECT NOW()");
                $timestamp = $stmt_timestamp->fetchColumn();
                
                // Aktualizovať odpovede na otázku, ktoré nemajú nastavený timestamp
                $stmt_responses = $this->pdo->prepare("UPDATE Responses SET timestamp = :timestamp WHERE question_id = :question_id AND timestamp IS NULL");
                $stmt_responses->execute(['timestamp' => $timestamp, 'question_id' => $question_id]);
            }
            
            return ['status' => 'success', 'message' => 'Question status updated successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update question status.'];
        }
    }
    
    
    
    
    public function getQuestionByCode($question_code) {
        $stmt = $this->pdo->prepare("SELECT * FROM Questions WHERE code = :question_code");
        $stmt->execute(['question_code' => $question_code]);
        
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($question) {
            return ['status' => 'success', 'question' => $question];
        } else {
            return ['status' => 'error', 'message' => 'Question not found.'];
        }
    }

    public function getQuestionsByUserId($user_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Questions WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($questions) {
            return ['status' => 'success', 'questions' => $questions];
        } else {
            return ['status' => 'error', 'message' => 'No questions found for this user.'];
        }
    }
}
?>