describe('Jest Mocking', () => {

  test('should use a mocked function', () => {
    const mockFunction = jest.fn();
    mockFunction.mockReturnValue('Hello');
    const result = mockFunction();
    expect(result).toBe('Hello');
  });

  test('should mock an async function', async () => {
    const mockFunction = jest.fn();
    mockFunction.mockResolvedValue('Hello');
    const result = await mockFunction();
    expect(result).toBe('Hello');
  });

  test('should check how a mock function was called', async () => {
    const mockFunction = jest.fn();

    mockFunction.mockResolvedValue('Hello');
    const result = await mockFunction('Manish', 123);
    expect(result).toBe('Hello');
    expect(mockFunction).toHaveBeenCalled();
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledWith('Manish', 123);
  });

  test('should spy on an existing function', () => {
    const calculator = {
      add: (a, b) => a + b
    };

    const spy = jest.spyOn(calculator, 'add');

    const result = calculator.add(2, 3);

    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2, 3);

    spy.mockRestore();
  });

});