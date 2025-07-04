//check the value
const massInput = document.getElementById("mass");
const velocityInput = document.getElementById("velocity");
const angleInput = document.getElementById("angle");
const heightInput = document.getElementById("height");
const launchButton = document.getElementById("launch");


function validateInputs() {
    const mass = parseFloat(massInput.value);
    const velocity = parseFloat(velocityInput.value);
    const angle = parseFloat(angleInput.value);
    const height = parseFloat(heightInput.value);

    let errors = [];

 
  
    if (velocity <= 0) {
        errors.push("Initial Velocity must be greater than 0.");
    }
    if (angle > 90) {
        errors.push("Angle must not be greater than 90 degrees.");
    }
    if (height > 100) {
        errors.push("Initial Height must not be more than 100 meters.");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
    }
    return true;
}


launchButton.addEventListener("click", (e) => {
    if (validateInputs()) {
      
        import('./script.js').then(module => {
            module.launchSimulation();
        });
    }
});
export function launchSimulation() {
   
    console.log("Simulation launched with valid inputs!");
}
