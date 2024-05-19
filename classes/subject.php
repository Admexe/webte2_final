<?php
require_once '../config.php';  // Uistite sa, že tento súbor správne nastaví PDO spojenie.

class SubjectHandler {
    
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;  // Predpokladajúc, že $pdo je tvoj objekt pripojenia PDO zo súboru config.php
    }
    /*
    public function createSubject($text) {
        // Príprava SQL dotazu pre vloženie nového predmetu do tabuľky Subjects
        $stmt = $this->pdo->prepare("INSERT INTO Subjects (text) VALUES (:text)");
        $stmt->execute(['text' => $text]);
        
        // Skontrolujeme, či bol predmet úspešne vložený
        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'message' => 'Subject created successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create subject.'];
        }
    }*/

    public function createSubject($text) {
        // Kontrola, či predmet s rovnakým textom už existuje
        $stmt_check = $this->pdo->prepare("SELECT * FROM Subjects WHERE text = :text");
        $stmt_check->execute(['text' => $text]);
        $existingSubject = $stmt_check->fetch(PDO::FETCH_ASSOC);
    
        if ($existingSubject) {
            // Ak predmet už existuje, vrátiť rovnaké informácie ako pri úspešnom vytvorení nového predmetu
            return ['status' => 'success', 'message' => 'Subject already exists.', 'subject' => $existingSubject];
        }
    
        // Vloženie nového predmetu do tabuľky Subjects
        $stmt = $this->pdo->prepare("INSERT INTO Subjects (text) VALUES (:text)");
        $stmt->execute(['text' => $text]);
        
        // Skontrolujeme, či bol predmet úspešne vložený
        if ($stmt->rowCount() > 0) {
            // Ak sa predmet úspešne vložil, získať informácie o vloženom predmete
            $newSubjectId = $this->pdo->lastInsertId();
            $stmt_new_subject = $this->pdo->prepare("SELECT * FROM Subjects WHERE id = :subject_id");
            $stmt_new_subject->execute(['subject_id' => $newSubjectId]);
            $newSubject = $stmt_new_subject->fetch(PDO::FETCH_ASSOC);
            
            return ['status' => 'success', 'message' => 'Subject created successfully.', 'subject' => $newSubject];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create subject.'];
        }
    }
    
    

    public function getSubject($subject_id) {
        // Príprava SQL dotazu pre získanie predmetu podľa jeho ID
        $stmt = $this->pdo->prepare("SELECT * FROM Subjects WHERE id = :subject_id");
        $stmt->execute(['subject_id' => $subject_id]);
        
        // Získanie výsledku dotazu
        $subject = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Skontrolujeme, či sme získali predmet
        if ($subject) {
            return ['status' => 'success', 'subject' => $subject];
        } else {
            return ['status' => 'error', 'message' => 'Subject not found.'];
        }
    }

    public function getSubjectByText($text) {
        // Príprava SQL dotazu pre získanie predmetu podľa jeho textu
        $stmt = $this->pdo->prepare("SELECT * FROM Subjects WHERE text = :text");
        $stmt->execute(['text' => $text]);
        
        // Získanie výsledku dotazu
        $subject = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Skontrolujeme, či sme získali predmet
        if ($subject) {
            return ['status' => 'success', 'subject' => $subject];
        } else {
            return ['status' => 'error', 'message' => 'Subject not found.'];
        }
    }

    // Ďalšie metódy by mohli byť pre úpravu a odstránenie predmetov podľa ID, získanie všetkých predmetov atď.
}
?>
