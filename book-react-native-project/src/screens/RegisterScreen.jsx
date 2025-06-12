import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !nombre || !apellido) {
            setError('Por favor complete todos los campos');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Crear perfil del usuario en Firestore
            await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
                nombre,
                apellido,
                email,
                createdAt: new Date()
            });

            // La navegación se manejará automáticamente por el estado de autenticación
        } catch (error) {
            console.error('Error en registro:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text h3 style={styles.title}>Registro</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Input
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
            />
            <Input
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
            />
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
                title="Registrarse"
                onPress={handleRegister}
                loading={loading}
                containerStyle={styles.button}
            />

            <Button
                title="¿Ya tienes cuenta? Inicia sesión"
                type="clear"
                onPress={() => navigation.navigate('Login')}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default RegisterScreen;