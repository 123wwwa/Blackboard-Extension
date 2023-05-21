import AlarmFooter from './AlarmFooter'
import AlarmList from './AlarmList'
import { useState } from 'react'
import { Filter, defaultFilter } from './Filter';
import { LectureList } from 'type';
import { useSelector } from 'react-redux';
import { selectLectureList } from '../../../features/lecture_reducer';
function AlarmLayout() {
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const lectureList: LectureList = useSelector(selectLectureList);
  const lectureNames = Object.entries(lectureList).map(
		([_, lecture]) => lecture.name
	);
  return (
    <>
        <AlarmList filter={filter}/>
        <AlarmFooter setFilter={setFilter} filter={filter}/>
    </>
  )
}

export default AlarmLayout