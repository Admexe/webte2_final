<?php
require_once '../config.php';  

class ResponseHandler {
    
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;  
    }
    
    public function createResponse($question_id, $text, $votes = 1) {
        // Check if response with the same question_id and text already exists
        $stmt = $this->pdo->prepare("SELECT id FROM Responses WHERE question_id = :question_id AND text = :text");
        $stmt->execute(['question_id' => $question_id, 'text' => $text]);
        $existing_response_id = $stmt->fetchColumn();
    
        if ($existing_response_id) {
            // If response with the same question_id and text exists, increment its votes by 1
            $update_stmt = $this->pdo->prepare("UPDATE Responses SET votes = votes + 1 WHERE id = :existing_response_id");
            $update_stmt->execute(['existing_response_id' => $existing_response_id]);
            return ['status' => 'success', 'message' => 'Response votes incremented successfully.'];
        } else {
            // If response doesn't exist, insert a new one
            $stmt = $this->pdo->prepare("INSERT INTO Responses (question_id, text, votes) VALUES (:question_id, :text, :votes)");
            $stmt->execute(['question_id' => $question_id, 'text' => $text, 'votes' => $votes]);
    
            if ($stmt->rowCount() > 0) {
                return ['status' => 'success', 'message' => 'Response created successfully.'];
            } else {
                return ['status' => 'error', 'message' => 'Failed to create response.'];
            }
        }
    }
    

    public function getResponseById($response_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Responses WHERE id = :response_id");
        $stmt->execute(['response_id' => $response_id]);
        
        $response = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($response) {
            return ['status' => 'success', 'response' => $response];
        } else {
            return ['status' => 'error', 'message' => 'Response not found.'];
        }
    }

    public function getResponsesByQuestionId($question_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Responses WHERE question_id = :question_id");
        $stmt->execute(['question_id' => $question_id]);
        
        $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($responses) {
            return ['status' => 'success', 'responses' => $responses];
        } else {
            return ['status' => 'error', 'message' => 'No responses found for the question.'];
        }
    }

    public function upvoteResponse($response_id) {
        // Check if response with the given ID exists
        $stmt = $this->pdo->prepare("SELECT * FROM Responses WHERE id = :response_id");
        $stmt->execute(['response_id' => $response_id]);
        
        $response = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($response) {
            // If response exists, increment its votes by 1
            $update_stmt = $this->pdo->prepare("UPDATE Responses SET votes = votes + 1 WHERE id = :response_id");
            $update_stmt->execute(['response_id' => $response_id]);
            
            // Get the updated votes count
            $stmt = $this->pdo->prepare("SELECT votes FROM Responses WHERE id = :response_id");
            $stmt->execute(['response_id' => $response_id]);
            $updated_votes = $stmt->fetchColumn();
            
            return ['status' => 'success', 'message' => 'Votes incremented successfully.', 'votes' => $updated_votes];
        } else {
            return ['status' => 'error', 'message' => 'Response not found.'];
        }
    }
    
    
}
?>