const container = document.getElementById( 'container' );

			let renderer, scene, camera, stats;
			let mesh;
			let raycaster;
			let line;

			const intersection = {
				intersects: false,
				point: new THREE.Vector3(),
				normal: new THREE.Vector3()
			};
			const mouse = new THREE.Vector2();
			const intersects = [];

			const textureLoader = new THREE.TextureLoader();
			const decalDiffuse = textureLoader.load( 'textures/decal/decal-diffuse.png' );
			decalDiffuse.colorSpace = THREE.SRGBColorSpace;
			const decalNormal = textureLoader.load( 'textures/decal/decal-normal.jpg' );

			const decalMaterial = new THREE.MeshPhongMaterial( {
				specular: 0x444444,
				map: decalDiffuse,
				normalMap: decalNormal,
				normalScale: new THREE.Vector2( 1, 1 ),
				shininess: 30,
				transparent: true,
				depthTest: true,
				depthWrite: false,
				polygonOffset: true,
				polygonOffsetFactor: - 4,
				wireframe: false
			} );

			const decals = [];
			let mouseHelper;
			const position = new THREE.Vector3();
			const orientation = new THREE.Euler();
			const size = new THREE.Vector3( 10, 10, 10 );

			const params = {
				minScale: 10,
				maxScale: 20,
				rotate: true,
				clear: function () {

					removeDecals();

				}
			};

			

			function nextTattoo(){
	addFile = addFile + 1;
	if(addFile > 50){addFile = 0;}
	updateCube();
	}
	function prevTattoo(){
	addFile = addFile - 1;
	if(addFile < 0){addFile = 50;}
	
	updateCube();
}

function nextSkin(){
	skinType = skinType + 1;
	if(skinType > 3){skinType = 0;}
	
	updateSkin();
}
function prevSkin(){
	skinType = skinType - 1;
	if(skinType < 0){skinType = 3;}
	
	updateSkin();
}
	function updateCube(){
	var materialB = new THREE.MeshPhongMaterial( {
			map: textureLoader.load( designs[addFile] ),
			shininess: 1,
			transparent: true,
		} );		
	
	cube.material = materialB ;
	decalMaterial = new THREE.MeshPhongMaterial( { 
	color: 0xffffff,
	specular: 0x111111,
	shininess: 1,
	map: textureLoader.load( designs[addFile] ), 
	transparent: true, 
	depthTest: true, 
	depthWrite: false, 
	polygonOffset: true,
	polygonOffsetFactor: -4, 
	wireframe: false 
});
	
	}
	function updateSkin(){
	mesh.material = new THREE.MeshPhongMaterial( {
						specular: 0x111111,
						map: textureLoader.load( skins[skinType] ),
						shininess: 1
					} );
	}
			function tag() {
                                position.copy( intersection.point );
				nextSkin();
				prevSkin();
				
			}
				function shoot() {
					prevSkin();
				orientation.copy( mouseHelper.rotation );
				orientation.z = params.Rotation/180*Math.PI;
				if(position.z < 0){orientation.z = params.Rotation/180*Math.PI + Math.PI;}
				var Scale = params.Scale;
				size.set( Scale, Scale, Scale );
				
				var material = decalMaterial.clone();
				material.color.setHex(0x000000);//( Math.random() * 0xffffff );
				var m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );
				nextSkin();
				decals.push( m );
				scene.add( m );
			}
			function newCube(){
		if(1==1){ //set second value to 0 for testing 1 to go
	var materialC = new THREE.MeshPhongMaterial( {
						specular: 0x111111,
						map: textureLoader.load( skins[0] ),
						shininess: 1
					} );
	var	geometryB = new THREE.BoxGeometry(9.9, 10.5, 9.9);
	
	cubeC = new THREE.Mesh( geometryB, materialC ); 
	cubeC.position.set(28,35,10);
	//cubeC.scale.set( 0.8, 0.8, 0.8 );
		scene.add( cubeC );
		
	var materialB = new THREE.MeshPhongMaterial( {
		
			map: textureLoader.load( designs[addFile] ),
			shininess: 1,
			transparent: true
		} );
	
		geometryB = new THREE.BoxGeometry(10, 10, 10);
	
	cube = new THREE.Mesh( geometryB, materialB );
	cube.position.set(28,35,10);
	scene.add( cube );
		}//end of test ommission

	}


			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				container.appendChild( stats.dom );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 120;

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 50;
				controls.maxDistance = 200;

				scene.add( new THREE.AmbientLight( 0x666666 ) );

				const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 3 );
				dirLight1.position.set( 1, 0.75, 0.5 );
				scene.add( dirLight1 );

				const dirLight2 = new THREE.DirectionalLight( 0xccccff, 3 );
				dirLight2.position.set( - 1, 0.75, - 0.5 );
				scene.add( dirLight2 );

				const geometry = new THREE.BufferGeometry();
				geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

				line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
				scene.add( line );

				loadLeePerrySmith();

				raycaster = new THREE.Raycaster();

				mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
				mouseHelper.visible = false;
				scene.add( mouseHelper );

				window.addEventListener( 'resize', onWindowResize );

				let moved = false;

				controls.addEventListener( 'change', function () {

					moved = true;

				} );

				window.addEventListener( 'pointerdown', function () {

					moved = false;

				} );

				window.addEventListener( 'pointerup', function ( event ) {

					if ( moved === false ) {

						checkIntersection( event.clientX, event.clientY );

						if ( intersection.intersects ) shoot();

					}

				} );

				window.addEventListener( 'pointermove', onPointerMove );

				function onPointerMove( event ) {

					if ( event.isPrimary ) {

						checkIntersection( event.clientX, event.clientY );

					}

				}

				function checkIntersection( x, y ) {

					if ( mesh === undefined ) return;

					mouse.x = ( x / window.innerWidth ) * 2 - 1;
					mouse.y = - ( y / window.innerHeight ) * 2 + 1;

					raycaster.setFromCamera( mouse, camera );
					raycaster.intersectObject( mesh, false, intersects );

					if ( intersects.length > 0 ) {

						const p = intersects[ 0 ].point;
						mouseHelper.position.copy( p );
						intersection.point.copy( p );

						const n = intersects[ 0 ].face.normal.clone();
						n.transformDirection( mesh.matrixWorld );
						n.multiplyScalar( 10 );
						n.add( intersects[ 0 ].point );

						intersection.normal.copy( intersects[ 0 ].face.normal );
						mouseHelper.lookAt( n );

						const positions = line.geometry.attributes.position;
						positions.setXYZ( 0, p.x, p.y, p.z );
						positions.setXYZ( 1, n.x, n.y, n.z );
						positions.needsUpdate = true;

						intersection.intersects = true;

						intersects.length = 0;

					} else {

						intersection.intersects = false;

					}

				}

				const gui = new GUI();

				gui.add( params, 'minScale', 1, 30 );
				gui.add( params, 'maxScale', 1, 30 );
				gui.add( params, 'rotate' );
				gui.add( params, 'clear' );
				gui.open();

			}

			function loadLeePerrySmith() {

				const map = textureLoader.load( 'models/gltf/LeePerrySmith/Map-COL.jpg' );
				map.colorSpace = THREE.SRGBColorSpace;
				const specularMap = textureLoader.load( 'models/gltf/LeePerrySmith/Map-SPEC.jpg' );
				const normalMap = textureLoader.load( 'models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' );

				const loader = new GLTFLoader();

				loader.load( 'models/gltf/LeePerrySmith/LeePerrySmith3.glb', function ( gltf ) {

					mesh = gltf.scene.children[ 0 ];
					mesh = gltf.scene.children[ 0 ];
					mesh.material = new THREE.MeshPhongMaterial( {
						specular: 0x111111,
						map: map,
						specularMap: specularMap,
						normalMap: normalMap,
						shininess: 25
					} );

					scene.add( mesh );
					mesh.scale.set( 10, 10, 10 );

				} );

			}

			function shoot2() {

				position.copy( intersection.point );
				orientation.copy( mouseHelper.rotation );

				if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

				const scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
				size.set( scale, scale, scale );

				const material = decalMaterial.clone();
				material.color.setHex( Math.random() * 0xffffff );

				const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );
				m.renderOrder = decals.length; // give decals a fixed render order

				decals.push( m );
				scene.add( m );

			}

			function removeDecals() {

				decals.forEach( function ( d ) {

					scene.remove( d );

				} );

				decals.length = 0;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			} 

			function animate() {

				requestAnimationFrame( animate );

				renderer.render( scene, camera );

				stats.update();

			}

			init();
			animate();

		
