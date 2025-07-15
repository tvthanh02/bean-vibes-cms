// MOCK DATA
let reportComments = [
  { id: 'rc1', commentId: 'c1', reason: 'Chửi tục', status: 'pending' },
  { id: 'rc2', commentId: 'c2', reason: 'Spam', status: 'pending' },
];

export const getReportComments = async () => Promise.resolve({ data: Array.isArray(reportComments) ? reportComments : [] });
export const resolveReportComment = async (id: string) => {
  reportComments = reportComments.map(r => r.id === id ? { ...r, status: 'resolved' } : r);
  return Promise.resolve();
}; 