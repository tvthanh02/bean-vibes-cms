// MOCK DATA cho reports
const mockReports = [
  { id: 'r1', type: 'post', objectId: 'p1', reason: 'Spam', status: 'pending' },
  { id: 'r2', type: 'comment', objectId: 'c1', reason: 'Từ ngữ không phù hợp', status: 'pending' },
  { id: 'r3', type: 'place', objectId: 'pl1', reason: 'Sai thông tin', status: 'resolved' },
];

export const getReports = async (type?: string) => {
  let data = mockReports;
  if (type) data = data.filter((r) => r.type === type);
  return Promise.resolve({ data });
};

export const resolveReport = async (id: string) => {
  const report = mockReports.find((r) => r.id === id);
  if (report) report.status = 'resolved';
  return Promise.resolve({ data: report });
}; 