const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');

const SECOND = 10000;

(async () => {
  const fn = async () => {
    const URL = 'https://app2.sli.do/api/v0.5/events/612649/questions?path=%2Fquestions';
    const Authorization = 'Bearer 62606617c3594d83a0d91fb02d5a5fcc44e42fd4';

    const result = await fetch(URL, {
      headers: {
        Authorization,
      },
    });

    const questions = await result.json();
    const hydratedQuestions = questions.sort((a, b) => +new Date(a.date_created) > +new Date(b.date_created)).map(({ text }) => text);

    const oldQuestions = await fs.readJson(path.resolve(__dirname, 'log.json'));
    const mergedQuestions = [...new Set([].concat(hydratedQuestions, oldQuestions))];

    const newQuestions = await fs.outputJson(path.resolve(__dirname, 'log.json'), mergedQuestions, { spaces: 2 });
  };

  await fn();
  setInterval(async () => { await fn(); }, 1 * SECOND);
})();
