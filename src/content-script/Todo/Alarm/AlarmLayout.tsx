import AlarmFooter from './AlarmFooter'
import AlarmList from './AlarmList'
import { useState } from 'react'
import { Filter, defaultFilter } from './Filter';
import { BB_alarm, LectureList } from 'type';
import { useSelector } from 'react-redux';
import { selectBB_alarmList} from '../../../features/lecture_reducer';
const AlarmLayout = () => {
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const BB_alarmList:BB_alarm[] = useSelector(selectBB_alarmList);
  return (
    <>
        <AlarmList filter={filter} BB_alarmList={BB_alarmList}/>
        <AlarmFooter setFilter={setFilter} filter={filter}/>
    </>
  )
}

export default AlarmLayout;