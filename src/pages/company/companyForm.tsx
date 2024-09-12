import React from "react";
import Form, { Item, GroupItem, Label } from "devextreme-react/form";

interface CompanyFormProps {
  formData:
    | {
        ID: number;
        FirstName: string;
        LastName: string;
        Age: number;
      }
    | undefined;
  validationGroupName: string;
  confirmBtnOptions: {
    text: string;
    type: string;
    onClick: () => void;
  };
  cancelBtnOptions: {
    text: string;
    onClick: () => void;
  };
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  validationGroupName,
}) => {
  return (
    <React.Fragment>
      <Form validationGroup={validationGroupName} formData={formData}>
        <GroupItem colCount={2}>
          <Item dataField="my_cd">
            <Label text="회사 코드" />
          </Item>
          <Item dataField="my_nm">
            <Label text="회사 명칭" />
          </Item>
          <Item dataField="type">
            <Label text="타입" />
          </Item>
          <Item dataField="sites">
            <Label text="사이트" />
          </Item>
        </GroupItem>
      </Form>
    </React.Fragment>
  );
};

export default CompanyForm;
