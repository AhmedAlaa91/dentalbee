import createAxiosInstance from '../axios/axiosInstance';

export const updateProfileApi = async (userId,body) => {
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.put(`/edit/user/${userId}`, {
      ...body,
    });
  };