// MOCK DATA
let users = [
  { id: '1', username: 'admin', email: 'admin@email.com', role: 'admin', isModerator: false },
  { id: '2', username: 'mod', email: 'mod@email.com', role: 'moderator', isModerator: true },
  { id: '3', username: 'user1', email: 'user1@email.com', role: 'user', isModerator: false },
];

export const getAdminUsers = async (params?: any) => {
  return Promise.resolve({ data: users });
};

export const updateAdminUser = async (id: string, data: any) => {
  users = users.map(u => u.id === id ? { ...u, ...data } : u);
  return Promise.resolve();
};

export const removeModerator = async (id: string) => {
  users = users.map(u => u.id === id ? { ...u, isModerator: false } : u);
  return Promise.resolve();
}; 