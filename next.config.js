/** @type {import('next').NextConfig} */
const nextConfig = {
  // To deploy to GitHub pages. See: https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/**'
      },
    ],
  },
}

export default nextConfig
