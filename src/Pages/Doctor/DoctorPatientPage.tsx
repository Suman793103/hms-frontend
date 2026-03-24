import React from 'react'
import Patients from '../../Components/Doctor/Dashboard/Patients'
import Patient from '../../Components/Doctor/Patients/Patient'

const DoctorPatientPage = () => {
  return (
    <div>
      <div className='p-5'>
        <Patient />
      </div>
    </div>
  )
}

export default DoctorPatientPage
