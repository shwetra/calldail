const validateVehicleNumber = (vehicleNumber) => {
    const vehicleNumberRegExp = /^[a-zA-z0-9 ]{0,20}$/;
    return vehicleNumberRegExp.test(vehicleNumber);
};

const validateName = (name) => {
    const nameRegExp = /^[A-Za-z\s]{1,30}$/;
    return nameRegExp.test(name);
};

const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegExp = /^\d{10}$/;
    return phoneNumberRegExp.test(phoneNumber);
};

const validatePassword = (password) => {
    const passwordRegExp = /^[A-Za-z0-9@#$*]{6,18}$/;
    return passwordRegExp.test(password);
};

const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};

const validateDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

const validateFilename = (fileName) => {
    const fileNameRegex = /^[a-zA-Z0-9_]{1,30}$/;
    return fileNameRegex.test(fileName);
};

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export { validateName, validatePhoneNumber, validatePassword, validateConfirmPassword, validateVehicleNumber, validateDate, validateFilename, validateEmail };