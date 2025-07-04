 const velocityInput = document.getElementById('velocity');
  const angleInput = document.getElementById('angle');
  const heightInput = document.getElementById('height');
  const launchButton = document.getElementById('launch');

  function validateInputs() {
    let isValid = true;

    // Velocity must be > 0
    const velocity = parseFloat(velocityInput.value);
    if (isNaN(velocity) || velocity <= 0) {
      velocityInput.style.border = "2px solid red";
      velocityInput.value = '';
      velocityInput.placeholder = "Enter velocity > 0";
      isValid = false;
    } else {
      velocityInput.style.border = "";
    }

    // Angle must be > 0 and < 90
    const angle = parseFloat(angleInput.value);
    if (isNaN(angle) || angle <= 0 || angle >= 90) {
      angleInput.style.border = "2px solid red";
      angleInput.value = '';
      angleInput.placeholder = "Enter angle 0-90";
      isValid = false;
    } else {
      angleInput.style.border = "";
    }

    // Height must be >= 0
    const height = parseFloat(heightInput.value);
    if (isNaN(height) || height < 0) {
      heightInput.style.border = "2px solid red";
      heightInput.value = '';
      heightInput.placeholder = "Enter height ≥ 0";
      isValid = false;
    } else {
      heightInput.style.border = "";
    }

    // Enable/Disable launch button
    launchButton.disabled = !isValid;
  }

  // Attach event listeners
  velocityInput.addEventListener('input', validateInputs);
  angleInput.addEventListener('input', validateInputs);
  heightInput.addEventListener('input', validateInputs);

  // Validate once on page load
  window.addEventListener('load', validateInputs);