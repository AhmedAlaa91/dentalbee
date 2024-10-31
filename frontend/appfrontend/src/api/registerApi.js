import createAxiosInstance from '../axios/axiosInstance';

export const registerNewUser = async (body) => {
    const axiosInstance = await createAxiosInstance();
    console.log('registerNewUser');
    return axiosInstance.post('/auth/register/', {
      ...body,
    });
  };