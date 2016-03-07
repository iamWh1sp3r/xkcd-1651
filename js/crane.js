function Crane(world) {
  "use strict";

  var Bodies = Matter.Bodies,
      Body = Matter.Body,
      Vector = Matter.Vector,
      Vertices = Matter.Vertices,
      World = Matter.World;

  this.keydown = keydown;
  this.keyup = keyup;
  this.update = update;

  var speed = 0.018;

  var segments = {
    a: {
      rotation: 0,
      rotationChange: 0,
      size: { w: 30, h: 175 },
      position: { x: 400, y: 579.5 },
      body: function() { return segmentBody(this); }
    },
    b: {
      rotation: 0,
      rotationChange: 0,
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
    angleChange: 0,
    angleSpeed: 0.01,
    rotation: 0,
    rotationChange: 0
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
      segment.$body = Bodies.rectangle(0, 0, segment.size.w, segment.size.h, { isStatic: true });
    }

    return segment.$body;
  }

  function keydown(event) {
    switch(event.keyCode) {
      case 77: // m
        segments.a.rotationChange = segments.a.speed;
        break;
      case 78: // n
        segments.a.rotationChange = -segments.a.speed;
        break;
      case 37: // left
        claw.rotationChange = -speed;
        break;
      case 39: // right
        claw.rotationChange = speed;
        break;
      case 38: // down
        claw.angleChange = claw.angleSpeed;
        break;
      case 40: // up
        claw.angleChange = -claw.angleSpeed;
        break;
      case 188: // ,
        segments.b.rotationChange = -speed;
        break;
      case 190: // .
        segments.b.rotationChange = speed;
        break;
    }
  }

  function keyup(event) {
    switch(event.keyCode) {
      case 77:  // m
      case 78:  // n
        segments.a.rotationChange = 0;
        break;
      case 37:  // left
      case 39:  // right
        claw.rotationChange = 0;
        break;
      case 38:  // down
      case 40:  // up
        claw.angleChange = 0;
        break;
      case 188: // ,
      case 190: // .
        segments.b.rotationChange = 0;
        break;
    }
  }

  function update() {
    applySegmentChanges();
    applyClawChanges();
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

  function applyClawChanges() {
    claw.angle = Math.min(Math.max(claw.angle + claw.angleChange, 0.44), 1.18);
    claw.rotation = Math.min(Math.max(claw.rotation + claw.rotationChange, -1.65), 1.65);
  }

  function applySegmentChanges() {
    segments.a.rotation = Math.min(Math.max(segments.b.rotation + segments.a.rotationChange, -1.0), 1.0);
    segments.b.rotation = Math.min(Math.max(segments.b.rotation + segments.b.rotationChange, -2.4), 2.4);
  }

  function updateSegment(body, position, rotation) {
    Body.setVelocity(body, Vector.sub(position, body.position));
    Body.setPosition(body, position);
    Body.setAngularVelocity(body, rotation - body.angle);
    Body.setAngle(body, rotation);
  }

  function updatePositions() {
    var segPos, clawPos, rotation, py;

    // segment a
    rotation = segments.a.rotation;
    segPos = segmentPosition(rotation, segments.a.position, segments.a.size);
    updateSegment(segments.a.body(), segPos.center, rotation);

    // segment b
    rotation = segments.a.rotation + segments.b.rotation;
    segPos = segmentPosition(rotation, segPos.tip, segments.b.size);
    updateSegment(segments.b.body(), segPos.center, rotation);

    // left claw
    rotation = segments.a.rotation + segments.b.rotation + claw.rotation - claw.angle;
    clawPos = segmentPosition(rotation, segPos.tip, segments.la.size);
    updateSegment(segments.la.body(), clawPos.center, rotation);

    rotation = segments.a.rotation + segments.b.rotation + claw.rotation - claw.angle + 1.2;
    clawPos = segmentPosition(rotation, clawPos.tip, segments.lb.size);
    updateSegment(segments.lb.body(), clawPos.center, rotation);

    // right claw
    rotation = segments.a.rotation + segments.b.rotation + claw.rotation  + claw.angle;
    clawPos = segmentPosition(rotation, segPos.tip, segments.ra.size);
    updateSegment(segments.ra.body(), clawPos.center, rotation);

    rotation = segments.a.rotation + segments.b.rotation + claw.rotation  + claw.angle - 1.2;
    clawPos = segmentPosition(rotation, clawPos.tip, segments.rb.size);
    updateSegment(segments.rb.body(), clawPos.center, rotation);
  }
}
