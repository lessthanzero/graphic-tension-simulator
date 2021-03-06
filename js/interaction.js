/**
 * INTERACTIONS
 */

/*
 * JQuery bindings
 */
 $(function(){ // onLoad
 	$('.BtnControls').each( function(i, el) {
		renderState(el);
	});

	$('#btnClear').click(clearScene);

	$('.BtnControls').click(function(){
		var state = this.getAttribute('data-state');
		window[state] = !window[state];  //isSimulating = !isSimulating;
		renderState(this);
	});

	renderSimulationTrigger();
	
	$('#modeSwitch div').click(function() {
		$('#modeSwitch div').removeClass("selected");
		$(this).addClass('selected');
		var isStatic = $('#modeSwitch div:nth-child(1)').hasClass('selected');
		isSimulating = !isStatic;
		wasAutoSwitched = false;
	});
});

function renderSimulationTrigger() {
	$('#modeSwitch div').removeClass("selected");
	var index = 2 - !isSimulating;
	$('#modeSwitch div:nth-child(' + index + ')').addClass('selected');
}

function renderState(obj) {
	var state = obj.getAttribute('data-state');
	if (window[state]) {
		$(obj).addClass("on");
	} else {
		$(obj).removeClass("on");
	}
}


function drawCursor() {
 	fill(0);
	noStroke();
	if (isDeleting) {
		cursor(ARROW);
		text("delete", mouseX + 12, mouseY + 10);
	} else if (isScaling) {
		cursor(ARROW);
		text("zoom", mouseX + 12, mouseY + 10);
	} else if (isMoving) {
		cursor(MOVE)
	} else {
		cursor(CROSS); // cursor(HAND)
	}
 }

function mouseDragged() {
	if (pickedObjectIndex < 0) return;
	if (isScaling) {  
		// SCALE
		//if (scaleSign == 0) scaleSign = sign(pickedObjectIndex);
		var amount = DRAG_AMOUNT * // scale factor 
			sign(pickedObjectIndex) * // direction
			dist(pmouseX, pmouseY, mouseX, mouseY);
		// adjust size then dragg
		var newSize = max(MIN_SIZE, objects[pickedObjectIndex][2] + amount);
		objects[pickedObjectIndex][2] = newSize;
		if (newSize > MIN_SIZE) { 
			// correct center
			objects[pickedObjectIndex][0] -= amount/2;
			objects[pickedObjectIndex][1] -= amount/2;
		}

	} else {
		// MOVE
		objects[pickedObjectIndex][0] += mouseX - pmouseX;
		objects[pickedObjectIndex][1] += mouseY - pmouseY;
		isMoving = true;
	}
	return false; // prevent default
}


function clearScene() {
	objects =  new Array();
	objects_all =  objects.concat(obstacles);
}

function keyPressed() {

	if (key == ' ') {
		isSimulating = !isSimulating;
		wasAutoSwitched = false;
		renderSimulationTrigger();
	} else if (keyCode == 'c') {
		clearScene();	
	}

	switch (keyCode) {
	 
		case DOWN_ARROW:
		showResultForces = !showResultForces;
		break;

		case UP_ARROW:
		showTension = !showTension;
		break;

		case RIGHT_ARROW:
		showDisplacements = !showDisplacements;
		break;
		
		case LEFT_ARROW:
		showFrame = !showFrame;
		break;

		case SHIFT:
		isScaling = true;
		break;

		case ALT:
		isDeleting = true;
		break;
	}
	return false; // prevent default
}

function keyReleased() {

	switch (keyCode) {

		case DOWN_ARROW:
		showResultForces = !showResultForces;
		break;

		case UP_ARROW:
		showTension = !showTension;
		break;

		case RIGHT_ARROW:
		showDisplacements = !showDisplacements;
		break;
		
		case LEFT_ARROW:
		showFrame = !showFrame;
		break;

		case SHIFT:
		isScaling = false;
		break;

		case ALT:
		isDeleting = false;
		break;
	}
	return false; // prevent default
}