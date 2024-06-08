import {
  DatePicker,
  FormInstance,
  Input,
  Select,
  Upload,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { emailRegex, idCardRegex, phoneNumberRegex } from "@utils/constants";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { disableFutureDates, disablePastDates } from "@utils/helpers";
import linkedAccountService from "@services/linkedAccount";
import { BankType } from "@models/linkedAccount";

interface FourStageCreate {
  formLinkedAccountRef: any;
  formLinkedAccount: FormInstance;
  data?: any;
  selectedBank?: BankType;
  setSelectedBank: React.Dispatch<React.SetStateAction<BankType | undefined>>;
}

const FourStageCreate: React.FC<FourStageCreate> = (props) => {
  const {
    formLinkedAccountRef,
    formLinkedAccount,
    data,
    selectedBank,
    setSelectedBank,
  } = props;
  const [maxLength, setMaxLength] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dataBankList, setDataBankList] = useState<BankType[]>([]);
  const [bankName, setBankName] = useState<string>("");

  const handleChangePhoneNumber = (e) => {
    const value = e.target.value;
  };

  const getAllBankInfo = async () => {
    setLoading(true);
    await linkedAccountService
      .getAllBankInfo()
      .then((res) => {
        console.log("bank: ", res);
        setDataBankList(res.data);
        setLoading(false);
      })
      .catch((errors) => {
        console.log("errors get all bank", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBankInfo();
  }, []);

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <Form
        ref={formLinkedAccountRef}
        form={formLinkedAccount}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%" }}
        layout="vertical"
      >
        <div className="grid grid-cols-2 ">
          {/* AccountNumber */}
          <Form.Item
            name="accountNumber"
            label="Số tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập số tài khoản" },
              { type: "string" },
              {
                pattern: idCardRegex,
                message: "Số tài khoản không bao gồm kí tự chữ!",
              },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập số tài khoản" className="h-9" />
          </Form.Item>

          <Form.Item
            name="bank"
            label="Ngân hàng"
            rules={[
              { required: true, message: "Vui lòng chọn ngân hàng" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Select
              showSearch
              className="w-52"
              value={bankName}
              onChange={(bankName: string) => {
                const selectedBankObject = dataBankList.find(
                  (bank) => bank.shortName === bankName
                );
                setSelectedBank(selectedBankObject);
              }}
              placeholder="Vui lòng chọn ngân hàng"
            >
              {dataBankList.map((bank, index) => (
                <Select.Option key={bank.id} value={bank.shortName}>
                  <div key={index} className="flex items-center justify-start">
                    <img
                      src={bank.logo}
                      alt={bank.shortName}
                      className="w-10 mr-4"
                    />
                    <span className="mr-4">{bank.shortName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default FourStageCreate;
