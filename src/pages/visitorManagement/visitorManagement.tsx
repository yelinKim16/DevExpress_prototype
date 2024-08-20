import React, { useState, useCallback } from "react";
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  DataGridTypes,
  Export,
  FilterRow,
  Grouping,
  GroupPanel,
  Item,
  LoadPanel,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/cjs/data-grid";
import Button from "devextreme-react/button";
import { visitorManagement } from "../../components/mock/visitorManagement";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";

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

export default function VisitorManagemnet() {
  const [popupVisible, setPopupVisible] = useState(false);

  // popup
  const changePopupVisibility = useCallback((isVisble: any) => {
    setPopupVisible(isVisble);
  }, []);

  const onAddContactClick = useCallback(() => {
    setPopupVisible(true);
  }, []);

  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  return (
    <React.Fragment>
      <h2 className={"content-block"}>방문예약관리</h2>

      <DataGrid
        columnAutoWidth={true} // 자동 너비
        allowColumnReordering={true} // 사용자가 너비조정
        dataSource={visitorManagement}
        onExporting={onExporting}
      >
        <SearchPanel visible placeholder="Contact Search" />
        <Selection mode="multiple" />
        <FilterRow visible={true} applyFilter="auto" />
        <Export enabled={true} allowExportSelectedData={true} />

        <Toolbar>
          <Item location="before">
            <div className="grid-header">Contacts</div>
          </Item>
          {/* <Item location="after" locateInMenu="auto">
            <Button
              icon="create"
              text="Add Contact"
              type="default"
              stylingMode="contained"
              onClick={onAddContactClick}
            />
          </Item>
           */}
          <Item location="after" locateInMenu="auto">
            <button>My Button</button>
          </Item>{" "}
          <Item location="after" widget="dxButton" locateInMenu="auto">
            <Button
              icon="plus"
              text="Add Task"
              type="default"
              stylingMode="contained"
              onClick={onAddContactClick}
            />
          </Item>
          <Item name="exportButton" />
          <Item name="searchPanel" locateInMenu="auto" />
        </Toolbar>
        <Column dataField="VisitorName" width={150}></Column>
        <Column dataField="VisitorCompany" width={150}></Column>
        <Column dataField="ContactNumber"></Column>
        <Column dataField="ContactName"></Column>
        <Column dataField="ContactCompany"></Column>
        <Column dataField="VisitPurpose"></Column>
        <Column dataField="VisitStatus"></Column>
        <Column dataField="VisitLocation"></Column>
      </DataGrid>
    </React.Fragment>
  );
}
