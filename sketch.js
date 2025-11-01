let capture;
let posenet;
let singlePose = null;
let skeleton = null;

function setup() {
  createCanvas(800, 500);

  // 🎥 Initialize webcam
  capture = createCapture(VIDEO, () => {
    console.log("🎥 Webcam started successfully");
  });
  capture.size(800, 500);
  capture.hide();

  // 🧍‍♂️ Initialize PoseNet
  posenet = ml5.poseNet(capture, () => {
    console.log("✅ PoseNet model loaded successfully!");
  });

  // 📡 Listen for poses
  posenet.on("pose", (results) => {
    if (results.length > 0) {
      singlePose = results[0].pose;
      skeleton = results[0].skeleton;
    }
  });
}

function draw() {
  background(0);

  // ✅ Mirror the webcam view
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);

  // 🟢 Draw pose
  if (singlePose) {
    drawPose(singlePose, skeleton);
  }
  pop(); // restore normal coordinate system (for text)

  // 🧾 Draw status text (not mirrored)
  if (singlePose) {
    showStatus("✅ Pose detected!", color(0, 255, 0));
  } else {
    showStatus("⌛ Detecting pose...", color(255, 255, 0));
  }
}

// 🎯 Draw detected pose
function drawPose(pose, skeleton) {
  // Draw keypoints
  for (let kp of pose.keypoints) {
    if (kp.score > 0.5) {
      fill(0, 255, 0);
      noStroke();
      ellipse(kp.position.x, kp.position.y, 12, 12);
    }
  }

  // Draw skeleton
  stroke(0, 255, 255);
  strokeWeight(6);
  for (let segment of skeleton) {
    const [p1, p2] = segment;
    line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
  }
}

// 🧾 Status message (always on correct side)
function showStatus(message, colorValue) {
  noStroke();
  fill(colorValue);
  textSize(22);
  textAlign(LEFT, TOP);
  text(message, 20, 20);
}
