const fs = require('fs');
const moment = require('moment');


function printContacts(file) {
    const rawdata = require(file);
    let toprint = "";
    let counter = 0;
    for (const person of rawdata) {
        const {emails, names,primary } = person.data;
        let mostRelevantMail = "";
        if (emails.length > 0) {
            mostRelevantMail = emails.filter((mail) => mail.type === "current_professional");
            if (!mostRelevantMail.length) {
                mostRelevantMail = emails.filter((mail) => mail.type === "professional");
            }
            if (mostRelevantMail.length) {
                counter ++;
                mostRelevantMail=mostRelevantMail[0].address;
                console.log(counter);
            } else {
                mostRelevantMail ="";
            }
        }

        let job_title = "";
        job_title = primary.job && primary.job.title && primary.job.title.name;

        if (job_title && job_title.indexOf('(') !== -1) {
            job_title = job_title.substr(0, job_title.indexOf('('));
        }

        const user = {
            name: names && names.length && capitalize(names[0].first_name + " " + names[0].last_name),
            company: primary.job && primary.job.company && capitalize(primary.job.company.name).replace('Gmbh', 'GmbH'),
            job_title: job_title && capitalize(job_title).replace('Hr', 'HR'),
            linkedin: person.linkedin,
            email: mostRelevantMail
        };

        toprint += user.name + ";" + user.company + ";" + user.job_title + ";" + user.linkedin + ";" + user.email + "\n";

    }

    const filename ="./data/contacts_" + moment().format("DD_MM_YYYY_HH_mm") + ".csv";

    fs.writeFile(filename, toprint, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    console.log("Finished all operations and saved to output file " + filename);

}


function capitalize(text) {
    return text && text && text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

module.exports = {printContacts};