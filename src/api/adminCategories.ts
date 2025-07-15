// MOCK DATA
let regions = [ { id: 'r1', name: 'Ba Đình' }, { id: 'r2', name: 'Hoàn Kiếm' } ];
let styles = [ { id: 's1', name: 'Vintage' }, { id: 's2', name: 'Modern' } ];
let services = [ { id: 'sv1', name: 'Wifi' }, { id: 'sv2', name: 'Điều hòa' } ];
let purposes = [ { id: 'p1', name: 'Học tập' }, { id: 'p2', name: 'Hẹn hò' } ];

export const getRegions = async () => Promise.resolve({ data: regions });
export const addRegion = async (data: any) => { regions.push({ id: Date.now() + '', ...data }); return Promise.resolve(); };
export const updateRegion = async (id: string, data: any) => { regions = regions.map(r => r.id === id ? { ...r, ...data } : r); return Promise.resolve(); };
export const deleteRegion = async (id: string) => { regions = regions.filter(r => r.id !== id); return Promise.resolve(); };

export const getStyles = async () => Promise.resolve({ data: styles });
export const addStyle = async (data: any) => { styles.push({ id: Date.now() + '', ...data }); return Promise.resolve(); };
export const updateStyle = async (id: string, data: any) => { styles = styles.map(r => r.id === id ? { ...r, ...data } : r); return Promise.resolve(); };
export const deleteStyle = async (id: string) => { styles = styles.filter(r => r.id !== id); return Promise.resolve(); };

export const getServices = async () => Promise.resolve({ data: services });
export const addService = async (data: any) => { services.push({ id: Date.now() + '', ...data }); return Promise.resolve(); };
export const updateService = async (id: string, data: any) => { services = services.map(r => r.id === id ? { ...r, ...data } : r); return Promise.resolve(); };
export const deleteService = async (id: string) => { services = services.filter(r => r.id !== id); return Promise.resolve(); };

export const getPurposes = async () => Promise.resolve({ data: purposes });
export const addPurpose = async (data: any) => { purposes.push({ id: Date.now() + '', ...data }); return Promise.resolve(); };
export const updatePurpose = async (id: string, data: any) => { purposes = purposes.map(r => r.id === id ? { ...r, ...data } : r); return Promise.resolve(); };
export const deletePurpose = async (id: string) => { purposes = purposes.filter(r => r.id !== id); return Promise.resolve(); }; 