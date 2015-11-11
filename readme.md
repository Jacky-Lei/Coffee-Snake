# Coffee Snake

![Screenshot]
(http://res.cloudinary.com/akantoword/image/upload/v1447180304/Screen_Shot_2015-11-10_at_10.30.47_AM_xv43yr.png)

[Game Link][game]

[game]: http://jacky-lei.github.io/Coffee-Snake/

### Description

Spin-off of arcade classic, with a twist of coffee. Consuming coffee will make your snake indestructible, move faster, and double your points for each apple consumed afterwards.

### Technical Details

Javascript, jQuery, HTML, and CSS were used to build this game.

The coffee_snake.js file includes classes such as the Board, Snake, Apple, and Coffee, with the latter 3 items belonging to the Board as properties upon initialization. These items are rendered by the Board on a new grid (an array of arrays) on an interval basis, which can be shortened to speed up the game when the snake consumes coffee. The snake's segments are coordinate elements in an array, with a new coordinate being pushed to the array and an old coordinate being shifted out during each interval render. The game ends when the snake's head position lands outside of the grid's dimensions or when the snake's head intersects one of its segment coordinates; both of these scenarios are ignored for a number of renders after the snake consumes coffee.

jQuery is used to listen for keydown events that are then passed to handling functions to start the game or turn the snake in a direction. The head of the snake encapsulates several CSS classes to respond to the directional logic of the snake's movement, resulting in the head turning towards each direction. All rendering is added into the #game element in the index.html file.
