CREATE TABLE IF NOT EXISTS dynasty (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50),
    period VARCHAR(100),
    capital VARCHAR(100),
    founder VARCHAR(50),
    last_ruler VARCHAR(50),
    duration VARCHAR(50),
    year_start INT,
    year_end INT,
    summary TEXT,
    description TEXT,
    family_tree TEXT,
    sort_order INT,
    image_gradient VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ruler (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dynasty_id BIGINT NOT NULL,
    title VARCHAR(50),
    name VARCHAR(50),
    reign_start VARCHAR(30),
    reign_end VARCHAR(30),
    relation VARCHAR(100),
    achievements TEXT
);

CREATE TABLE IF NOT EXISTS royal_member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dynasty_id BIGINT NOT NULL,
    name VARCHAR(100),
    title VARCHAR(100),
    lifespan VARCHAR(50),
    role VARCHAR(20),
    description TEXT
);
