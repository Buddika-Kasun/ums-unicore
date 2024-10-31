"use server"

import ReservationComp from "@/components/reservationsComp/ReservationComp";
import { dbConnect } from "@/lib/mongo";
import { Faculty } from "@/model/faculty-model";
import { Location } from "@/model/location-model";
import { Reservation } from "@/model/reservation-model";

const ReservationForm = async({searchParams}) => {

  const { docID, method } = searchParams || {};

  const currentMethod = method ? 'Cancel': docID ? 'Update': 'Create';

  let formData = {};

  await dbConnect();

  const reservationData = docID ? await Reservation.findOne({ docID }) : null;

  if(reservationData){

    formData = {
      docID: reservationData.docID,
      docDate: reservationData.docDate,
      faculty: reservationData.faculty,
      locationName: reservationData.locationName,
      reservationName: reservationData.reservationName,
      reservationCode: reservationData.reservationCode,
      hallCap: reservationData.hallCap,
      stockLoc: reservationData.stockLoc,
      rackNo: reservationData.rackNo,
      binNo: reservationData.binNo,
      active: reservationData.active,
      departments: reservationData.departments,
    };

  }
  else {

    const currentYear = (new Date().getFullYear()) % 100;

    const preDocID = await Reservation.findOne({}, { docID: 1, _id: 0 }).sort({ _id: -1 });

    let id;

    if (!preDocID) {
      id = 1;
    }
    else {
      id = parseInt(preDocID.docID.split('/')[2]) + 1;
    }

    const newdocId = `${currentYear}/RVC/${id}`;

    formData = {
      docID: newdocId,
    };
  }

  const facultys = await Faculty.find({}, { facultyName: 1, facultyCode: 1, _id: 0 }).lean();

  const locations = await Location.find({}, { locName: 1, faculty: 1, _id: 0 }).lean();

  return (
    <ReservationComp
      facultys = {facultys}
      data = {formData}
      locations = {locations}
      method={currentMethod}
    />
  );
};

export default ReservationForm;
