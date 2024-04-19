# Installation of the frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, make sure that you have npm or yarn installed in your computer, if you don't please check how to here:
- [npm installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [yarn installation](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

Next, please make sure to add a .env file in the folder <location_of_your_repo>/AML-Fraud-prevention-Demo/frontend.
It should include the following :

```md
MONGODB_URI=<your_MONGODB_URI>
NEXT_PUBLIC_MONGODB_DB=AML_Fraud_detection
NEXT_PUBLIC_FUZZY_URL=<your_app_services_endpoint_URL>
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> [!Note]
> If the backend was deployed into a server, then you have to put the server's IP address in the NEXT_PUBLIC_API_URL above.

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

Once you have done everything, we can move on to the next part:
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Or go back [to the main page](../)