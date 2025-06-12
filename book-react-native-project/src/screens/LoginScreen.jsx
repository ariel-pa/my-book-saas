import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor complete todos los campos');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await signInWithEmailAndPassword(auth, email, password);
            // Navegación automática manejada por el estado de autenticación global
        } catch (error) {
            console.error('Error en login:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../../assets/book-placeholder.png')}
                style={styles.avatar}
            />

            <Text h3 style={styles.title}>Iniciar Sesión</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Input
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                containerStyle={styles.button}
            />

            <Button
                title="¿No tienes cuenta? Regístrate"
                type="clear"
                onPress={() => navigation.navigate('Register')}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        marginVertical: 10,
        width: '100%',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default LoginScreen;
