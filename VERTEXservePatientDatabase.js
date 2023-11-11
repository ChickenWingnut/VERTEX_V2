import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import request from 'request'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
const port = 2270;

app.use(express.static(path.join(__dirname,".")));


app.listen(port, function() {
    console.log(`App started on port number ${port}`)
});

function savePatientData(patientJSON){
    console.log('savePatientData called');
    fs.writeFileSync(patientJSON.MRN + ".json",JSON.stringify(patientJSON, null, 4));
    let allPatientData = [];
    if (fs.existsSync('patients.json')) {
        allPatientData = JSON.parse(fs.readFileSync('patients.json', 'utf8'));
    }

    allPatientData.push(patientJSON);
    fs.writeFileSync('patients.json', JSON.stringify(allPatientData, null, 4));
}
// Grab MRN - Changed returnedMRN to be response.data.medicalRecordNumber
function getMRN(callback, patientName) {
    console.log('getMRN called');
    //const apiEndpoint = {
    //    url: `http://160.94.179.166/2280/patient/search?name=${encodeURIComponent(patientName)}`,
    //    json: true
    //};
    //request(apiEndpoint, (error, response, body) => {
    //    if (!error && response.statusCode === 200 && body.medicalRecordNumber) {
    //        callback(body.medicalRecordNumber);
    //    } else {
    //        console.error('Error fetching MRN:', error);
    //        callback(`MRN Not Available`);
    //    }
    //});
    const min = 100000
    const max = 999999
    callback(Math.floor(Math.random() * (max - min + 1)) + min) 
}

// put in string, if mrn not equal to null, put mrn, else put mrn not available

function calculateRiskFactors(qData) {
    console.log("calculateRiskFactors called")
    // Initialize score variables
    let foodSecurityScore = 0;
    let housingSecurityScore = 0;
    let transportationScore = 0;
    let interpersonalSafetyScore = 0;
    let suicideScore = 0;
    let depressionScore = 0;
    let stressScore = 0;
    let alcoholScore = 0;
    let prescriptionDrugScore = 0;
    let illegalDrugScore = 0;
    let tobaccoScore = 0;
    let foodInsecurity = "low";
    let housingInsecurity = "low";
    let transportationInaccessibility = "low";
    let interpersonalSafetyRisk = "low";
    let suicideRisk = "low";
    let depressionRisk = "low";
    let emotionalDistress = "low";
    let substanceUse = "low";
    
    //Compute Numerical Scores
    if (qData[question1] === "No") foodSecurityScore += 3;
    if (qData[question2] === "Yes") foodSecurityScore += 1;
    if (qData[question3] === "Yes") foodSecurityScore += 1;
    if (qData[question4] === "No") housingSecurityScore += 4;
    if (qData[question5] === "No") housingSecurityScore += 2;
    if (qData[question6] === "Yes") housingSecurityScore += 1;
    if (qData[question7] === "Yes") housingSecurityScore += 1;
    if (qData[question8] === "No") transportationScore += 2;
    if (qData[question9] === "Yes") transportationScore += 1;
    if (qData[question10] === "No") interpersonalSafetyScore += 4;
    if (qData[question11] === "Yes") interpersonalSafetyScore += 2;
    if (qData[question12] === "Yes") interpersonalSafetyScore += 1;
    if (qData[question13] === "Yes") suicideScore += 5;
    if (qData[question14] === "Yes") suicideScore += 1;
    if (qData[question15] === "Yes") suicideScore += 1;
    if (qData[question16] === "Yes") suicideScore += 1;
    if (qData[question17] === "Yes") suicideScore += 1;
    if (qData[question18] === "Several days") depressionScore += 1;
    if (qData[question18] === "More than half the days") depressionScore += 2;
    if (qData[question18] === "Nearly every day") depressionScore += 3;
    if (qData[question19] === "Several days") depressionScore += 1;
    if (qData[question19] === "More than half the days") depressionScore += 2;
    if (qData[question19] === "Nearly every day") depressionScore += 3;
    if (qData[question20] === "A little bit") stressScore += 1;
    if (qData[question20] === "Somewhat") stressScore += 2;
    if (qData[question20] === "Quite a bit") stressScore += 3;
    if (qData[question20] === "Very much") stressScore += 4;
    if (qData[question21] === "Once or Twice") alcoholScore += 1;
    if (qData[question21] === "Monthly") alcoholScore += 2;
    if (qData[question21] === "Weekly") alcoholScore += 3;
    if (qData[question21] === "Daily or Almost Daily") alcoholScore += 4;
    if (qData[question22] === "Once or Twice") prescriptionDrugScore += 1;
    if (qData[question22] === "Monthly") prescriptionDrugScore += 2;
    if (qData[question22] === "Weekly") prescriptionDrugScore += 3;
    if (qData[question22] === "Daily or Almost Daily") prescriptionDrugScore += 4;
    if (qData[question23] === "Once or Twice") illegalDrugScore += 1;
    if (qData[question23] === "Monthly") illegalDrugScore += 2;
    if (qData[question23] === "Weekly") illegalDrugScore += 3;
    if (qData[question23] === "Daily or Almost Daily") illegalDrugScore += 4;
    if (qData[question24] === "Once or Twice") tobaccoScore += 1;
    if (qData[question24] === "Monthly") tobaccoScore += 2;
    if (qData[question24] === "Weekly") tobaccoScore += 3;
    if (qData[question24] === "Daily or Almost Daily") tobaccoScore += 4;
    

    //Translate Numerical Risk Scores into Verbal Risk Values
    if (foodSecurityScore === 1) foodInsecurity = "medium";
    if (foodSecurityScore === 2) foodInsecurity = "high";
    if (foodSecurityScore > 2) foodInsecurity = "imminent";
    if (housingSecurityScore === 1) housingInsecurity = "medium";
    if (housingSecurityScore > 1 && housingSecurityScore < 4) housingInsecurity = "high";
    if (housingSecurityScore >= 4) housingInsecurity = "imminent";
    if (transportationScore === 1) transportationInaccessibility = "medium";
    if (transportationScore >= 2) transportationInaccessibility = "imminent";
    if (interpersonalSafetyScore === 1) interpersonalSafetyRisk = "medium";
    if (interpersonalSafetyScore > 1 && interpersonalSafetyScore < 4) interpersonalSafetyRisk = "high";
    if (interpersonalSafetyScore >= 4) interpersonalSafetyRisk = "imminent";
    if (suicideScore >= 1 && suicideScore < 5) suicideRisk = "high"; 
    if (suicideScore >= 5) suicideRisk = "imminent"; 
    if (depressionScore >= 3) depressionRisk = "high";
    if (stressScore < 2) emotionalDistress = "low";
    if (stressScore === 2) emotionalDistress = "medium";
    if (stressScore === 3) emotionalDistress = "high";
    if (stressScore >= 4) emotionalDistress = "imminent";

    let highestSubstanceScore = Math.max(alcoholScore, prescriptionDrugScore, illegalDrugScore, tobaccoScore)
    if (highestSubstanceScore < 2) substanceUse = "low";
    if (highestSubstanceScore === 2) substanceUse = "medium";
    if (highestSubstanceScore === 3) substanceUse = "high";
    if (highestSubstanceScore > 3) substanceUse = "imminent";

    return {
        foodInsecurity,
        housingInsecurity,
        transportationInaccessibility,
        interpersonalSafetyRisk,
        suicideRisk,
        depressionRisk,
        emotionalDistress,
        substanceUse
    };
}

function buildPatientJSON(qData){    
    const riskFactors = calculateRiskFactors(qData);
    console.log("calculateRiskFactors is being called")
    console.log("buildPatientJSON called")
    //Assemble patient Data JSON
    let patientData = {
        MRN: null,
        patientName: qData.patientName,
        riskFactors,
        questionnaireResponses: qData
    };

    getMRN((returnedMRN)=>{
        patientData.MRN = returnedMRN;
        console.log("savePatientData is being called")
        savePatientData(patientData);
    }, qData.patientName);
}

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
});
app.get("/question", (req,res)=>{
    res.sendFile(__dirname+"/questionnaire/index.html")
})
app.get("/thankyou", (req, res) => {
    res.sendFile((__dirname+ '/public/thankyou.html'));
});
app.get("/allPatientData", function(req,res) {
    const allPatients = JSON.parse(fs.readFileSync(`patients.json`, `utf-8`));
    res.json(allPatients);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put("/updatePatient", (req, res) => {
    const { MRN, patientName, questionnaireResponses } = req.body;
    fs.readFile('patients.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        let PatientData = JSON.parse(data);
        let patientIndex = PatientData.findIndex(patient => patient.MRN === MRN);
        if (patientIndex !== -1) {
            const updatedRiskFactors = calculateRiskFactors(questionnaireResponses);
            PatientData[patientIndex].patientName = patientName
            PatientData[patientIndex].riskFactors = updatedRiskFactors;
            PatientData[patientIndex].questionnaireResponses = questionnaireResponses;
        } else {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }
        fs.writeFile('patients.json', JSON.stringify(PatientData, null, 4), () => {});
        res.json({ message: 'Patient data updated successfully' });
    });
});

app.delete("/deletePatient", (req, res) => {
    const { patientName, MRN } = req.body
    fs.readFile('patients.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        let patientData = JSON.parse(data)
        let patientIndex = patientData.findIndex(patient => patient.MRN === MRN && patient.patientName === patientName)
        if (patientIndex !== -1) {
            patientData.splice(patientIndex, 1);
            fs.writeFile('patients.json', JSON.stringify(patientData, null, 4), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error writing to file' });
                }
                res.status(200).json({ message: 'Patient data deleted successfully' });
            });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    });
});


app.post("/", (req,res)=> {
    let questionnaireData = req.body;
    console.log(questionnaireData);

    if(req.body.command == "computeRiskScores"){
        console.log("Questionnaire requested the backend computeRiskScores");
        console.log("buildPatientJSON is being called")
        buildPatientJSON(questionnaireData);
    }else{
        console.log("Questionnaire sent the backend a post command that it did not recognize");
    }
    res.redirect('/thankyou')
});


const question1 = '1. Do you have food for tonight? (Y/N)';
const question2 = '2. Within the past 12 months, did you worry that your food would run out before you got money to buy more? (Y/N)';
const question3 = '3. Within the past 12 months, did the food you bought just not last and you didn’t have money to get more? (Y/N)';
const question4 = '4. Do you have somewhere safe to sleep tonight? (Y/N)';
const question5 = '5. Do you have housing? (Y/N)';
const question6 = '6. Are you worried about losing your housing? (Y/N)';
const question7 = '7. Within the past 12 months, have you or your family members you live with been unable to get utilities (heat, electricity) when it was really needed? (Y/N)';
const question8 = '8. Are your currently able to access reliable transportation to receive needed care (e.g. transportation to medical appointments, pharmacies for medications, other needed services)? (Y/N)';
const question9 = '9. Within the past 12 months, has lack of transportation kept you from medical appointments, getting your medicines, non-medical meetings or appointments, work, or from getting things that you need? (Y/N)';
const question10 = '10. Do you feel physically and emotionally safe where you currently live? (Y/N)';
const question11 = '11. Within the past 12 months, have you been hit, slapped, kicked or otherwise physically hurt by someone? (Y/N)';
const question12 = '12. Within the past 12 months, have you been humiliated or emotionally abused in other ways by your partner or ex-partner? (Y/N)';
const question13 = '13. Are you having thoughts of killing yourself right now? (Y/N)';
const question14 = '14. In the past few weeks, have you wished you were dead? (Y/N)';
const question15 = '15. In the past few weeks, have you felt that you or your family would be better off if you were dead? (Y/N)';
const question16 = '16. In the past week, have you been having thoughts about killing yourself? (Y/N)';
const question17 = '17. Have you ever tried to kill yourself? (Y/N)';
const question18 = '18a. Little interest or pleasure in doing things?';
const question19 = '18b. Feeling down, depressed, or hopeless?';
const question20 = '19. Stress means a situation in which a person feels tense, restless, nervous, or anxious, or is unable to sleep at night because his or her mind is troubled all the time. Do you feel this kind of stress these days?';
const question21 = '20a. How many times in the past 12 months have you had 5 or more drinks in a day (males) or 4 or more drinks in a day (females)? One drink is 12 ounces of beer, 5 ounces of wine, or 1.5 ounces of 80-proof spirits.';
const question22 = '20b. How many times in the past 12 months have you used prescription drugs for non-medical reasons?';
const question23 = '20c. How many times in the past 12 months have you used illegal drugs?';
const question24 = '20d. How many times in the past 12 months have you used tobacco products (like cigarettes, cigars, snuff, chew, electronic cigarettes)?';
