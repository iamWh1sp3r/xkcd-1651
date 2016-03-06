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

  var renderOptions = engine.render.options;
      renderOptions.showAxes = true;
      renderOptions.showPositions = true;
  //     renderOptions.wireframes = false;

  // var defaultCategory = 0x0001,
  //     craneCategory = 0x0002;

  // add ground plane
  var offset = 5;
  var ground = Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { friction: 0.5, isStatic: true });
  World.add(world, ground);

  // add some boxes
  var stack = Composites.stack(20, 20, 20, 4, 0, 0, function(x, y) {
    return Bodies.rectangle(x, y, Common.random(15, 20), Common.random(15, 20));
  });
  World.add(world, stack);

  // add mouse constraint
  var mouseConstraint = MouseConstraint.create(engine);
  World.add(world, mouseConstraint);

  // add crane
  var crane = new Crane(world);

  document.onkeydown = keyDown;
  document.onkeyup = keyUp;

  // run the engine
  Events.on(engine, 'beforeUpdate', engineBeforeUpdate);
  Engine.run(engine);


  function engineBeforeUpdate(event) {
    crane.update();
  }

  function keyDown(event) {
    crane.keyDown(event);
  }

  function keyUp(event) {
    crane.keyUp(event);
  }
})();