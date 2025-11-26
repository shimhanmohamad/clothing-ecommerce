import api from './api';

export const utilsService = {
  /**
   * Upload file to server
   */
  uploadFile: (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }).then(res => res.data);
  },

  /**
   * Get app configuration
   */
  getConfig: () => 
    api.get('/config').then(res => res.data),

  /**
   * Health check
   */
  healthCheck: () => 
    api.get('/health').then(res => res.data),

  /**
   * Contact form submission
   */
  contactSupport: (contactData) => 
    api.post('/contact', contactData).then(res => res.data)
};