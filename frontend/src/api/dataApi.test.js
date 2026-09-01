import api from './authApi';
import { exportNotes, importNotes } from './dataApi';

jest.mock('./authApi', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

test('exportNotes downloads the notes as a blob', async () => {
  try {
    api.get.mockResolvedValue({ data: {} });

    await exportNotes();

    expect(api.get).toHaveBeenCalledWith('/data/export', { responseType: 'blob' });
  } catch (err) {
    throw err;
  }
});

test('importNotes posts the notes payload', async () => {
  try {
    api.post.mockResolvedValue({ data: { data: { imported: 1, skipped: 0 } } });
    const payload = [{ title: 'Note A', content: 'Body' }];

    await importNotes(payload);

    expect(api.post).toHaveBeenCalledWith('/data/import', payload);
  } catch (err) {
    throw err;
  }
});
