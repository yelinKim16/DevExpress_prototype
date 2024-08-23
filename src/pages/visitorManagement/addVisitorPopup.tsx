import React, { PropsWithChildren, useCallback, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import "./addVisitorPopup.scss";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  SimpleItem,
} from "devextreme-react/cjs/form";
import { ValidationGroupRef } from "devextreme-react/validation-group";
import notify from "devextreme/ui/notify";
import { postVisitorManagement } from "../../api/visitorManagement";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { createStore } from "devextreme-aspnet-data-nojquery";

type PopupProps = {
  title: string;
  visible: boolean;
  width?: number;
  height?: number | string;
  wrapperAttr?: { class: string };
  isSaveDisabled?: boolean;
  setVisible: (visible: boolean) => void;
  onSave?: () => void;
};

export const AddVisitorPopup = ({
  title,
  visible,
  width = 900,
  height = "auto",
  onSave,
  setVisible,

  wrapperAttr = { class: "" },
  isSaveDisabled = false,
}: PropsWithChildren<PopupProps>) => {
  const validationGroup = useRef<ValidationGroupRef>(null); //유효성 검사

  const close = () => {
    validationGroup.current?.instance().reset(); //폼초기화
    setVisible(false);
  };

  const url = "http://localhost:3001/comments";

  const dataSource = createStore({
    key: "id",
    loadUrl: url,
    insertUrl: url,
  });

  const positionOptions = {
    items: dataSource,
    value: "",
  };

  const handleSubmit = useCallback((e: { preventDefault: () => void }) => {
    notify(
      {
        message: "생성되었습니다.",
        position: {
          my: "center top",
          at: "right top",
        },
      },
      "success",
      3000
    );
    e.preventDefault();
  }, []);

  return (
    <Popup
      title={title}
      visible={visible}
      width={width}
      enableBodyScroll={true}
      hideOnOutsideClick={true} // 외부 클릭할 시 창 꺼짐
      resizeEnabled={true}
      // maxHeight={700}
      // onInitialized
      wrapperAttr={{
        ...wrapperAttr,
        class: `${wrapperAttr?.class} form-popup`,
      }}
      height={height}
      onHiding={() => setVisible(false)} // 팝업이 닫힐 때 호출
      showCloseButton={true} // 닫기 버튼 표시
    >
      <div id="app-container">
        <form action="/visitManagements" method="post" onSubmit={handleSubmit}>
          <Form id="form" labelLocation="top" showColonAfterLabel={false}>
            <GroupItem>
              <GroupItem>
                <GroupItem caption="방문자 정보" colCount={2}>
                  <SimpleItem
                    dataField="vistorName"
                    label={{ text: "방문자 이름" }}
                    isRequired={true}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="vistorCompany"
                    label={{ text: "방문자 회사" }}
                    isRequired={true}
                    editorOptions={{ height: 35 }}
                  />
                </GroupItem>
                <GroupItem colCount={2}>
                  <SimpleItem
                    dataField="visitorNumber"
                    label={{ text: "연락처" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitorDepartment"
                    label={{ text: "방문자 부서" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitorPosition"
                    label={{ text: "방문자 직급" }}
                    editorOptions={{ height: 35 }}
                  />
                  <ButtonItem
                    horizontalAlignment="center"
                    cssClass="scan-button"
                  >
                    <ButtonOptions text="스캐너" />
                  </ButtonItem>
                </GroupItem>
              </GroupItem>
              <GroupItem>
                <GroupItem
                  caption="담당자 정보"
                  name="HomeAddress"
                  colCount={2}
                >
                  <SimpleItem
                    dataField="contactName"
                    label={{ text: "담당자 이름" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="contactNumber"
                    label={{ text: "사원번호" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="contactCompany"
                    label={{ text: "담당자 회사" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="contactDepartment"
                    label={{ text: "담당자 부서" }}
                    editorType="dxSelectBox"
                    editorOptions={positionOptions}
                  />
                </GroupItem>
              </GroupItem>
              <GroupItem>
                <GroupItem caption="방문 정보" name="HomeAddress" colCount={2}>
                  <SimpleItem
                    dataField="cardName"
                    label={{ text: "카드 명칭" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitLocation"
                    label={{ text: "방문위치" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitPurpose"
                    label={{ text: "방문목적" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitWorkPlace"
                    label={{ text: "사업장" }}
                    editorType="dxSelectBox"
                    editorOptions={positionOptions}
                  />
                </GroupItem>
              </GroupItem>
              <ButtonItem horizontalAlignment="right">
                <ButtonOptions text="저장" useSubmitBehavior={true} />
              </ButtonItem>
            </GroupItem>
          </Form>
        </form>
      </div>
    </Popup>
  );
};

{
  /* <SimpleItem
dataField="vistor name"
label={{ text: "방문자 이름" }}
isRequired={true}
editorOptions={{ height: 35 }}
/> */
}

{
  /* <GroupItem>
<GroupItem>
  <GroupItem caption="방문자 정보" colCount={2}>
    <SimpleItem
      dataField="vistorName"
      label={{ text: "방문자 이름" }}
      isRequired={true}
      editorOptions={{ height: 35 }}
    />
    <SimpleItem
      dataField="vistorCompany"
      label={{ text: "회사" }}
      isRequired={true}
      editorOptions={{ height: 35 }}
    />
  </GroupItem>
  <GroupItem colCount={2}>
    <SimpleItem
      dataField="contactNumber"
      editorOptions={{ height: 35 }}
    />
    <SimpleItem
      dataField="contactName"
      editorOptions={{ height: 35 }}
    />
    <SimpleItem
      dataField="contactCompany"
      editorOptions={{ height: 35 }}
    />
  </GroupItem>
</GroupItem>
<GroupItem>
  <GroupItem caption="담당자 정보" name="HomeAddress">
    <SimpleItem
      dataField="visitPurpose"
      editorOptions={{ height: 35 }}
    />
    <SimpleItem
      dataField="visitStatus"
      editorOptions={{ height: 35 }}
    />
    <SimpleItem
      dataField="visitLocation"
      editorOptions={{ height: 35 }}
    />
  </GroupItem>
</GroupItem>
</GroupItem> */
}
