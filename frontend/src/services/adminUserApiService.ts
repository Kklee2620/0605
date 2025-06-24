
import { API_BASE_URL } from '../config';
import { AdminUserSummary, UserRole } from '../types';

interface FetchAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | 'ALL'; // Allow string for 'ALL' or specific role
}

interface FetchAdminUsersResponse {
  data: AdminUserSummary[];
  total: number;
  page: number;
  limit: number;
}

export const fetchAdminUsersApi = async (
  params: FetchAdminUsersParams,
  token: string
): Promise<FetchAdminUsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role && params.role !== 'ALL') queryParams.append('role', params.role);

  const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch admin users');
  }
  return response.json();
};

export const updateAdminUserRoleApi = async (
  userId: string,
  role: UserRole,
  token: string
): Promise<AdminUserSummary> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user role');
  }
  return response.json() as Promise<AdminUserSummary>;
};
