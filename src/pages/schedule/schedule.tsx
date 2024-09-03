import React, { useEffect, useState } from "react";
import Scheduler, { SchedulerTypes } from "devextreme-react/scheduler";

const currentDate = new Date(2021, 3, 29);
const views: SchedulerTypes.ViewType[] = ["day", "week", "workWeek", "month"];

const Schedule = () => {
  return (
    <div className={"content-block"}>
      <div className="grid-header">스케줄</div>
      <Scheduler
        timeZone="America/Los_Angeles"
        // dataSource={data}
        views={views}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        height={730}
        startDayHour={9}
      />
    </div>
  );
};

export default Schedule;
