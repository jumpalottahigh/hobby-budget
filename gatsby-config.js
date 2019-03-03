module.exports = {
  siteMetadata: {
    title: 'Hobby Budget',
    author: 'Georgi Yanev',
  },
  plugins: [
    {
      resolve: `@wapps/gatsby-plugin-material-ui`,
      options: {
        theme: {
          palette: {
            primary: {
              main: '#0375d8',
            },
            secondary: {
              main: '#f5f5f5',
            },
          },
          typography: {
            useNextVariants: true,
          },
        },
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
        name: `data`,
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hobby Budget`,
        short_name: `HobbyBudget`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#1960a0`,
        display: `minimal-ui`,
        icon: `src/assets/hobby-budget-logo-512.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Roboto:300,400,500`],
      },
    },
    `gatsby-plugin-offline`,
  ],
}
