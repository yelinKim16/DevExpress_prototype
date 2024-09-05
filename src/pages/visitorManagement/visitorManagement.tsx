import React, { useState, useCallback, useRef } from "react";
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
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { exportDataGrid } from "devextreme/excel_exporter";
import { AddVisitorPopup } from "./addVisitorPopup";
import swal from "sweetalert";
import { visitorManagementData } from "../../lib/api/visitormanagement";
import dxDataGrid from "devextreme/ui/data_grid";
import SelectBox from "devextreme-react/select-box";
import { ValueChangedEvent } from "devextreme/ui/select_box";
import { VisitorManagements } from "../../lib/api/visitormanagement";

const titles = ["전체 선택", "전체 해제"];
const titleLabel = { "aria-label": "Title" };

// 체크박스를 위한 데이터 정의
let employees: VisitorManagements[] = [];
visitorManagementData
  .load()
  .then((data) => {
    if (Array.isArray(data)) {
      employees = data.map((item) => ({
        id: item.id,
        visitorName: item.visitorName,
        visitorCompany: item.visitorCompany,
      }));
    }
  })
  .catch((error) => {
    console.error("Failed to load visitor management data:", error);
  });

export default function VisitorManagement() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); // 체크한 행의 key값
  const dataGridRef = useRef<dxDataGrid>(null);

  // 새로고침
  const refresh = useCallback(() => {
    dataGridRef?.current?.instance().refresh();
  }, []);

  // popup open
  const onAddVisitorClick = () => {
    setPopupVisible(true);
  };

  const changePopupVisibility = useCallback((isVisble: any) => {
    setPopupVisible(isVisble);
  }, []);

  // 편집
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

  // 체크박스 전체선택/취소
  const onSelectionChanged = useCallback(
    ({
      selectedRowKeys: changedRowKeys,
    }: {
      selectedRowKeys: string[];
      selectedRowsData: VisitorManagements[];
    }) => {
      setSelectedRowKeys(changedRowKeys);
    },
    []
  );

  const onSelectionFilterChanged = useCallback((e: ValueChangedEvent) => {
    const value = e.value as string;
    let changedRowKeys: string[] = [];
    let filteredEmployees: VisitorManagements[] = [];

    if (value === "전체 선택") {
      filteredEmployees = employees;
      changedRowKeys = filteredEmployees.map((employee) => employee.id);
    } else if (value === "전체 해제") {
      dataGridRef.current?.instance().clearSelection();
      setSelectedRowKeys([]);
    }

    setPrefix(value);
    setSelectedRowKeys(changedRowKeys);
    dataGridRef.current?.instance().selectRows(changedRowKeys, false);
  }, []);

  // 체크한 행 삭제
  const onDeleted = () => {
    swal({
      text: "예약을 삭제하시겠습니까?",
      icon: "info",
      buttons: ["취소", "확인"],
    }).then((result) => {
      if (result) {
        const deleteCodes = Array.from(selectedRowKeys);
        if (deleteCodes.length === 0) {
          swal({
            text: "예약을 선택해주세요.",
            icon: "error",
            timer: 1500,
          });
          return;
        }
        Promise.all(
          deleteCodes.map((code) => {
            visitorManagementData.remove(code);
          })
        )
          .then(() => {
            swal({
              text: "예약이 삭제 되었습니다.",
              icon: "success",
              timer: 1500,
            });
            dataGridRef?.current?.instance().refresh();
          })
          .catch(() => {
            swal({
              text: "예약 삭제를 실패했습니다.",
              icon: "error",
              timer: 1500,
            });
          });
      }
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
          selectedRowKeys={selectedRowKeys}
          ref={dataGridRef}
          onSelectionChanged={onSelectionChanged}
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <LoadPanel showPane={false} />
          <SearchPanel visible />
          <Selection mode="multiple" />
          <FilterRow visible={true} applyFilter="auto" />
          <Export enabled={true} allowExportSelectedData={true} />

          <Toolbar>
            <Item location="before">
              <SelectBox
                dataSource={titles}
                inputAttr={titleLabel}
                placeholder="선택"
                width={150}
                onValueChanged={onSelectionFilterChanged}
                value={prefix}
              />
            </Item>
            <Item location="before" locateInMenu="auto">
              <Button
                icon="plus"
                text="추가"
                type="default"
                stylingMode="contained"
                onClick={onAddVisitorClick}
              />
            </Item>
            <Item location="before" locateInMenu="auto">
              <Button
                icon="remove"
                text="삭제"
                type="default"
                stylingMode="contained"
                onClick={onDeleted}
              />
            </Item>
            <Item
              location="before"
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
            <Item location="before" name="exportButton" />
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
            popup={{
              title: "방문예약 정보수정",
              showTitle: true,
              width: 700,
              height: 450,
            }}
          />
        </DataGrid>
        <AddVisitorPopup
          title="방문예약 정보작성"
          visible={isPopupVisible}
          setVisible={changePopupVisibility}
          dataGridRef={dataGridRef}
        />
      </div>
    </React.Fragment>
  );
}
