import React, { useEffect, useState } from "react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import ArrayStore from "devextreme/data/array_store";

const App = () => {
  const [dataSource, setDataSource] = useState<PivotGridDataSource | null>(
    null
  );
  const [applyChangesMode, setApplyChangesMode] = useState<
    "instantly" | "onDemand"
  >("instantly");

  useEffect(() => {
    // 데이터를 가져와서 처리합니다.
    fetch("http://localhost:3001/accessCount")
      .then((response) => response.json())
      .then((data) => {
        // date객체로 변환
        data.forEach((entry: { date: string | number | Date }) => {
          entry.date = new Date(entry.date);
        });
        // 가져온 JSON 데이터를 ArrayStore를 사용하여 처리합니다.
        const store = new ArrayStore({
          data: data,
          key: "id", // 데이터를 식별할 수 있는 고유 키를 지정합니다. 없다면 생략 가능
        });

        const dataSource = new PivotGridDataSource({
          fields: [
            { dataField: "region", area: "row" },
            { dataField: "city", area: "row" },
            { dataField: "date", area: "column" },
            { dataField: "amount", area: "data", summaryType: "sum" },
          ],
          store: store,
        });

        setDataSource(dataSource); // dataSource 상태 업데이트
      });
  }, []);

  if (!dataSource) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"content-block"}>
      <div className="grid-header">방문자 관리</div>
      <React.Fragment>
        <PivotGrid
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowFiltering={true}
          allowSorting={true}
          height="auto"
          showBorders={true}
        >
          <FieldChooser
            enabled={true}
            allowSearch={true}
            applyChangesMode={applyChangesMode}
          />
        </PivotGrid>
      </React.Fragment>
    </div>
  );
};

export default App;
