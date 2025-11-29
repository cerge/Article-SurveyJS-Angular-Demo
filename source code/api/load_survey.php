<?php
/**
 * load_survey.php
 * 
 * Loads survey schema JSON from backend
 * Carga el esquema JSON de la encuesta desde el backend
 * 
 * Endpoint: GET /api/load_survey.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$filePath = __DIR__ . '/../data/survey_schema.json';

if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Survey not found',
        'survey' => null
    ]);
    exit;
}

$fileContent = file_get_contents($filePath);

if ($fileContent === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to read survey file'
    ]);
    exit;
}

$survey = json_decode($fileContent, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON in survey file: ' . json_last_error_msg()
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'survey' => $survey
]);

?>





