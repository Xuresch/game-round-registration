// utils/permissions.js
const permissions = {
    gameRound: {
      create: ['admin', 'organizer', 'normal'],
      update: ['admin', 'owner'],
      delete: ['admin', 'owner'],
    },
    event: {
      create: ['admin', 'organizer'],
      update: ['admin', 'owner'],
      delete: ['admin', 'owner'],
    },
    user: {
      fetchAll: ['admin'],
      fetchSingle: ['admin', 'owner'],
      update: ['admin', 'owner'],
      delete: ['admin', 'owner'],
    },
  };
  
  export default permissions;
  