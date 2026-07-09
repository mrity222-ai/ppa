<?php
// config.php - Database Configuration and CORS Headers

// Enable Error Reporting for Local Development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database Credentials
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ppa_lucknow');

// CORS Headers to allow requests from NextJS client
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Returns a PDO database connection instance.
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed: " . $e->getMessage()
        ]);
        exit();
    }
}

/**
 * Audit log utility to record user activities.
 */
function logActivity($userId, $action, $details = null) {
    try {
        $db = getDBConnection();
        $stmt = $db->prepare("INSERT INTO activity_logs (user_id, action, details) VALUES (:user_id, :action, :details)");
        $stmt->execute([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details
        ]);
    } catch (Exception $e) {
        // Fail silently to avoid breaking the calling request
        error_log("Activity logging failed: " . $e->getMessage());
    }
}
?>
