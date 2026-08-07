import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

process.env.VITE_API_BASE_URL = 'http://localhost:5000/api';