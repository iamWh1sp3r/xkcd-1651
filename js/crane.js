function Crane(world) {
  "use strict";

  var Bodies = Matter.Bodies,
      Body = Matter.Body,
      Vertices = Matter.Vertices,
      World = Matter.World;

  this.update = update;
  this.keyDown = keyDown;
  this.keyUp = keyUp;

  var segments = {
    a: {
      rotation: 0,
      change: 0,
      speed: 0.01,
      size: { w: 30, h: 175 },
      position: { x: 400, y: 579.5 },
      body: function() { return segmentBody(this); }
    },
    b: {
      rotation: 0,
      change: 0,
      speed: 0.01,
      size: { w: 20, h: 150 },
      body: function() { return segmentBody(this); }
    },
    la: {
      rotation: 0,
      size: { w: 10, h: 90 },
      body: function() { return segmentBody(this); }
    },
    lb: {
      rotation: 0,
      size: { w: 10, h: 50 },
      body: function() { return segmentBody(this); }
    },
    ra: {
      rotation: 0,
      size: { w: 10, h: 90 },
      body: function() { return segmentBody(this); }
    },
    rb: {
      rotation: 0,
      size: { w: 10, h: 50 },
      body: function() { return segmentBody(this); }
    }
  };

  var claw = {
    angle: 0.7,
    rotation: 0,
    angleChange: 0,
    rotationChange: 0,
    speed: 0.008
  };

  World.add(world, [
    segments.a.body(),
    segments.b.body(),
    segments.la.body(),
    segments.lb.body(),
    segments.ra.body(),
    segments.rb.body()
  ]);

  function segmentBody(segment) {
    if (!segment.$body) {
      segment.$body = Bodies.rectangle(0, 0, segment.size.w, segment.size.h, { friction: 0.5, isStatic: true });
    }

    return segment.$body;
  }

  function keyDown(event) {
    console.log(event.keyCode);

    switch(event.keyCode) {
      case 33: // pgup
        claw.rotationChange = claw.speed;
        break;
      case 34: // pgdown
        claw.rotationChange = -claw.speed;
        break;
      case 37: // left
        segments.b.change = -segments.b.speed;
        break;
      case 39: // right
        segments.b.change = segments.b.speed;
        break;
      case 40: // up
        claw.angleChange = -claw.speed;
        break;
      case 38: // down
        claw.angleChange = claw.speed;
        break;
      case 188: // ,
        segments.a.change = -segments.a.speed;
        break;
      case 190: // .
        segments.a.change = segments.a.speed;
        break;
    }
  }

  function keyUp(event) {
    switch(event.keyCode) {
      case 33:
      case 34:
        claw.rotationChange = 0;
        break;
      case 37:
      case 39:
        segments.b.change = 0;
        break;
      case 38:
      case 40:
        claw.angleChange = 0;
        break;
      case 188:
      case 190:
        segments.a.change = 0;
        break;
    }
  }

  function update() {
    segments.a.rotation += segments.a.change;
    segments.b.rotation += segments.b.change;
    claw.angle += claw.angleChange;
    claw.rotation += claw.rotationChange;
    updatePositions();
  }

  function segmentPosition(angle, position, size) {
    var up = -angle + Math.PI/2,
        cos = Math.cos(up),
        sin = Math.sin(up);

    return {
      center: {
        x: position.x + cos * (size.h/2),
        y: position.y - sin * (size.h/2)
      },
      tip: {
        x: position.x + cos * (size.h),
        y: position.y - sin * (size.h)
      }
    };
  }

  function updatePositions() {
    var segPos, clawPos, rotation;

    rotation = segments.a.rotation;
    segPos = segmentPosition(rotation, segments.a.position, segments.a.size);
    Body.setPosition(segments.a.body(), segPos.center);
    Body.setAngle(segments.a.body(), rotation);

    rotation = segments.a.rotation + segments.b.rotation;
    segPos = segmentPosition(rotation, segPos.tip, segments.b.size);
    Body.setPosition(segments.b.body(), segPos.center);
    Body.setAngle(segments.b.body(), rotation);

    // left claw
    rotation = segments.a.rotation + segments.b.rotation + claw.rotation - claw.angle;
    clawPos = segmentPosition(rotation, segPos.tip, segments.la.size);
    Body.setPosition(segments.la.body(), clawPos.center);
    Body.setAngle(segments.la.body(), rotation);

    rotation = segments.a.rotation + segments.b.rotation + claw.rotation - claw.angle + 1.2;
    clawPos = segmentPosition(rotation, clawPos.tip, segments.lb.size);
    Body.setPosition(segments.lb.body(), clawPos.center);
    Body.setAngle(segments.lb.body(), rotation);

    // right claw
    rotation = segments.a.rotation + segments.b.rotation + claw.rotation  + claw.angle;
    clawPos = segmentPosition(rotation, segPos.tip, segments.ra.size);
    Body.setPosition(segments.ra.body(), clawPos.center);
    Body.setAngle(segments.ra.body(), rotation);

    rotation = segments.a.rotation + segments.b.rotation + claw.rotation  + claw.angle - 1.2;
    clawPos = segmentPosition(rotation, clawPos.tip, segments.rb.size);
    Body.setPosition(segments.rb.body(), clawPos.center);
    Body.setAngle(segments.rb.body(), rotation);
  }
}