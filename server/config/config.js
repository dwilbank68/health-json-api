var env = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

if (env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = process.env.DB_URL;       // from .env file
}

if (env === 'test'){
    process.env.PORT = 3001;
    process.env.MONGODB_URI = process.env.DB_URL_TEST;   // from .env file
}
