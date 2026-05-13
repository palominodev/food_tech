// @vitest-environment node
import { signToken, verifyToken } from './jwt';

describe('JWT Utilities', () => {
  it('should sign and verify a token successfully', async () => {
    const payload = { id: 1, rol: 'administrador' as const };
    const token = await signToken(payload);
    
    expect(typeof token).toBe('string');
    
    const verified = await verifyToken(token);
    expect(verified).toMatchObject(payload);
  });

  it('should fail to verify an invalid token', async () => {
    const verified = await verifyToken('invalid.token.string');
    expect(verified).toBeNull();
  });
});
