// MOCK DATA
let reportReviews = [
  { id: 'rr1', reviewId: 'rv1', reason: 'Spam', status: 'pending' },
  { id: 'rr2', reviewId: 'rv2', reason: 'Nội dung không phù hợp', status: 'pending' },
];

export const getReportReviews = async () => Promise.resolve({ data: Array.isArray(reportReviews) ? reportReviews : [] });
export const resolveReportReview = async (id: string) => {
  reportReviews = reportReviews.map(r => r.id === id ? { ...r, status: 'resolved' } : r);
  return Promise.resolve();
}; 