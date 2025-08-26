module.exports = {
  title: 'Proxmox Monitor',
  tagline: 'Rust-powered monitoring for Proxmox VE',
  url: 'https://trytonottry.github.io',
  baseUrl: '/proxmox-monitor/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Trytonottry',
  projectName: 'proxmox_monitor',
  trailingSlash: false,

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Trytonottry/proxmox_monitor/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Proxmox Monitor',
      logo: {
        alt: 'Rust Logo',
        src: 'img/rust.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/Trytonottry/proxmox_monitor',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'CLI', to: '/docs/cli' },
            { label: 'Exporter', to: '/docs/exporter' },
            { label: 'Deployment', to: '/docs/deployment/docker' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Issues', href: 'https://github.com/Trytonottry/proxmox_monitor/issues' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Proxmox Monitor. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
};