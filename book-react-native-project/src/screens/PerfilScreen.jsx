import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Input, Button, Text, Card } from "react-native-elements";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { deleteProfileImage, uploadProfileImage } from "../services/uploadImage";

const PerfilScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    email: "",
    photoUrl: "",
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    booksInProgress: 0,
    booksToRead: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadUserStats();
  }, []);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, "usuarios", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile((prev) => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadUserStats = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setStats({
          totalBooks: userData.totalBooks || 0,
          booksRead: userData.booksRead || 0,
          booksInProgress: userData.booksInProgress || 0,
          booksToRead: userData.booksToRead || 0,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "usuarios", auth.currentUser.uid), profile);
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const handlePickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.cancelled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;

      try {
        if (profile.photoUrl) {
          await deleteProfileImage(auth.currentUser.uid);
        }

        const url = await uploadProfileImage(uri, auth.currentUser.uid);
        setProfile((prev) => ({ ...prev, photoUrl: url }));

        await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
          photoUrl: url,
        });

        alert("Imagen actualizada exitosamente");
      } catch (error) {
        console.error("Error actualizando imagen:", error);
        alert("Error al actualizar la imagen");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>Mi Perfil</Card.Title>
        <View style={styles.profileImageWrapper}>
          <Image
            source={
              profile.photoUrl
                ? { uri: profile.photoUrl }
                : require("../../assets/perfil.jpg") // Imagen predeterminada
            }
            style={styles.profileImage}
          />
          <View style={styles.imageButtonContainer}>
            <Button
              title="+"
              onPress={handlePickAndUploadImage}
              buttonStyle={styles.imageButton}
            />
          </View>
        </View>

        <Input
          placeholder="Nombre"
          value={profile.nombre}
          onChangeText={(text) => setProfile({ ...profile, nombre: text })}
        />
        <Input
          placeholder="Apellido"
          value={profile.apellido}
          onChangeText={(text) => setProfile({ ...profile, apellido: text })}
        />
        <Input
          placeholder="Email"
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
        />
        <Button
          title="Actualizar Perfil"
          onPress={handleUpdate}
          containerStyle={styles.button}
        />
      </Card>

      <Button
        title="Cerrar Sesión"
        onPress={handleSignOut}
        type="outline"
        containerStyle={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginVertical: 10,
  },
  profileImageWrapper: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  imageButton: {
    backgroundColor: "#2089dc",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
});

export default PerfilScreen;
