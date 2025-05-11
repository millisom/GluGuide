const corsOptions = require('../../config/corsConfig');

describe('CORS Configuration', () => {
  it('should have the correct origins', () => {
    expect(corsOptions.origin).toContain('http://localhost:5173');
    expect(corsOptions.origin).toContain('http://127.0.0.1:5173');
  });

  it('should include essential HTTP methods', () => {
    expect(corsOptions.methods).toContain('GET');
    expect(corsOptions.methods).toContain('POST');
    expect(corsOptions.methods).toContain('DELETE');
    expect(corsOptions.methods).toContain('PUT');
    expect(corsOptions.methods).toContain('OPTIONS');
    expect(corsOptions.methods).toContain('PATCH');
  });

  it('should enable credentials', () => {
    expect(corsOptions.credentials).toBe(true);
  });

  it('should set optionsSuccessStatus to 200', () => {
    expect(corsOptions.optionsSuccessStatus).toBe(200);
  });
}); 