// @vitest-environment node
import { hashPassword, comparePassword } from './hash';

describe('Hash Utilities', () => {
  it('should hash a password and verify it correctly', async () => {
    const plainText = 'mypassword123';
    const hashed = await hashPassword(plainText);
    
    expect(hashed).not.toBe(plainText);
    
    const isValid = await comparePassword(plainText, hashed);
    expect(isValid).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const hashed = await hashPassword('mypassword123');
    const isValid = await comparePassword('wrongpassword', hashed);
    expect(isValid).toBe(false);
  });
});
