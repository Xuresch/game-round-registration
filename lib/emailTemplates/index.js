// emailTemplates/index.js

import eventCreationTemplate from "./eventCreationTemplate.mjml.js";
import roundCreationTemplate from "./roundCreationTemplate.mjml.js";
import registNewPlayerTemplate from "./registNewPlayerTemplate.mjml.js";
import registNewPlayerGmTemplate from "./registNewPlayerGmTemplate.mjml.js";
import unregistPlayerTemplate from "./unregistPlayerTemplate.mjml.js";
import unregistPlayerGmTemplate from "./unregistPlayerGmTemplate.mjml.js";
import waitinglistPlayerTemplate from "./waitinglistPlayerTemplate.mjml.js";
import waitinglistPlayerGmTemplate from "./waitinglistPlayerGmTemplate.mjml.js";
import waitinglistUpdateGmTemplate from "./waitinglistUpdateGmTemplate.mjml.js";

const templates = {
  eventCreation: eventCreationTemplate,
  roundCreation: roundCreationTemplate,
  registNewPlayer: registNewPlayerTemplate,
  registNewPlayerGm: registNewPlayerGmTemplate,
  unregistPlayer: unregistPlayerTemplate,
  unregistPlayerGm: unregistPlayerGmTemplate,
  waitinglistPlayer: waitinglistPlayerTemplate,
  waitinglistPlayerGm: waitinglistPlayerGmTemplate,
  waitinglistUpdateGm: waitinglistUpdateGmTemplate,
};

export function selectTemplate(templateName, data) {
  //console.log("templat:",templateName,"Data:", data)
  const templateFunction = templates[templateName];
  //console.log(templateFunction)
  if (!templateFunction) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  return templateFunction(data);
}
