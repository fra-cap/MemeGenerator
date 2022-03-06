-- SQLite
UPDATE positions 
set style = '{"position":"absolute","width":"95%","height":"30%","maxHeight":"30%","bottom":"2%", "right" : "2.5%"}'
where id =4;


UPDATE positions 
set style = '{"position":"absolute","width":"30%","height":"30%","maxHeight":"50%","bottom":"30%","right":"20%"}'
where id =17;

UPDATE images 
SET field= '[ { "pos" : 16 }, { "pos" : 17 } ]'
where id=16

DELETE FROM memes
where id = 16

-- SQLite
INSERT INTO images (img, title, fieldNumber, field)
VALUES ('img11.jpg','Run Jack',2,'[{"pos": 3},{"pos": 4}]');

DELETE from images where id=14

INSERT INTO positions ( style)
VALUES ('{"position":"absolute","width":"30%","height":"30%","maxHeight":"50%","bottom":"30%","right":"15%"}');

INSERT INTO positions ( style)
VALUES ('{"position":"absolute","width":"30%","height":"30%","maxHeight":"50%","top":"20%","left":"15%"}');



UPDATE positions
set style = '{"position":"absolute","width":"55%","height":"20%","maxHeight":"25%","top":"48%","left":"-2%"}'
where id = 15;


-- SQLite
INSERT INTO users (email, name, pwHash)
VALUES ('cosma@polito.it','Cosma','$2a$10$ah9wqLsT1r1EeunbkktDUOLdg.1iaagt1nuUIlJVz.F9PhmqSAu/u');
