<?php
require_once '../config.php';

class NoteHandler {
    
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }
    
    public function createNote($question_id, $text) {
        $timestamp = date('Y-m-d H:i:s');
        $stmt = $this->pdo->prepare("INSERT INTO Notes (question_id, timestamp, text) VALUES (:question_id, :timestamp, :text)");
        $stmt->execute(['question_id' => $question_id, 'timestamp' => $timestamp, 'text' => $text]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Note created successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create note.'];
        }
    }

    public function getNoteById($note_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Notes WHERE id = :note_id");
        $stmt->execute(['note_id' => $note_id]);
        
        $note = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($note) {
            return ['status' => 'success', 'note' => $note];
        } else {
            return ['status' => 'error', 'message' => 'Note not found.'];
        }
    }

    public function updateNote($note_id, $text) {
        $stmt = $this->pdo->prepare("UPDATE Notes SET text = :text WHERE id = :note_id");
        $stmt->execute(['text' => $text, 'note_id' => $note_id]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Note updated successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update note.'];
        }
    }

    public function deleteNote($note_id) {
        $stmt = $this->pdo->prepare("DELETE FROM Notes WHERE id = :note_id");
        $stmt->execute(['note_id' => $note_id]);
        
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Note deleted successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to delete note.'];
        }
    }

    // Ďalšie metódy by mohli byť pre získanie všetkých poznámok podľa ID otázky, získanie poznámok podľa dátumu atď.
}
?>
