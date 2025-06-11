import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const demo2File = path.join(__dirname, './Code_of_Business_Conduct_and_Ethics.txt');

export const DEMO_INPUT_1 = `Our new employee onboarding process starts the first Monday of every month, beginning with a mandatory virtual orientation session from 9 AM to 12 PM AEST. New hires will receive an email with their login credentials for the HR portal and our internal collaboration tool, Slack, 48 hours prior to their start date. It's crucial they complete their tax forms and set up direct deposit in the HR portal within the first three days. After orientation, each new hire will be introduced to their team lead who will guide them through specific departmental training and project assignments. We also offer a mentorship program where new employees are paired with experienced colleagues for the first six months to help them settle in and understand our company culture. Benefits enrollment, including health insurance and 401k, must be completed by the end of their first week. For IT support, new employees should contact helpdesk@ourcompany.com or call extension 5555. They will be provisioned with a laptop and necessary software by the end of their first day, provided they have completed the pre-onboarding IT survey.`;

export const DEMO_INPUT_2 = fs.readFileSync(demo2File, 'utf8');
