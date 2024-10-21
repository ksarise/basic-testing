import axios from 'axios';
import { throttledGetDataFromApi } from './index';
jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockAxiosCreate: jest.Mock;
  let mockAxiosGet: jest.Mock;
  beforeEach(() => {
    mockAxiosGet = jest.fn().mockResolvedValue({ data: {} });
    mockAxiosCreate = jest.fn(() => ({ get: mockAxiosGet }));
    (axios.create as jest.Mock) = mockAxiosCreate;
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts');
    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/posts');
    expect(mockAxiosGet).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test' };
    mockAxiosGet.mockResolvedValue({ data: mockData });
    const result = await throttledGetDataFromApi('/posts/1');
    expect(result).toEqual(mockData);
  });
});
