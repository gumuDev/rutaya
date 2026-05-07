import { describe, it, expect, beforeEach } from 'vitest';
import {
  getToken, saveSession, clearSession, isAuthenticated,
  getRole, getSuperToken, exitImpersonation,
} from './useAuth';

beforeEach(() => localStorage.clear());

describe('useAuth', () => {
  describe('saveSession / getToken / getRole', () => {
    it('saves and retrieves token and role', () => {
      saveSession('tok-123', 'company-1', 'Empresa Test', 'admin');

      expect(getToken()).toBe('tok-123');
      expect(getRole()).toBe('admin');
    });

    it('isAuthenticated returns true when token exists', () => {
      saveSession('tok-123', 'company-1', 'Empresa', 'admin');
      expect(isAuthenticated()).toBe(true);
    });

    it('isAuthenticated returns false when no token', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('removes all session keys', () => {
      saveSession('tok-123', 'company-1', 'Empresa', 'operator');
      clearSession();

      expect(getToken()).toBeNull();
      expect(getRole()).toBe('operator'); // fallback default
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getRole', () => {
    it('returns operator as default when no role stored', () => {
      expect(getRole()).toBe('operator');
    });

    it('returns stored role', () => {
      saveSession('tok', 'c-1', 'Empresa', 'superadmin');
      expect(getRole()).toBe('superadmin');
    });
  });

  describe('impersonation', () => {
    it('getSuperToken returns null when not impersonating', () => {
      expect(getSuperToken()).toBeNull();
    });

    it('exitImpersonation restores superadmin role and returns true', () => {
      // Setup: superadmin token stored, then impersonated
      localStorage.setItem('rutaya_super_token', 'super-tok');
      localStorage.setItem('rutaya_token', 'company-tok');
      localStorage.setItem('rutaya_role', 'admin');

      const result = exitImpersonation();

      expect(result).toBe(true);
      expect(getToken()).toBe('super-tok');
      expect(getRole()).toBe('superadmin');
      expect(getSuperToken()).toBeNull();
    });

    it('exitImpersonation returns false when not impersonating', () => {
      const result = exitImpersonation();
      expect(result).toBe(false);
    });
  });
});
