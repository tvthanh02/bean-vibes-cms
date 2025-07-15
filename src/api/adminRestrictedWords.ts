// MOCK DATA
let words = [
  { id: 'w1', word: 'cấm1', type: 'review' },
  { id: 'w2', word: 'cấm2', type: 'comment' },
  { id: 'w3', word: 'cấm3', type: 'cafe' },
];

export const getRestrictedWords = async (type?: string) => {
  let data = words;
  if (type) data = data.filter((w) => w.type === type);
  return Promise.resolve({ data });
};
export const addRestrictedWord = async (data: any) => {
  words.push({ id: Date.now() + '', ...data });
  return Promise.resolve();
};
export const updateRestrictedWord = async (id: string, data: any) => {
  words = words.map(w => w.id === id ? { ...w, ...data } : w);
  return Promise.resolve();
};
export const deleteRestrictedWord = async (id: string) => {
  words = words.filter(w => w.id !== id);
  return Promise.resolve();
}; 