import React, { useState, useEffect, useContext } from 'react';
import {
    FiUser, FiKey, FiUsers, FiLock, FiEdit, FiTrash2, FiSave, FiPlus
} from 'react-icons/fi';
import authApi from '../../../services/authApi';
import { AuthContext } from '../../../context/authContext';

// --- Color Constants ---
const COLOR_PRIMARY = '#454545';
const COLOR_SURFACE_LIGHT = 'bg-[#f3efee]';
const COLOR_SURFACE_DEFAULT = 'bg-[#f3efee]';
const COLOR_SURFACE_SUBTLE = 'bg-[#F5F1EE]';
const COLOR_TEXT_TITLE = 'text-[#4A4A4A]';
const COLOR_TEXT_PRIMARY = 'text-[#722F37]';

// --- Role Definitions ---
const USER_ROLES_DEFINITION = [
    { role: 'super_admin', display: 'Super Admin', access: '1', who: 'Cofounders and Directors only', responsibilities: 'Full access to manage users, content, and dashboard.' },
    { role: 'hr_hiring', display: 'HR - Hiring', access: '2.1', who: 'HR team', responsibilities: 'Manage hiring process and candidate data.' },
    { role: 'project_content_manager', display: 'Project Content Managers', access: '2.2', who: 'Project team', responsibilities: 'Manage project-related website content.' },
];

// --- Helper Functions (Moved outside) ---
const renderHeader = (icon, title) => (
    <h2 className={`flex items-center text-2xl font-semibold ${COLOR_TEXT_TITLE} mb-4 border-b border-gray-200 pb-2`}>
        {React.createElement(icon, { className: `mr-2 ${COLOR_TEXT_PRIMARY}` })} {title}
    </h2>
);

// --- Components (Moved outside) ---

const PersonalSettings = ({ newName, setNewName, handleNameUpdate, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, handlePasswordChange }) => (
    // Increased overall vertical space between the two main sections
    <div className={`${COLOR_SURFACE_DEFAULT} p-6 rounded-lg  space-y-10`}> 
        <div>
            {renderHeader(FiUser, 'Profile Information')}
            {/* Increased space-y-4 to space-y-6 for inputs/button spacing */}
            <form onSubmit={handleNameUpdate} className="space-y-6"> 
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full max-w-md"
                    required
                />
                <button type="submit" className={`flex items-center px-4 py-2 text-white rounded-md`} style={{ backgroundColor: COLOR_PRIMARY }}>
                    <FiSave className="mr-2" /> Save Changes
                </button>
            </form>
        </div>
        
        <div>
            {renderHeader(FiKey, 'Change Password')}
            {/* Increased space-y-4 to space-y-6 for inputs/button spacing */}
            <form onSubmit={handlePasswordChange} className="space-y-6"> 
                
                {/* Current Password Field */}
                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="p-3 border rounded-lg w-full max-w-md" required />
                
                {/* 🔑 MODIFIED: Added mt-4 for extra space before New Password */}
                <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="p-3 border rounded-lg w-full max-w-md mt-4" required minLength={8} />
                
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="p-3 border rounded-lg w-full max-w-md" required />
                
                <button type="submit" className={`flex items-center px-4 py-2 text-white rounded-md`} style={{ backgroundColor: COLOR_PRIMARY }}>
                    <FiEdit className="mr-2" /> Update Password
                </button>
            </form>
        </div>
    </div>
);

// 🔑 UPDATED AdminSettings to accept newUserPassword and setNewUserPassword
const AdminSettings = ({ currentUser, userList, loadingUsers, addingUser, setAddingUser, newUserData, setNewUserData, newUserPassword, setNewUserPassword, handleAddUserSubmit, handleRoleChange, handleUserDelete }) => (
    // 🔑 Removed shadow-md and unnecessary space-y-10 class
    <div className={`${COLOR_SURFACE_DEFAULT} p-6 rounded-lg mt-8`}>
        {renderHeader(FiUsers, 'Admin: User & Role Management')}
        
        {/* Button Section */}
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">{loadingUsers ? 'Loading Users...' : `Total Users: ${userList.length}`}</h3>
            <button 
                // 🔑 Removed shadow-md and hover:shadow-lg
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90`} 
                style={{ backgroundColor: COLOR_PRIMARY }} 
                onClick={() => setAddingUser(prev => !prev)}
            >
                <FiPlus className="mr-2" /> {addingUser ? 'Cancel Add User' : 'Add New User'}
            </button>
        </div>

        {/* 🔑 New User Form Layout (Grid) */}
        {addingUser && (
            // 🔑 Removed shadow-inner and explicit border
            <div className={`${COLOR_SURFACE_SUBTLE} p-6 mb-6 rounded-xl border-gray-300 space-y-4`}>
                <h4 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">New System User Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUserData.name}
                        onChange={e => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#722F37] focus:border-transparent transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUserData.email}
                        onChange={e => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#722F37] focus:border-transparent transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Initial Password (min 8 chars)"
                        value={newUserPassword}
                        onChange={e => setNewUserPassword(prev => e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#722F37] focus:border-transparent transition"
                        required
                        minLength={8}
                    />
                    <select
                        value={newUserData.role}
                        onChange={e => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                        className="p-3 border border-gray-300 rounded-lg w-full bg-white appearance-none cursor-pointer"
                    >
                        {USER_ROLES_DEFINITION.map(r => <option key={r.access} value={r.role}>{r.display}</option>)}
                    </select>
                </div>

                {/* Submit button moved to the end of the form block */}
                <div className="pt-2">
                    <button 
                        onClick={handleAddUserSubmit} 
                        // 🔑 Removed shadow-md
                        className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90`} 
                        style={{ backgroundColor: COLOR_PRIMARY }}
                    >
                        <FiSave className="mr-2 inline-block" /> Finalize & Add User
                    </button>
                </div>
            </div>
        )}

        {/* User Table */}
        {/* 🔑 Removed overflow-x-auto border border-gray-200 rounded-lg shadow-sm */}
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className={COLOR_SURFACE_SUBTLE}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className={`${COLOR_SURFACE_DEFAULT} divide-y divide-gray-200`}>
                    {userList.length === 0 && !loadingUsers ? (
                         <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                No users found or you do not have permission to view.
                            </td>
                         </tr>
                    ) : (
                        userList.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={u.role}
                                        onChange={e => handleRoleChange(u._id, e.target.value)}
                                        className="border p-2 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500"
                                        disabled={u._id === currentUser._id}
                                    >
                                        {USER_ROLES_DEFINITION.map(r => <option key={r.access} value={r.role}>{r.display}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {u._id !== currentUser._id ? (
                                        <button 
                                            onClick={() => handleUserDelete(u._id)} 
                                            className="text-red-600 hover:text-red-800 ml-4 p-2 transition-colors rounded-full hover:bg-red-100"
                                            title="Delete User"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 text-xs italic">Current User</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Main Component ---
const Settings = () => {
    const { user: currentUser } = useContext(AuthContext);
    const isSuperAdmin = currentUser?.role === 'super_admin';

    const [userList, setUserList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [addingUser, setAddingUser] = useState(false);

    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        role: USER_ROLES_DEFINITION[0].role
    });

    // 🔑 NEW STATE FOR THE ADMIN-SET PASSWORD
    const [newUserPassword, setNewUserPassword] = useState(''); 

    const [newName, setNewName] = useState(currentUser?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Fetch all users (Super Admin only)
    // ... (fetchUsers and useEffect remain unchanged)

    const fetchUsers = async () => {
        if (!isSuperAdmin) return;
        setLoadingUsers(true);
        try {
            const { data: users = [] } = await authApi.getAllUsers();
            setUserList(users);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to fetch users.');
        }
        setLoadingUsers(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [isSuperAdmin]);

    // --- Handlers ---
    // ... (handleNameUpdate and handlePasswordChange remain unchanged)

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        try {
            await authApi.updateProfile({ name: newName });
            alert('Name updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update name.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return alert('Passwords do not match.');
        if (newPassword.length < 8) return alert('Password must be at least 8 characters.');
        try {
            await authApi.changePassword(currentPassword, newPassword);
            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to change password.');
        }
    };

    // 🔑 UPDATED handleAddUserSubmit to include password
    const handleAddUserSubmit = async () => {
        // Check for password as well
        if (!newUserData.name || !newUserData.email || !newUserPassword) {
             return alert('Please fill in all fields including the initial password.');
        }
        if (newUserPassword.length < 8) {
            return alert('Initial password must be at least 8 characters.');
        }
        
        try {
            // 🔑 CHANGE: Pass the password as the third argument (you must update authApi.js next)
            const { user } = await authApi.createUser(
                newUserData.name, 
                newUserData.email, 
                newUserPassword, // <-- New argument
                newUserData.role
            );
            
            setUserList(prev => [...prev, user]);
            
            // Reset state
            setNewUserData({
                name: '',
                email: '',
                role: USER_ROLES_DEFINITION[0].role
            });
            setNewUserPassword(''); // <-- Reset the new password field
            setAddingUser(false);
            
            alert('User added successfully! They can now log in with the initial password you provided.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add user.');
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await authApi.updateUserRole(userId, role);
            setUserList(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role.');
        }
    };

    const handleUserDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await authApi.deleteUser(userId);
            setUserList(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    if (!currentUser) return <div className="p-6">Loading...</div>;

    return (
        <div className={`${COLOR_SURFACE_LIGHT} min-h-screen`}>
            

            <PersonalSettings
                newName={newName}
                setNewName={setNewName}
                handleNameUpdate={handleNameUpdate}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handlePasswordChange={handlePasswordChange}
            />

            {isSuperAdmin ? (
                <AdminSettings
                    currentUser={currentUser}
                    userList={userList}
                    loadingUsers={loadingUsers}
                    addingUser={addingUser}
                    setAddingUser={setAddingUser}
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    // 🔑 PASS NEW PASSWORD STATE TO ADMINSETTINGS
                    newUserPassword={newUserPassword} 
                    setNewUserPassword={setNewUserPassword}
                    handleAddUserSubmit={handleAddUserSubmit}
                    handleRoleChange={handleRoleChange}
                    handleUserDelete={handleUserDelete}
                />
            ) : (
                <div className=" p-4 rounded-lg flex items-center  mt-6">
                    <FiLock className="mr-3 text-yellow-700" size={24} />
                    <p className="text-yellow-800 font-medium">Admin settings only accessible by Super Admin.</p>
                </div>
            )}
        </div>
    );
};

export default Settings;