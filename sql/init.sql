-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS vehicles;

-- Création de la table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Création de la table vehicles
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(10) NOT NULL UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    rent_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_registration (registration_number),
    INDEX idx_price (rent_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des données de test pour les utilisateurs
INSERT INTO users (name, email, password, role) VALUES
    ('Admin Propelize', 'admin@propelize.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'admin'),
    ('John Doe', 'john.doe@example.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'user'),
    ('Jane Smith', 'jane.smith@example.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'user');

-- Insertion des données de test pour les véhicules
INSERT INTO vehicles (registration_number, make, model, year, rent_price) VALUES
    ('AB-123-CD', 'Toyota', 'Corolla', 2022, 50.00),
    ('EF-456-GH', 'Renault', 'Clio', 2021, 45.00),
    ('IJ-789-KL', 'Peugeot', '308', 2023, 55.00),
    ('MN-012-OP', 'Volkswagen', 'Golf', 2022, 52.00),
    ('QR-345-ST', 'BMW', 'Serie 3', 2023, 75.00); 