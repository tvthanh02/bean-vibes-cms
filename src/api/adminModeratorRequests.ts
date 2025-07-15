// MOCK DATA cho moderator requests
const mockRequests = [
  { id: '1', username: 'mod1', email: 'mod1@email.com', status: 'pending' },
  { id: '2', username: 'mod2', email: 'mod2@email.com', status: 'pending' },
  { id: '3', username: 'mod3', email: 'mod3@email.com', status: 'rejected' },
];

export const getModeratorRequests = async () => {
  return Promise.resolve({ data: mockRequests });
};

export const approveModeratorRequest = async (id: string) => {
  const req = mockRequests.find((r) => r.id === id);
  if (req) req.status = 'approved';
  return Promise.resolve({ data: req });
};

export const rejectModeratorRequest = async (id: string) => {
  const req = mockRequests.find((r) => r.id === id);
  if (req) req.status = 'rejected';
  return Promise.resolve({ data: req });
}; 