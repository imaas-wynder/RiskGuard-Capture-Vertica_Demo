CREATE TABLE lab_reports (
  report_id IDENTITY(1),
  patient_name varchar(45) NOT NULL,
  patient_dob datetime NOT NULL,
  physician_name varchar(45) DEFAULT NULL,
  accession_number varchar(45) DEFAULT NULL,
  date_collected datetime NOT NULL,
  date_received datetime NOT NULL,
  date_completed datetime NOT NULL,
  lab_name varchar(45) DEFAULT NULL,
  lab_address varchar(45) DEFAULT NULL,
  lab_phone varchar(45) DEFAULT NULL,
  PRIMARY KEY (report_id)
);
