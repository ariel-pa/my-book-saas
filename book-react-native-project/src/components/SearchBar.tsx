import React, { useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { searchBooks } from '../api/booksApi';
import { BookCard } from '../components/BookCard';

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await searchBooks(query);
    setResults(data);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Buscar libros..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        style={{ borderWidth: 1, padding: 10 }}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { bookId: item.id })} />
        )}
      />
    </View>
  );
};
