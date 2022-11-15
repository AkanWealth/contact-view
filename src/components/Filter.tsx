import { Button, Table } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteContact, getContacts } from '../server/service';
import { IContact } from '../types';
import { toast } from "react-toastify";
// import data from "./ListData.json"
interface IProp {
  input: string;
  openModal: (val:string) => void
}

interface DataType {
  key: string;
  contactName: string;
  phoneNumber: string;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'contactName',
    key: 'contactName',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

const ContactList = ({ input,openModal }: IProp) => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery('contacts', getContacts);

  const { mutate:deleteMutate, isLoading: deleteLoading } = useMutation(deleteContact);


  const filteredData = data?.data?.filter((el: any) => {
    if (input === '') {
      return el;
    }
    else {
      return el?.contactName?.toLowerCase().includes(input.toLowerCase());
    }
  });

  const contactDelete = (contactId: string) => {
    deleteMutate(contactId, {
      onSuccess: () =>{
        toast.success("Contact deleted");
        queryClient.invalidateQueries("contacts")
      },
    })
  }
  return (
    <>
      <Table
        className="my-10 sm:mx-20"
        columns={columns}
        bordered
        scroll={{ x: 300, y: 200 }}
        // dataSource={data}
        dataSource={filteredData?.map((val: IContact) => {
          const content = {
            contactName: val.contactName,
            phoneNumber: val.phoneNumber,
            action: (
              <div className="flex justify-around">
                <Button type="primary" size="large" onClick={()=>openModal(val._id)}>
                  Update
                </Button>
                <Button type="primary" size="large" onClick={ ()=> contactDelete(val._id)}>
                  Delete
                </Button>
              </div>
            ),
          };
          return content;
        })}
      />
    </>
  );
};

export default ContactList;
