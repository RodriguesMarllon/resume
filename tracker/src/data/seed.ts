import { Application, Resume } from '../types';

export const seedResumes: Resume[] = [
  {
    id: 'resume-automation-en',
    name: 'Automation EN',
    title: 'Automation & Control Systems Engineer',
    type: 'automation',
    lang: 'en',
    path: 'versions/2026-06-30/automation_en.pdf',
    keywords:
      'IEC 61850, SCADA, AVEVA, Modbus, FPSO, Petrobras, SEL, HMI, PLC, commissioning, offshore, Python, TypeScript, TagFinder, RDO, automation, OT, industrial, Siemens, Rockwell, Schneider',
    notes: 'Primary automation CV in English. Used for international roles.',
    createdAt: '2026-06-30T00:00:00.000Z',
  },
  {
    id: 'resume-automation-ptbr',
    name: 'Automation PT-BR',
    title: 'Engenheiro de Automação e Sistemas de Controle',
    type: 'automation',
    lang: 'pt-br',
    path: 'versions/2026-06-30/automation_ptbr.pdf',
    keywords:
      'IEC 61850, SCADA, AVEVA, Modbus, FPSO, Petrobras, SEL, IHM, CLP, comissionamento, offshore, Python, TypeScript, TagFinder, RDO, automação, OT, industrial, Siemens, Rockwell, Schneider',
    notes: 'Versão PT-BR do CV de automação. Para vagas brasileiras.',
    createdAt: '2026-06-30T00:00:00.000Z',
  },
  {
    id: 'resume-fullstack-en',
    name: 'Full Stack EN',
    title: 'Full Stack Software Engineer',
    type: 'it',
    lang: 'en',
    path: 'versions/2026-06-30/it-fullstack_en.pdf',
    keywords:
      'TypeScript, Node.js, Fastify, Express, React, Vue.js, Python, PostgreSQL, Prisma, Redis, Docker, CI/CD, GitHub Actions, REST API, multi-tenant SaaS, RBAC, ECDSA, Z-score, ETS, Cloudflare R2, Vercel, Git, Full Stack',
    notes: 'Full stack IT CV in English. For web/software roles.',
    createdAt: '2026-06-30T00:00:00.000Z',
  },
];

export const seedApplications: Application[] = [
  {
    id: 'app-gali',
    role: 'Automation Engineer',
    company: 'Gali',
    location: 'Bauru, Brazil',
    status: 'sent',
    date: '2026-06-30',
    resumeId: 'resume-automation-ptbr',
    keywords: 'automação, PLC, SCADA, industrial',
    strengths: 'Experiência AVEVA + comissionamento offshore. Indicado por Daniel Phelipe.',
    notes: 'Enviado via Daniel Phelipe em 30/06/2026. Aguardando retorno.',
    createdAt: '2026-06-30T00:00:00.000Z',
  },
  {
    id: 'app-pasona-sg',
    role: 'IT Developer (Full Stack) — HR Systems',
    company: 'Pasona Singapore',
    location: 'Tai Seng, Singapore',
    status: 'prep',
    date: '2026-06-30',
    salary: 'SGD $3,300–$4,500/mo',
    resumeId: 'resume-fullstack-en',
    keywords: 'React, Python, PostgreSQL, Linux, Git, automation scripts, Cron jobs, dashboards, BI',
    strengths:
      'React ✅, Python ✅, PostgreSQL ✅, Git ✅, CI/CD ✅. Full lifecycle, Agile, independent work.',
    notes:
      'Pasona é agência de recrutamento japonesa. Perguntas: right to work in SG, expected salary, years full stack, frontend frameworks.',
    createdAt: '2026-06-30T00:00:00.000Z',
  },
];
