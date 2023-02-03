const {
    REACT_APP_SERVER_HOST: host,
    REACT_APP_SERVER_MOVIES: moviesUrl
} = process.env;

const serverUri = new URL(`${host}${moviesUrl}`);

export const API_URL = {
    DETAILS: serverUri,
    NOW_PLAYING: `${serverUri}/now_playing`,
    POPULAR: `${serverUri}/popular`,
    SEARCH: `${serverUri}/search`,
    UPCOMING: `${serverUri}/upcoming`,
    FAVORITES: `${serverUri}/favorites`
}

export const TMDB = {
    IMG_URL: 'https://image.tmdb.org/t/p/',
    IMG_SIZE: {
        POSTER: 'w185',
        BACKDROP: 'original'
    }
}

export const FORM_TYPE = {
    REGISTER: 'register',
    LOGIN: 'login',
}

export const FORM_TEXT = {
    SIGNUP: 'Sign Up',
    SIGNIN: 'Sign In',
}

export const FORM_MSG = {
    NO_EMAIL_PASS: 'Please enter an email and password.',
    NO_PASS_CONFIRM: 'Please confirm your password.',
    PASS_MISMATCH: 'Passwords do not match.'
}

export const ROUTE = {
    REGISTER: '/',
    LOGIN: '/login',
    BROWSE: '/browse',
    DETAILS: '/details',
    ACCOUNT: '/account'
}