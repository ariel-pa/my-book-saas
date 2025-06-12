import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from './src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BookListScreen from './src/screens/BookListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen.tsx';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen} 
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
           
              <Stack.Screen 
                name="BookList" 
                component={BookListScreen}
                options={({ navigation }) => ({
                  title: 'Biblioteca',
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Perfil')}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="person-circle-outline" size={22} color="black" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen 
                name="Perfil" 
                component={PerfilScreen}
                options={{ title: 'Mi Perfil' }}
              />
              <Stack.Screen 
                name="BookDetail" 
                component={BookDetailScreen}
                options={{ title: 'Detalles del Libro' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 