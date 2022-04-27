const fetch = require("node-fetch");
require("dotenv").config();
//This is the id for the jira project
const jiraProjectID = process.env.JIRA_PROJECT_ID;
//Auth header user useraccount and associated API key
const authHeader = {
  Authorization: `Basic ${Buffer.from(
    process.env.JIRA_USERNAME + ":" + process.env.JIRA_API
  ).toString("base64")}`,
  Accept: "application/json",
};

//Tak JSON object from job creation form and creates Jira task with relevant information
async function createPosition(bodyObject) {
  const createDate = Date.now();
  let formatted = {
    fields: {
      project: {
        id: jiraProjectID,
      },
      summary: `Onboarding - New Position Added - ${
        bodyObject.job_title
      } starting on ${new Date(bodyObject.start_date).toLocaleDateString(
        "en-US",
        { timeZone: "UTC" }
      )}`,
      description: `${new Date(createDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
      })} - Onboarding process initialized by ${bodyObject.added_by}
${new Date(createDate).toLocaleDateString("en-US", {
  timeZone: "UTC",
})} - Asset and license check performed with status OK.
${new Date(createDate).toLocaleDateString("en-US", {
  timeZone: "UTC",
})} - Preassigned licenses and asset XXM21.
${new Date(createDate).toLocaleDateString("en-US", {
  timeZone: "UTC",
})} - Awaiting position assignment update for user account creation...`,
      issuetype: {
        id: "2",
      },
    },
  };

  console.log(formatted);
  //return createIssue();

  //SAMPLE RETURN REMOVE IN PROD!!!!
  return {
    id: "1snwofn",
    key: "XXX-1215",
    self: "https://XXXX.atlassian.net/rest/api/2/issue/1snwofn",
  };
}

async function createIssue(bodyObject) {
  return fetch(`https://${process.env.JIRA_HOST}/rest/api/2/issue`, {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify(bodyObject),
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

async function getIssue(key) {
  return fetch(`https://${process.env.JIRA_HOST}/rest/api/2/issue/${key}`, {
    method: "GET",
    headers: authHeader,
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

exports.getIssue = getIssue;
exports.createPosition = createPosition;
