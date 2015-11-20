#ROACH RAGE
A web-based game by Double-Haul Productions

##TECHNOLOGIES USED
HTML, CSS, javascript, jquery

##APPROACH TAKEN

###Rendering The Animation Frames
The web app uses the HTML5 canvas feature to render the game.  Objects are created with coordinates for each item to be drawn.  They are drawn in "layers" so certain objects are always seen "on top".  The layers are drawn in the following order: smashed roaches, live roaches, mouse (player) icon/cursor.  This is set to render on a repeating interval.

###Game Logic
The core design is in this github repository in the file "/stuff/pseudo.code"

The game is initialized by creating an array of player objects.
The game loops through each player object to allow the player to play one round. An array of roach objects is created with random starting coordinates near the center of the canvas.  The render function is kicked off on a repeating interval.  Listeners monitor mouse movement and clicks.  When a player clicks in the proximity of a roach, the roach is removed from the array of roaches.  Roaches are removed from the array if they "escape" to outside the border of the canvas.  When all roaches are gone, the render interval timer is cleared and this process continues until all payers have played.


##INSTALLATION INSTRUCTIONS
Install files on a webserver or install files directly on a computer with a browser.
The game is installed and playable from these links:
http://gambler-polarity-27158.bitballoon.com/
http://dctabion.github.io/project1 (sound does't work here)


##UNSOLVED ISSUES
-Some roaches don't move
-Make .png files transparent to improve rendering and remove the "rectangles" around images.
-Occasionally there is an error at the end of a player's round.  This doesn't cause
-Score summary at end of game has poor formatting.
-sound doesn't work on version at github server
-sound doesn't play

A more complete log of unsolved issues is contained in the github repository in the file "stuff/issues&featureTracking".


##FUTURE FEATURES
Some of the main features which might be added include:
-give roaches "intelligence" to allow them to respond to proximity of mouse position
-Within one player's round, allow a new wave(s) of roaches to be generated.
-show indication of impending new wave of roaches
-allow player to plant up to x number of roach bombs which are more effective than simple mouse clicking
-more sounds for various aspects of the game

A more complete list of future features is contained in the github repository in the file "stuff/issues&featureTracking".
