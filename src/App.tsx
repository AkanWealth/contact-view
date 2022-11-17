import './App.css';
import 'antd/dist/antd.css';
import { IContact } from './types';
import { FormEvent, useState } from 'react';
import UploadFile from './components/Upload';
import ContactList from './components/Filter';
import { Button, Input, Modal, Form, Select } from 'antd';
import { addContact, deleteBulk, getContacts, getSingleContact, updateContact } from './server/service';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;

const { Option } = Select;

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Contact />
      <ToastContainer />
    </QueryClientProvider>
  );
}

const Contact = () => {
  const [contactId, setContactId] = useState('');
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string[]>([])
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['singleContact', contactId],
    () => getSingleContact(contactId),
    { enabled: !!contactId }
  );
  const { data:allContact, isLoading:allContactLoading } = useQuery('contacts', getContacts);

  const { mutate, isLoading: uploadLoading } = useMutation(addContact);

  const { mutate: UpdateMutate, isLoading: updateLoading } =
    useMutation(updateContact);

  const { mutate: deleteMutate, isLoading: deleteLoading } =
    useMutation(deleteBulk);

  const onSearch = (value: string) => {
    setInputText(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showDeleteModal = () => {
    setIsShowDeleteModal(true);
  };

  const handleOk = () => {
    deleteMutate(selectedContact, {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts');
      },
    }),
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
    setIsShowDeleteModal(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
    setIsShowDeleteModal(false)
  };

  const onFinish = (values: IContact) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts');
        window.location.reload()
      },
    });
  };

  const onUpdate = (e: any) => {
    const payload = {
      contactName: e.target['contactName'].value,
      phoneNumber: e.target['phoneNumber'].value,
      contactId,
    };
    UpdateMutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts');
      },
    });
    setIsModalOpenUpdate(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const openUpdate = (id: string) => {
    setContactId(id);
    setIsModalOpenUpdate(true);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedContact(prev => [...prev, value])
    
  };

  return (
    <>
      <div className="p-20">
        <h1 className="text-5xl">Contact List</h1>
        <div className="my-5 flex justify-center gap-5">
          <Button type="primary" onClick={showModal}>
            Add Contact
          </Button>
          <UploadFile placeholder={'Click for bulk upload'} />
          <UploadFile placeholder={'Click for bulk update'} />
          <Button type="ghost" onClick={showDeleteModal} className="text-white">Click to delete in bulk</Button>
        </div>
        <div className="">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
          <ContactList input={inputText} openModal={openUpdate} />
        </div>
      </div>
      {/* Add Contact */}
      <Modal
        title="Add Contact"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="contactName"
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input your phone number' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleOk}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Bulk delete */}
      {isShowDeleteModal ? (
        <Modal
          title="Delete Contacts"
          open={isShowDeleteModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select contacts"
            // defaultValue={['']}
            onChange={handleChange}
            optionLabelProp="label"
          >
            {allContact?.data?.map((contact: any) => (
              // <option value={option.value}>{option.label}</option>
            <Option value={contact.phoneNumber} label={contact.phoneNumber}>
              <div className="demo-option-label-item">
                {contact.contactName} {contact.phoneNumber}
              </div>
            </Option>
            ))}
          </Select>
        </Modal>
      ) : null}
      {/* Update Contact */}
      {isModalOpenUpdate ? (
        <Modal
          title="Update Contact"
          open={isModalOpenUpdate}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <form autoComplete="off" onSubmit={onUpdate}>
            <div className="flex justify-center gap-8">
              <input
                name="contactName"
                defaultValue={data?.contact?.contactName}
              />
              <input
                name="phoneNumber"
                defaultValue={data?.contact?.phoneNumber}
                className="border-spacing-x-8 border-cyan-500"
              />
            </div>
            <div className="mt-10 flex justify-center">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
};
