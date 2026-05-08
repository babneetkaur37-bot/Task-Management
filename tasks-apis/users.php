<?php
require_once 'config.php';
// Simple fetch for your dropdown
$stmt = $conn->prepare("SELECT id, username FROM admin_users");
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));