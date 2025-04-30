export default {
  items: {
    'api': [
      {
        title: 'Basics',
        open: true,
        items: [
          { title: 'Overview for the docs' },
          { title: 'quickstart-cli', document: 'quickstart-cli.md' },
          { title: 'examples-overview', document: 'examples-overview.md' }
        ]
      },
      {
        title: 'API docs',
        items: [
          { title: 'codeexamples', document: 'codeexamples.md' },
          {
            title: 'Sub menu',
            items: [
              { title: 'ex1', document: 'ex1.md' },
              { title: 'ex2', document: 'ex2.md' }
            ]
          },
          { title: 'appeventapi', document: 'appeventapi.md' },
          { title: 'cli', document: 'cli.md' }
        ]
      }
    ]
  }
}; 