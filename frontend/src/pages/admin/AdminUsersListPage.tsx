
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthContextType, AdminUserSummary, UserRole } from '../../types';
import { fetchAdminUsersApi, updateAdminUserRoleApi } from '../../services/adminUserApiService';
import { Button } from '../../components/Button';
import { PaginationControls } from '../../components/PaginationControls'; // Import PaginationControls

const AdminUsersListPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, currentUser } = useContext(AuthContext) as AuthContextType;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);


  const loadUsers = useCallback(async (page: number, search: string, role: UserRole | 'ALL') => {
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (role !== 'ALL') params.role = role;
      
      const response = await fetchAdminUsersApi(params, token);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.total / response.limit)); // Calculate total pages
      setCurrentPage(response.page); // Set current page from API response
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [token, limit]);

  useEffect(() => {
    loadUsers(currentPage, searchTerm, roleFilter);
  }, [loadUsers, currentPage, searchTerm, roleFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };
  
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value as UserRole | 'ALL');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // PaginationControls will ensure newPage is valid
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!token || !currentUser) {
      alert("Authentication error.");
      return;
    }
    if (userId === currentUser.id && newRole !== 'ADMIN') {
        alert("You cannot demote your own admin account.");
        return;
    }

    const adminUsers = users.filter(u => u.role === 'ADMIN');
    if (adminUsers.length === 1 && adminUsers[0].id === userId && newRole === 'USER') {
        if (!window.confirm("This is the last admin account. Are you sure you want to demote it? This could lock you out of admin functions.")) {
            return;
        }
    }

    setUpdatingUserId(userId);
    try {
      const updatedUser = await updateAdminUserRoleApi(userId, newRole, token);
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: updatedUser.role } : u));
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    } finally {
      setUpdatingUserId(null);
    }
  };
  
  const getRoleColor = (role?: UserRole) => {
    if (role === 'ADMIN') return 'bg-purple-100 text-purple-800';
    return 'bg-blue-100 text-blue-800';
  };


  if (loading && users.length === 0) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Users</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search-user" className="block text-sm font-medium text-gray-700">Search Users</label>
          <input
            type="text"
            id="search-user"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Name or Email..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700">Filter by Role</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.id !== currentUser?.id && (
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-1 bg-white"
                            disabled={updatingUserId === user.id}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    )}
                    {updatingUserId === user.id && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-6"
        />
      )}
    </div>
  );
};

export default AdminUsersListPage;
