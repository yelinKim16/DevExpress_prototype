import React from "react";
import {
  Form,
  SimpleItem,
  GroupItem,
  TabbedItem,
  Tab,
  TabPanelOptions,
} from "devextreme-react/form"; // 올바르게 Form 관련 컴포넌트 임포트

const employee = {
  name: "John Heart",
  position: "CEO",
  hireDate: new Date(2012, 4, 13),
  officeNumber: 901,
  phone: "+1(213) 555-9392",
  skype: "jheart_DX_skype",
  email: "jheart@dx-email.com",
  notes: "John has been in the Audio/Video industry since 1990.",
};

const VisitorManagementEdit = () => {
  return (
    <Form formData={employee} colCount={2}>
      <GroupItem caption="Employee">
        <SimpleItem dataField="name" />
        <SimpleItem dataField="position" />
        <SimpleItem dataField="hireDate" />
        <SimpleItem dataField="officeNumber" />
      </GroupItem>
      <GroupItem caption="Personal Information">
        <TabbedItem>
          <TabPanelOptions height={260} />
          <Tab title="Contacts">
            <SimpleItem dataField="phone" />
            <SimpleItem dataField="skype" />
            <SimpleItem dataField="email" />
          </Tab>
          <Tab title="Note">
            <SimpleItem dataField="notes" />
          </Tab>
        </TabbedItem>
      </GroupItem>
    </Form>
  );
};

export default VisitorManagementEdit;
