import apiClient from './apiClient';
export const uploadCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/api/import-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('CSV uploaded successfully:', response.data);
    return {
      ok: true,
      message: 'CSV uploaded successfully',
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error uploading CSV:', error);
    return {
      ok: false,
      message: 'Failed to upload CSV',
      error: error.response ? error.response.data : 'Network error',
    };
  }
};
