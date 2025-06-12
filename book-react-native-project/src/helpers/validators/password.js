
export const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!value) return 'La contraseña es requerida';
    if (!passwordRegex.test(value)) {
        return 'Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
    }
    return '';
};

export const validateConfirmPassword = (value, password) => {
    if (!value) return 'Debe confirmar la contraseña';
    if (value !== password) return 'Las contraseñas no coinciden';
    return '';
};