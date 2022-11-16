import axios, { AxiosError } from 'axios';

interface Iinstance {
    file: boolean;
  }

export const instance = ({ file }: Iinstance) => axios.create({
    baseURL: 'https://contacttask.herokuapp.com/v1',
    timeout: 50000,
    headers: {
        "Content-Type": file ? "multipart/form-data" : "application/json",
        Accept: 'application/json',
    }
});

export const next = (e: AxiosError) => {
    //@ts-ignore
    throw new Error(e?.response?.data ? e.response?.data.message : 'Something went wrong, please try again');
}
