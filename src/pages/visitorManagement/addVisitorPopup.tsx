import React, { PropsWithChildren, useCallback, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import "./addVisitorPopup.scss";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  SimpleItem,
} from "devextreme-react/cjs/form";
import { ValidationGroupRef } from "devextreme-react/validation-group";
import swal from "sweetalert";
import axios from "axios";

const departmentEditorOptions = {
  items: ["인사부", "개발부", "영업부"],
  searchEnabled: true, // 선택 항목 검색을 허용하려면 추가
  value: "", // 초기 선택된 값 (선택사항)
};

const workPlaceEditorOptions = {
  items: ["이즈원", "네이버", "카카오"],
  searchEnabled: true,
  value: "",
};

type VisitorFormData = {
  visitorName: string;
  visitorCompany: string;
  visitorNumber: string;
  visitorDepartment: string;
  visitorPosition: string;
  contactName: string;
  contactNumber: string;
  contactCompany: string;
  contactDepartment: string;
  cardName: string;
  visitLocation: string;
  visitPurpose: string;
  visitWorkPlace: string;
};

type PopupProps = {
  title: string;
  visible: boolean;
  width?: number;
  height?: number | string;
  wrapperAttr?: { class: string };
  isSaveDisabled?: boolean;
  setVisible: (visible: boolean) => void;
  onSave?: () => void;
  // formData: VisitorFormData;
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
}: // formData,
PropsWithChildren<PopupProps>) => {
  const validationGroup = useRef<ValidationGroupRef>(null); //유효성 검사

  const url = "http://localhost:3001/visitorManagements";

  const [formData, setFormData] = useState({});

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log(formData);
      e.preventDefault(); // 기본 폼 제출 방지
      axios
        .post(url, formData)
        .then((response) => {
          swal({
            text: "방문자 정보 저장되었습니다.",
            icon: "success",
            timer: 1500,
          });
          setVisible(false); // 창 닫힘
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    [formData]
  );

  const onClickScanner = () => {
    swal({
      text: "스캐너를 실행하시겠습니까?",
      icon: "info",
      buttons: ["취소", "확인"],
    }).then((result) => {
      if (result) {
        // "확인" 버튼을 눌렀을 때
        swal({
          text: "적용되었습니다.",
          icon: "success",
          timer: 1500,
        });
      } else {
        // "취소" 버튼을 눌렀을 때
        swal({
          text: "취소되었습니다.",
          icon: "warning",
          timer: 1500,
        });
      }
    });
  };

  // management로 formData넘길 방법
  // 넘겨서 버튼 누를때 setValue를 초기화 시키면 됨.

  return (
    <Popup
      title={title}
      visible={visible}
      width={width}
      enableBodyScroll={true}
      hideOnOutsideClick={false} // 외부 클릭할 시 창 꺼짐
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
        <form action="/visitManagements" onSubmit={handleSubmit}>
          <Form
            formData={formData}
            labelLocation="top"
            showColonAfterLabel={false}
          >
            <GroupItem>
              <GroupItem>
                <GroupItem caption="방문자 정보" colCount={2}>
                  <SimpleItem
                    dataField="visitorName"
                    label={{ text: "방문자 이름" }}
                    isRequired={true}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitorCompany"
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
                    <ButtonOptions
                      text="스캐너"
                      onClick={onClickScanner}
                      width={300}
                      height={40}
                    />
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
                    editorOptions={departmentEditorOptions}
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
                    editorOptions={workPlaceEditorOptions}
                  />
                </GroupItem>
              </GroupItem>
              <ButtonItem horizontalAlignment="right">
                <ButtonOptions
                  text="저장"
                  useSubmitBehavior={true}
                  width={100}
                  height={35}
                />
              </ButtonItem>
            </GroupItem>
          </Form>
        </form>
      </div>
    </Popup>
  );
};
