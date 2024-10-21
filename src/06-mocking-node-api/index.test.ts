// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  let setTimeoutSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach((): void => {
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const mockCb = jest.fn();
    const mockTimeout = 1000;
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockCb, mockTimeout);
    expect(mockCb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(mockTimeout);
    expect(mockCb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let setIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockPath = 'some/path/to/file.txt';
  const fileContent = 'sample file content';

  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should call join with pathToFile', async () => {
    const mockJoin = (path.join as jest.Mock).mockReturnValue(
      '/mocked/fullpath',
    );

    await readFileAsynchronously(mockPath);
    expect(mockJoin).toHaveBeenCalledWith(__dirname, mockPath);
  });

  test('should return null if file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(mockPath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from(fileContent),
    );
    const result = await readFileAsynchronously(mockPath);
    expect(result).toBe(fileContent);
  });
});
