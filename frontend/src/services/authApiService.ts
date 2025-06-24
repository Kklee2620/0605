import { API_BASE_URL } from '../config';
import { User } from '../types'; // Frontend User type

interface LoginResponse {
  accessToken: string;
}

// Corresponds to backend's RegisterUserDto
interface RegisterPayload {
  name?: string; // name is optional in DTO
  email: string;
  password: string;
}

// Corresponds to backend's LoginUserDto
interface LoginPayload {
  email: string;
  password: string;
}


export const registerUserApi = async (payload: RegisterPayload): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }
  return response.json() as Promise<User>; // Backend returns user object (without password)
};

export const loginUserApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }
  return response.json() as Promise<LoginResponse>;
};

export const fetchUserProfileApi = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 401) { 
        localStorage.removeItem('modernstore-jwt'); // Clean up invalid/expired token
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }
  return response.json() as Promise<User>;
};
