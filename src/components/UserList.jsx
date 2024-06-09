// src/UserList.js
import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editUser) {
      // Edit existing user
      const updatedUser = { ...editUser, name, email, username, website };
      if (editUser.isNew) {
        // Update local state for new user
        setUsers(users.map(user => (user.id === editUser.id ? updatedUser : user)));
      } else {
        // Update on server for existing user
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
          });

          const data = await response.json();
          setUsers(users.map(user => (user.id === editUser.id ? data : user)));
        } catch (error) {
          console.error('Error updating user:', error);
        }
      }
      setEditUser(null);
      setName('');
      setEmail('');
      setUsername('');
      setWebsite('');
    } else {
      // Add new user
      const newUser = { id: Date.now(), name, email, username, website, isNew: true };
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        const data = await response.json();
        // Override the response ID with a local temporary ID
        setUsers([...users, { ...data, id: newUser.id, isNew: true }]);
        setName('');
        setEmail('');
        setUsername('');
        setWebsite('');
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setUsername(user.username);
    setWebsite(user.website);
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center">CRUD using JSONPlaceholder</h1>
      <h2 className="text-3xl font-bold mb-4 text-center">Register User</h2>
      <p className="text-center">
        JSONPlaceholder is a free online REST API that you can use whenever you need some fake data. 
      </p>
      
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-2">
          <label className="block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-2">
          <label className="block">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-2">
          <label className="block">Website:</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {editUser ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Website</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.website}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
