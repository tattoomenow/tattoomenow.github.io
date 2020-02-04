export function nextTattoo(){
	addFile = addFile + 1;
	if(addFile > 40){addFile = 0;}
	console.log(addFile);
	updateCube();
}
