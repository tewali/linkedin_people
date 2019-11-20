// TODO: replace with your data source (linkedin urls)
const results = require('./input').linkedin;
const request = require('request-promise');
const fs = require('fs');
const moment = require('moment');
const mailfinder = require('./mails');

// TODO: REPLACE CONTENT OF API_KEY WITH YOUR KEY (https://dashboard.peopledatalabs.com/signup)
const API_KEY=process.env.PEOPLE_DATA_LABS_KEY;
const API_URL='https://api.peopledatalabs.com/v4/person?pretty=true&api_key=' + API_KEY;

(async() => {
    let peopleEnriched = [];
    let counter = 0;
    for (const result of results) {
        // just a failsafe for urls scraped from google (they are sometimes job postings)
        if (result.url.indexOf('jobs') !== -1) {
            continue;
        }
        const requestURL = API_URL + '&profile=' + result.url;
        try {
            const body = await request({uri: requestURL});
            if (body && JSON.parse(body)) {
                const response = JSON.parse(body);
                if (response.status === 200) {
                    peopleEnriched.push({...response, linkedin: result.url});
                } else {
                    peopleEnriched.push({linkedin: result.url});
                }
            }
            counter ++;
            console.log("Enriched profile " + counter +  " of " + results.length);
        } catch (e) {
            console.error(e);
        }
    }

    // write json to file
    const filename = "./data/json_run_" + moment().format("DD_MM_YYYY_HH_mm") + ".json";
    fs.writeFile(filename, JSON.stringify(peopleEnriched), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The json-file was saved!");
        mailfinder.printContacts(filename);
    });



})();
