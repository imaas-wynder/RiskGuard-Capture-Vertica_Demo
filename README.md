# Demo Application using OpenText Risk Guard and Capture API Services, and Vertica Analytics Platform database
This is a sample application showcasing **Risk Guard Service** and **Capture Service** on the OpenText Cloud Platform (OCP), and the use of **Vertica Analytics Platform** database to store extracted information.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). This was combined with the OpenText IM Services APIs and Vertica Analytics database.

## This sample application demonstrates 3 main capabilities: 
1. Using Risk Guard Service to identify PII information in a document.
2. Using Capture Service to extract all relevant data from a document.
3. Using a local database (Vertica CE) to load extracted data into a relational database.

## Deploying the Application
There are 3 parts to the setup:

### 1. Application Code - Deploying the application code and installing Node.js libraries
1. Download the code from [GitHub](https://github.com/imaas-wynder).
2. Download and install the latest LTS version of [Node.js](https://nodejs.org/). (You can also use Node Version Manager to manage multiple versions of Node). This sample application was built on Node version 18.16.0.
3. In the application root folder install the node libraries using the command
```
npm install
```
4. Based on the dependencies listed in package.json, this npm install command will also install the following libraries used by this application
```
vertica-nodejs, express, axios, webpack, webpack-cli, webpack-node-externals, @babel/core, @babel/preset-env, @babel/preset-react, babel-loader
```

### 2. Database – Installing Vertica CE database and creating the 2 tables used by the application
1. Download and install [Vertica Community Edition (CE) 12.0](https://docs.vertica.com/12.0.x/en/getting-started/community-edition-ce/) or later. This demo was built using CE container image running on [Docker Desktop](https://www.docker.com/get-started/) container engine.
2. Once the Docker Desktop is installed, pull the CE container image  from the [Vertica DockerHub registry](https://hub.docker.com/r/vertica/vertica-ce). Follow the instructions provided on the website to run the Vertica CE container.
3. To create the database for this demo, run the [admintools](https://docs.vertica.com/12.0.x/en/admin/using-admin-tools/running-admin-tools/) that was installed as part of the CE container image. First, stop the sample (VMart) database that was installed with the CE container image. Next, go to "Configuration Menu" to create a new database. Use "Enterprise Mode" for the new database. Make note of the new database name, password, host ip, and port.  
4. Update the database information in the **/src/properties.js** file in the demo application package.
5. To create the tables used by the demo application, run [vsql client](https://docs.vertica.com/12.0.x/en/connecting-to/using-vsql/connecting-from-command-line/) that was installed as part of the CE container image. Run the two database scripts included in the **db_scripts** folder of the demo application package.
```
vertica_create_table_lab_reports.sql
vertica_create_table_lab_report_pathogens.sql
```

### 3. Core Capture - ‘Lab Report Information Extraction’ profile in Core Capture
1. This demo uses a new Capture Profile to extract information from a lab report. The files used for the new profile are in the **capture_template** folder of the demo application package.
```
Sub-Folders                                   Files
--------------------------------------------  ----------------------------------------
GlobalData/DocumentTypes                      DNA_Stool_Analysis.xml
GlobalData/ExportProfile                      Lab_Report_Information_Extraction.xml
GlobalData/ImageProcessing                    Lab_Report_Information_Extraction.xml
GlobalData/Recognition/InformationExtraction  DNA Stool Analysis.xml
GlobalData/ScanImportProfile                  Lab_Report_Information_Extraction.config
```
2. Watch the [tutorial videos](https://www.youtube.com/@Opentext_IMaaS/search?query=capture) to learn about the **Core Capture Application** and the **Core Capture Designer**. You will need to use the designer to upload the new capture profile to your OpenText Cloud Platform (OCP) tenant.
3. After you've installed the Core Capture Designer and logged in the first time, a new profile folder will be created on your local drive. On Windows, the default location of this folder is **C:\Users\[Windows User]\Documents\Core Capture Data**. Copy the files listed in the previous step into this folder.
4. Re-login into the Core Capture Designer and go to **Publish to Development** tab. Select the following items from the list and click "Publish" to upload them to your OCP tenant.
```
Document Types:      DNA Stool Analysis
Recognition Project: Information Extraction
Capture Profiles:    Lab Report Information Extraction
```
5. Next, login to your OpenText Developer account and go to the Admin Center. Navigate to the Tenant apps and select the **CoreCapture** subscription. Click on the "Link to app" hyperlink to access the Core Capture web application. The dashboard will show the newly uploaded **Lab Report Information Extraction** profile. Select this profile and proceed to upload the sample pdf file included in the demo source code package inside the **sample_file** folder.
6. Follow the steps described in the first Core Capture tutorial video to train the AI to allocate information in the uploaded pdf to the correct fields.


## Running the Application
1. Before you run the demo application, update the **/src/properties.js** file.

2. **Client-side application**: To run the client-side application, open a command line (terminal) and type the following command in the application root folder. Running this command will also open the application frontend in your default web browser.
```
npm start
```

3. **Server-side application**: To compile and run the server-side application, open another command line (terminal) and run the following commands from the application root folder.
```
npm run build:server
npm run start:server
```

## Interacting with the Application
This demo application has 4 sections:

1. The first section allows you to fetch the Access Token using the credentials in the properties.js file. 

2. The second section uses Risk Guard API Service to identify any PII in the uploaded file. A sample file called "lab-report-1pg.pdf" has been provided in the application package to use for this service.
   - The first step is to select the file.
   - The next step is to use the Risk Guard Service to process the file and identify PII.
   - The final step is to display the PII data identified in the file.

3. The third section uses the Capture Service to extract data from a lab report ("lab-report-1pg.pdf").
   - The first step, once again, is to select the file.
   - The next step is to upload the file to the Capture Service staging area and obtain a file id.
   - The final step is to use the Capture Service to classify the uploaded file and extract the data from the file. (This service is resource intensive so it can take a few seconds to extract all the data). You will see the extracted data in the text field provided.

4. The last section is to upload the extracted lab report data into the Vertica CE database. The “Send Data To Database” option will call the server-side application to insert the data into the two database tables. After you receive a success message, you can query the database for the records.
