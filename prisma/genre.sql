INSERT INTO Genre (code, value) VALUES ('RPG_FANTASY', 'Fantasy (RPG)');
INSERT INTO Genre (code, value) VALUES ('RPG_SCIFI', 'Sci-Fi (RPG)');
INSERT INTO Genre (code, value) VALUES ('RPG_HORROR', 'Horror (RPG)');
INSERT INTO Genre (code, value) VALUES ('RPG_URBAN', 'Modern/Urban Fantasy (RPG)');
INSERT INTO Genre (code, value) VALUES ('TT_WARGAME', 'Wargames (Tabletop)');
INSERT INTO Genre (code, value) VALUES ('TT_MINIATURE', 'Miniature Board Games (Tabletop)');
INSERT INTO Genre (code, value) VALUES ('TT_STRATEGY', 'Strategy (Tabletop)');
INSERT INTO Genre (code, value) VALUES ('BG_EURO', 'Eurogames (Board Game)');
INSERT INTO Genre (code, value) VALUES ('BG_COOP', 'Cooperative (Board Game)');
INSERT INTO Genre (code, value) VALUES ('BG_DECKBUILD', 'Deck Building (Board Game)');
INSERT INTO Genre (code, value) VALUES ('BG_PARTY', 'Party (Board Game)');

INSERT INTO Genre (code, value, type) VALUES
('fantasy-rpg', 'Fantasy', 'roleplay'),
('sci-fi-rpg', 'Science-Fiction', 'roleplay'),
('horror-rpg', 'Horror', 'roleplay'),
('historical-rpg', 'Historisch', 'roleplay'),
('adventure-rpg', 'Abenteuer', 'roleplay'),
('cyberpunk-rpg', 'Cyberpunk', 'roleplay'),
('steampunk-rpg', 'Steampunk', 'roleplay'),

('skirmish-tt', 'Skirmish', 'tabletop'),
('historical-tt', 'Historisch', 'tabletop'),
('fantasy-tt', 'Fantasy', 'tabletop'),
('sci-fi-tt', 'Science-Fiction', 'tabletop'),

('strategy-bg', 'Strategie', 'boardgame'),
('family-bg', 'Familie', 'boardgame'),
('adventure-bg', 'Abenteuer', 'boardgame'),
('dice-bg', 'Würfelspiele', 'boardgame'),
('card-bg', 'Kartenspiele', 'boardgame'),
('cooperative-bg', 'Kooperativ', 'boardgame')

('other', 'Andere', 'other');
