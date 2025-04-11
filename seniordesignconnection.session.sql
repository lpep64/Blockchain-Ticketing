-- Users can own many Tickets and the Tickets belong to one Event.
-- @block
DROP TABLE Users;

-- @block
CREATE TABLE Users(
    netId VARCHAR(255) PRIMARY KEY,
    privilege INT,
    pointTotal INT
);


-- @block
DROP TABLE Tickets

-- @block
DROP TABLE Events;

-- @block
CREATE TABLE Events (
    eventId INT PRIMARY KEY AUTO_INCREMENT,
    eventName VARCHAR(255),
    eventDate DATETIME,
    totalTickets INT, -- the cap/limit for tickets per event.
    eventLocation VARCHAR(255),
    ticketsOpen DATETIME,
    sport VARCHAR(255)
);

-- @block
SELECT * FROM Users

-- @block
SHOW TABLES;