<?php
// api.php - Master Controller API for PPA Lucknow Management System
require_once 'config.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get database instance
$db = getDBConnection();

// Get input JSON body if POST/PUT
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Router based on 'action' parameter
$action = $_GET['action'] ?? '';

switch ($action) {

    // ==========================================
    // 1. AUTHENTICATION & REGISTRATION
    // ==========================================

    case 'login':
        if ($method !== 'POST') { http_response_code(405); echo json_encode(["success" => false, "error" => "Method not allowed"]); exit(); }
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode(["success" => false, "error" => "Email and password are required"]);
            exit();
        }

        // Clean input for mobile checking
        $cleanInputMobile = preg_replace('/[^0-9]/', '', $email);
        $mobilePattern = '';
        if (strlen($cleanInputMobile) >= 8) {
            $mobilePattern = '%' . $cleanInputMobile;
        }

        $stmt = $db->prepare("
            SELECT u.*, d.name AS district_name 
            FROM users u 
            LEFT JOIN districts d ON u.district_id = d.id 
            LEFT JOIN members m ON u.id = m.user_id 
            WHERE u.email = :email 
               OR u.mobile = :mobile 
               OR (:mobile_pattern1 != '' AND REPLACE(REPLACE(REPLACE(REPLACE(u.mobile, ' ', ''), '-', ''), '+', ''), '(', '') LIKE :mobile_pattern2)
               OR m.member_id_card = :card
               OR SUBSTRING_INDEX(u.email, '@', 1) = :username
        ");
        $stmt->execute([
            'email' => $email,
            'mobile' => $email,
            'mobile_pattern1' => $mobilePattern,
            'mobile_pattern2' => $mobilePattern,
            'card' => $email,
            'username' => $email
        ]);
        $user = $stmt->fetch();

        if ($user) {
            // Check password (supports bcrypt hash or plain text for local demo fallback)
            $passwordMatched = false;
            if (password_verify($password, $user['password_hash'])) {
                $passwordMatched = true;
            } else if ($user['password_hash'] === $password) {
                $passwordMatched = true;
            }

            if ($passwordMatched) {
                if ($user['role'] === 'member') {
                    echo json_encode(["success" => false, "error" => "Only administrators can log in. Members cannot log in. / केवल व्यवस्थापक ही लॉगिन कर सकते हैं। सदस्य लॉगिन नहीं कर सकते।"]);
                    exit();
                }

                if (!$user['is_approved']) {
                    echo json_encode(["success" => false, "error" => "Your account is pending verification by an administrator."]);
                    exit();
                }

                // If member, fetch membership details
                $memberData = null;
                if ($user['role'] === 'member') {
                    $mStmt = $db->prepare("SELECT * FROM members WHERE user_id = :user_id");
                    $mStmt->execute(['user_id' => $user['id']]);
                    $memberData = $mStmt->fetch();
                }

                logActivity($user['id'], 'LOGIN', 'Logged into the platform');

                echo json_encode([
                    "success" => true,
                    "user" => [
                        "id" => $user['id'],
                        "name" => $user['name'],
                        "email" => $user['email'],
                        "role" => $user['role'],
                        "district_id" => $user['district_id'],
                        "district_name" => $user['district_name'],
                        "member_details" => $memberData
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "error" => "Invalid credentials / अमान्य साख"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Account not found / खाता नहीं मिला"]);
        }
        break;

    case 'register':
        if ($method !== 'POST') { http_response_code(405); echo json_encode(["success" => false, "error" => "Method not allowed"]); exit(); }
        
        $name = $input['name'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $designation = $input['designation'] ?? '';
        $department = $input['department'] ?? '';
        $retirement_date = $input['retirement_date'] ?? null;
        $ppo_number = $input['ppo_number'] ?? null;
        $address = $input['address'] ?? '';
        $city = $input['city'] ?? '';
        $pincode = $input['pincode'] ?? '';
        $photo_url = $input['photo_url'] ?? null;

        if (empty($name) || empty($mobile) || empty($district_id) || empty($designation)) {
            echo json_encode(["success" => false, "error" => "Required fields are missing"]);
            exit();
        }

        // Auto-generate dummy email if empty
        if (empty($email)) {
            $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
            $email = "member_" . $cleanMobile . "@upppa.org";
        }

        // Auto-generate password if empty
        if (empty($password)) {
            $password = bin2hex(random_bytes(16));
        }

        // Check if user already exists (by email or mobile)
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email OR mobile = :mobile");
        $stmt->execute(['email' => $email, 'mobile' => $mobile]);
        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Email or Mobile number is already registered / ईमेल या मोबाइल नंबर पहले से पंजीकृत है"]);
            exit();
        }

        // Directly create user as approved member
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $userStmt = $db->prepare("INSERT INTO users (name, email, password_hash, mobile, role, district_id, is_approved) VALUES (:name, :email, :password_hash, :mobile, 'member', :district_id, 1)");
        
        $userStmt->execute([
            'name' => $name,
            'email' => $email,
            'password_hash' => $hashedPassword,
            'mobile' => $mobile,
            'district_id' => $district_id
        ]);
        $user_id = $db->lastInsertId();

        // Auto-generate membership card ID
        $cardCode = strtoupper(substr(md5(uniqid()), 0, 3));
        $member_id_card = "PPA-LKO-2026-" . $cardCode . sprintf("%03d", $user_id);

        // Insert membership details
        $mStmt = $db->prepare("INSERT INTO members (user_id, member_id_card, designation, department, retirement_date, ppo_number, address, city, pincode, membership_status, renewal_date, photo_url) VALUES (:user_id, :member_id_card, :designation, :department, :retirement_date, :ppo_number, :address, :city, :pincode, 'active', '2027-06-30', :photo_url)");
        
        $mStmt->execute([
            'user_id' => $user_id,
            'member_id_card' => $member_id_card,
            'designation' => $designation,
            'department' => $department,
            'retirement_date' => $retirement_date,
            'ppo_number' => $ppo_number,
            'address' => $address,
            'city' => $city,
            'pincode' => $pincode,
            'photo_url' => $photo_url
        ]);

        // Fetch new user details for instant login session
        $uQuery = $db->prepare("SELECT u.id, u.name, u.email, u.role, u.district_id, d.name AS district_name FROM users u LEFT JOIN districts d ON u.district_id = d.id WHERE u.id = :id");
        $uQuery->execute(['id' => $user_id]);
        $userData = $uQuery->fetch();

        $mQuery = $db->prepare("SELECT * FROM members WHERE user_id = :user_id");
        $mQuery->execute(['user_id' => $user_id]);
        $memberDetails = $mQuery->fetch();

        logActivity($user_id, 'REGISTER', 'Registered directly as member and logged in');

        echo json_encode([
            "success" => true,
            "message" => "Registration successful!",
            "user" => [
                "id" => $userData['id'],
                "name" => $userData['name'],
                "email" => $userData['email'],
                "role" => $userData['role'],
                "district_id" => $userData['district_id'],
                "district_name" => $userData['district_name'],
                "member_details" => $memberDetails
            ]
        ]);
        break;

    case 'create_admin_user':
        if ($method !== 'POST') { http_response_code(405); echo json_encode(["success" => false, "error" => "Method not allowed"]); exit(); }
        
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'districtadmin';
        $district_id = $input['district_id'] ?? null;
        $creator_id = $input['creator_id'] ?? null;

        if (empty($name) || empty($email) || empty($mobile) || empty($password) || empty($role)) {
            echo json_encode(["success" => false, "error" => "Required fields are missing"]);
            exit();
        }

        if (!in_array($role, ['superadmin', 'stateadmin', 'districtadmin'])) {
            echo json_encode(["success" => false, "error" => "Invalid administrator role"]);
            exit();
        }

        // Check if user already exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email OR mobile = :mobile");
        $stmt->execute(['email' => $email, 'mobile' => $mobile]);
        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Email or Mobile number is already in use / ईमेल या मोबाइल नंबर पहले से उपयोग में है"]);
            exit();
        }

        // Create Admin User (directly approved)
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $userStmt = $db->prepare("INSERT INTO users (name, email, password_hash, mobile, role, district_id, is_approved) VALUES (:name, :email, :password_hash, :mobile, :role, :district_id, 1)");
        
        $ok = $userStmt->execute([
            'name' => $name,
            'email' => $email,
            'password_hash' => $hashedPassword,
            'mobile' => $mobile,
            'role' => $role,
            'district_id' => ($role === 'districtadmin') ? $district_id : null
        ]);

        if ($ok) {
            $new_user_id = $db->lastInsertId();
            logActivity($creator_id, 'CREATE_ADMIN', "Created administrator $name ($role) with ID $new_user_id");
            echo json_encode(["success" => true, "message" => "Administrator account created successfully!"]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to create administrator account."]);
        }
        break;

    // ==========================================
    // 2. MEMBER REQUEST WORKFLOW
    // ==========================================

    case 'get_pending_requests':
        $district_id = $_GET['district_id'] ?? null;
        $sql = "SELECT r.*, d.name as district_name FROM membership_requests r JOIN districts d ON r.district_id = d.id WHERE r.status = 'pending'";
        $params = [];
        if ($district_id) {
            $sql .= " AND r.district_id = :district_id";
            $params['district_id'] = $district_id;
        }
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "requests" => $stmt->fetchAll()]);
        break;

    case 'approve_request':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $request_id = $input['request_id'] ?? null;
        $admin_id = $input['admin_id'] ?? null;

        if (!$request_id) {
            echo json_encode(["success" => false, "error" => "Request ID is required"]);
            exit();
        }

        // Fetch request details
        $stmt = $db->prepare("SELECT * FROM membership_requests WHERE id = :id");
        $stmt->execute(['id' => $request_id]);
        $req = $stmt->fetch();

        if (!$req) {
            echo json_encode(["success" => false, "error" => "Request not found"]);
            exit();
        }

        // 1. Create User
        $userStmt = $db->prepare("INSERT INTO users (name, email, password_hash, mobile, role, district_id, is_approved) VALUES (:name, :email, :password_hash, :mobile, 'member', :district_id, 1)");
        $userStmt->execute([
            'name' => $req['name'],
            'email' => $req['email'],
            'password_hash' => $req['password_hash'],
            'mobile' => $req['mobile'],
            'district_id' => $req['district_id']
        ]);
        $new_user_id = $db->lastInsertId();

        // 2. Generate Member ID Card Number (E.g. PPA-LKO-2026-XXXX)
        $distStmt = $db->prepare("SELECT code FROM districts WHERE id = :id");
        $distStmt->execute(['id' => $req['district_id']]);
        $dist = $distStmt->fetch();
        $distCode = $dist ? $dist['code'] : 'GEN';
        $member_id_card = "PPA-" . $distCode . "-" . date('Y') . "-" . str_pad($new_user_id, 4, '0', STR_PAD_LEFT);

        // 3. Create Member Detail
        $memStmt = $db->prepare("INSERT INTO members (user_id, member_id_card, designation, department, retirement_date, ppo_number, address, city, pincode, membership_status, points, renewal_date, photo_url) VALUES (:user_id, :member_id_card, :designation, :department, :retirement_date, :ppo_number, :address, :city, :pincode, 'active', 100, :renewal_date, :photo_url)");
        $memStmt->execute([
            'user_id' => $new_user_id,
            'member_id_card' => $member_id_card,
            'designation' => $req['designation'],
            'department' => $req['department'],
            'retirement_date' => $req['retirement_date'],
            'ppo_number' => $req['ppo_number'],
            'address' => $req['address'],
            'city' => $req['city'],
            'pincode' => $req['pincode'],
            'renewal_date' => date('Y-m-d', strtotime('+1 year')),
            'photo_url' => $req['photo_url']
        ]);

        // 4. Update request status
        $upStmt = $db->prepare("UPDATE membership_requests SET status = 'approved' WHERE id = :id");
        $upStmt->execute(['id' => $request_id]);

        logActivity($admin_id, 'APPROVE_MEMBER', 'Approved request ID: ' . $request_id . ' generating Card ID: ' . $member_id_card);

        echo json_encode(["success" => true, "message" => "Member approved, account activated successfully!"]);
        break;

    case 'reject_request':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $request_id = $input['request_id'] ?? null;
        $admin_notes = $input['notes'] ?? '';
        $admin_id = $input['admin_id'] ?? null;

        if (!$request_id) {
            echo json_encode(["success" => false, "error" => "Request ID is required"]);
            exit();
        }

        $upStmt = $db->prepare("UPDATE membership_requests SET status = 'rejected', admin_notes = :notes WHERE id = :id");
        $upStmt->execute(['id' => $request_id, 'notes' => $admin_notes]);

        logActivity($admin_id, 'REJECT_MEMBER', 'Rejected request ID: ' . $request_id);

        echo json_encode(["success" => true, "message" => "Request rejected successfully."]);
        break;

    // ==========================================
    // 3. DISTRICTS CRUD
    // ==========================================

    case 'get_districts':
        $stmt = $db->query("SELECT * FROM districts ORDER BY name ASC");
        echo json_encode(["success" => true, "districts" => $stmt->fetchAll()]);
        break;

    case 'create_district':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $name = $input['name'] ?? '';
        $code = $input['code'] ?? '';
        $admin_id = $input['admin_id'] ?? null;

        if (empty($name) || empty($code)) {
            echo json_encode(["success" => false, "error" => "District name and code are required"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO districts (name, code) VALUES (:name, :code)");
        $stmt->execute(['name' => $name, 'code' => strtoupper($code)]);

        logActivity($admin_id, 'CREATE_DISTRICT', 'Added district: ' . $name);

        echo json_encode(["success" => true, "message" => "District created successfully!"]);
        break;

    // ==========================================
    // 4. MEMBERS CRUD & DIRECTORY
    // ==========================================

    case 'get_members':
        $district_id = $_GET['district_id'] ?? null;
        $search = $_GET['search'] ?? '';

        $sql = "SELECT u.id, u.name, u.email, u.mobile, u.role, d.name as district_name, m.member_id_card, m.designation, m.department, m.membership_status, m.photo_url FROM users u JOIN members m ON u.id = m.user_id LEFT JOIN districts d ON u.district_id = d.id WHERE u.role = 'member'";
        $params = [];

        if ($district_id) {
            $sql .= " AND u.district_id = :district_id";
            $params['district_id'] = $district_id;
        }

        if (!empty($search)) {
            $sql .= " AND (u.name LIKE :search OR m.member_id_card LIKE :search OR m.designation LIKE :search)";
            $params['search'] = "%$search%";
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "members" => $stmt->fetchAll()]);
        break;

    case 'update_member':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $user_id = $input['user_id'] ?? null;
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $designation = $input['designation'] ?? '';
        $department = $input['department'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $membership_status = $input['membership_status'] ?? 'active';
        $admin_id = $input['admin_id'] ?? null;

        if (!$user_id || empty($name) || empty($email) || empty($mobile)) {
            echo json_encode(["success" => false, "error" => "User ID, name, email and mobile are required"]);
            exit();
        }

        $db->beginTransaction();
        try {
            $stmt1 = $db->prepare("UPDATE users SET name = :name, email = :email, mobile = :mobile, district_id = :district_id WHERE id = :user_id");
            $stmt1->execute([
                'name' => $name,
                'email' => $email,
                'mobile' => $mobile,
                'district_id' => $district_id ? $district_id : null,
                'user_id' => $user_id
            ]);

            $stmt2 = $db->prepare("UPDATE members SET designation = :designation, department = :department, membership_status = :membership_status WHERE user_id = :user_id");
            $stmt2->execute([
                'designation' => $designation,
                'department' => $department,
                'membership_status' => $membership_status,
                'user_id' => $user_id
            ]);

            $db->commit();
            logActivity($admin_id, 'UPDATE_MEMBER', 'Updated member details for User ID: ' . $user_id);
            echo json_encode(["success" => true, "message" => "Member details updated successfully."]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'update_profile':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $user_id = $input['user_id'] ?? null;
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $password = $input['password'] ?? '';

        if (!$user_id || empty($name) || empty($email)) {
            echo json_encode(["success" => false, "error" => "User ID, name and email are required"]);
            exit();
        }

        // Check if email is already taken by another user
        $chkStmt = $db->prepare("SELECT id FROM users WHERE email = :email AND id != :user_id");
        $chkStmt->execute(['email' => $email, 'user_id' => $user_id]);
        if ($chkStmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Email is already in use by another account"]);
            exit();
        }

        try {
            if (!empty($password)) {
                // Update with password
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $db->prepare("UPDATE users SET name = :name, email = :email, mobile = :mobile, password_hash = :password_hash WHERE id = :user_id");
                $stmt->execute([
                    'name' => $name,
                    'email' => $email,
                    'mobile' => $mobile,
                    'password_hash' => $hashedPassword,
                    'user_id' => $user_id
                ]);
            } else {
                // Update without password
                $stmt = $db->prepare("UPDATE users SET name = :name, email = :email, mobile = :mobile WHERE id = :user_id");
                $stmt->execute([
                    'name' => $name,
                    'email' => $email,
                    'mobile' => $mobile,
                    'user_id' => $user_id
                ]);
            }
            logActivity($user_id, 'UPDATE_PROFILE', 'Updated own profile details');
            echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'reset_password':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($mobile) || empty($password)) {
            echo json_encode(["success" => false, "error" => "Email, mobile and new password are required"]);
            exit();
        }

        // Verify if user exists with matching email and mobile
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email AND mobile = :mobile");
        $stmt->execute(['email' => $email, 'mobile' => $mobile]);
        $user = $stmt->fetch();

        if (!$user) {
            echo json_encode(["success" => false, "error" => "No account found with this email and mobile combination / इस ईमेल और मोबाइल के साथ कोई खाता नहीं मिला"]);
            exit();
        }

        try {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $upStmt = $db->prepare("UPDATE users SET password_hash = :password_hash WHERE id = :id");
            $upStmt->execute(['password_hash' => $hashedPassword, 'id' => $user['id']]);
            
            logActivity($user['id'], 'RESET_PASSWORD', 'Reset account password via Forgot Password');
            echo json_encode(["success" => true, "message" => "Password reset successfully! You can now log in."]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'delete_member':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "error" => "User ID is required"]);
            exit();
        }

        $db->beginTransaction();
        try {
            $stmtG = $db->prepare("DELETE FROM grievances WHERE user_id = :id");
            $stmtG->execute(['id' => $id]);

            $stmtR = $db->prepare("DELETE FROM event_registrations WHERE user_id = :id");
            $stmtR->execute(['id' => $id]);

            $stmtM = $db->prepare("DELETE FROM members WHERE user_id = :id");
            $stmtM->execute(['id' => $id]);

            $stmtU = $db->prepare("DELETE FROM users WHERE id = :id");
            $stmtU->execute(['id' => $id]);

            $db->commit();
            logActivity($admin_id, 'DELETE_MEMBER', 'Deleted member user ID: ' . $id);
            echo json_encode(["success" => true, "message" => "Member deleted successfully."]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
        break;

    // ==========================================
    // 5. NEWS CRUD
    // ==========================================

    case 'get_news':
        $district_id = $_GET['district_id'] ?? null;
        $sql = "SELECT n.*, d.name as district_name, u.name as author_name FROM news n LEFT JOIN districts d ON n.district_id = d.id JOIN users u ON n.author_id = u.id";
        $params = [];
        
        if ($district_id) {
            // Show state-wide news (district_id is NULL) + local news for that district
            $sql .= " WHERE n.district_id IS NULL OR n.district_id = :district_id";
            $params['district_id'] = $district_id;
        }
        $sql .= " ORDER BY n.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "news" => $stmt->fetchAll()]);
        break;

    case 'create_news':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $title_en = $input['title_en'] ?? '';
        $title_hi = $input['title_hi'] ?? '';
        $category = $input['category'] ?? 'Pension';
        $content_en = $input['content_en'] ?? '';
        $content_hi = $input['content_hi'] ?? '';
        $image_url = $input['image_url'] ?? '/7.jpg';
        $district_id = $input['district_id'] ?? null;
        $author_id = $input['author_id'] ?? null;

        if (empty($title_en) || empty($content_en) || !$author_id) {
            echo json_encode(["success" => false, "error" => "Required news fields are missing"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO news (title_en, title_hi, category, content_en, content_hi, image_url, district_id, author_id) VALUES (:title_en, :title_hi, :category, :content_en, :content_hi, :image_url, :district_id, :author_id)");
        $stmt->execute([
            'title_en' => $title_en,
            'title_hi' => $title_hi,
            'category' => $category,
            'content_en' => $content_en,
            'content_hi' => $content_hi,
            'image_url' => $image_url,
            'district_id' => $district_id ? $district_id : null,
            'author_id' => $author_id
        ]);

        logActivity($author_id, 'CREATE_NEWS', 'Created news article: ' . $title_en);

        echo json_encode(["success" => true, "message" => "News article posted successfully!"]);
        break;

    case 'update_news':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $title_en = $input['title_en'] ?? '';
        $title_hi = $input['title_hi'] ?? '';
        $category = $input['category'] ?? 'Pension';
        $content_en = $input['content_en'] ?? '';
        $content_hi = $input['content_hi'] ?? '';
        $image_url = $input['image_url'] ?? null;
        $district_id = $input['district_id'] ?? null;
        $author_id = $input['author_id'] ?? null;

        if (!$id || empty($title_en) || empty($content_en)) {
            echo json_encode(["success" => false, "error" => "Required news fields are missing"]);
            exit();
        }

        $stmt = $db->prepare("UPDATE news SET title_en = :title_en, title_hi = :title_hi, category = :category, content_en = :content_en, content_hi = :content_hi, image_url = COALESCE(:image_url, image_url), district_id = :district_id WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'title_en' => $title_en,
            'title_hi' => $title_hi,
            'category' => $category,
            'content_en' => $content_en,
            'content_hi' => $content_hi,
            'image_url' => $image_url,
            'district_id' => $district_id ? $district_id : null
        ]);

        if ($author_id) {
            logActivity($author_id, 'UPDATE_NEWS', 'Updated news article ID: ' . $id);
        }

        echo json_encode(["success" => true, "message" => "News article updated successfully!"]);
        break;

    case 'delete_news':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        $stmt = $db->prepare("DELETE FROM news WHERE id = :id");
        $stmt->execute(['id' => $id]);

        logActivity($admin_id, 'DELETE_NEWS', 'Deleted news ID: ' . $id);
        echo json_encode(["success" => true, "message" => "News article deleted."]);
        break;

    // ==========================================
    // 6. EVENTS CRUD & REGISTRATION
    // ==========================================

    case 'get_events':
        $district_id = $_GET['district_id'] ?? null;
        $user_id = $_GET['user_id'] ?? null; // To check registration

        $sql = "SELECT e.*, d.name as district_name, u.name as author_name FROM events e LEFT JOIN districts d ON e.district_id = d.id JOIN users u ON e.author_id = u.id";
        $params = [];

        if ($district_id) {
            $sql .= " WHERE e.district_id IS NULL OR e.district_id = :district_id";
            $params['district_id'] = $district_id;
        }
        $sql .= " ORDER BY e.date ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $events = $stmt->fetchAll();

        // Attach registration info
        foreach ($events as &$evt) {
            $rStmt = $db->prepare("SELECT COUNT(*) as total FROM event_registrations WHERE event_id = :event_id");
            $rStmt->execute(['event_id' => $evt['id']]);
            $evt['registrations_count'] = $rStmt->fetch()['total'];

            $evt['is_registered'] = false;
            if ($user_id) {
                $checkStmt = $db->prepare("SELECT id FROM event_registrations WHERE event_id = :event_id AND user_id = :user_id");
                $checkStmt->execute(['event_id' => $evt['id'], 'user_id' => $user_id]);
                if ($checkStmt->fetch()) {
                    $evt['is_registered'] = true;
                }
            }
        }

        echo json_encode(["success" => true, "events" => $events]);
        break;

    case 'create_event':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $title_en = $input['title_en'] ?? '';
        $title_hi = $input['title_hi'] ?? '';
        $date = $input['date'] ?? '';
        $time = $input['time'] ?? '';
        $day = $input['day'] ?? 'Saturday';
        $venue_en = $input['venue_en'] ?? '';
        $venue_hi = $input['venue_hi'] ?? '';
        $type = $input['type'] ?? 'Meeting';
        $description_en = $input['description_en'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $author_id = $input['author_id'] ?? null;
        
        $image_urls = $input['image_urls'] ?? '';
        if (is_array($image_urls)) {
            $image_urls = implode(',', $image_urls);
        }
        $image_url = explode(',', $image_urls)[0] ?? 'https://picsum.photos/seed/event/800/600';

        if (empty($title_en) || empty($date) || empty($venue_en) || !$author_id) {
            echo json_encode(["success" => false, "error" => "Required event fields are missing"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO events (title_en, title_hi, date, time, day, venue_en, venue_hi, type, description_en, image_url, image_urls, district_id, author_id) VALUES (:title_en, :title_hi, :date, :time, :day, :venue_en, :venue_hi, :type, :description_en, :image_url, :image_urls, :district_id, :author_id)");
        $stmt->execute([
            'title_en' => $title_en,
            'title_hi' => $title_hi,
            'date' => $date,
            'time' => $time,
            'day' => $day,
            'venue_en' => $venue_en,
            'venue_hi' => $venue_hi,
            'type' => $type,
            'description_en' => $description_en,
            'image_url' => $image_url,
            'image_urls' => $image_urls,
            'district_id' => $district_id ? $district_id : null,
            'author_id' => $author_id
        ]);

        logActivity($author_id, 'CREATE_EVENT', 'Created event: ' . $title_en);
        echo json_encode(["success" => true, "message" => "Event created successfully!"]);
        break;

    case 'register_event':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $event_id = $input['event_id'] ?? null;
        $user_id = $input['user_id'] ?? null;
        $name = $input['name'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $address = $input['address'] ?? '';

        if (!$event_id || empty($name) || empty($mobile)) {
            echo json_encode(["success" => false, "error" => "Event ID, name and mobile are required"]);
            exit();
        }

        // Check if already registered (by event_id + mobile)
        $chk = $db->prepare("SELECT id FROM event_registrations WHERE event_id = :event_id AND mobile = :mobile");
        $chk->execute(['event_id' => $event_id, 'mobile' => $mobile]);
        if ($chk->fetch()) {
            echo json_encode(["success" => true, "message" => "You are already registered for this event."]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO event_registrations (event_id, user_id, name, mobile, address) VALUES (:event_id, :user_id, :name, :mobile, :address)");
        try {
            $stmt->execute([
                'event_id' => $event_id,
                'user_id' => $user_id ? $user_id : null,
                'name' => $name,
                'mobile' => $mobile,
                'address' => $address
            ]);
            logActivity($user_id, 'REGISTER_EVENT', 'Attendee ' . $name . ' (' . $mobile . ') registered for Event ID: ' . $event_id);
            echo json_encode(["success" => true, "message" => "Registered for event successfully!"]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'unregister_event':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $event_id = $input['event_id'] ?? null;
        $user_id = $input['user_id'] ?? null;

        $stmt = $db->prepare("DELETE FROM event_registrations WHERE event_id = :event_id AND user_id = :user_id");
        $stmt->execute(['event_id' => $event_id, 'user_id' => $user_id]);

        logActivity($user_id, 'UNREGISTER_EVENT', 'Unregistered from Event ID: ' . $event_id);
        echo json_encode(["success" => true, "message" => "Unregistered from event successfully."]);
        break;

    case 'update_event':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $title_en = $input['title_en'] ?? '';
        $title_hi = $input['title_hi'] ?? '';
        $date = $input['date'] ?? '';
        $time = $input['time'] ?? '';
        $day = $input['day'] ?? 'Saturday';
        $venue_en = $input['venue_en'] ?? '';
        $venue_hi = $input['venue_hi'] ?? '';
        $type = $input['type'] ?? 'Meeting';
        $description_en = $input['description_en'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $author_id = $input['author_id'] ?? null;
        
        $image_urls = $input['image_urls'] ?? '';
        if (is_array($image_urls)) {
            $image_urls = implode(',', $image_urls);
        }
        $image_url = explode(',', $image_urls)[0] ?? null;

        if (!$id || empty($title_en) || empty($date) || empty($venue_en)) {
            echo json_encode(["success" => false, "error" => "Required event fields are missing"]);
            exit();
        }

        $sql = "UPDATE events SET title_en = :title_en, title_hi = :title_hi, date = :date, time = :time, day = :day, venue_en = :venue_en, venue_hi = :venue_hi, type = :type, description_en = :description_en, district_id = :district_id";
        $params = [
            'id' => $id,
            'title_en' => $title_en,
            'title_hi' => $title_hi,
            'date' => $date,
            'time' => $time,
            'day' => $day,
            'venue_en' => $venue_en,
            'venue_hi' => $venue_hi,
            'type' => $type,
            'description_en' => $description_en,
            'district_id' => $district_id ? $district_id : null
        ];
        
        if ($image_url !== null) {
            $sql .= ", image_url = :image_url, image_urls = :image_urls";
            $params['image_url'] = $image_url;
            $params['image_urls'] = $image_urls;
        }
        $sql .= " WHERE id = :id";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        if ($author_id) {
            logActivity($author_id, 'UPDATE_EVENT', 'Updated event ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Event updated successfully!"]);
        break;

    case 'delete_event':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        $stmt = $db->prepare("DELETE FROM events WHERE id = :id");
        $stmt->execute(['id' => $id]);

        logActivity($admin_id, 'DELETE_EVENT', 'Deleted event ID: ' . $id);
        echo json_encode(["success" => true, "message" => "Event deleted."]);
        break;

    // ==========================================
    // 7. GALLERY
    // ==========================================

    case 'get_gallery':
        $district_id = $_GET['district_id'] ?? null;
        $sql = "SELECT * FROM gallery";
        $params = [];
        if ($district_id) {
            $sql .= " WHERE district_id IS NULL OR district_id = :district_id";
            $params['district_id'] = $district_id;
        }
        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "photos" => $stmt->fetchAll()]);
        break;

    case 'create_gallery':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $title = $input['title'] ?? 'Moment';
        $album_name = $input['album_name'] ?? 'General';
        $district_id = $input['district_id'] ?? null;
        $date = $input['date'] ?? null;
        $time = $input['time'] ?? null;
        $day = $input['day'] ?? null;

        $image_urls = $input['image_urls'] ?? '';
        if (is_array($image_urls)) {
            $image_urls = implode(',', $image_urls);
        }
        $image_url = explode(',', $image_urls)[0] ?? '';

        if (empty($image_urls)) {
            echo json_encode(["success" => false, "error" => "Photo URL is required"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO gallery (title, image_url, image_urls, album_name, date, time, day, district_id) VALUES (:title, :image_url, :image_urls, :album_name, :date, :time, :day, :district_id)");
        $stmt->execute([
            'title' => $title,
            'image_url' => $image_url,
            'image_urls' => $image_urls,
            'album_name' => $album_name,
            'date' => $date,
            'time' => $time,
            'day' => $day,
            'district_id' => $district_id ? $district_id : null
        ]);

        echo json_encode(["success" => true, "message" => "Photo added to gallery!"]);
        break;

    case 'delete_gallery':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        $stmt = $db->prepare("DELETE FROM gallery WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($admin_id) {
            logActivity($admin_id, 'DELETE_GALLERY', 'Deleted gallery post ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Gallery item deleted successfully."]);
        break;

    case 'update_gallery':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $title = $input['title'] ?? 'Moment';
        $album_name = $input['album_name'] ?? 'General';
        $district_id = $input['district_id'] ?? null;
        $date = $input['date'] ?? null;
        $time = $input['time'] ?? null;
        $day = $input['day'] ?? null;
        $admin_id = $input['admin_id'] ?? null;

        $image_urls = $input['image_urls'] ?? '';
        if (is_array($image_urls)) {
            $image_urls = implode(',', $image_urls);
        }
        $image_url = explode(',', $image_urls)[0] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "error" => "Gallery Post ID is required"]);
            exit();
        }

        $sql = "UPDATE gallery SET title = :title, album_name = :album_name, date = :date, time = :time, day = :day, district_id = :district_id";
        $params = [
            'id' => $id,
            'title' => $title,
            'album_name' => $album_name,
            'date' => $date,
            'time' => $time,
            'day' => $day,
            'district_id' => $district_id ? $district_id : null
        ];

        if ($image_url !== null) {
            $sql .= ", image_url = :image_url, image_urls = :image_urls";
            $params['image_url'] = $image_url;
            $params['image_urls'] = $image_urls;
        }
        $sql .= " WHERE id = :id";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        if ($admin_id) {
            logActivity($admin_id, 'UPDATE_GALLERY', 'Updated gallery post ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Gallery post updated successfully!"]);
        break;

    // ==========================================
    // 8. CONTACT SUBMISSIONS & GRIEVANCES
    // ==========================================

    case 'submit_contact':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $name = $input['name'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $state = $input['state'] ?? '';
        $district = $input['district'] ?? '';
        $designation = $input['designation'] ?? '';
        $message = $input['message'] ?? '';

        if (empty($name) || empty($mobile) || empty($state) || empty($district)) {
            echo json_encode(["success" => false, "error" => "Required form fields are missing"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO contact_requests (name, mobile, state, district, designation, message) VALUES (:name, :mobile, :state, :district, :designation, :message)");
        $stmt->execute([
            'name' => $name,
            'mobile' => $mobile,
            'state' => $state,
            'district' => $district,
            'designation' => $designation,
            'message' => $message
        ]);

        echo json_encode(["success" => true, "message" => "Contact request submitted successfully!"]);
        break;

    case 'get_submissions':
        $stmt = $db->query("SELECT * FROM contact_requests ORDER BY created_at DESC");
        echo json_encode(["success" => true, "submissions" => $stmt->fetchAll()]);
        break;


    // ==========================================
    // 9. NOTICES & DOCUMENTS
    // ==========================================

    case 'get_notices':
        $district_id = $_GET['district_id'] ?? null;
        $sql = "SELECT * FROM notices";
        $params = [];
        if ($district_id) {
            $sql .= " WHERE district_id IS NULL OR district_id = :district_id";
            $params['district_id'] = $district_id;
        }
        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "notices" => $stmt->fetchAll()]);
        break;

    case 'create_notice':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $title = $input['title'] ?? '';
        $content = $input['content'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $admin_id = $input['admin_id'] ?? null;
        $link_url = $input['link_url'] ?? null;
        $file_url = $input['file_url'] ?? null;
        $photo_url = $input['photo_url'] ?? null;
        $date = $input['date'] ?? null;
        $time = $input['time'] ?? null;
        $day = $input['day'] ?? null;

        if (empty($title) || empty($content)) {
            echo json_encode(["success" => false, "error" => "Title and content are required"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO notices (title, content, district_id, link_url, file_url, photo_url, date, time, day) VALUES (:title, :content, :district_id, :link_url, :file_url, :photo_url, :date, :time, :day)");
        $stmt->execute([
            'title' => $title,
            'content' => $content,
            'district_id' => $district_id ? $district_id : null,
            'link_url' => $link_url,
            'file_url' => $file_url,
            'photo_url' => $photo_url,
            'date' => $date,
            'time' => $time,
            'day' => $day
        ]);

        logActivity($admin_id, 'CREATE_NOTICE', 'Posted notice announcement: ' . $title);
        echo json_encode(["success" => true, "message" => "Notice board updated."]);
        break;

    case 'delete_notice':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        $stmt = $db->prepare("DELETE FROM notices WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($admin_id) {
            logActivity($admin_id, 'DELETE_NOTICE', 'Deleted notice ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Notice deleted successfully."]);
        break;

    case 'update_notice':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $title = $input['title'] ?? '';
        $content = $input['content'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $admin_id = $input['admin_id'] ?? null;
        $link_url = $input['link_url'] ?? null;
        $file_url = $input['file_url'] ?? null;
        $photo_url = $input['photo_url'] ?? null;
        $date = $input['date'] ?? null;
        $time = $input['time'] ?? null;
        $day = $input['day'] ?? null;

        if (!$id || empty($title) || empty($content)) {
            echo json_encode(["success" => false, "error" => "ID, title and content are required"]);
            exit();
        }

        $stmt = $db->prepare("UPDATE notices SET title = :title, content = :content, district_id = :district_id, link_url = :link_url, file_url = :file_url, photo_url = :photo_url, date = :date, time = :time, day = :day WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'title' => $title,
            'content' => $content,
            'district_id' => $district_id ? $district_id : null,
            'link_url' => $link_url,
            'file_url' => $file_url,
            'photo_url' => $photo_url,
            'date' => $date,
            'time' => $time,
            'day' => $day
        ]);

        if ($admin_id) {
            logActivity($admin_id, 'UPDATE_NOTICE', 'Updated notice ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Notice updated successfully!"]);
        break;

    // ==========================================
    // 10. STATISTICS & REPORTS
    // ==========================================

    case 'get_stats':
        $district_id = $_GET['district_id'] ?? null;

        // 1. Members count
        $memSql = "SELECT COUNT(*) as total FROM users WHERE role = 'member' AND is_approved = 1";
        $memParams = [];
        if ($district_id) {
            $memSql .= " AND district_id = :district_id";
            $memParams['district_id'] = $district_id;
        }
        $mStmt = $db->prepare($memSql);
        $mStmt->execute($memParams);
        $totalMembers = $mStmt->fetch()['total'];

        // 2. Pending applications
        $pendSql = "SELECT COUNT(*) as total FROM membership_requests WHERE status = 'pending'";
        $pendParams = [];
        if ($district_id) {
            $pendSql .= " AND district_id = :district_id";
            $pendParams['district_id'] = $district_id;
        }
        $pStmt = $db->prepare($pendSql);
        $pStmt->execute($pendParams);
        $pendingApps = $pStmt->fetch()['total'];

        // 3. Pending grievances
        $grivSql = "SELECT COUNT(*) as total FROM grievances WHERE status = 'pending'";
        $grivParams = [];
        if ($district_id) {
            $grivSql .= " AND district_id = :district_id";
            $grivParams['district_id'] = $district_id;
        }
        $gStmt = $db->prepare($grivSql);
        $gStmt->execute($grivParams);
        $pendingGrievances = $gStmt->fetch()['total'];

        // 4. District wise stats (For super admin only)
        $districtStats = [];
        if (!$district_id) {
            $dStmt = $db->query("SELECT d.name as district_name, COUNT(u.id) as members_count FROM districts d LEFT JOIN users u ON d.id = u.district_id AND u.role = 'member' AND u.is_approved = 1 GROUP BY d.id");
            $districtStats = $dStmt->fetchAll();
        }

        // Recent Audit logs
        $logSql = "SELECT l.*, u.name as user_name FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT 8";
        $lStmt = $db->query($logSql);
        $recentLogs = $lStmt->fetchAll();

        // 4. Events count
        $evtStmt = $db->query("SELECT COUNT(*) as total FROM events");
        $totalEvents = $evtStmt->fetch()['total'];

        echo json_encode([
            "success" => true,
            "stats" => [
                "total_members" => (int)$totalMembers,
                "pending_applications" => (int)$pendingApps,
                "pending_grievances" => (int)$pendingGrievances,
                "total_events" => (int)$totalEvents,
                "districts_data" => $districtStats,
                "activity_logs" => $recentLogs
            ]
        ]);
        break;

    case 'get_event_registrations':
        $event_id = $_GET['event_id'] ?? null;
        if (!$event_id) {
            echo json_encode(["success" => false, "error" => "Event ID is required"]);
            exit();
        }
        $stmt = $db->prepare("SELECT * FROM event_registrations WHERE event_id = :event_id ORDER BY id DESC");
        $stmt->execute(['event_id' => $event_id]);
        echo json_encode(["success" => true, "registrations" => $stmt->fetchAll()]);
        break;

    case 'get_committees':
        $stmt = $db->query("SELECT * FROM committees ORDER BY created_at DESC");
        echo json_encode(["success" => true, "committees" => $stmt->fetchAll()]);
        break;

    case 'create_committee':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        $image_url = $input['image_url'] ?? '';
        $file_url = $input['file_url'] ?? '';
        $members_list = $input['members_list'] ?? '';
        $admin_id = $input['admin_id'] ?? null;

        if (empty($name)) {
            echo json_encode(["success" => false, "error" => "Committee/Group name is required"]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO committees (name, description, image_url, file_url, members_list) VALUES (:name, :description, :image_url, :file_url, :members_list)");
        $stmt->execute([
            'name' => $name,
            'description' => $description,
            'image_url' => $image_url,
            'file_url' => $file_url,
            'members_list' => $members_list
        ]);

        if ($admin_id) {
            logActivity($admin_id, 'CREATE_COMMITTEE', 'Created committee group: ' . $name);
        }
        echo json_encode(["success" => true, "message" => "Committee/Group created successfully!"]);
        break;

    case 'update_committee':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        $image_url = $input['image_url'] ?? '';
        $file_url = $input['file_url'] ?? '';
        $members_list = $input['members_list'] ?? '';
        $admin_id = $input['admin_id'] ?? null;

        if (!$id || empty($name)) {
            echo json_encode(["success" => false, "error" => "ID and name are required"]);
            exit();
        }

        $stmt = $db->prepare("UPDATE committees SET name = :name, description = :description, image_url = :image_url, file_url = :file_url, members_list = :members_list WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'name' => $name,
            'description' => $description,
            'image_url' => $image_url,
            'file_url' => $file_url,
            'members_list' => $members_list
        ]);

        if ($admin_id) {
            logActivity($admin_id, 'UPDATE_COMMITTEE', 'Updated committee group ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Committee/Group updated successfully!"]);
        break;

    case 'delete_committee':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "error" => "Committee ID is required"]);
            exit();
        }

        $stmt = $db->prepare("DELETE FROM committees WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($admin_id) {
            logActivity($admin_id, 'DELETE_COMMITTEE', 'Deleted committee group ID: ' . $id);
        }
        echo json_encode(["success" => true, "message" => "Committee/Group deleted successfully."]);
        break;

    case 'get_admin_users':
        if ($method !== 'GET') { http_response_code(405); exit(); }
        $stmt = $db->prepare("SELECT u.id, u.name, u.email, u.mobile, u.role, u.district_id, d.name as district_name FROM users u LEFT JOIN districts d ON u.district_id = d.id WHERE u.role IN ('superadmin', 'stateadmin', 'districtadmin') ORDER BY u.id DESC");
        $stmt->execute();
        echo json_encode(["success" => true, "admins" => $stmt->fetchAll()]);
        break;

    case 'update_admin_user':
        if ($method !== 'POST') { http_response_code(405); exit(); }
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $role = $input['role'] ?? '';
        $district_id = $input['district_id'] ?? null;
        $password = $input['password'] ?? '';
        $admin_id = $input['admin_id'] ?? null;

        if (!$id || empty($name) || empty($email) || empty($mobile) || empty($role)) {
            echo json_encode(["success" => false, "error" => "Required fields are missing"]);
            exit();
        }

        // Check duplicates excluding self
        $dupStmt = $db->prepare("SELECT id FROM users WHERE (email = :email OR mobile = :mobile) AND id != :id");
        $dupStmt->execute(['email' => $email, 'mobile' => $mobile, 'id' => $id]);
        if ($dupStmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Email or Mobile is already registered by another user"]);
            exit();
        }

        $params = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'mobile' => $mobile,
            'role' => $role,
            'district_id' => ($role === 'districtadmin') ? $district_id : null
        ];

        $sql = "UPDATE users SET name = :name, email = :email, mobile = :mobile, role = :role, district_id = :district_id";

        if (!empty($password)) {
            $sql .= ", password_hash = :password_hash";
            $params['password_hash'] = password_hash($password, PASSWORD_BCRYPT);
        }

        $sql .= " WHERE id = :id";
        $stmt = $db->prepare($sql);
        $ok = $stmt->execute($params);

        if ($ok) {
            if ($admin_id) {
                logActivity($admin_id, 'UPDATE_ADMIN_USER', "Updated administrator ID: $id ($name)");
            }
            echo json_encode(["success" => true, "message" => "Administrator updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to update administrator account."]);
        }
        break;

    case 'delete_admin_user':
        if ($method !== 'DELETE') { http_response_code(405); exit(); }
        $id = $_GET['id'] ?? null;
        $admin_id = $_GET['admin_id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "error" => "Administrator ID is required"]);
            exit();
        }

        // Prevent self deletion
        if ($id == $admin_id) {
            echo json_encode(["success" => false, "error" => "You cannot delete your own account"]);
            exit();
        }

        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $ok = $stmt->execute(['id' => $id]);

        if ($ok) {
            if ($admin_id) {
                logActivity($admin_id, 'DELETE_ADMIN_USER', "Deleted administrator ID: $id");
            }
            echo json_encode(["success" => true, "message" => "Administrator account deleted."]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to delete administrator account."]);
        }
        break;

    case 'upload_image':
        if ($method !== 'POST') {

            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Method not allowed"]);
            exit();
        }

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["success" => false, "error" => "No image file uploaded"]);
            exit();
        }

        $file = $_FILES['image'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!in_array($file['type'], $allowedTypes)) {
            echo json_encode(["success" => false, "error" => "Invalid file type. Only JPG, PNG, GIF, WebP, and PDF are allowed."]);
            exit();
        }

        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (empty($extension)) {
            $extension = 'jpg';
        }
        $filename = uniqid('file_', true) . '.' . $extension;
        $destination = $uploadDir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $baseUrl = $protocol . "://" . $host . dirname($_SERVER['SCRIPT_NAME']);
            $url = rtrim($baseUrl, '/') . '/uploads/' . $filename;

            echo json_encode(["success" => true, "url" => $url]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to save uploaded file on server."]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Invalid action requested: " . $action]);
        break;
}
?>
