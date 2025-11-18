import { describe, it, expect } from 'vitest';
import { callAI } from './_core/ai';

describe('AI Integration', () => {
  it('should successfully call AI API with valid key', async () => {
    const response = await callAI([
      { role: 'user', content: 'Say "test successful" and nothing else.' }
    ], { maxTokens: 10 });
    
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  }, 15000); // 15 second timeout for API call
});
