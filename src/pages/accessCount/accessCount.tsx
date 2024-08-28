import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChartRef } from "devextreme-react/chart";
import { accessCount } from "../accessStructure/visitorCount";
import PivotGrid, {
  FieldChooser,
  PivotGridRef,
} from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import "./accessCount.scss";

const dataSource = new PivotGridDataSource({
  fields: [
    {
      caption: "Region",
      width: 120,
      dataField: "region",
      area: "row",
      sortBySummaryField: "Total",
    },
    {
      caption: "City",
      dataField: "city",
      width: 150,
      area: "row",
    },
    {
      dataField: "date",
      dataType: "date",
      area: "column",
    },
    {
      groupName: "date",
      groupInterval: "month",
      visible: false,
    },
    {
      caption: "Total",
      dataField: "amount",
      dataType: "number",
      summaryType: "sum",
      format: "currency",
      area: "data",
    },
  ],
  store: accessCount,
});

export default function AccessCount() {
  const chartRef = useRef<ChartRef>(null);
  const pivotGridRef = useRef<PivotGridRef>(null);

  useEffect(() => {
    pivotGridRef.current?.instance().bindChart(chartRef.current?.instance(), {
      dataFieldsDisplayMode: "splitPanes",
      alternateDataFields: false,
    });
    setTimeout(() => {
      dataSource.expandHeaderItem("row", ["North America"]);
      dataSource.expandHeaderItem("column", [2024]);
    });
  }, []);

  return (
    <div className={"content-block"}>
      <div className="grid-header">방문자 관리</div>
      <React.Fragment>
        <PivotGrid
          id="pivotgrid"
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowFiltering={true}
          showBorders={true}
          // showColumnTotals={false}
          showColumnGrandTotals={false}
          // showRowTotals={false}
          // showRowGrandTotals={false}
          ref={pivotGridRef}
        >
          <FieldChooser enabled={true} height={150} />
        </PivotGrid>
      </React.Fragment>
    </div>
  );
}
