import axios from 'axios';

const API = axios.create({
    baseURL: 'https://reactnd-books-api.udacity.com',
    headers: {
        'Authorization': 'whatever-you-want'
    }
});

export const getAllBooks = async () => {
    const res = await API.get('/books');
    return res.data.books;
};

export const getBookById = async (id: string) => {
    const res = await API.get(`/books/${id}`);
    return res.data.book;
};

export const searchBooks = async (query: string) => {
    const res = await API.post('/search', { query });
    return res.data.books;
};