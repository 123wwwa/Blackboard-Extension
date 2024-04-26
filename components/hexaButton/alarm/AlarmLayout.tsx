import AlarmFooter from '~components/hexaButton/alarm/AlarmFooter'
import AlarmList from '~components/hexaButton/alarm/AlarmList'
import { useState } from 'react'
import { type AlarmFilter, defaultFilter } from '~components/hexaButton/alarm/alramFilter'

import useLectureStore from '~shared/stores/lectureStore';
const AlarmLayout = () => {
  const [filter, setFilter] = useState<AlarmFilter>(defaultFilter);
  const {alarmList} = useLectureStore();
  return (
    <>
        <AlarmList filter={filter} BB_alarmList={alarmList}/>
        <AlarmFooter setFilter={setFilter} filter={filter}/>
    </>
  )
}

export default AlarmLayout;