<?php
require_once 'config.php';
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $sql = "SELECT t.*, u.username as assignee_name 
                    FROM tasks t 
                    LEFT JOIN admin_users u ON t.assigned_to = u.id 
                    WHERE t.is_deleted = 0 
                    ORDER BY t.created_date DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        try {
            $query = "INSERT INTO tasks (task_type_id, title, description, created_by, assigned_to, priority, task_state_id, org_id, created_date) 
                      VALUES (:type, :title, :desc, :by, :to, :priority, :state, :org, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':type'     => $data->task_type_id ?? 1,
                ':title'    => $data->title,
                ':desc'     => $data->description ?? '',
                ':by'       => $data->created_by ?? 1, 
                ':to'       => $data->assigned_to,
                ':priority' => $data->priority ?? 'MEDIUM',
                ':state'    => $data->task_state_id ?? 1,
                ':org'      => $data->org_id ?? 1
            ]);
            // IMPORTANT: Return task_id so Angular can use it immediately
            echo json_encode(["task_id" => $conn->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        try {
            $query = "UPDATE tasks SET 
                        title = :title, 
                        description = :desc, 
                        assigned_to = :to, 
                        priority = :priority, 
                        task_state_id = :state,
                        updated_date = NOW()
                      WHERE task_id = :id";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':title'    => $data->title,
                ':desc'     => $data->description,
                ':to'       => $data->assigned_to,
                ':priority' => $data->priority,
                ':state'    => $data->task_state_id,
                ':id'       => $data->task_id
            ]);
            echo json_encode(["message" => "Updated"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("UPDATE tasks SET is_deleted = 1 WHERE task_id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Deleted"]);
        break;
}