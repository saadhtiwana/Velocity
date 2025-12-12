export const uploadToImageKit = async (file) => {
  try {
    // Get authentication parameters from backend
    const authResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/imagekit/auth`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!authResponse.ok) {
      throw new Error('Failed to get ImageKit authentication');
    }

    const authData = await authResponse.json();

    // Create form data for ImageKit upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('folder', '/velocity/cars/');
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authData.signature);
    formData.append('expire', authData.expire);
    formData.append('token', authData.token);

    // Upload to ImageKit
    const uploadResponse = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to ImageKit');
    }

    const uploadData = await uploadResponse.json();
    return uploadData.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};
