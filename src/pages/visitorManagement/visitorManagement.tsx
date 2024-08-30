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
  Popup,
  DataGridRef,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { exportDataGrid } from "devextreme/excel_exporter";
import { AddVisitorPopup } from "./addVisitorPopup";
import { createStore } from "devextreme-aspnet-data-nojquery";
import VisitorManagementEdit from "./editPopup";
import axios from "axios";
import CustomStore from "devextreme/data/custom_store";
import swal from "sweetalert";

const url = "http://localhost:3001/visitorManagements";

const dataSources = createStore({
  key: "id",
  loadUrl: url,
});

const dataSource = new CustomStore({
  key: "id",
  load: function () {
    return fetch(url)
      .then((response) => response.json())
      .catch(() => {
        throw "Data loading error";
      });
  },
  insert: function (values) {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .catch(() => {
        throw "Data insert error";
      });
  },
  update: function (key, values) {
    return fetch(`${url}/${key}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .catch(() => {
        throw "Data update error";
      });
  },
  remove: function (key) {
    return fetch(`${url}s/${key}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          swal({
            text: "방문 예약이 삭제되었습니다.",
            icon: "success",
            timer: 1500,
          });
        } else {
          throw new Error("Failed to delete");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        swal({
          text: "삭제에 실패했습니다.",
          icon: "error",
          timer: 1500,
        });
      });
  },
});

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

export default function VisitorManagement() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const gridRef = useRef<DataGridRef>(null);

  const refresh = useCallback(() => {
    gridRef.current?.instance().refresh();
  }, []);

  // 팝업
  const onAddVisitorClick = () => {
    setPopupVisible(true);
  };

  const changePopupVisibility = useCallback((isVisble: any) => {
    setPopupVisible(isVisble);
  }, []);

  //

  return (
    <React.Fragment>
      <div className={"content-block"}>
        <div className="grid-header">방문 예약 관리</div>
        <DataGrid
          dataSource={dataSource as any}
          showBorders={false}
          columnAutoWidth={true} // 자동 너비
          allowColumnReordering={true} // 사용자가 너비조정
          remoteOperations={false} // 데이터가 서버에서 처리
          onExporting={onExporting}
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
          >
            <Popup
              title="방문자 정보"
              showTitle={true}
              width={700}
              height={525}
            />
            <VisitorManagementEdit />
          </Editing>
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
