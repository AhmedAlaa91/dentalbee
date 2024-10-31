import createAxiosInstance from '../axios/axiosInstance';

export const fetchProfileApi = async (userId,body) => {
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.get(`/get/user/${userId}`);
  };