import React, { useState, useCallback, useRef, useEffect } from "react";
import { saveAs } from "file-saver-es";
import { Workbook } from "exceljs";
import "./visitorManagement.scss";
import {
  DataGrid,
  Selection,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  LoadPanel,
  DataGridTypes,
  FilterRow,
  Column,
  Editing,
  Paging,
  Pager,
  DataGridRef,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { exportDataGrid } from "devextreme/excel_exporter";
import { AddVisitorPopup } from "./addVisitorPopup";
import swal from "sweetalert";
import { visitorManagementData } from "../../lib/api/visitormanagement";

export default function VisitorManagement() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const refresh = useCallback(() => {
    visitorManagementData.load();
  }, []);

  // popup open
  const onAddVisitorClick = () => {
    setPopupVisible(true);
  };

  const changePopupVisibility = useCallback((isVisble: any) => {
    setPopupVisible(isVisble);
  }, []);

  function updateRow(e: any) {
    const { key, newData, oldData } = e;
    const updatedData = { ...oldData, ...newData }; // 병합하여 전체 데이터를 생성
    visitorManagementData.update(key, updatedData);
    e.component.refresh(); // 새로고침 없이 데이터 update
    e.cancel = true; // 기존 api 요청 cancel
    e.component.cancelEditData(); // 수정 후 팝업 닫기
  }

  // 엑셀 export
  const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "DataGrid.xlsx"
        );
      });
    });
  };

  return (
    <React.Fragment>
      <div className={"content-block"}>
        <div className="grid-header">방문 예약 관리</div>
        <DataGrid
          dataSource={visitorManagementData as any}
          showBorders={false}
          columnAutoWidth={true} // 자동 너비
          allowColumnReordering={true} // 사용자가 너비조정
          remoteOperations={false} // 데이터가 서버에서 처리
          onExporting={onExporting}
          onRowUpdating={updateRow}
          onRowInserting={insertedRow}
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <LoadPanel showPane={false} />
          <SearchPanel visible />
          <Selection mode="multiple" />
          <FilterRow visible={true} applyFilter="auto" />
          <Export enabled={true} allowExportSelectedData={true} />

          <Toolbar>
            <Item location="after" locateInMenu="auto">
              <Button
                icon="plus"
                text="방문예약 정보작성"
                type="default"
                stylingMode="contained"
                onClick={onAddVisitorClick}
              />
            </Item>
            <Item
              location="after"
              locateInMenu="auto"
              showText="inMenu"
              widget="dxButton"
            >
              <Button
                icon="refresh"
                text="Refresh"
                stylingMode="text"
                onClick={refresh}
              />
            </Item>
            <Item name="exportButton" />
            <Item name="searchPanel" locateInMenu="auto" />
          </Toolbar>
          <Column dataField="visitorName" caption="방문자 이름" width={150} />
          <Column
            dataField="visitorCompany"
            caption="방문자 회사"
            width={150}
          />
          <Column dataField="contactNumber" caption="연락처" alignment="left" />
          <Column dataField="contactName" caption="담당자 번호" />
          <Column dataField="contactCompany" caption="담당자 회사" />
          <Column dataField="visitPurpose" caption="방문 목적" />
          <Column dataField="visitStatus" caption="방문 상태" />
          <Column dataField="visitLocation" caption="방문 위치" />
          <Editing
            mode="popup"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          ></Editing>
        </DataGrid>
        <AddVisitorPopup
          title="방문예약 정보작성"
          visible={isPopupVisible}
          setVisible={changePopupVisibility}
        />
      </div>
    </React.Fragment>
  );
}
