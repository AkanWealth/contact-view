import { instance, next } from './base';

interface IAddContact {
  contactName: string;
  phoneNumber: string;
  contactId?:string
}

// interface IDelete {
//   phoneNumbers: string[];
// }


export const getContacts = async () => {
  const { data } = await instance({ file: false })
    .get(`/contact`)
    .catch((e) => next(e));
  console.log('data', data);
  return data;
};

export const addContact = async (values: IAddContact) => {
  const { data } = await instance({ file: false })
    .post(`/contact`, values )
    .catch((e) => next(e));
    console.log("values",values)
  return data;
};

export const getSingleContact = async (contactId: string) => {
  const { data } = await instance({ file: false })
    .get(`/contact/${contactId}`)
    .catch((e) => next(e));
    console.log("jj",data)
  return data?.data;
};

export const updateContact = async ({contactId, contactName, phoneNumber}: IAddContact) => {
  const { data } = await instance({ file: false })
    .put(`/contact/${contactId}`, {contactName, phoneNumber})
    .catch((e) => next(e));
  return data?.data;
}

export const deleteContact = async (contactId: string) => {
  const { data } = await instance({ file: false })
    .delete(`/contact/${contactId}`)
    .catch((e) => next(e));
  return data?.data;
}

export const deleteBulk = async(phoneNumbers: string[]) => {
  const { data } = await instance({ file: false })
    .delete(`/contact`, {data: {phoneNumbers}})
    .catch((e) => next(e));
  return data?.data;
}
