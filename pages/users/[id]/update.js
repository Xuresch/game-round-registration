// Next.js and Authentication
import { getSession } from "next-auth/react";

// API and Networking
import { deleteUser, getUser, updateUser } from "@/lib/user/userService";

// Components and Styles
import Card from "@/components/shared/card/card";
import styles from "./UpdateUser.module.css";
import { useEffect, useState } from "react";
import TextInput from "@/components/shared/intput/textInput";
import ButtonGroup from "@/components/shared/actionButton/buttonGroupComponent";
import { env } from "@/helpers/env";
import { useRouter } from "next/router";
import ActionButtons from "@/components/shared/actionButton/actionButton";
import useSessionApp from "@/hooks/useSessionApp";
import Dropdown from "@/components/shared/intput/dropdown";
import { set } from "date-fns";
import ConfirmationModal from "@/components/shared/modal/confirmationModal";

function UpdateUserPage({ fetchedUserData, user }) {
  const router = useRouter();
  const { isSessionLoading, loadedSession } = useSessionApp();

  const [userData, setUserData] = useState(fetchedUserData);
  const [errors, setErrors] = useState([]);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [deleteUserData, setDeleteUserData] = useState(null);

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);


  const onSubmit = async (data) => {
    data.preventDefault();
    console.log("Frontend:", userData);

    const payload = {
      email: userData.email,
      userName: userData.userName,
      role: userData.role,
    };

    console.log(payload);
    updateUser(userData.id, payload);
    router.push(`${env.BASE_URL}/events`);
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    router.push(`${env.BASE_URL}/events`);
  };

  // Handler for delete button click
  const handleDelete = async () => {
    setDeleteUserLoading(true);
    try {
      const data = await deleteUser(userData.id);
      setDeleteUserData(data);
    } catch (error) {
      setDeleteUserError(error);
    } finally {
      setDeleteUserLoading(false);
    }
  };

  useEffect(() => {
    if (!deleteUserLoading && !deleteUserError && deleteUserData) {
      window.location.href = `${env.BASE_URL}/auth`;
    }
  }, [deleteUserLoading, deleteUserError, deleteUserData]);

  return (
    <Card>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          deleteObject={fetchedUserData.userName}
          onDelete={handleDelete}
        />
      )}
      <section className={styles.header}>
        <h1 className={styles.title}>Update User {fetchedUserData.userName}</h1>
        <ActionButtons
          loadedSession={loadedSession}
          user={user}
          ownerId={userData.id}
          handleDelete={() => setConfirmationModalOpen(true)}
        />
      </section>
      <section className={styles.content}>
        <form className={styles.form} onSubmit={onSubmit}>
          <TextInput
            label="Username"
            value={userData.userName}
            onChange={(event) =>
              setUserData({ ...userData, userName: event.target.value })
            }
            error={errors.name ? "Username wird benötigt!" : null}
          />
          <TextInput
            label="Title"
            value={userData.email}
            onChange={(event) =>
              setUserData({ ...userData, email: event.target.value })
            }
            error={errors.name ? "Email wird benötigt!" : null}
          />
          {loadedSession && user.role == "admin" && (
            <Dropdown
              label="Usertype"
              options={[
                { value: "normal", label: "User" },
                { value: "organizer", label: "Organisator" },
                { value: "admin", label: "Admin" },
              ]}
              value={userData.role}
              onChange={(event) =>
                setUserData({ ...userData, role: event.target.value })
              }
            />
          )}
          <ButtonGroup
            handleCancel={handleCancel}
            saveButtonText="Profil aktualisieren"
            cancelButtonText="Abbrechen"
          />
        </form>
      </section>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Get the user from the session
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;

    // Fetch gameMaster details
    const data = await getUser(id);
    const fetchedUserData = data.data;

    // If the user is the game master or an admin, return the round details
    if (user.id === fetchedUserData.id || user.role == "admin") {
      return {
        props: {
          fetchedUserData,
          user,
        },
      };
    }
    // If the user is a player, redirect to the player page
    else if (user != null) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }
    // Otherwise, redirect to the login page
    else {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }
  } catch (error) {
    // Log any errors and return a 404 page
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
}

export default UpdateUserPage;
