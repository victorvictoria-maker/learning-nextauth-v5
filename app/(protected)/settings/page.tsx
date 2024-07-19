// import { auth, signOut } from "@/auth";

// const SettingsPage = async () => {
//   const session = await auth();

//   return (
//     <div>
//       {JSON.stringify(session)}
//       <form
//         action={async () => {
//           "use server";

//           await signOut();
//         }}
//       >
//         <button type='submit'>Sign out</button>
//       </form>
//     </div>
//   );
// };

// export default SettingsPage;

// MAKING THE ABOVE A CLIENT COMPONENT
"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";

const SettingsPage = () => {
  // add a session provider wrapped around the page or app layput to be able to use the useSession
  const user = useCurrentUser();

  useEffect(() => {
    console.log(user);
  });

  const onClick = () => {
    logout();
  };

  return (
    <div className='bg-white p-10 rounded-xl'>
      <button onClick={onClick} type='submit'>
        Sign out
      </button>
    </div>
  );
};

export default SettingsPage;
