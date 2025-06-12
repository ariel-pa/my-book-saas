import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export const BookCard = ({ book, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginBottom: 10 }}>
    <Image source={{ uri: book.imageLinks.thumbnail }} style={{ width: 100, height: 150 }} />
    <Text>{book.title}</Text>
    <Text>{book.authors?.join(', ')}</Text>
  </TouchableOpacity>
);