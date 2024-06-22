import axios from 'axios';

const baseUrl = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

baseUrl.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      config.headers['Authorization'] = `Bearer ${jwt}`;
    }
    return config;
  },
  (err) => {
    console.error('Error happend intercepting request', err);
  }
);

// -- AUTH ---

export async function signUpApi(accDetails) {
  const { data } = await baseUrl.post('api/v1/users/signUp', accDetails);
  return data;
}

export async function signInApi(accDetails) {
  const { data } = await baseUrl.post('api/v1/users/signIn', accDetails);
  return data;
}

// -- AUTH END ---

// -- CHATS ---

export async function getUserChatsApi(pageParam) {
  const { data } = await baseUrl.get('/api/v1/chats', {
    params: { page: pageParam },
  });
  return data;
}

export async function getGroupChatsApi() {
  const { data } = await baseUrl.get('/api/v1/chats/groupChats');
  return data;
}

// -- CHATS END ---

// --- USERS ---

export async function searchUserApi(query) {
  const { data } = await baseUrl.get(`api/v1/users/allUsers`, {
    params: { email: query },
  });
  return data;
}

export async function updateProfilePictureApi(profilePicture) {
  const { data } = await baseUrl.patch(
    '/api/v1/users/profilePicture',
    { photo: profilePicture },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return data;
}

export async function updateUserInfoApi(userInfo) {
  const { data } = await baseUrl.patch('api/v1/users/updateSettings', userInfo);
  return data;
}

export async function getLoggedUserApi() {
  const { data } = await baseUrl.get('api/v1/users/me');
  return data;
}

// --- USERS END ---

// --- MESSAGES ---

export async function getChatMessages({ pageParam, chatId }) {
  const { data } = await baseUrl.get(`/api/v1/chats/${chatId}`, {
    params: { page: pageParam },
  });
  return data;
}

export async function downloadMessageFile(messageId) {
  const { data } = await baseUrl.get(`api/v1/messages/${messageId}`, {
    responseType: 'blob',
  });
  return data;
}

// --- MESSAGES END---
