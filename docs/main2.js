const table = [];

let data = [];

let camera, scene, renderer, controls, composer;
var hblur, vblur;
let targets = { simple: [], table: [], sphere: [], helix: [], grid: [] };
let targets2 = { simple: [], grid: [] };

let selectedIndex = -1;
let layout = "table";

init();
animate();

async function init() {
  await getData();

  showMenu();

  initCamera();

  initScene();

  initObjects();

  addClickListeners();

  initRenderer();

  initTrackbarControls();

  transform(targets.table, /*2000*/ 500);

  window.addEventListener("resize", onWindowResize, false);
}

async function getData() {
  const postResponse = await fetch("index.json");
  const posts = await postResponse.json();
  data = posts;
  //console.log(data);
}

function showMenu() {
  for (let i = 0; i < data.length; i++) {
    const toc = document.getElementById("toc");

    let btn = document.createElement("button");
    btn.className = "list-group-item list-group-item-action";
    btn.id = "toc_" + i;
    btn.innerHTML = i + 1 + ". " + data[i].label;
    btn.addEventListener("click", () => elementClickHandler(i), false);
    toc.appendChild(btn);

    /*
    let object = new THREE.CSS3DObject(htmlElement2(data, i));
    //console.log({ object });

    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;

    scene.add(object);
    targets.simple.push(object);
    tableLayout2(data, i);
    */
  }
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;
}

function initScene() {
  scene = new THREE.Scene();
}

function initRenderer() {
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);
}

function initObjects() {
  simpleObjectsLayout();
  generateGeometricLayouts();
}

function addClickListeners() {
  addClickListener(targets.table, "table");
  addClickListener(targets.sphere, "sphere");
  addClickListener(targets.helix, "helix");
  addClickListener(targets.grid, "grid");
}

function simpleObjectsLayout() {
  let map = {};
  let key = "??????";
  for (let i = 0; i < data.length; i++) {
    //for (const obj of data) {
    let obj = data[i];
    let subject = obj[key] ? obj[key][0] : "";
    if (!map[subject]) {
      map[subject] = [];
    }
    map[subject].push(i);
  }
  let keys = Object.keys(map);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let object2 = new THREE.CSS3DObject(htmlElement3(key));
    //object2.position.x = 50000;
    //object2.position.y = -50000;

    scene.add(object2);

    targets2.simple.push(object2);
  }
  /*
  for (let i = 0; i < table.length; i += 5) {
    let object = new THREE.CSS3DObject(htmlElement(table, i));
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;

    scene.add(object);
    targets.simple.push(object);
    tableLayout(table, i);
  }
  

  let object3 = new THREE.CSS3DObject(htmlElement3());
  object3.position.x = 0;
  object3.position.y = 1000;
  object3.position.z = 1000;

  scene.add(object2);
  scene.add(object3);

  targets2.simple.push(object2);
  targets2.simple.push(object3);
  */

  for (let i = 0; i < data.length; i++) {
    let object = new THREE.CSS3DObject(htmlElement2(data, i));
    //console.log({ object });

    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;

    scene.add(object);
    targets.simple.push(object);
    tableLayout2(data, i);
  }
}

function htmlElement3(label) {
  let element = document.createElement("div");
  //element.width = 120 * 10;
  //element.height = 120;
  element.className = "element2";
  element.style.backgroundColor = "white";

  //const image = document.createElement("img");
  //image.className = "number";
  //image.width = 120 * 10;
  //image.height = 120;
  //image.src = `files/${table[i].objectID}.jpg`;
  //element.appendChild(image);

  /*
    let number = document.createElement("div");
    number.className = "number";
    number.textContent = i / 5 + 1;
    element.appendChild(number);
  
    let symbol = document.createElement("div");
    symbol.className = "symbol";
    symbol.textContent = table[i];
    element.appendChild(symbol);
    */

  //let details = document.createElement("div");
  //details.className = "details2";
  element.innerHTML = "<br/>" + label; /*table[i].label;*/
  //element.appendChild(details);

  //details.addEventListener("click", () => elementClickHandler(i), false);

  return element;
}

function htmlElement2(table, i) {
  let element = document.createElement("div");
  element.className = "element";
  element.style.backgroundColor =
    "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

  const image = document.createElement("img");
  //image.className = "number";
  image.width = 120;
  image.height = 120;
  image.src = `files/${table[i].objectID}.jpg`;
  element.appendChild(image);

  /*
    let number = document.createElement("div");
    number.className = "number";
    number.textContent = i / 5 + 1;
    element.appendChild(number);
  
    let symbol = document.createElement("div");
    symbol.className = "symbol";
    symbol.textContent = table[i];
    element.appendChild(symbol);
    */

  let details = document.createElement("div");
  details.className = "details";
  details.innerHTML = table[i].label;
  element.appendChild(details);

  details.addEventListener("click", () => elementClickHandler(i), false);

  return element;
}

function htmlElement(table, i) {
  let element = document.createElement("div");
  element.className = "element";
  element.style.backgroundColor =
    "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

  const image = document.createElement("img");
  //image.className = "number";
  image.width = 120;
  image.height = 160;
  image.src =
    "http://clioimg.hi.u-tokyo.ac.jp/EXT/nishikie/12000002/00000174.jpg";
  element.appendChild(image);

  /*
  let number = document.createElement("div");
  number.className = "number";
  number.textContent = i / 5 + 1;
  element.appendChild(number);

  let symbol = document.createElement("div");
  symbol.className = "symbol";
  symbol.textContent = table[i];
  element.appendChild(symbol);
  */

  let details = document.createElement("div");
  details.className = "details";
  details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
  element.appendChild(details);

  details.addEventListener("click", () => elementClickHandler(i), false);

  return element;
}

function elementClickHandler(i) {
  let e = targets[layout][i];
  /*
  //$("#exampleModal").modal();
  var myModal = new bootstrap.Modal(
    document.getElementById("exampleModal"),
    {}
  );
  myModal.show();
  */

  console.log({ camera, controls });

  let prev = selectedIndex;

  selectedIndex = i;

  if (selectedIndex > 0) {
    const button = document.getElementById(/*"menu2"*/ "browse");
    //button.style = `display: block;`;
  }

  for (let i = 0; i < data.length; i++) {
    if (i === selectedIndex) {
      document.getElementById("toc_" + i).classList.add("active");

      document.getElementById("toc_" + (i > 0 ? i - 1 : 0)).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      document.getElementById("toc_" + i).classList.remove("active");
    }
  }

  let position = e.position;

  let destinationVector = new THREE.Vector3(
    position.x,
    position.y,
    position.z + 500
  );

  TWEEN.removeAll();

  var camNewPosition = destinationVector;
  var targetNewPos = position;

  let tweenDuration = 1000;

  var camTween = new TWEEN.Tween(camera.position)
    .to(camNewPosition, tweenDuration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
  var targetTween = new TWEEN.Tween(controls.target)
    .to(targetNewPos, tweenDuration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
}

function browse() {
  if (selectedIndex < 0) {
    return;
  }
  const i = selectedIndex;
  document.getElementById("exampleModalLabel").innerHTML = data[i].label;

  document.getElementById("iframe").src =
    "mirador/?manifest=" + data[i].manifest;

  //alert(selectedIndex);
  var myModal = new bootstrap.Modal(
    document.getElementById("exampleModal"),
    {}
  );
  myModal.show();
}

function tableLayout2(data, index) {
  let object = new THREE.Object3D();

  let y = parseInt(index / 10);
  let mod = index % 10;

  //object.position.x = table[index + 3] * 140 - 1330;
  object.position.y = -(y * 180) + 990;
  //object.position.x = index * 140;
  object.position.x = mod * 140 - 140 * 5;
  targets.table.push(object);
}

function tableLayout(table, index) {
  let object = new THREE.Object3D();

  object.position.x = table[index + 3] * 140 - 1330;
  object.position.y = -(table[index + 4] * 180) + 990;
  targets.table.push(object);
}

function addClickListener(target, elementId) {
  const button = document.getElementById(elementId);

  button.addEventListener(
    "click",
    function () {
      /*
      const button = document.getElementById("menu2");
      button.style = `display: none;`;
      */
      layout = this.getAttribute("id");
      transform(target, 2000, layout);
    },
    false
  );
}

function initTrackbarControls() {
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 0;
  controls.maxDistance = 600000;
  controls.addEventListener("change", render);
}

function generateGeometricLayouts() {
  let sphereVector = new THREE.Vector3();
  let helixVector = new THREE.Vector3();

  for (let i = 0, l = targets.simple.length; i < l; i++) {
    addSphereObject(sphereVector, i, l);
    addHelixObject(helixVector, i);
    //addGridObject(i);
    //addGridObject2(i);
  }
  addGridObject2();
}

function addSphereObject(sphereVector, index, length) {
  const phi = Math.acos(-1 + (2 * index) / length);
  const theta = Math.sqrt(length * Math.PI) * phi;
  let object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  sphereVector.copy(object.position).multiplyScalar(2);

  object.lookAt(sphereVector);

  targets.sphere.push(object);
}

function addHelixObject(helixVector, index) {
  const theta = index * 0.175 + Math.PI;
  const y = -(index * 8) + 450;
  let object = new THREE.Object3D();

  object.position.setFromCylindricalCoords(900, theta, y);

  helixVector.x = object.position.x * 2;
  helixVector.y = object.position.y;
  helixVector.z = object.position.z * 2;

  object.lookAt(helixVector);

  targets.helix.push(object);
}

function addGridObject(index) {
  let object = new THREE.Object3D();
  object.position.x = (index % 5) * 400 - 800;
  object.position.y = -(Math.floor(index / 5) % 5) * 400 + 800;
  object.position.z = Math.floor(index / 25) * 1000 - 2000;
  targets.grid.push(object);
}

function addGridObject2() {
  let map = {};
  let key = "??????";
  for (let i = 0; i < data.length; i++) {
    //for (const obj of data) {
    let obj = data[i];
    let subject = obj[key] ? obj[key][0] : "";
    if (!map[subject]) {
      map[subject] = [];
    }
    map[subject].push(i);
  }
  let keys = Object.keys(map);
  //console.log({ keys });
  let map2 = {};
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let arr = map[key];

    if (i < 2 || true) {
      const object = new THREE.Object3D();
      object.position.x = -140 * 5 + 360 / 2;
      object.position.y = 990 + 70 * 2;
      object.position.z = i * 1000 - 2000;
      targets2.grid.push(object);
    }

    for (let j = 0; j < arr.length; j++) {
      let object = new THREE.Object3D();

      let y = parseInt(j / 10);
      let mod = j % 10;

      //object.position.x = table[index + 3] * 140 - 1330;
      object.position.y = -(y * 180) + 990;
      //object.position.x = index * 140;
      object.position.x = mod * 140 - 140 * 5;

      //object.position.x = (j % 5) * 400 - 800;
      //object.position.y = -(Math.floor(j / 5) % 5) * 400 + 800;
      object.position.z = i * 1000 - 2000;

      map2[arr[j]] = object;

      //targets.grid.push(object);
    }
  }

  for (let key in map2) {
    targets.grid.push(map2[key]);
  }
  /*
  let object = new THREE.Object3D();
  object.position.x = (index % 5) * 400 - 800;
  object.position.y = -(Math.floor(index / 5) % 5) * 400 + 800;
  object.position.z = Math.floor(index / 25) * 1000 - 2000;
  targets.grid.push(object);
  */
}

function transform(target, duration, aaa = "") {
  TWEEN.removeAll();

  //console.log({ target, aaa, targets2 });

  for (let i = 0; i < targets.simple.length; i++) {
    let object = targets.simple[i];
    let targetObject = target[i];
    transformObjectPosition(object, targetObject, duration);
    transformObjectRotation(object, targetObject, duration);
  }

  if (aaa === "grid") {
    for (let i = 0; i < targets2.simple.length; i++) {
      let object = targets2.simple[i];
      object.element.classList.remove("none");
      //object.element.style = "display:unset;";
      //console.log(object.element);
      let targetObject = targets2[aaa][i];
      transformObjectPosition(object, targetObject, duration);
      transformObjectRotation(object, targetObject, duration);
    }
  } else {
    let targetObject = new THREE.Object3D();
    //targetObject.position.x = 50000;
    //targetObject.position.y = -50000;
    for (let i = 0; i < targets2.simple.length; i++) {
      let object = targets2.simple[i];
      object.element.classList.add("none");
      transformObjectPosition(object, targetObject, duration);
      transformObjectRotation(object, targetObject, duration);
    }
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function transformObjectPosition(object, targetObject, duration) {
  new TWEEN.Tween(object.position)
    .to(
      {
        x: targetObject.position.x,
        y: targetObject.position.y,
        z: targetObject.position.z,
      },
      Math.random() * duration + duration
    )
    .easing(TWEEN.Easing.Exponential.InOut)
    .start();
}

function transformObjectRotation(object, targetObject, duration) {
  new TWEEN.Tween(object.rotation)
    .to(
      {
        x: targetObject.rotation.x,
        y: targetObject.rotation.y,
        z: targetObject.rotation.z,
      },
      Math.random() * duration + duration
    )
    .easing(TWEEN.Easing.Exponential.InOut)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();

  if (controls) {
    controls.update();
  }

  //composer.render();
}

function test(value) {
  camera.position.x += value;
  camera.position.z = 200;
  //camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));

  //console.log(controls);
  controls.target = new THREE.Vector3(camera.position.x, 0, 0);
}

function move(value) {
  if (value < 0) {
    if (selectedIndex > 0) {
      selectedIndex += value;
      elementClickHandler(selectedIndex);
    }
  } else {
    if (selectedIndex < data.length - 1) {
      selectedIndex += value;
      elementClickHandler(selectedIndex);
    }
  }

  /*
  if (selectedIndex > 0) {
    selectedIndex += value;
  } else if (selectedIndex > 0) {
    selectedIndex += value;
  }
  */
}
