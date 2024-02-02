CREATE TABLE lab_report_pathogens (
  pathogen_id IDENTITY(1),
  report_id int NOT NULL,
  pathogen_type varchar(45) NOT NULL,
  pathogen_name varchar(45) NOT NULL,
  pathogen_result varchar(45) NOT NULL,
  pathogen_expected varchar(45) NOT NULL,
  pathogen_indicator varchar(45) DEFAULT NULL,
  PRIMARY KEY (pathogen_id),
  CONSTRAINT fk_report_id FOREIGN KEY (report_id) REFERENCES lab_reports (report_id)
);
