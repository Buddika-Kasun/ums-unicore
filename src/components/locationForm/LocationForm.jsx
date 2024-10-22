"use client"

import { useState } from 'react';
import styles from './locationForm.module.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SubLoading from '../loading/SubLoading';

const LocationForm = ({data, method}) => {

  const [isloading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    docID: data.docID,
    // docDate: data.docDate || new Date(Date.now()).toLocaleString(),
    docDate: new Date(Date.now()).toLocaleString(), // when update use new date time
    faculty: data.faculty || '',
    cost: data.cost || '',
    locationType: data.locationType || '',
    active: data.active || '',
    buildingNo: data.buildingNo || 0,
    floorNo: data.floorNo || 0,
    locName: data.locName || '',
    locCode: data.locCode || 'LOC/1',
  });

  //const [formData, setFormData] = useState(data.data);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nameRegex = /^[.a-zA-Z0-9\s]*$/;

    if(name === 'locName' && !nameRegex.test(value)) {
        toast.warning("Location name should only contain letters,numbers and spaces.");
        return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formReset = (docID, locCode) => {
    setFormData({
      docID: docID,
      docDate: new Date(Date.now()).toLocaleString(),
      faculty: '',
      cost: '',
      locationType: '',
      active: '',
      buildingNo: 0,
      floorNo: 0,
      locName: '',
      locCode: locCode,
    });
  };

  const handleSave = async(e) => {
    e.preventDefault();

    try {
      if(Object.values(formData).some(value => value === '' || value === null || value === undefined)){
        toast.warning("All fields required");
        return;
      }
      // console.log(formData);

      setIsLoading(true);

      let res;

      if(method == 'Create') {
        res = await axios.post('/api/pages/gestor/master', formData);
      }

      if(method == 'Update') {
        res = await axios.put('/api/pages/gestor/master', formData);
      }

      if (res.status === 200) {
        //console.log(res.data.message);

        // Update docID
        const x = formData.docID.split('/');
        const newDocId = `${x[0]}/${x[1]}/${parseInt(x[2])+1}`;

        formReset(newDocId, formData.locCode);

        setIsLoading(false);

        setTimeout(() => {
          (method == 'Update') && router.push('/gestor/master/listView');
        }, 1000);

        toast.success(res.data.message, {
            autoClose: 2000,
        });
      }
      else {
        throw err;
      }

    }
    catch(err) {
      console.log(err);
      setIsLoading(false);
      toast.error('An unexpected error occurred while registering the user.');
    }
  };

  const router = useRouter();

  const visit = () => {
    setIsLoading(true);
    router.push('/gestor/master/listView');
  }

  return (
    <>
      {isloading && <SubLoading />}
      <div className={styles.header}>
        <h2 className={styles.title}>{(method == "Update")? "Update" : "Create"} Location</h2>

        {/* Document Section */}
        <div className={styles.docSection}>
          <div className={styles.formGroup}>
            <label>Doc ID</label>
            <input type="text" className={styles.input} value={formData.docID} readOnly/>
          </div>

          <div className={styles.formGroup}>
            <label>Doc Date</label>
            <input type="text" className={styles.input} value={formData.docDate} readOnly />
          </div>
        </div>
      </div>

    <div className={styles.container}>

      {/* Button Group Aligned to the Right */}
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={visit}>{(method == "Update")? "Back" : "List View"}</button>
        {(method == "Update") && <button className={styles.button} onClick={() => router.push('/gestor/master')}>New</button>}
        <button className={styles.button} onClick={() => formReset(formData.docID, formData.locCode)}>Clear all</button>
        <button className={styles.button} onClick={handleSave}>{(method == "Update")? "Update" : "Save"}</button>
      </div>

      {/* Form Fields Section */}
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Faculty</label>
          <select className={styles.input} name='faculty' value={formData.faculty} onChange={handleChange} required>
            <option value="Faculty of Technology">Faculty of Technology</option>
            <option value="Faculty of Arts">Faculty of Arts</option>
            <option value="Faculty of Science">Faculty of Science</option>
            <option value="engineeringFaculty of Engineering">Faculty of Engineering</option>
            <option value="Faculty of Business">Faculty of Business</option>
            <option value="Faculty of Law">Faculty of Law</option>
            <option value="" disabled>Select faculty</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Cost Center</label>
          <select className={styles.input} name='cost' value={formData.cost} onChange={handleChange}>
            <option>Internal Use</option>
            <option>External Use</option>
            <option value="" disabled>Select cost center</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Location Type</label>
          <select className={styles.input} name='locationType' value={formData.locationType} onChange={handleChange}>
            <option>Internal Use</option>
            <option>External Use</option>
            <option value="" disabled>Select location type</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Active?</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" name="active" value="Yes" checked={formData.active === 'Yes'} onChange={handleChange}/> Yes
            </label>
            <label>
              <input type="radio" name="active" value="No" checked={formData.active === 'No'} onChange={handleChange}/> No
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Building No</label>
          <input type="number" className={styles.input} name='buildingNo' value={formData.buildingNo} onChange={handleChange}/>
        </div>

        <div className={styles.formGroup}>
          <label>Floor No</label>
          <input type="number" className={styles.input} name='floorNo' value={formData.floorNo} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Location Name</label>
          <input type="text" className={styles.input} placeholder="Enater location name" name='locName' value={formData.locName} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Location Code</label>
          <input type="text" className={styles.input} value={formData.locCode} readOnly />
        </div>
      </div>
    </div>
    </>
  );
};

export default LocationForm;