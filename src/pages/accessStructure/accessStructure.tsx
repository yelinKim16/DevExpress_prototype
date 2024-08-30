import React, { useCallback, useState } from "react";
import TreeList, {
  Column,
  Editing,
  HeaderFilter,
  RowDragging,
  SearchPanel,
  TreeListTypes,
} from "devextreme-react/tree-list";
import { createStore } from "devextreme-aspnet-data-nojquery";
import CustomStore from "devextreme/data/custom_store";
import { dragAccessStructure } from "./dragData";

const url = "http://localhost:3001/accessStructure";

const dataSource = new CustomStore({
  key: "id",
  load: function () {
    return fetch(url)
      .then((response) => response.json())
      .catch(() => {
        throw "Data loading error";
      });
  },
});

const expandedRowKeys = [1];

const onDragChange = (e: any) => {
  // 허용되지 않은 위치로 이동하는 것 방지
  const visibleRows = e.component.getVisibleRows(); // 화면에 표시된 행
  const sourceNode = e.component.getNodeByKey(e.itemData.id); // 드래그하는 항목의 노드
  let targetNode = visibleRows[e.toIndex].node; // 드롭할 위치의 노드

  while (targetNode && targetNode.data) {
    if (targetNode.data.id === sourceNode.data.id) {
      e.cancel = true;
      break;
    }
    targetNode = targetNode.parent;
  }
};

const popupOptions = {
  title: "Employee Info",
  showTitle: true,
  width: 600,
  height: 280,
};

const allowDeleting = (e: any) => e.row.data.id !== 1;

const onEditorPreparing = (e: TreeListTypes.EditorPreparingEvent) => {
  if (e.dataField === "Head_ID" && e.row?.data.id === 1) {
    e.editorOptions.disabled = true;
    e.editorOptions.value = null;
  }
};

const onInitNewRow = (e: TreeListTypes.InitNewRowEvent) => {
  e.data.Head_ID = 1;
};

export default function AccessStructure() {
  const [accessStructure, setAccessStructure] = useState(dragAccessStructure);
  const [allowDropInsideItem, setAllowDropInsideItem] = useState(true);
  const [allowReordering, setAllowReordering] = useState(true);
  const [showDragIcons, setShowDragIcons] = useState(true);

  const onReorder = useCallback(
    // 데이터 순서 변경
    (e: any) => {
      const visibleRows = e.component.getVisibleRows(); // 화면에 표시된 행
      let sourceData = e.itemData; // 드래그된 데이터
      const updatedEmployees = [...accessStructure];
      const sourceIndex = updatedEmployees.indexOf(sourceData); // 드래그된 항목의 인덱스

      if (e.dropInsideItem) {
        sourceData = { ...sourceData, head_id: visibleRows[e.toIndex].key }; // 드롭된 위치의 항목 키를 sourceData의 head_id로 설정
        updatedEmployees.splice(sourceIndex, 1);
        updatedEmployees.splice(e.toIndex, 0, sourceData); // sourceData 지우고 새로운 위치에 추가
      } else {
        const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex; // 최종 인덱스
        let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null; // 드롭될 위치의 항목 데이터

        if (targetData && e.component.isRowExpanded(targetData.id)) {
          // 확장된 행에 드롭
          sourceData = { ...sourceData, head_id: targetData.id };
          targetData = null;
        } else {
          // 확장되지 않은 행에 드롭
          const headId = targetData ? targetData.head_id : -1;
          if (sourceData.head_id !== headId) {
            sourceData = { ...sourceData, head_id: headId };
          }
        }

        updatedEmployees.splice(sourceIndex, 1);
        const targetIndex = updatedEmployees.indexOf(targetData) + 1;
        updatedEmployees.splice(targetIndex, 0, sourceData);
      }

      setAccessStructure(updatedEmployees);
    },
    [accessStructure]
  );

  return (
    <div className={"content-block"}>
      <div className="grid-header">출입문 구조</div>
      <TreeList
        id="accessStructure"
        dataSource={accessStructure}
        rootValue={-1}
        keyExpr="id"
        showRowLines={true}
        showBorders={true}
        parentIdExpr="head_id"
        defaultExpandedRowKeys={expandedRowKeys}
        columnAutoWidth={true}
        onEditorPreparing={onEditorPreparing}
        onInitNewRow={onInitNewRow}
      >
        <SearchPanel visible={true} width={250} />
        <HeaderFilter visible={true} />
        <RowDragging
          onDragChange={onDragChange}
          onReorder={onReorder}
          allowDropInsideItem={allowDropInsideItem}
          allowReordering={allowReordering}
          showDragIcons={showDragIcons}
        />
        <Column dataField="title" caption="Name" />
        <Column dataField="category" />
        <Column dataField="workplace" />
        <Column dataField="doortype" />

        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={allowDeleting}
          allowAdding={true}
          popup={popupOptions}
        />
        {/* <Toolbar>
          <Item
            widget="dxButton"
            options={{
              icon: "plus",
              text: "추가",
            }}
            location="after"
          />
          <Item name="searchPanel" />
        </Toolbar> */}
      </TreeList>
    </div>
  );
}
