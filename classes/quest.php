<?php
require_once '../config.php';  

class QuestionHandler {
    
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;  
    }
    
    public function createQuestion($user_id, $subject_id, $text) {
        $code = $this->generateUniqueCode();
        $stmt = $this->pdo->prepare("INSERT INTO Questions (user_id, subject_id, text, code) VALUES (:user_id, :subject_id, :text, :code)");
        $stmt->execute(['user_id' => $user_id, 'subject_id' => $subject_id, 'text' => $text, 'code' => $code]);
        
        if ($stmt->rowCount() > 0) {
            // Optionally, store question ID in session here
            return ['status' => 'success', 'message' => 'Question created successfully.', 'code' => $code];
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

    public function updateQuestion($question_id, $subject_id, $text) {
        $stmt = $this->pdo->prepare("UPDATE Questions SET subject_id = :subject_id, text = :text WHERE id = :question_id");
        $stmt->execute(['subject_id' => $subject_id, 'text' => $text, 'question_id' => $question_id]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Question updated successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update question.'];
        }
    }

    private function generateUniqueCode() {
        $code = mt_rand(10000, 99999); // Generuje 5-miestne náhodné číslo
        // Skontrolujeme, či je kód jedinečný v tabuľke
        $stmt = $this->pdo->prepare("SELECT code FROM Questions WHERE code = :code");
        $stmt->execute(['code' => $code]);
        $existing_code = $stmt->fetchColumn();

        // Ak je kód už použitý, generujeme nový, kým nenájdeme jedinečný kód
        while ($existing_code) {
            $code = mt_rand(10000, 99999);
            $stmt->execute(['code' => $code]);
            $existing_code = $stmt->fetchColumn();
        }

        return $code;
    }
}
?>
