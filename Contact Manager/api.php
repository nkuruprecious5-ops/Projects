<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $stmt = db()->query('SELECT id, name, email, phone, created_at FROM contacts ORDER BY id DESC');
        respond(['ok' => true, 'contacts' => $stmt->fetchAll()]);
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $action = $input['action'] ?? '';

        if ($action === 'add') {
            $name = trim((string) ($input['name'] ?? ''));
            $email = trim((string) ($input['email'] ?? ''));
            $phone = trim((string) ($input['phone'] ?? ''));

            if ($name === '' || $email === '' || $phone === '') {
                respond(['ok' => false, 'message' => 'Name, email, and phone are required.'], 422);
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                respond(['ok' => false, 'message' => 'Please enter a valid email address.'], 422);
            }

            $stmt = db()->prepare('INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone)');
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
            ]);

            respond(['ok' => true, 'message' => 'Contact added successfully.']);
        }

        if ($action === 'delete') {
            $id = (int) ($input['id'] ?? 0);

            if ($id <= 0) {
                respond(['ok' => false, 'message' => 'Invalid contact id.'], 422);
            }

            $stmt = db()->prepare('DELETE FROM contacts WHERE id = :id');
            $stmt->execute([':id' => $id]);

            respond(['ok' => true, 'message' => 'Contact deleted successfully.']);
        }

        respond(['ok' => false, 'message' => 'Unsupported action.'], 400);
    }

    respond(['ok' => false, 'message' => 'Method not allowed.'], 405);
} catch (PDOException $e) {
    respond(['ok' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
} catch (Throwable $e) {
    respond(['ok' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
