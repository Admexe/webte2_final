<?php
require_once '../config.php';  // Make sure this file correctly sets up the PDO connection.

class Auth {
    
    private $pdo;
    
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;  // Assuming $pdo is your PDO connection object from config.php
    }
    
    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT id, password, name, role FROM `Users` WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
       
        if ($user) {
            // Verify the password (assuming passwords are hashed in the database)
            if (password_verify($password, $user['password'])) {
                $_SESSION['logged_in'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['name']; // Optional: store other details in session
                $_SESSION['role'] = $user['role']; // Optional: store role if needed for permissions
                
                // Return user data as part of the login success message
                return [
                    'status' => 'success',
                    'message' => 'Logged in successfully.',
                    'user_id' => $user['id'],
                    'username' => $user['name'],
                    'role' => $user['role']
                ];
            
            
            }
            

            /*if ($password === $user['password']) {

                $_SESSION['logged_in'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['name']; // Optional: store other details in session
                $_SESSION['role'] = $user['role']; // Optional: store role if needed for permissions
                
                // Return user data as part of the login success message
                return [
                    'status' => 'success',
                    'message' => 'Logged in successfully.',
                    'user_id' => $user['id'],
                    'username' => $user['name'],
                    'role' => $user['role']
                ];
            }*/
            

        }

        return ['status' => 'error', 'message' => 'Invalid credentials.'];
    }

    public function logout() {
        // Destroy the session to log the user out.
        session_destroy();
        return ['status' => 'success', 'message' => 'Logged out successfully.'];
    }
}
?>
