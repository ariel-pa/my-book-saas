    export const validateEmail = (value) => {
        if (!value) return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
        return '';
    };