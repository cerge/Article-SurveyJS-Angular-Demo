<?php
/**
 * load_results.php
 * 
 * Loads survey results from backend
 * Carga los resultados de la encuesta desde el backend
 * 
 * Endpoint: GET /api/load_results.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$filePath = __DIR__ . '/../data/survey_results.json';

if (!file_exists($filePath)) {
    http_response_code(200);
    echo json_encode([]);
    exit;
}

$fileContent = file_get_contents($filePath);

if ($fileContent === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to read results file'
    ]);
    exit;
}

$results = json_decode($fileContent, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON in results file: ' . json_last_error_msg()
    ]);
    exit;
}

if (!is_array($results)) {
    $results = [];
}

http_response_code(200);
echo json_encode($results);

?>





