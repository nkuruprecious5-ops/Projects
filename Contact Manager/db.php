<?php
declare(strict_types=1);

// Update these values to match your local MySQL setup.
const DB_HOST = '127.0.0.1';
const DB_NAME = 'contact_manager';
const DB_USER = 'root';
const DB_PASS = '';

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}
