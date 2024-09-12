import React, { PropsWithChildren, useCallback, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  SimpleItem,
} from "devextreme-react/cjs/form";
import swal from "sweetalert";
import { RefObject } from "react";
import { DataGridRef } from "devextreme-react/data-grid";
import { visitorManagementData } from "../../lib/api/visitormanagement";
import { useScreenSize } from "../../utils/media-query";

type PopupProps = {
  title: string;
  visible: boolean;
  width?: number;
  height?: number | string;
  wrapperAttr?: { class: string };
  isSaveDisabled?: boolean;
  setVisible: (visible: boolean) => void;
  dataGridRef?: RefObject<DataGridRef>;
};
export const EditVisitorPopup = ({
  title,
  visible,
  width = 700,
  height = "auto",
  setVisible,
  wrapperAttr = { class: "" },
  isSaveDisabled = false,
  dataGridRef,
}: PropsWithChildren<PopupProps>) => {
  const { isXSmall } = useScreenSize();
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);

  const handleCloseForm = () => {
    setVisible(false);
    setFormData({});
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // 자동으로 폼 새로고침
      try {
        const response = await visitorManagementData.insert(formData);
        if (response.ok) {
          swal({
            text: "방문 예약이 생성되었습니다.",
            icon: "success",
            timer: 1500,
          });
          setVisible(false); // 창 닫기
          dataGridRef?.current?.instance().refresh();
        } else {
          throw new Error("저장에 실패했습니다.");
        }
      } catch (error) {
        swal({
          text: "생성 실패했습니다.",
          icon: "error",
          timer: 1500,
        });
        console.error("Error:", error);
      }
    },
    [formData]
  );

  return (
    <Popup
      title={title}
      visible={visible}
      width={width}
      enableBodyScroll={true}
      fullScreen={isXSmall}
      hideOnOutsideClick={false} // 외부 클릭할 시 창 꺼짐
      resizeEnabled={true}
      wrapperAttr={{
        ...wrapperAttr,
        class: `${wrapperAttr?.class} form-popup`,
      }}
      height={height}
      onHiding={handleCloseForm}
      showCloseButton={true} // 닫기 버튼 표시
    >
      <div id="app-container">
        <form onSubmit={handleSubmit}>
          <Form
            formData={formData}
            ref={formRef}
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
                    dataField="visitorDepartment"
                    label={{ text: "방문자 부서" }}
                    editorOptions={{ height: 35 }}
                  />
                  <SimpleItem
                    dataField="visitorPosition"
                    label={{ text: "방문자 직급" }}
                    editorOptions={{ height: 35 }}
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
                </GroupItem>
              </GroupItem>
              <ButtonItem horizontalAlignment="right">
                <ButtonOptions
                  text="저장"
                  useSubmitBehavior={true}
                  width={100}
                  height={35}
                  disabled={isSaveDisabled} // 필드 요건 부적합시 전송X
                />
              </ButtonItem>
            </GroupItem>
          </Form>
        </form>
      </div>
    </Popup>
  );
};
