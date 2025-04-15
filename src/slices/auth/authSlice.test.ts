import authReducer, { loginUser, fetchUser, initialState } from './authSlice';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

describe('authSlice reducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('loginUser action', () => {
    it('should handle fulfilled state', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });
  });

  describe('fetchUser action', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch user';
      const action = {
        type: fetchUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});
