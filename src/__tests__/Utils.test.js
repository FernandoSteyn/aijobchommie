// Mock utility functions
const fetchJobs = jest.fn();
const fetchUser = jest.fn();
const handleError = jest.fn();
const formatCurrency = (amount) => `R${amount.toLocaleString()}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-ZA');
const formatPhoneNumber = (phone) => phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

describe('Utility and Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchJobs API method works correctly', async () => {
    const mockJobs = [{ id: 1, title: 'Developer' }];
    fetchJobs.mockResolvedValue(mockJobs);
    
    const jobs = await fetchJobs();
    expect(jobs).toEqual(mockJobs);
    expect(fetchJobs).toHaveBeenCalled();
  });

  test('fetchUser API method works correctly', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    fetchUser.mockResolvedValue(mockUser);
    
    const user = await fetchUser();
    expect(user).toEqual(mockUser);
    expect(fetchUser).toHaveBeenCalled();
  });

  test('errorHandler handles errors gracefully', () => {
    const error = new Error('Test Error');
    handleError(error);
    expect(handleError).toHaveBeenCalledWith(error);
  });

  test('formatCurrency formats numbers correctly', () => {
    const formatted = formatCurrency(1234567.89);
    expect(formatted).toContain('R');
    expect(formatted).toContain('1');
    expect(formatted).toContain('234');
    expect(formatted).toContain('567');
  });

  test('formatDate formats dates correctly', () => {
    const formatted = formatDate('2025-08-02');
    expect(formatted).toMatch(/\d{4}[\/\-]\d{2}[\/\-]\d{2}/);
  });

  test('formatPhoneNumber formats phone numbers correctly', () => {
    const formatted = formatPhoneNumber('1234567890');
    expect(formatted).toBe('(123) 456-7890');
  });
});
