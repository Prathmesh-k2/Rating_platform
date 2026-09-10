// -- =====================================================
// -- STORE RATING PLATFORM
// -- MYSQL DATABASE
// -- =====================================================

// -- 1. CREATE DATABASE
// -- =====================================================

// CREATE DATABASE IF NOT EXISTS store_rating_platform;

// USE store_rating_platform;


// -- =====================================================
// -- 2. DROP TABLES IF THEY ALREADY EXIST
// -- =====================================================

// DROP TABLE IF EXISTS ratings;
// DROP TABLE IF EXISTS stores;
// DROP TABLE IF EXISTS users;


// -- =====================================================
// -- 3. USERS TABLE
// -- =====================================================

// CREATE TABLE users (
//     user_id BIGINT AUTO_INCREMENT PRIMARY KEY,

//     name VARCHAR(60) NOT NULL,

//     email VARCHAR(255) NOT NULL UNIQUE,

//     password VARCHAR(255) NOT NULL,

//     address VARCHAR(400),

//     role ENUM(
//         'admin',
//         'user',
//         'owner'
//     ) NOT NULL,

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         ON UPDATE CURRENT_TIMESTAMP,

//     is_active BOOLEAN DEFAULT TRUE,

//     last_login TIMESTAMP NULL,

//     CONSTRAINT chk_user_name_length
//         CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60)
// );


// -- =====================================================
// -- 4. STORES TABLE
// -- =====================================================

// CREATE TABLE stores (
//     store_id BIGINT AUTO_INCREMENT PRIMARY KEY,

//     owner_id BIGINT NOT NULL,

//     name VARCHAR(255) NOT NULL,

//     email VARCHAR(255),

//     address VARCHAR(400),

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         ON UPDATE CURRENT_TIMESTAMP,

//     is_active BOOLEAN DEFAULT TRUE,

//     CONSTRAINT fk_store_owner
//         FOREIGN KEY (owner_id)
//         REFERENCES users(user_id)
//         ON DELETE CASCADE
//         ON UPDATE CASCADE
// );


// -- =====================================================
// -- 5. RATINGS TABLE
// -- =====================================================

// CREATE TABLE ratings (
//     rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,

//     user_id BIGINT NOT NULL,

//     store_id BIGINT NOT NULL,

//     rating_value INT NOT NULL,

//     review_text TEXT,

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         ON UPDATE CURRENT_TIMESTAMP,

//     CONSTRAINT fk_rating_user
//         FOREIGN KEY (user_id)
//         REFERENCES users(user_id)
//         ON DELETE CASCADE
//         ON UPDATE CASCADE,

//     CONSTRAINT fk_rating_store
//         FOREIGN KEY (store_id)
//         REFERENCES stores(store_id)
//         ON DELETE CASCADE
//         ON UPDATE CASCADE,

//     CONSTRAINT chk_rating_value
//         CHECK (rating_value BETWEEN 1 AND 5),

//     CONSTRAINT unique_user_store_rating
//         UNIQUE (user_id, store_id)
// );


// -- =====================================================
// -- 6. INDEXES
// -- =====================================================

// -- USERS

// CREATE INDEX idx_users_name
// ON users(name);

// CREATE INDEX idx_users_role
// ON users(role);

// CREATE INDEX idx_users_address
// ON users(address);


// -- STORES

// CREATE INDEX idx_stores_name
// ON stores(name);

// CREATE INDEX idx_stores_address
// ON stores(address);

// CREATE INDEX idx_stores_owner
// ON stores(owner_id);


// -- RATINGS

// CREATE INDEX idx_ratings_user
// ON ratings(user_id);

// CREATE INDEX idx_ratings_store
// ON ratings(store_id);





