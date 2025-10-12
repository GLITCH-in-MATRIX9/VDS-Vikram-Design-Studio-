import React, { useState } from 'react';
import { FiUser, FiKey, FiShield, FiUsers, FiLock, FiEdit, FiTrash2, FiSave, FiAlertCircle, FiPlus } from 'react-icons/fi';

// --- Color Constants based on the Provided Palette ---
// Your color definitions are now strictly enforced:

// Primary Action Color (Maroon/Dark Red-Brown - based on 'Darker' Border)
const COLOR_PRIMARY = '#722F37';
const COLOR_PRIMARY_HOVER = '#632932'; 

// Surface Colors
const COLOR_SURFACE_LIGHT = 'bg-[#F5F1EE]'; // Background: Light
const COLOR_SURFACE_DEFAULT = 'bg-white';   // Surface: Default
const COLOR_SURFACE_SUBTLE = 'bg-[#F5F1EE]'; // Surface: Subtle (using Light background for texture)
const COLOR_SURFACE_DISABLED = 'bg-[#E0E0E0]'; // Surface: Disabled (Grey)
const COLOR_SURFACE_SECONDARY = '#F08080'; // Surface: Secondary (Light Red/Coral)

// Text Colors
const COLOR_TEXT_TITLE = 'text-[#4A4A4A]'; // Text/Icon: Title (Dark Grey)
const COLOR_TEXT_BODY = 'text-[#454545]';  // Text/Icon: Body (Medium Grey)
const COLOR_TEXT_PRIMARY = 'text-[#722F37]'; // Text/Icon: Primary (Maroon)

// --- Mock Data and Constants ---

const MOCK_CURRENT_USER = {
    id: 'u1',
    name: 'Namman Shroff',
    email: 'namman@company.com',
    role: 'Super Admin', 
};

const USER_ROLES_DEFINITION = [
    { role: 'Super Admin', access: '1', who: 'Cofounders and Directors only - 3 of them - Namman, Vikramm, and Pooza', responsibilities: 'Editing and managing content across the website. Access to Job portal and hiring process.' },
    { role: 'HR - Hiring', access: '2.1', who: 'Not co-founders; only HR - and those involved in hiring', responsibilities: 'Overlooking the hiring process and managing open positions, existing candidates, and test content received.' },
    { role: 'Project Content Managers', access: '2.2', who: 'Team members assigned to manage and update projects on the website only', responsibilities: 'Add, remove, update project information on the admin dashboard, in the pre-decided format.' },
];

const MOCK_USER_LIST = [
    { id: 'u1', name: 'Namman Shroff', email: 'namman@company.com', role: 'Super Admin', status: 'Active' },
    { id: 'u2', name: 'Vikramm B Shroff', email: 'vikramm@company.com', role: 'Super Admin', status: 'Active' }, 
    { id: 'u3', name: 'Pooza Agarwal', email: 'pooza@company.com', role: 'Super Admin', status: 'Active' },
    { id: 'u4', name: 'Rajesh Sharma', email: 'rajesh@company.com', role: 'Project Content Managers', status: 'Active' },
    { id: 'u5', name: 'Anjali Menon', email: 'anjali@company.com', role: 'HR - Hiring', status: 'Active' },
];


const Settings = () => {
    const [user] = useState(MOCK_CURRENT_USER);
    const [userList, setUserList] = useState(MOCK_USER_LIST);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newName, setNewName] = useState(user.name);
    
    const isSuperAdmin = user.role === 'Super Admin';

    // --- Placeholder API Handlers ---

    const handleNameUpdate = (e) => {
        e.preventDefault();
        console.log('Updating Name to:', newName);
        alert(`Name updated to ${newName}! (Simulated)`);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 8) {
             alert("Password must be at least 8 characters long.");
            return;
        }
        console.log('Changing password with old:', currentPassword, 'new:', newPassword);
        alert("Password change initiated! (Simulated)");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };
    
    const handleRoleChange = (userId, newRole) => {
        const updatedList = userList.map(u => 
            u.id === userId ? { ...u, role: newRole } : u
        );
        setUserList(updatedList);
        console.log(`Role for user ${userId} updated to ${newRole}`);
    };

    const handleUserDelete = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        const updatedList = userList.filter(u => u.id !== userId);
        setUserList(updatedList);
        console.log(`User ${userId} deleted.`);
    };

    const handleAddUser = () => {
        alert("New User Modal: Enter Name, Email, and initial Role. (Simulated)");
    };
    
    const handleEnable2FA = () => {
        alert("2FA Setup flow initiated! (Simulated)");
    };

    // --- Component Section Rendering ---

    const renderHeader = (icon, title) => (
        <h2 className={`flex items-center text-2xl font-semibold ${COLOR_TEXT_TITLE} mb-4 border-b border-gray-200 pb-2`}>
            {React.createElement(icon, { className: `mr-2 ${COLOR_TEXT_PRIMARY}` })} {title}
        </h2>
    );

    const PersonalSettings = () => (
        <div className={`${COLOR_SURFACE_DEFAULT} p-6 rounded-lg shadow-md space-y-8`}>
            {/* 1. Change Name/Profile Info */}
            <div>
                {renderHeader(FiUser, "Profile Information")}
                <form onSubmit={handleNameUpdate} className="space-y-4">
                    <label className={`block ${COLOR_TEXT_BODY}`}>Display Name</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        // Consistent border and focus style using Primary color
                        className={`p-3 border border-gray-300 rounded-lg w-full max-w-md focus:ring-1 focus:ring-offset-1 focus:ring-[${COLOR_PRIMARY}] focus:border-[${COLOR_PRIMARY}]`}
                        required
                    />
                    <button
                        type="submit"
                        style={{ backgroundColor: COLOR_PRIMARY }}
                        className={`flex items-center px-4 py-2 text-white rounded-md hover:bg-[${COLOR_PRIMARY_HOVER}] transition`}
                    >
                        <FiSave className="mr-2" /> Save Changes
                    </button>
                </form>
            </div>
            
            {/* 2. Change Password */}
            <div>
                {renderHeader(FiKey, "Change Password")}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`p-3 border border-gray-300 rounded-lg w-full max-w-md focus:ring-1 focus:ring-offset-1 focus:ring-[${COLOR_PRIMARY}] focus:border-[${COLOR_PRIMARY}]`}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`p-3 border border-gray-300 rounded-lg w-full max-w-md focus:ring-1 focus:ring-offset-1 focus:ring-[${COLOR_PRIMARY}] focus:border-[${COLOR_PRIMARY}]`}
                        required
                        minLength={8}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`p-3 border border-gray-300 rounded-lg w-full max-w-md focus:ring-1 focus:ring-offset-1 focus:ring-[${COLOR_PRIMARY}] focus:border-[${COLOR_PRIMARY}]`}
                        required
                    />
                    <button
                        type="submit"
                        // Use the Secondary Surface color for a slightly less prominent action
                        style={{ backgroundColor: COLOR_SURFACE_SECONDARY }}
                        className={`flex items-center px-4 py-2 text-white rounded-md hover:opacity-90 transition`}
                    >
                        <FiEdit className="mr-2" /> Update Password
                    </button>
                </form>
            </div>
            
            {/* 3. Two-Factor Authentication (2FA) Setup */}
            <div>
                {renderHeader(FiShield, "Two-Factor Authentication (2FA)")}
                <p className={`text-sm ${COLOR_TEXT_BODY} mb-4`}>
                    Enable two-factor authentication for an extra layer of security on your account.
                </p>
                <button
                    onClick={handleEnable2FA}
                    // Use a Neutral/Title color for security button (e.g., #4A4A4A)
                    style={{ backgroundColor: '#4A4A4A' }} 
                    className={`flex items-center px-4 py-2 text-white rounded-md hover:bg-[#3A3A3A] transition text-sm`}
                >
                    <FiLock className="mr-2" /> Enable 2FA
                </button>
            </div>
        </div>
    );
    
    const AdminSettings = () => (
        <div className={`${COLOR_SURFACE_DEFAULT} p-6 rounded-lg shadow-md mt-8 space-y-10`}>
            {renderHeader(FiUsers, "Admin: User & Role Management")}

            {/* 1. User List & Role Editor */}
            <div className="overflow-x-auto">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddUser}
                        style={{ backgroundColor: COLOR_PRIMARY }}
                        className={`flex items-center px-4 py-2 text-white rounded-md hover:bg-[${COLOR_PRIMARY_HOVER}] transition text-sm`}
                    >
                        <FiPlus className="mr-2" /> Add New User
                    </button>
                </div>

                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className={COLOR_SURFACE_SUBTLE}>
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-bold ${COLOR_TEXT_BODY} uppercase tracking-wider`}>User</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold ${COLOR_TEXT_BODY} uppercase tracking-wider`}>Email</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold ${COLOR_TEXT_BODY} uppercase tracking-wider`}>Role (Access)</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold ${COLOR_TEXT_BODY} uppercase tracking-wider`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`${COLOR_SURFACE_DEFAULT} divide-y divide-gray-200`}>
                        {userList.map((u) => (
                            <tr key={u.id} className={u.id === user.id ? 'bg-gray-50' : ''}> {/* Neutral highlight for current user */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className={`border p-1 rounded-md text-sm bg-white ${COLOR_TEXT_BODY}`}
                                        disabled={u.id === user.id} // Cannot change your own role
                                    >
                                        {USER_ROLES_DEFINITION.map((role) => (
                                            <option key={role.access} value={role.role}>
                                                {role.role} (Level {role.access})
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {u.id !== user.id ? (
                                        <button
                                            onClick={() => handleUserDelete(u.id)}
                                            className="text-red-600 hover:text-red-800 ml-4 p-1"
                                            title="Delete User"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 text-xs italic">Current User</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 2. Role/Access Level Definitions (Reference) */}
            <div className='mt-10'>
                {renderHeader(FiLock, "Access Level Definitions")}
                <div className="text-sm text-gray-700 mb-4 flex items-center p-2 bg-yellow-100 border border-yellow-300 rounded">
                    <FiAlertCircle className="mr-2 text-yellow-700" />
                    Reference: This table summarizes the rules defined for each access level.
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead style={{ backgroundColor: '#F1E4DF' }} className={`${COLOR_TEXT_PRIMARY}`}>
                            <tr>
                                {['Role', 'Access Level', 'Who?', 'Responsibilities'].map((h) => (
                                    <th key={h} className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`${COLOR_SURFACE_DEFAULT} divide-y divide-gray-200`}>
                            {USER_ROLES_DEFINITION.map((def) => (
                                <tr key={def.access}>
                                    <td className="px-4 py-2 whitespace-nowrap font-medium text-sm">{def.role}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{def.access}</td>
                                    <td className="px-4 py-2 text-sm">{def.who}</td>
                                    <td className="px-4 py-2 text-sm">{def.responsibilities}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* 3. Log Activity View - Simple Placeholder */}
            <div className='mt-10'>
                {renderHeader(FiShield, "Recent Admin Activity Log")}
                <ul className={`text-sm ${COLOR_TEXT_BODY} ${COLOR_SURFACE_SUBTLE} p-4 rounded-lg`}>
                    <li>[2025-10-12 10:00] Namman changed Raj's role to Project Content Managers.</li>
                    <li>[2025-10-11 15:30] Pooza updated Company Name field.</li>
                    <li>[2025-10-10 09:15] Vikramm enabled 2FA on his account.</li>
                </ul>
            </div>
        </div>
    );


    return (
        <div className={`p-6 ${COLOR_SURFACE_LIGHT} min-h-screen`}>
            <h1 className={`text-3xl font-bold ${COLOR_TEXT_TITLE} mb-6`}>Account & System Settings</h1>

            {/* Personal Settings Section */}
            <PersonalSettings />

            <div className="mt-8">
                {/* Admin Settings Section - Only visible to Super Admin */}
                {isSuperAdmin ? (
                    <AdminSettings />
                ) : (
                    <div className="bg-yellow-100 p-4 rounded-lg flex items-center border border-yellow-300">
                        <FiLock className="mr-3 text-yellow-700" size={24} />
                        <p className="text-yellow-800 font-medium">
                            Administrative settings are only accessible by Super Admin (Access Level 1).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;