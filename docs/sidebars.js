module.exports = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Главная',
      items: ['index'],
    },
    {
      type: 'category',
      label: 'CLI',
      items: [
        'cli/index',
        'cli/installation',
        'cli/commands',
        'cli/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Exporter',
      items: [
        'exporter/index',
        'exporter/metrics',
        'exporter/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Развертывание',
      items: [
        'deployment/docker',
        'deployment/kubernetes',
      ],
    },
    {
      type: 'category',
      label: 'Интеграции',
      items: [
        'integrations/prometheus',
        'integrations/grafana',
        'integrations/alertmanager',
      ],
    },
    {
      type: 'category',
      label: 'Оповещения',
      items: [
        'alerts/rules',
      ],
    },
    {
      type: 'doc',
      id: 'contributing',
    },
  ],
};