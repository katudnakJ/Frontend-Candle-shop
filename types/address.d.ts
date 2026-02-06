declare module 'react-thailand-address-autocomplete' {
  import { ReactNode, ComponentType, ChangeEvent } from 'react';

  export interface AddressData {
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
  }

  interface ThailandAddressProps {
    onSelect: (address: AddressData) => void;
    showSelected?: boolean;
    children?: ReactNode;
    value?: string;
    // เปลี่ยนจาก any เป็น ChangeEvent ของ HTMLInputElement
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  }

  // สร้าง Interface สำหรับตัวลูกๆ เพื่อเลี่ยงการใช้ any
  interface ChildInputProps {
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  }

  const ThailandAddressTypeahead: ComponentType<ThailandAddressProps> & {
    Subdistrict: ComponentType<ChildInputProps>;
    District: ComponentType<ChildInputProps>;
    Province: ComponentType<ChildInputProps>;
    PostalCode: ComponentType<ChildInputProps>;
  };

  export default ThailandAddressTypeahead;
}