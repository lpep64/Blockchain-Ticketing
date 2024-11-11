CREATE TABLE students (
    student_id VARCHAR(255) PRIMARY KEY,
    hashed_netid VARCHAR(255) NOT NULL,
    hashed_full_name VARCHAR(255) NOT NULL,
    hashed_ps_id VARCHAR(255) NOT NULL,
    hashed_email VARCHAR(255) NOT NULL,
    student_status VARCHAR(255) NOT NULL
);

CREATE TABLE events (
    event_id VARCHAR(255) PRIMARY KEY,
    hashed_event_name VARCHAR(255) NOT NULL,
    event_datetime DATETIME NOT NULL,
    hashed_venue VARCHAR(255) NOT NULL,
    total_tickets INT NOT NULL,
    available_tickets INT NOT NULL
);