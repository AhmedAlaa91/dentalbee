import createAxiosInstance from '../axios/axiosInstance';

export const loginUser = async (body) => {
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.post('/auth/login/', {
      ...body,
    });
  };