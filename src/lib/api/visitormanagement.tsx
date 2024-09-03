import CustomStore from "devextreme/data/custom_store";
import swal from "sweetalert";
const url = "http://localhost:3001/visitorManagements";

export const visitorManagementData = new CustomStore({
  key: "id",
  load: function () {
    return fetch(url)
      .then((response) => response.json())
      .catch(() => {
        throw new Error("Data update error");
      });
  },
  insert: function (values) {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
  },
  update: function (key, values) {
    return fetch(`${url}/${key}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
  },
  remove: function (key) {
    return fetch(`${url}/${key}`, {
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
        }
      })
      .catch((error) => {
        swal({
          text: "삭제에 실패했습니다.",
          icon: "error",
          timer: 1500,
        });
      });
  },
});
