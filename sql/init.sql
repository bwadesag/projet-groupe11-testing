-- Suppression de la table si elle existe déjà
DROP TABLE IF EXISTS vehicles;

-- Création de la table
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

-- Insertion des données de test
INSERT INTO vehicles (registration_number, make, model, year, rent_price) VALUES
    ('AB-123-CD', 'Toyota', 'Corolla', 2022, 50.00),
    ('EF-456-GH', 'Renault', 'Clio', 2021, 45.00),
    ('IJ-789-KL', 'Peugeot', '308', 2023, 55.00),
    ('MN-012-OP', 'Volkswagen', 'Golf', 2022, 52.00),
    ('QR-345-ST', 'BMW', 'Serie 3', 2023, 75.00); 