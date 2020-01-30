function nextTattoo(){
	addFile = addFile + 1;
	if(addFile > 40){addFile = 0;}
	console.log(addFile);
	updateCube();
}
function prevTattoo(){
	addFile = addFile - 1;
	if(addFile < 0){addFile = 40;}
	console.log(addFile);
	updateCube();
}

function nextSkin(){
	skinType = skinType + 1;
	if(skinType > 3){skinType = 0;}
	console.log(skinType);
	updateSkin();
}
function prevSkin(){
	skinType = skinType - 1;
	if(skinType < 0){skinType = 3;}
	console.log(skinType);
	updateSkin();
}

function updateCube(){
	var materialB = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture( designs[addFile] ),
			shininess: 10,
			transparent: true,
		} );		
	
	cube.material = materialB ;
	decalMaterial = new THREE.MeshPhongMaterial( { 
	color: 0xffffff,
	specular: 0xffffff,
	shininess: 10,
	map: THREE.ImageUtils.loadTexture( designs[addFile] ), 
	transparent: true, 
	depthTest: true, 
	depthWrite: false, 
	polygonOffset: true,
	polygonOffsetFactor: -4, 
	wireframe: false 
});
	
	}
	function updateSkin(){
		
	var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture( skins[skinType] ),
			specularMap: THREE.ImageUtils.loadTexture( 'assets/Map-SPEC.jpg' ),
			normalMap: THREE.ImageUtils.loadTexture( 'assets/Map-NOR.jpg' ),
			shininess: 10
		} );
		mesh.material = material;
	}
	
	function newCube(){
	materialC = new THREE.MeshBasicMaterial( { color: 0xeeffee } );
	var	geometryB = new THREE.BoxGeometry(14.9, 15.5, 14.9);
	
	cubeC = new THREE.Mesh( geometryB, materialC ); 
	cubeC.position.set(30,20,10);
	//cubeC.scale.set( 0.8, 0.8, 0.8 );
		scene.add( cubeC );
		
	var materialB = new THREE.MeshPhongMaterial( {
		
			map: THREE.ImageUtils.loadTexture( designs[addFile] ),
			shininess: 10,
			transparent: true
		} );
	
		geometryB = new THREE.BoxGeometry(15, 15, 15);
	
	cube = new THREE.Mesh( geometryB, materialB );
	cube.position.set(30,20,10);
		scene.add( cube );
		//cube.scale.set( 0.7, 7, 7 );
	}
