import React from 'react';
import {properties} from './properties';

export default function AppServer(props) {
  const data = props.data

  const patientName     = data.find(({name}) => name === "PatientName").data[0].value
  const patientDOB      = data.find(({name}) => name === "PatientDOB").data[0].value
  const physicianName   = data.find(({name}) => name === "PhysicianName").data[0].value
  const accessionNumber = data.find(({name}) => name === "AccessionNumber").data[0].value
  const dateCollected   = data.find(({name}) => name === "DateCollected").data[0].value
  const dateReceived    = data.find(({name}) => name === "DateReceived").data[0].value
  const dateCompleted   = data.find(({name}) => name === "DateCompleted").data[0].value
  const labName         = data.find(({name}) => name === "LabName").data[0].value
  const labAddress      = data.find(({name}) => name === "LabAddress").data[0].value
  const labPhone        = data.find(({name}) => name === "LabPhone").data[0].value

  const pathogensNames     = data.find(({name}) => name === "Pathogens_Name").data
  const pathogensResults   = data.find(({name}) => name === "Pathogens_Result").data
  const pathogensExpected  = data.find(({name}) => name === "Pathogens_Expected").data
  const pathogensIndicator = data.find(({name}) => name === "Pathogens_Indicator").data

  const pathogenTypes = ['Bacterial Pathogens','Parasitic Pathogens','Viral Pathogens','H. pylori']

  const insertLabReportQuery = "insert into lab_reports (patient_name, patient_dob, physician_name, accession_number, date_collected, date_received, date_completed, lab_name, lab_address, lab_phone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  const insertPathogensQuery = "insert into lab_report_pathogens (report_id, pathogen_type, pathogen_name, pathogen_result, pathogen_expected, pathogen_indicator) values (?, ?, ?, ?, ?, ?)"

  const {Client} = require('vertica-nodejs')
  const client = new Client({
    host     : properties.db_host,
    port     : properties.db_port,
    user     : properties.db_user,
    password : properties.db_password,
    database : properties.db_database
  })

  client.connect()
  console.log("Connected to Vertica DB")

  client.query(
    insertLabReportQuery,
    [patientName, patientDOB, physicianName, accessionNumber, dateCollected, dateReceived, dateCompleted, labName, labAddress, labPhone],
    (err, res) => {
      if (err) {
        console.log('error: ', err)
        throw err
      }

      client.query("select last_insert_id()", (err, res) => {
        if (err) console.log('error: ', err)
        let reportId = res.rows[0].last_insert_id;
        console.log('New lab report added with report Id: ', reportId);

        let pathogenType = '';

        for (let i = 0; i < pathogensNames.length; i++) {
          if (pathogenTypes.includes(pathogensNames.at(i).value)) {
            pathogenType = pathogensNames.at(i).value
            continue;
          }

          client.query(
            insertPathogensQuery,
            [reportId, pathogenType, pathogensNames.at(i).value, pathogensResults.at(i).value, pathogensExpected.at(i).value, pathogensIndicator.at(i).value],
            (err, res) => {
              if (err) {
                console.log('error: ', err)
                throw err
              }
            }
          )
        }

        client.query("commit", (err, res) => {
          if (err) console.log('error: ', err)
          client.end()
        })
      })
    }
  )

  return ("Successfully added extracted data into local database")
}