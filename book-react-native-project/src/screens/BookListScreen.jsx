import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SearchBar, Button, Text, Card, Icon } from "react-native-elements";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { getAllBooks, searchBooks } from "../api/booksApi";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth / 2 - 20;
const CARD_HEIGHT = 280;

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    loadBooks();
    loadFavorites();
  }, []);

  const loadBooks = async () => {
    try {
      const booksData = await getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favsQuery = query(
        collection(db, "favorites"),
        where("userId", "==", auth.currentUser.uid)
      );
      const favSnapshot = await getDocs(favsQuery);
      const favs = {};
      favSnapshot.forEach((doc) => {
        favs[doc.data().bookId] = doc.id;
      });
      setFavorites(favs);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (book) => {
    const userId = auth.currentUser.uid;
    const bookId = book.id;
    const favRef = doc(db, "favorites", `${userId}_${bookId}`);

    if (favorites[bookId]) {
      await deleteDoc(favRef);
      const updated = { ...favorites };
      delete updated[bookId];
      setFavorites(updated);
    } else {
      await setDoc(favRef, {
        bookId,
        title: book.title,
        thumbnail: book.imageLinks?.thumbnail || "",
        userId,
        isFavorite: true,
      });
      setFavorites((prev) => ({ ...prev, [bookId]: `${userId}_${bookId}` }));
    }
  };

  const filterBooks = (status) => {
    setSelectedStatus(status);
    let filtered = books;

    if (status === "to_read") {
      filtered = books.filter((book) => favorites[book.id]);
    }

    if (search) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = async (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchBooks(text);
      let filtered = searchResults;

      if (selectedStatus === "to_read") {
        filtered = searchResults.filter((book) => favorites[book.id]);
      }

      setFilteredBooks(filtered);
    } catch (error) {
      console.error("Error al buscar libros:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }) => (
    <View key={item.id} style={styles.cardWrapper}>
      <Card containerStyle={styles.card}>
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={styles.favoriteIcon}
        >
          <Icon
            name={favorites[item.id] ? "heart" : "heart-o"}
            type="font-awesome"
            color={favorites[item.id] ? "red" : "gray"}
            size={20}
          />
        </TouchableOpacity>

        <Card.Image
          source={
            item.imageLinks
              ? { uri: item.imageLinks.thumbnail }
              : require("../../assets/book-placeholder.png")
          }
          style={styles.thumbnail}
        />
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.author}>
          {item.authors?.[0]}
        </Text>
        <Button
          title="Ver"
          onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar libros..."
        onChangeText={handleSearch}
        value={search}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
        inputStyle={styles.searchBarText}
        placeholderTextColor="#888"
      />
      <View style={styles.filterContainer}>
        <Button
          title="Todos"
          type={selectedStatus === "all" ? "solid" : "outline"}
          onPress={() => filterBooks("all")}
          containerStyle={styles.filterButton}
        />
        <Button
          title="Mis libros"
          type={selectedStatus === "to_read" ? "solid" : "outline"}
          onPress={() => filterBooks("to_read")}
          containerStyle={styles.filterButton}
        />
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2089dc" />
          </View>
        ) : filteredBooks.length === 0 ? (
          <Text style={styles.noBooks}>No se encontraron libros</Text>
        ) : (
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchBarInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 40,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchBarText: {
    color: "#333",
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginVertical: 10,
  },
  card: {
    height: CARD_HEIGHT,
    padding: 8,
    borderRadius: 12,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 140,
    borderRadius: 6,
    resizeMode: "cover",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    height: 36,
  },
  author: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    alignSelf: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#2089dc",
    borderRadius: 6,
    paddingVertical: 6,
  },
  buttonTitle: {
    fontSize: 12,
  },
  noBooks: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
    color: "#888",
  },
});

export default BookListScreen;
