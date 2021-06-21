'use strict';

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import {
  OrbitControls
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

import {
  GLTFLoader
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

import {
  EffectComposer
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';

import {
  RenderPass
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';

import {
  ShaderPass
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/ShaderPass.js';

import {
  GUI
} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

function main() {
  // create WebGLRenderer
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });

  // 모델용 씬을 찍을 perspective camera 생성 
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  // create OrbitControls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0); // OrbitControls에 의해 카메라가 움직일 때 카메라의 시선을 해당 좌표에 고정시킴
  controls.update(); // 값을 바꿔주면 항상 업데이트 메서드를 호출해줘야 함.

  // 포토샵으로 만든 LUT png 파일들을 사용할 수 있도록 lutTextures의 요소들을 추가해 줌
  const lutTextures = [{
      name: 'identity',
      size: 2,
      filter: true,
    },
    {
      name: 'identity no filter',
      size: 2,
      filter: false,
    },
    {
      name: 'custom',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/3dlut-red-only-s16.png'
    },
    {
      name: 'monochrome',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/monochrome-s8.png'
    },
    {
      name: 'sepia',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/sepia-s8.png'
    },
    {
      name: 'saturated',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/saturated-s8.png',
    },
    {
      name: 'posterize',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-s8n.png',
    },
    {
      name: 'posterize-3-rgb',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-3-rgb-s8n.png',
    },
    {
      name: 'posterize-3-lab',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-3-lab-s8n.png',
    },
    {
      name: 'posterize-4-lab',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-4-lab-s8n.png',
    },
    {
      name: 'posterize-more',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-more-s8n.png',
    },
    {
      name: 'inverse',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/inverse-s8.png',
    },
    {
      name: 'color negative',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/color-negative-s8.png',
    },
    {
      name: 'high contrast',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/high-contrast-bw-s8.png',
    },
    {
      name: 'funky contrast',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/funky-contrast-s8.png',
    },
    {
      name: 'nightvision',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/nightvision-s8.png',
    },
    {
      name: 'thermal',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/thermal-s8.png',
    },
    {
      name: 'b/w',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/black-white-s8n.png',
    },
    {
      name: 'hue +60',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-plus-60-s8.png',
    },
    {
      name: 'hue +180',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-plus-180-s8.png',
    },
    {
      name: 'hue -60',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-minus-60-s8.png',
    },
    {
      name: 'red to cyan',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/red-to-cyan-s8.png'
    },
    {
      name: 'blues',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/blues-s8.png'
    },
    {
      name: 'infrared',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/infrared-s8.png'
    },
    {
      name: 'radioactive',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/radioactive-s8.png'
    },
    {
      name: 'goolgey',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/googley-s8.png'
    },
    {
      name: 'bgy',
      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/bgy-s8.png'
    },
  ];

  // 2*2*2 identity(동일한, 즉 아무 변화가 없는) 3DLUT 를 만들려는데, WebGL1이 3D 텍스처를 지원하지 않으므로, 이를 펼친 4*2 2D 텍스처로 identity LUT를 생성해주는 함수
  const makeIdentityLutTexture = function () {
    // 형식화 배열로 4*2 텍스처에 들어가는 픽셀 컬러들을 할당해놓음.
    const identityLUT = new Uint8Array([
      0, 0, 0, 255, // black
      255, 0, 0, 255, // red
      0, 0, 255, 255, // blue
      255, 0, 255, 255, // magenta
      0, 255, 0, 255, // green
      255, 255, 0, 255, // yellow
      0, 255, 255, 255, // cyan
      255, 255, 255, 255, // white
    ]);

    return function (filter) {
      // DataTexture 메서드는 raw data(위에 Uint8Array로 만든 4*2 2D 텍스쳐 데이터), width, height을 받아서 DataTexture를 생성함.
      const texture = new THREE.DataTexture(identityLUT, 4, 2, THREE.RGBAFormat);
      texture.minFilter = filter;
      texture.magFilter = filter; // 만들어진 텍스처가 원본보다 각각 커질때, 작아질 때 전달받은 filter로 처리해 달라는 뜻.
      texture.needsUpdate = true; // 업데이트를 트리거할 설정을 해준 것. 나중에 이 텍스쳐가 사용되면 업데이트가 실행됨.
      texture.flipY = false; // false로 지정해서 만들어진 텍스처가 수직으로 뒤집어지지 않게 함.
      return texture;
    };
  }();

  // 얘는 identity lut를 사용하거나, LUT png 파일을 이용해서 색상데이터를 추출해서 identity lut의 텍스처에 덧씌움으로써 lutTexture를 만들어주는 함수
  // 위에 makeIdentityLutTexture와 마찬가지로 즉시실행함수를 사용하여 호출해 줌.
  const makeLUTTexture = function () {
    const imgLoader = new THREE.ImageLoader(); // three.js가 이미지를 로드할 수 있도록 해주는 이미지로더 객체 생성
    const ctx = document.createElement('canvas').getContext('2d'); // WebGLRenderer 안에 할당한 canvas 외에 또다른 2D 캔버스를 하나 더 생성해서 2DContext를 생성함.

    // 내부의 중첩함수를 makeLUTTexture에 리턴 후 할당해줘서, makeLUTTexture를 호출하면 사실상 이 중첩함수가 호출됨.
    return function (info) {
      // 일단 identityLUT를 만드는데, filter가 true면 LinearFilter(필터링 있음)를 전달해주고, filter가 false거나 아예 값이 존재하지 않는 경우(즉, LUT png 파일들)는 NearestFilter(필터링 없음)를 전달해서 identityLUT 텍스처를 만들어놓음
      const texture = makeIdentityLutTexture(
        info.filter ? THREE.LinearFilter : THREE.NearestFilter
      );

      // LUT png처럼 url값이 존재하는 info 객체면 if block을 실행하고, 아니면 그냥 위에서 만든 identityLUT 그대로 리턴해 줌.
      if (info.url) {
        const lutSize = info.size; // 각 LUT png의 파일 이름에서 추출한 LUT 육면체 사이즈를 할당함.

        // 육면체 크기값을 나타내는 info.size를 identity LUT의 크기인 2로 설정한 뒤, 아래에서 이미지를 로드하고 나서 원래 크기로 복원해 줌.
        // 왜? 이미지가 로드되지 않았다면 info.size는 그대로 2이고, 현재 텍스처도 identityLUT 그대로이기 때문에, 만약에 이미지 로드가 안된다고 해도
        // 맨 아래쪽에 LUT를 사용해서 ShaderPass에 값을 할당해주는 코드는 그냥 identityLUT의 texture와 size를 그대로 사용하게 되기 때문임.
        // 텍스처에 이미지가 적용됬다면 ImageLoader의 onLoadFn 이 잘 실행되었다는 뜻이고, 그러면 info.size값도 원래대로 돌아오겠지!
        info.size = 2;

        // 다른 loader 객체들과 마찬가지로, url을 인자로 받고, onLoadFn도 전달받을 수 있는데, 이때 onLoad 함수가 전달받는 인자는 로드가 완료된 이미지 객체임
        imgLoader.load(info.url, function (image) {
          const width = lutSize * lutSize; // 위에서 생성한 2D 캔버스에 할당하려는 너비값. Color Cube 예제에서 작성했듯이 단면을 가로방향으로 펼쳐서 렌더해줄거기 때문에 size * size 만큼 캔버스의 width를 할당해주고 있지
          const height = lutSize;
          info.size = lutSize; // 로드가 완료되었다면 info.size도 원래 값으로 복구해놓음.
          ctx.canvas.width = width;
          ctx.canvas.height = height; // 육면체 단면 가로방향 띠의 사이즈만큼 캔버스 사이즈를 지정하고
          ctx.drawImage(image, 0, 0); // 로드한 이미지를 2D캔버스의 (0, 0)자리에서부터 렌더해 줌.
          const imageData = ctx.getImageData(0, 0, width, height); // 캔버스 전체에 렌더된 이미지의 픽셀 데이터들을 가져옴.

          texture.image.data = new Uint8Array(imageData.data.buffer); // 캔버스에서 가져온 이미지의 픽셀 데이터를 위에서 만든 indentityLUT 텍스처에 지정해 줌.
          texture.image.width = width;
          texture.image.height = height; // width, height 모두 캔버스와 동일하게 지정해 줌
          texture.needsUpdate = true; // 텍스쳐가 바뀌었을 때 바로 적용하도록 needsUpdate를 true로 설정해놓음.
        });
      }

      return texture; // 텍스처를 최종적으로 리턴해 줌.
    };
  }();

  // 각각의 LUT png들의 info 객체에 대해 texture key를 만들어서 거기에 makeLUTTexture 함수로 만든 텍스처들을 할당해 줌.
  lutTextures.forEach((info) => {
    // 사이즈값이 없는 info 객체는 png 파일명에서 사이즈값을 가져옴. s뒤에 있는 숫자가 육면체의 사이즈를 의미함.
    if (!info.size) {
      // 파일 이름이 '-s<숫자>[n]' 이런 형식으로 되어있는 게 많은데, <숫자>는 육면체 크기이고,
      // [n]은 '필터링 없음' 또는 'nearest'를 의미함.
      const m = /-s(\d+)(n*)\.[^.]+$/.exec(info.url); // 정규표현식.exec(string)은 인자로 전달한 문자열에서 일치탐색을 수행한 결과를 배열로 리턴해 준다고 함... 정규식을 모르니까 어떻게 탐색하는건지를 모르겠네ㅠ

      // m에 탐색 결과로 배열을 할당받았다면 if block을 수행할거고, null값을 할당받을 수도 있기 때문에 그런 경우에는 if block을 건너뜀.
      if (m) {
        info.size = parseInt(m[1]); // 아마 m 배열의 1번째 인덱스에 들어있는 값이 size 숫자가 들어있는 문자열인거 같고, 그거를 정수로 변환해서 info.size에 할당하려는 것 같음.
        // info.filter가 정의된 info 객체는 그냥 원래의 filter값 그대로 가져가고, 
        // 정의되지 않은 경우, m 배열의 2번째 인덱스에 들어있는 문자열이 'n'이라면 false를, 'n'이 아니라면 true를 할당해주라는 뜻.
        info.filter = info.filter === undefined ? m[2] !== 'n' : info.filter;
      }
    }

    info.texture = makeLUTTexture(info); // 수정해 준 info 객체를 makeLUTTexture 함수에 인자로 넘겨줘서 텍스처를 리턴받아서 info.texture 이라는 key를 새로 생성한 뒤 거기에 할당해 줌.
  });

  // lutNameIndexMap 객체에는 각 lutTexture의 이름과 lutTextures 배열 상에서의 인덱스를 매핑해서 저장해 둠
  const lutNameIndexMap = {};
  lutTextures.forEach((info, index) => {
    lutNameIndexMap[info.name] = index;
  });

  // lutSettings.lut에는 dat.GUI에서 입력받은 인덱스값에 따라 어떤 LUTTexture 를 사용할건지 지정해 줌.
  const lutSettings = {
    lut: lutNameIndexMap.identity,
  }

  // dat.GUI로 입력창을 하나 만들어서 lutNameIndexMap에 존재하는 key값으로 입력값을 받으면, 그 key값에 해당하는 인덱스 value를 lutSettings.lut에 넣어줄거임. 
  const gui = new GUI({
    width: 300
  });
  gui.add(lutSettings, 'lut', lutNameIndexMap);

  // 모델용 씬 생성
  const scene = new THREE.Scene();

  // 배경용 씬 및 배경용 카메라(Orthographic camera) 생성... 왜냐면 배경은 평면 메쉬에 텍스처를 렌더해서 XY축을 기준으로 세워둘거니까 정사영 카메라로 2D 평면을 찍어주면 됨.
  const sceneBG = new THREE.Scene();
  const cameraBG = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  // 배경 이미지 텍스처를 로드해 담아놓을 변수와 그 텍스처로 평면 메쉬를 만들어 담아놓을 변수
  let bgMesh;
  let bgTexture;

  // 배경이미지 텍스처를 로드한 뒤, 해당 텍스처로 평면 메쉬를 만들어서 배경용 씬에 추가해 줌.
  {
    const loader = new THREE.TextureLoader();
    bgTexture = loader.load('./image/beach.jpg');
    const planeGeo = new THREE.PlaneGeometry(2, 2); // 위에서 정사영 카메라가 left, right, top. bottom을 각각 -1, 1, 1, -1로 했으므로, camera width = 2, height = 2니까 배경용 카메라에 평면 메쉬가 꽉 차겠지
    const planeMat = new THREE.MeshBasicMaterial({ // 배경용 메쉬니까 조명에 따라 반응할 필요가 없는 베이직 머티리얼을 사용함.
      map: bgTexture,
      depthTest: false, // 픽셀과 카메라의 거리값에 따라 다른 물체보다 더 멀리있거나 하는 픽셀은 렌더를 안해주는 등 거리값에 따른 렌더 여부를 결정함.
      // 근데 지금 배경용 씬에 배경용 메쉬 하나만 추가할 것이므로, 다른 물체에 가리고 자시고 할 게 없지. 그니까 depthTest 옵션을 꺼두는 거임.
    });
    bgMesh = new THREE.Mesh(planeGeo, planeMat);
    sceneBG.add(bgMesh);
  }

  /**
   * 직각삼각형에서 tan(angle) = 높이 / 밑변 공식을 활용해서 
   * 밑변 = 높이 / tan(angle)로 육면체가 카메라의 절두체 안으로 들어올 수 있는 육면체 ~ 카메라 사이의 거리값을 구할 수 있음.
   * 자세한 공식 유도 과정은 튜토리얼 웹사이트 참고.
   * 
   * 이 거리를 구할 때 bounding box의 크기(boxSize)와 중심점(boxCenter)을 넘겨줘서 구하는 함수를 만든 것.
   */
  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5; // 카메라 절두체 화면크기의 절반값. 직각삼각형 높이에 해당.
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5); // 인자로 전달받은 카메라 시야각 절반값. tan() 메서드에 할당할 각도값. 
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY); // 카메라와 bounding box 사이의 거리값. 탄젠트값으로 직각삼각형 밑변 길이 구하는 공식

    // 카메라 위치 ~ bounding box 중심점 사이의 거리를 벡터로 나타낸 값을 '길이는 1이고 방향값만 갖는 단위벡터'로 만들어버림.
    const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // 방향벡터에 스칼라값인 distance를 곱해주면 방향은 카메라 위치 ~ bounding box 중심점과 동일하고, 거리는 distance인 벡터가 리턴될거고,
    // 이 벡터만큼을 boxCenter 좌표값부터 더해준다면 camera가 distance만큼 떨어졌을 때 있어야 할 위치값이 나오겠지
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // 절두체의 near는 boxSize의 0.01배, far는 100배로 지정
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    // 카메라의 속성값을 바꿔줬으니 업데이트 메서드를 호출해줘야 함.
    camera.updateProjectionMatrix();

    // 카메라가 움직이더라도 시선은 boxCenter에 고정되어 있도록 함
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  // gltf 파일을 로드해온 뒤, scene 객체의 bounding box 사이즈 및 중심점을 구하고, 그 값들을 전달받아서 카메라 절두체 사이즈, 카메라 ~ 중심점 사이의 거리를 구해주는 frameArea 함수를 호출함.
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./model/3dbustchallange_submission/scene.gltf', (gltf) => {
      // onLoad 함수에서 인자로 전달받은 gltf JSON 오브젝트 안에서도 씬그래프 최상위 노드에 해당하는 scene 객체만 root에 할당한 뒤, 
      // 얘의 bounding box를 구해서 절두체 사이즈, 카메라 거리값 등을 구해줄거임.
      const root = gltf.scene;
      scene.add(root); // 일단 씬에 추가해주고

      // 씬과 그것의 하위노드에 존재하는 하위 노드들의 머티리얼을 {material: material}로 전달해 줌.
      root.traverse(({
        material
      }) => {
        // 만약 material이 0이 아닌 값으로 존재한다면, if block으로 들어가서 depthWrite를 활성화하여 해당 머티리얼이 깊이 버퍼에 영향을 미치도록, 즉 깊이에 의한 렌더가 적용되도록 한다는 거겠지.
        if (material) {
          material.depthWrite = true;
        }
      });

      // root 객체와 그것의 자식 노드들의 전역 변환을 업데이트 해주는 메서드
      root.updateMatrixWorld();

      // 인자로 전달한 root 객체를 감싸는 3차원 공간상의 bounding box를 계산해서 생성함.
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length(); // bounding box 전체를 대각선 방향으로 가로지르는 직선 길이를 구해줌.
      const boxCenter = box.getCenter(new THREE.Vector3()); // bounding box의 가운데 좌표값을 구해서 인자로 전달한 Vector3에 복사해서 리턴해 줌.

      // boxSize, boxCenter, camera 등의 값을 전달하면서 frameSize 함수 호출. 이 함수 안에서 모델용 씬을 담는 카메라의 위치, 절두체 사이즈 등을 지정해 줄거임.
      frameArea(boxSize * 0.4, boxSize, boxCenter, camera);

      controls.maxDistance = boxSize * 10; // OrbitControls가 perspective camera의 dolly out 할 때의 최대 거리를 지정해 줌.
      controls.target.copy(boxCenter); // OrbitControls가 카메라를 움직일 때 카메라의 시선을 bounding box의 중심점으로 맞춘 것
      controls.update(); // 값을 바꿔줬으니 항상 업데이트 해줄 것.
    });
  }

  // 쉐이더를 이용한 후처리 패스를 두 개 만들건데, shaderPass들에 각각 넣어줄 쉐이더 코드를 작성한 것. 
  const lutShader = {
    uniforms: {
      tDiffuse: {
        value: null
      }, // the previous pass's result
      lutMap: {
        value: null
      },
      lutMapSize: {
        value: 1,
      },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      #include <common>

      #define FILTER_LUT true

      uniform sampler2D tDiffuse;
      uniform sampler2D lutMap;
      uniform float lutMapSize;

      varying vec2 vUv;

      vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
        float sliceSize = 1.0 / size;                  // space of 1 slice
        float slicePixelSize = sliceSize / size;       // space of 1 pixel
        float width = size - 1.0;
        float sliceInnerSize = slicePixelSize * width; // space of size pixels
        float zSlice0 = floor( texCoord.z * width);
        float zSlice1 = min( zSlice0 + 1.0, width);
        float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
        float yRange = (texCoord.y * width + 0.5) / size;
        float s0 = xOffset + (zSlice0 * sliceSize);

        #ifdef FILTER_LUT

          float s1 = xOffset + (zSlice1 * sliceSize);
          vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
          vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
          float zOffset = mod(texCoord.z * width, 1.0);
          return mix(slice0Color, slice1Color, zOffset);

        #else

          return texture2D(tex, vec2( s0, yRange));

        #endif
      }

      void main() {
        vec4 originalColor = texture2D(tDiffuse, vUv);
        gl_FragColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
      }
    `,
  };

  const lutNearestShader = {
    uniforms: {
      ...lutShader.uniforms
    }, // 이 쉐이더의 uniforms는 lutShader의 uniforms값들을 그대로 복사해서 사용한다는 뜻.
    vertexShader: lutShader.vertexShader, // 이것도 마찬가지
    fragmentShader: lutShader.fragmentShader.replace('#define FILTER_LUT', '//'), // 이거는 lutShader.fragmentShader에서 '#define FILTER_LUT'부분을 '//'로 바꿔서 아예 한 줄을 통째로 주석처리 한다는 뜻.
  };

  // 위에서 가져온 각각의 쉐이더 코드로 ShaderPass를 만들어 줌
  const effectLUT = new ShaderPass(lutShader);
  effectLUT.renderToScreen = true;
  const effectLUTNearest = new ShaderPass(lutNearestShader);
  effectLUTNearest.renderToScreen = true;

  // 이 예제에서는 배경용 씬과 카메라, 모델용 씬과 카메라를 분리했으므로, 씬을 렌더타겟에 넘겨주는 RenderPass 역시 따로 생성해줘야 함.
  const renderModel = new RenderPass(scene, camera);
  // 이거는 모든 패스들이 기본적으로 상속받는 옵션값인 clear 즉, 패스 체이닝에서 현재 pass 이전까지의 화면을 초기화할지 여부를 결정함.
  renderModel.clear = false;
  const renderBG = new RenderPass(sceneBG, cameraBG);

  // EffectComposer를 생성함. 이때 EffectComposer가 패스 체이닝에서 내부적으로 사용할 렌더타겟을 직접 옵션을 지정해서 만든 뒤 넘겨줄 수도 있음.
  const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
  }; // 렌더 타겟을 직접 만들 때 해당 렌더 타겟에서 생성되는 텍스처에 대한 옵션값들을 지정해준 것 같음.
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, rtParameters));

  // 이제 패스 체인에 패스들을 순서대로 추가해 줌
  composer.addPass(renderBG);
  composer.addPass(renderModel);
  composer.addPass(effectLUT);
  composer.addPass(effectLUTNearest);

  // resize renderer
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth * window.devicePixelRatio | 0;
    const height = canvas.clientHeight * window.devicePixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  // 이전 프레임의 타임스탬프값을 저장할 변수
  let then = 0;

  // animate
  function animate(now) {
    now *= 0.001; // 밀리초 단위 타임스탬프값을 초 단위로 변환
    const delta = now - then; // 마지막 프레임을 렌더한 이후의 시간값. EffectComposer.render 메서드를 호출할 때 전달해줘야 함.
    then = now; // 마지막 프레임의 타임스탬프값을 매번 overwrite 해줌.

    // 렌더러를 리사이즈 해줬으면 카메라 비율(aspect)도 리사이징된 사이즈에 맞게 업데이트 해줌
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const canvasAspect = canvas.clientWidth / canvas.clientHeight; // canvasAspect 를 따로 구해서 할당해놓은건 아래에서 이미지 비율과 캔버스 비율값을 비교하는 aspect를 구하는 데에도 쓸 수 있기 위함.
      camera.aspect = canvasAspect;
      camera.updateProjectionMatrix(); // 카메라의 속성값을 바꿔줬으면 업데이트를 해야 함.

      // EffectComposer가 패스 체인을 모두 적용해 준 결과물 씬을 캔버스에 렌더링해줄 때, 캔버스 크기가 리사이징 되었다면 결과물의 크기도 리사이징된 캔버스 크기로 맞춰주어야 함.
      composer.setSize(canvas.width, canvas.height);

      // imageAspect 의 경우, 텍스처를 로드하는 데 시간이 걸리므로, 이미지가 로드되지 않았을 경우 값을 1로 할당해버림.
      const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
      const aspect = imageAspect / canvasAspect;

      bgMesh.scale.x = aspect > 1 ? aspect : 1;
      bgMesh.scale.y = aspect > 1 ? 1 : 1 / aspect;
    }

    // dat.GUI의 입력창에서 받는 index값에 따라 어떤 LUT 텍스처에 관한 정보 객체가 할당될 지 결정됨.
    const lutInfo = lutTextures[lutSettings.lut];

    // 해당하는 LUT 텍스처 정보 객체의 filter가 true냐 false냐에 따라 effect에는 각기 다른 shaderPass가 할당될거임
    const effect = lutInfo.filter ? effectLUT : effectLUTNearest;

    // enable은 모든 pass들의 공통 상속 옵션으로, 해당 shaderPass를 사용할 지 말 지를 결정함.
    effectLUT.enabled = lutInfo.filter;
    effectLUTNearest.enabled = !lutInfo.filter;

    // 할당된 DataTexture 인스턴스가 할당된 lutInfo.texture를 lutTexture에 넣어줌.
    const lutTexture = lutInfo.texture;

    // effect에 할당된 shaderPass의 각각의 uniforms값에 lutTexture와 size를 할당해 줌.
    effect.uniforms.lutMap.value = lutTexture;
    effect.uniforms.lutMapSize.value = lutInfo.size;

    // EffectComposer의 후처리가 적용된 renderer를 렌더하려면 WebGLRenderer.render() 대신 EffectComposer.render()를 매 프레임마다 호출해야 함.
    composer.render(delta);

    requestAnimationFrame(animate); // 내부에서 반복 호출
  }

  requestAnimationFrame(animate);
}

main();