import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { getBookById } from "../api/booksApi";
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getBookById(bookId).then(setBook);
    fetchReviewsByBookId(bookId).then(setReviews);
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const saveReview = async (bookId, review) => {
    try {
      await addDoc(collection(db, "reviews"), {
        bookId,
        review,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error al guardar reseña:", error);
    }
  };

  const fetchReviewsByBookId = async (bookId) => {
    try {
      const q = query(collection(db, "reviews"), where("bookId", "==", bookId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      return [];
    }
  };

  if (!book) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: book.imageLinks?.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.authors?.join(", ")}</Text>

      <Text style={styles.description}>
        {showFullDescription
          ? book.description
          : book.description?.slice(0, 150) + "..."}
      </Text>

      <TouchableOpacity onPress={toggleDescription}>
        <Text style={styles.readMore}>
          {showFullDescription ? "Leer menos" : "Leer más"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.reviewButtonText}>Agregar reseña</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escribe tu reseña</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Tu opinión sobre el libro..."
              value={reviewText}
              onChangeText={setReviewText}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={async () => {
                  await saveReview(bookId, reviewText);
                  const updatedReviews = await fetchReviewsByBookId(bookId);
                  setReviews(updatedReviews);
                  setReviewText("");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reseñas */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Reseñas
        </Text>
        {reviews.length === 0 ? (
          <Text style={{ fontStyle: "italic", color: "#666" }}>
            Aún no hay reseñas para este libro.
          </Text>
        ) : (
          reviews.map((review) => (
            <View
              key={review.id}
              style={{
                marginBottom: 12,
                padding: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 14 }}>{review.review}</Text>
              {review.createdAt && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                    marginTop: 4,
                  }}
                >
                  {review.createdAt.toDate().toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: screenWidth * 0.6,
    aspectRatio: 2 / 3,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    textAlign: "justify",
  },
  readMore: {
    color: "#007BFF",
    fontWeight: "bold",
    textAlign: "right",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reviewButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    marginHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
  },
  reviewButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000000aa",
  },
  modalContainer: {
    backgroundColor: "white",
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#007BFF",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BookDetailScreen;
