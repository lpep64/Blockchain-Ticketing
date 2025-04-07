-- Users can own many Tickets and the Tickets belong to one Event.
-- @block
CREATE TABLE Users(
    netId VARCHAR(255) PRIMARY KEY,
    privilege INT
);


-- @block
CREATE TABLE Events (
    eventId INT PRIMARY KEY AUTO_INCREMENT,
    eventName VARCHAR(255),
    eventDate DATETIME,
    totalTickets INT -- the cap/limit for tickets per event.
);


-- @block
CREATE TABLE Tickets (
    ticketId VARCHAR(255) PRIMARY KEY,
    eventId INT,
    ownerNetId VARCHAR(255), -- this is the foreign key to the table Users.netId
    qrCode VARCHAR(255),     -- ideal is to be generated when claimed and then if needed refresh
    isRedeemed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES Events(eventId),
    FOREIGN KEY (ownerNetId) REFERENCES Users(netId)
);


-- @block
SHOW TABLES;