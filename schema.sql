-- MySQL Database Schema for PPA Lucknow SaaS Management System
-- Compatible with MySQL 5.7+ and MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `ppa_lucknow` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ppa_lucknow`;

-- 1. Districts Table
CREATE TABLE IF NOT EXISTS `districts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `role` ENUM('superadmin', 'stateadmin', 'districtadmin', 'member') NOT NULL DEFAULT 'member',
  `district_id` INT DEFAULT NULL,
  `is_approved` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Members Table
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `member_id_card` VARCHAR(50) NOT NULL UNIQUE, -- E.g. PPA-LKO-2025-0042
  `designation` VARCHAR(150) NOT NULL, -- Retired Designation
  `department` VARCHAR(150) NOT NULL,
  `retirement_date` DATE DEFAULT NULL,
  `ppo_number` VARCHAR(50) DEFAULT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
  `pincode` VARCHAR(10) NOT NULL,
  `membership_status` ENUM('active', 'expired', 'suspended') NOT NULL DEFAULT 'active',
  `points` INT DEFAULT 0,
  `renewal_date` DATE DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Membership Requests Table
CREATE TABLE IF NOT EXISTS `membership_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `district_id` INT NOT NULL,
  `designation` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `retirement_date` DATE DEFAULT NULL,
  `ppo_number` VARCHAR(50) DEFAULT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. News & Pension Updates Table
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_hi` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL, -- E.g. Pension, Health, Event, Policy
  `content_en` TEXT NOT NULL,
  `content_hi` TEXT NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `district_id` INT DEFAULT NULL, -- NULL means State-wide, non-NULL is local district news
  `author_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Events Table
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_hi` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(100) NOT NULL,
  `day` VARCHAR(20) DEFAULT NULL,
  `venue_en` VARCHAR(255) NOT NULL,
  `venue_hi` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL, -- E.g. Meeting, Health Camp, Workshop
  `description_en` TEXT NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `image_urls` TEXT DEFAULT NULL,
  `district_id` INT DEFAULT NULL, -- NULL means state-wide event, non-NULL is local
  `author_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Event Registrations Table
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_registration` (`event_id`, `user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Gallery Table
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `image_urls` TEXT DEFAULT NULL,
  `album_name` VARCHAR(100) NOT NULL DEFAULT 'General',
  `date` DATE DEFAULT NULL,
  `time` VARCHAR(100) DEFAULT NULL,
  `day` VARCHAR(20) DEFAULT NULL,
  `district_id` INT DEFAULT NULL, -- NULL means State-wide
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Contact Requests Table
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(150) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('new', 'read', 'archived') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Grievances Table
CREATE TABLE IF NOT EXISTS `grievances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `district_id` INT NOT NULL,
  `status` ENUM('pending', 'in-progress', 'resolved', 'closed') NOT NULL DEFAULT 'pending',
  `resolution_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Notices / Announcements Table
CREATE TABLE IF NOT EXISTS `notices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `district_id` INT DEFAULT NULL, -- NULL means state-wide, else local
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Documents Table
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL, -- E.g. Circular, Application Form, Guide
  `file_url` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --- SEED DATA ---

-- Insert initial districts
INSERT INTO `districts` (`id`, `name`, `code`) VALUES
(1, 'Lucknow', 'LKO'),
(2, 'Kanpur', 'KNP'),
(3, 'Gorakhpur', 'GKP'),
(4, 'Varanasi', 'VNS'),
(5, 'Prayagraj', 'PRG');

-- Insert initial users (Passwords are plaintext for demo/seeding purposes. In production, use password_hash() in PHP)
-- superadmin: admin123
-- stateadmin: state123
-- districtadmin: district123
-- member: member123
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `mobile`, `role`, `district_id`, `is_approved`) VALUES
(1, 'Super Administrator', 'superadmin@upppa.org', '$2y$10$7R92zU4B5G1u6FhH8O1vN.r.yD0bU0c.u1w9y8x.zP9zW9r5a2c1e', '+91 99352 12121', 'superadmin', NULL, 1),
(2, 'State Officer', 'stateadmin@upppa.org', '$2y$10$7R92zU4B5G1u6FhH8O1vN.r.yD0bU0c.u1w9y8x.zP9zW9r5a2c1e', '+91 99352 12122', 'stateadmin', NULL, 1),
(3, 'Lucknow District Admin', 'districtadmin@upppa.org', '$2y$10$7R92zU4B5G1u6FhH8O1vN.r.yD0bU0c.u1w9y8x.zP9zW9r5a2c1e', '+91 99352 12123', 'districtadmin', 1, 1),
(4, 'Approved Member', 'member@upppa.org', '$2y$10$7R92zU4B5G1u6FhH8O1vN.r.yD0bU0c.u1w9y8x.zP9zW9r5a2c1e', '+91 94150 12345', 'member', 1, 1);

-- Insert initial member details for the member user
INSERT INTO `members` (`id`, `user_id`, `member_id_card`, `designation`, `department`, `retirement_date`, `ppo_number`, `address`, `city`, `pincode`, `membership_status`, `points`) VALUES
(1, 4, 'PPA-LKO-2025-0042', 'Senior Administrative Officer', 'UP Secretariat', '2024-12-31', 'PPO-2024-998877', 'House 12, Chinhat', 'Lucknow', '226028', 'active', 1250);

-- Insert initial news
INSERT INTO `news` (`id`, `title_en`, `title_hi`, `category`, `content_en`, `content_hi`, `image_url`, `district_id`, `author_id`) VALUES
(1, 'State Pension Revision Notice 2026', 'राज्य पेंशन संशोधन अधिसूचना 2026', 'Pension', 'The Uttar Pradesh state government has officially sanctioned the latest pension revisions for retired officers.', 'उत्तर प्रदेश राज्य सरकार ने आधिकारिक तौर पर सेवानिवृत्त अधिकारियों के लिए नवीनतम पेंशन संशोधनों को मंजूरी दे दी है।', '/7.jpg', NULL, 1),
(2, 'Lucknow Member Pension Camp', 'लखनऊ सदस्य पेंशन शिविर', 'Event', 'A special verification camp is scheduled at the Lucknow office next Monday.', 'अगले सोमवार को लखनऊ कार्यालय में एक विशेष सत्यापन शिविर निर्धारित है।', '/7.jpg', 1, 3);

-- Insert initial events
INSERT INTO `events` (`id`, `title_en`, `title_hi`, `date`, `time`, `venue_en`, `venue_hi`, `type`, `description_en`, `image_url`, `district_id`, `author_id`) VALUES
(1, 'Quarterly PPA State Committee Meeting', 'त्रैमासिक पीपीए राज्य समिति की बैठक', '2026-07-15', '11:00 AM - 2:00 PM', 'Town Hall Assembly, Lucknow', 'टाउन हॉल असेंबली, लखनऊ', 'Meeting', 'Reviewing pensioner welfare policies, pending grievances, and district audits.', 'https://picsum.photos/seed/meeting1/800/600', NULL, 1),
(2, 'Senior Citizens Free Medical Checkup Camp', 'वरिष्ठ नागरिक निःशुल्क चिकित्सा शिविर', '2026-08-08', '09:00 AM - 4:00 PM', 'District Hospital Campus, LKO', 'जिला अस्पताल परिसर, लखनऊ', 'Health Camp', 'General medical, eye checkup and cardiovascular tests for members.', 'https://picsum.photos/seed/health1/800/600', 1, 3);

-- Insert initial notices
INSERT INTO `notices` (`id`, `title`, `content`, `district_id`) VALUES
(1, 'Upload your PPO to complete digitisation', 'All members registered in Lucknow are requested to upload their PPO to access digital ID cards.', 1),
(2, 'State body elections declared for September', 'The official nominations for PPA state body office-bearers will begin in August.', NULL);

-- Insert initial documents
INSERT INTO `documents` (`id`, `title`, `type`, `file_url`, `file_size`) VALUES
(1, 'Official Pension Revision Order 2026', 'Pension Circulars', '/docs/revision_order_2026.pdf', '1.4 MB'),
(2, 'Medical Reimbursement Application Form', 'Application Forms', '/docs/medical_reimbursement.pdf', '0.8 MB');

-- Insert initial grievances
INSERT INTO `grievances` (`id`, `user_id`, `subject`, `description`, `district_id`, `status`) VALUES
(1, 4, 'Delay in December Pension Disbursement', 'My pension for December has not been credited to my SBI account. Please verify.', 1, 'pending');
