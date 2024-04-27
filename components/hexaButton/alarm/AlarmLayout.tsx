import AlarmFooter from '~components/hexaButton/alarm/AlarmFooter'
import AlarmList from '~components/hexaButton/alarm/AlarmList'
import { useState } from 'react'
import { type AlarmFilter, defaultFilter } from '~components/hexaButton/alarm/alramFilter'

const AlarmLayout = () => {
  const [filter, setFilter] = useState<AlarmFilter>(defaultFilter);
  return (
    <>
        <AlarmList filter={filter}/>
        <AlarmFooter setFilter={setFilter} filter={filter} />
    </>
  )
}

export default AlarmLayout;