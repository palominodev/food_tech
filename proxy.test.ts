// @vitest-environment node
import { NextRequest } from 'next/server';
import { proxy } from './proxy';
import { signToken } from './lib/auth/jwt';

describe('Proxy', () => {
  it('should redirect to /login if no token is present on /admin route', async () => {
    const req = new NextRequest('http://localhost:3000/admin/usuarios');
    const res = await proxy(req);
    
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('should allow request if valid token is present on /admin route', async () => {
    const validToken = await signToken({ id: 1, rol: 'administrador' });
    const req = new NextRequest('http://localhost:3000/admin/usuarios');
    req.cookies.set('token', validToken);
    
    const res = await proxy(req);
    // NextResponse.next() returns a response with no location header and status 200 (or empty headers depending on mock)
    // Actually, proxy returns NextResponse.next(), which doesn't redirect
    expect(res.headers.get('location')).toBeNull();
  });

  it('should allow request on non-admin routes without token', async () => {
    const req = new NextRequest('http://localhost:3000/menu');
    const res = await proxy(req);
    expect(res.headers.get('location')).toBeNull();
  });
});
