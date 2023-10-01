const { getSession } = require("next-auth/react");
const { useState, useEffect } = require("react");

const useSessionApp = () => {
  const [isSessionLoading, setisSessionLoading] = useState(true); // Local state to toggle loading state
  const [loadedSession, setLoadedSession] = useState(null); // Local state to store session data
  const [user, setUser] = useState(null); // Local state to store user data

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoadedSession(session);
        setUser(session.user);
      } else {
        setisSessionLoading(false);
      }
    });
  }, []);

  return { isSessionLoading, loadedSession, user };
};

export default useSessionApp;
