<?php
/**
 * save_results.php
 * 
 * Saves survey results to backend
 * Guarda los resultados de la encuesta en el backend
 * 
 * Endpoint: POST /api/save_results.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method is allowed'
    ]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON: ' . json_last_error_msg()
    ]);
    exit;
}

if (!isset($data['results']) || empty($data['results'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Results data is required'
    ]);
    exit;
}

$dataDir = __DIR__ . '/../data';
$filePath = $dataDir . '/survey_results.json';

if (!is_dir($dataDir)) {
    if (!mkdir($dataDir, 0755, true)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create data directory'
        ]);
        exit;
    }
}

$allResults = [];

if (file_exists($filePath)) {
    $fileContent = file_get_contents($filePath);
    if (!empty($fileContent)) {
        $allResults = json_decode($fileContent, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($allResults)) {
            $allResults = [];
        }
    }
}

$allResults[] = [
    'timestamp' => isset($data['timestamp']) ? $data['timestamp'] : date('c'),
    'results' => $data['results']
];

$jsonContent = json_encode($allResults, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if ($jsonContent === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to encode results data: ' . json_last_error_msg()
    ]);
    exit;
}

$result = file_put_contents($filePath, $jsonContent);

if ($result === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to write results file. Check file permissions.'
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Results saved successfully',
    'file' => $filePath,
    'total_submissions' => count($allResults),
    'bytes_written' => $result
]);

?>





