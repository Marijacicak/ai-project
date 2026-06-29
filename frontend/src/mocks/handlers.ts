import { http, HttpResponse } from 'msw';
import { mockHello } from './data';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const handlers = [
  http.get('/hello', () => HttpResponse.json(mockHello)),
  http.get(`${API_URL}/hello`, () => HttpResponse.json(mockHello)),
];
