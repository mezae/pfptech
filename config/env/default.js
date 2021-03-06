'use strict';


module.exports = {
    app: {
        title: 'Prep Wiki',
        description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'MongoDB, Express, AngularJS, Node.js',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: process.env.SESSION,
    sessionCollection: 'sessions'
};