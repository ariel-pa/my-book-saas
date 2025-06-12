import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{
                    headerShown:
                        false
                }} />
                <Stack.Screen name="BookList" component={BookListScreen} options={{
                    headerShown: true,
                    title: 'Libros'
                }} />
                <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{
                    headerShown: true,
                    title: 'Detalles del libro'
                }} />
                {/* <Stack.Screen name="Search" component={SearchScreen} options={{
                    headerShown: true,
                    title: 'Buscar libros'
                }} /> */}
            </Stack.Navigator>
            <Toast />
        </NavigationContainer>
    );
}