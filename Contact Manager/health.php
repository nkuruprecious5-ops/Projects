<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

$result = [
    'php_version' => PHP_VERSION,
    'pdo_mysql_loaded' => extension_loaded('pdo_mysql'),
    'db_connected' => false,
    'contacts_table' => false,
    'error' => null,
];

try {
    $pdo = db();
    $result['db_connected'] = true;

    $stmt = $pdo->query("SHOW TABLES LIKE 'contacts'");
    $result['contacts_table'] = (bool) $stmt->fetchColumn();
} catch (Throwable $e) {
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
