(function () {
  "use strict";

  // Matter.js module aliases
  var Bodies = Matter.Bodies,
      Common = Matter.Common,
      Composites = Matter.Composites,
      Engine = Matter.Engine,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      World = Matter.World;

  // create a Matter.js engine
  var engine = Engine.create(document.getElementById('canvas-container')),
      world = engine.world;

  // set rendering options
  var renderOptions = engine.render.options;
      renderOptions.showAxes = true;
      renderOptions.showPositions = true;

  addBodies();
  addConstraints();
  addEvents();

  var crane = new Crane(world);

  // run the engine
  Events.on(engine, 'beforeUpdate', engineBeforeUpdate);
  Engine.run(engine);

  function addBodies() {
    // add ground plane
    var offset = 5;
    var ground = Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true });
    World.add(world, ground);

    // add some boxes
    var stack = Composites.stack(20, 20, 20, 4, 0, 0, function(x, y) {
      return Bodies.rectangle(x, y, Common.random(15, 20), Common.random(15, 20));
    });
    World.add(world, stack);
  }

  function addConstraints() {
    var mouseConstraint = MouseConstraint.create(engine);
    World.add(world, mouseConstraint);
  }

  function addEvents() {
    document.onkeydown = keydown;
    document.onkeyup = keyup;
  }

  function engineBeforeUpdate(event) {
    crane.update();
  }

  function keydown(event) {
    crane.keydown(event);
  }

  function keyup(event) {
    crane.keyup(event);
  }
})();
