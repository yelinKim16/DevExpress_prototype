import React, { useCallback, useState, useMemo, useRef } from "react";
import "devextreme/dist/css/dx.light.css";
import DataGrid, { Column, Editing, Button } from "devextreme-react/data-grid";
import Popup, { ToolbarItem } from "devextreme-react/popup";
import validationEngine from "devextreme/ui/validation_engine";
import { companyData } from "../../lib/api/company";
import dxDataGrid from "devextreme/ui/data_grid";
import CompanyForm from "./companyForm";
// const employeeStore = new ArrayStore({
//   data: employees,
//   key: "id",
// });

interface PopupState {
  formData: any;
  visible: boolean;
}
const validationGroupName = "gridForm";

const CompanyPage = () => {
  const dataGridRef = useRef<dxDataGrid>(null);
  const [{ formData, visible }, setPopupState] = useState<PopupState>({
    formData: {},
    visible: false,
  });

  const showPopup = useCallback((formData: any) => {
    setPopupState({ formData, visible: true });
  }, []);

  const hidePopup = useCallback(() => {
    setPopupState((prevState) => ({ ...prevState, visible: false }));
  }, []);

  const confirmChanges = useCallback(async () => {
    const result = validationEngine.validateGroup(validationGroupName);

    if (!result.isValid) return;

    try {
      await companyData.update(formData.my_cd, formData);
      dataGridRef?.current?.instance().refresh();
    } finally {
      hidePopup();
    }
  }, [formData, hidePopup]);

  const confirmBtnOptions = useMemo(() => {
    return {
      text: "저장",
      type: "success",
      onClick: confirmChanges,
    };
  }, [confirmChanges]);

  const cancelBtnOptions = useMemo(() => {
    return {
      text: "취소",
      onClick: hidePopup,
    };
  }, [hidePopup]);

  const editRow = useCallback(
    (e: any) => {
      showPopup({ ...e.row.data });
    },
    [showPopup]
  );

  // 편집
  function updateRow(e: any) {
    const { key, newData, oldData } = e;
    const updatedData = { ...oldData, ...newData }; // 병합하여 전체 데이터를 생성
    companyData.update(key, updatedData);
    e.component.refresh(); // 새로고침 없이 데이터 update
    e.cancel = true; // 기존 api 요청 cancel
    e.component.cancelEditData(); // 수정 후 팝업 닫기
  }

  return (
    <React.Fragment>
      <DataGrid
        dataSource={companyData}
        ref={dataGridRef}
        showBorders={true}
        repaintChangesOnly={true}
        onRowUpdating={updateRow}
      >
        <Editing
          allowUpdating={true}
          allowDeleting={true}
          useIcons={true}
          mode="popup"
        />
        <Column type="buttons">
          <Button name="edit" onClick={editRow} />
          {/* <Button name="delete" />  */}
        </Column>
        <Column dataField="my_cd" caption="회사 코드" />
        <Column dataField="my_nm" caption="회사 명칭" />
        <Column dataField="type" caption="타입" />
        <Column dataField="sites" caption="사이트" />
        <Column
          dataField="createdt"
          caption="생성날짜"
          dataType="date"
          format="yyyy-MM-dd HH:mm:ss"
        />
        <Column
          dataField="updatedt"
          caption="수정날짜"
          dataType="date"
          format="yyyy-MM-dd HH:mm"
        />
      </DataGrid>

      {visible ? (
        <Popup
          title="회사 수정"
          hideOnOutsideClick={true}
          visible={true}
          height={"auto"}
          width={600}
          onHiding={hidePopup}
        >
          <ToolbarItem
            widget="dxButton"
            location="after"
            toolbar="bottom"
            options={confirmBtnOptions}
          />
          <ToolbarItem
            widget="dxButton"
            location="after"
            toolbar="bottom"
            options={cancelBtnOptions}
          />

          <CompanyForm
            formData={formData}
            validationGroupName={validationGroupName}
            confirmBtnOptions={confirmBtnOptions}
            cancelBtnOptions={cancelBtnOptions}
          />
        </Popup>
      ) : null}
    </React.Fragment>
  );
};

export default CompanyPage;
