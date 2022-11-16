import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';

interface IProps {
  placeholder: string
}
const props: UploadProps = {
  name: 'file',
  action: 'https://contacttask.herokuapp.com/v1/contact/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const UploadFile = ({placeholder}:IProps) => (
  <Upload {...props}>
    <Button className="text-white hover:bg-[#1890ff] hover:text-white" icon={<UploadOutlined />}>{placeholder}</Button>
    {/* <Button onClick={click}>Upload</Button> */}
  </Upload>
);

export default UploadFile;