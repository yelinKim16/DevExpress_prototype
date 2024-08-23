import axios from "axios";

export const postVisitorManagement = (visitorManagement: any) =>
  axios.post(`/api/visitorManagements`, visitorManagement);
